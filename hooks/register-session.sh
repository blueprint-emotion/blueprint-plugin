#!/usr/bin/env bash
# Blueprint 로컬 에이전트에 Claude Code 세션 등록.
#
# SessionStart hook (matcher: startup|resume|clear) 에서 호출된다.
# stdin 으로 { session_id, cwd, hook_event_name, source, model } JSON 수신.
#
# 동작:
#   1. stdin 에서 cwd 추출
#   2. cwd 가 git 저장소이면 origin remote 에서 owner/repo 추출
#   3. POST http://127.0.0.1:7777/register { repo, path, listenMode:false }
#
# 에이전트가 안 떠 있거나 네트워크 실패해도 세션은 막지 않음. 항상 exit 0.

set -u

# stdin JSON 읽기 (hook 규약)
INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat)
fi

# cwd 추출. jq 우선, 없으면 sed 폴백, 그래도 안 되면 $PWD 사용
CWD=""
if command -v jq >/dev/null 2>&1 && [ -n "$INPUT" ]; then
  CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
fi
if [ -z "$CWD" ] && [ -n "$INPUT" ]; then
  # 아주 단순한 폴백 — 중첩 JSON 없어서 첫 "cwd":"..." 매치
  CWD=$(printf '%s' "$INPUT" | sed -nE 's/.*"cwd"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' | head -n1)
fi
CWD="${CWD:-${CLAUDE_PROJECT_DIR:-$PWD}}"

# git remote 확인
REMOTE=$(git -C "$CWD" remote get-url origin 2>/dev/null || true)
if [ -z "$REMOTE" ]; then
  # git 저장소 아님 또는 origin 없음 — 등록 건너뜀
  exit 0
fi

# owner/repo 추출 (git@host:owner/repo.git / https://host/owner/repo.git / ssh://... 모두 대응)
REPO=$(printf '%s' "$REMOTE" | sed -E 's#\.git$##; s#.*[:/]([^/]+/[^/]+)$#\1#')

if [ -z "$REPO" ]; then
  exit 0
fi

# 페이로드 — JSON 문자열 이스케이프 간단히 (path 에 " 없다고 가정)
PAYLOAD=$(printf '{"repo":"%s","path":"%s","listenMode":false}' "$REPO" "$CWD")

curl -sS -X POST "http://127.0.0.1:7777/register" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --max-time 2 \
  >/dev/null 2>&1 || true

exit 0
