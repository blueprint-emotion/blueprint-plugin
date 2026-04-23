#!/usr/bin/env bash
# Blueprint 로컬 에이전트에서 Claude Code 세션 등록 해제.
#
# SessionEnd hook 에서 호출된다. stdin 으로 { session_id, cwd, hook_event_name } 수신.

set -u

INPUT=""
if [ ! -t 0 ]; then
  INPUT=$(cat)
fi

CWD=""
if command -v jq >/dev/null 2>&1 && [ -n "$INPUT" ]; then
  CWD=$(printf '%s' "$INPUT" | jq -r '.cwd // empty' 2>/dev/null || true)
fi
if [ -z "$CWD" ] && [ -n "$INPUT" ]; then
  CWD=$(printf '%s' "$INPUT" | sed -nE 's/.*"cwd"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' | head -n1)
fi
CWD="${CWD:-${CLAUDE_PROJECT_DIR:-$PWD}}"

PAYLOAD=$(printf '{"path":"%s"}' "$CWD")

curl -sS -X POST "http://127.0.0.1:7777/unregister" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  --max-time 2 \
  >/dev/null 2>&1 || true

exit 0
