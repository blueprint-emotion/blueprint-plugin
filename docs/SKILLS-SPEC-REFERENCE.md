# Agent Skills 공식 스펙 레퍼런스

> 수집일: 2026-03-27
> 출처: agentskills.io/specification, platform.claude.com, github.com/vercel-labs/skills

---

## 1. 스킬이란

Agent Skills는 AI 에이전트에게 특화된 지식과 워크플로우를 부여하는 경량 확장 포맷.
`SKILL.md` 파일 기반이며, 40+ 에이전트(Claude Code, Cursor, Copilot, Codex, Gemini CLI 등)에서 호환.

### 작동 방식 (Progressive Disclosure)

1. **Discovery**: 시작 시 모든 스킬의 `name` + `description`만 로드 (~100 토큰)
2. **Activation**: 태스크가 description과 매치되면 `SKILL.md` 본문 로드 (< 5000 토큰 권장)
3. **Execution**: 필요 시 `references/`, `scripts/`, `assets/` 파일을 온디맨드 로드

---

## 2. 디렉토리 구조

```
skill-name/
├── SKILL.md          # 필수: 메타데이터 + 인스트럭션
├── scripts/          # 선택: 실행 가능한 코드
├── references/       # 선택: 참고 문서
├── assets/           # 선택: 템플릿, 리소스
└── ...               # 추가 파일/디렉토리
```

### CLI 탐색 경로 (자동 발견)

- 루트 디렉토리 (`SKILL.md` 존재 시)
- `skills/` 및 하위 디렉토리
- `skills/.curated/`, `skills/.experimental/`, `skills/.system/`
- 에이전트별 디렉토리 (`.claude/skills/`, `.agents/skills/` 등)

---

## 3. SKILL.md 프론트매터 스펙

| 필드 | 필수 | 제약 |
|------|------|------|
| `name` | **Yes** | 최대 64자. 소문자+숫자+하이픈만. 하이픈으로 시작/끝 불가. 연속 하이픈 불가. **부모 디렉토리명과 일치해야 함** |
| `description` | **Yes** | 최대 1024자. 비어있으면 안 됨. 스킬이 무엇을 하는지 + 언제 사용하는지 모두 포함 |
| `license` | No | 라이선스명 또는 번들 라이선스 파일 참조 |
| `compatibility` | No | 최대 500자. 환경 요구사항 (런타임, 패키지, 네트워크 등) |
| `metadata` | No | 임의 key-value 맵 (author, version 등) |
| `allowed-tools` | No | 공백 구분 도구 목록 (실험적) |

### 프론트매터 예시

```yaml
---
name: flowframe-wireframe
description: md 기획서를 FlowFrame 업로드 규격에 맞는 HTML 와이어프레임으로 변환한다. 화면 구조와 기능 목록을 시각화하여 FlowFrame에서 플로우 확인 및 코멘트가 가능한 산출물을 생성한다. 사용자가 "와이어프레임", "wireframe", "화면 설계" 등을 언급할 때 사용한다.
license: MIT
metadata:
  author: flow-frame
  version: "1.0.0"
---
```

### name 규칙 상세

- 1~64자
- 소문자 알파벳(a-z), 숫자, 하이픈만 허용
- 하이픈으로 시작/끝 불가
- 연속 하이픈(`--`) 불가
- **부모 디렉토리명과 동일해야 함** (예: `skills/flowframe-wireframe/SKILL.md` → `name: flowframe-wireframe`)

### description 작성 가이드

- **3인칭으로 작성** (시스템 프롬프트에 주입되므로)
  - Good: "Processes Excel files and generates reports"
  - Avoid: "I can help you process Excel files"
- 무엇을 하는지 + 언제 사용하는지 모두 포함
- 에이전트가 100+ 스킬 중에서 이 스킬을 선택할 수 있도록 구체적 키워드 포함

---

## 4. SKILL.md 본문 작성 가이드

### 핵심 원칙

1. **간결하게**: 에이전트는 이미 똑똑하다. 에이전트가 모르는 정보만 추가
2. **자유도 조절**: 태스크의 깨지기 쉬운 정도에 맞춰 구체성 조절
   - 높은 자유도: 다양한 접근이 유효할 때 (텍스트 가이드)
   - 낮은 자유도: 정확한 순서가 필요할 때 (구체적 스크립트)
3. **500줄 이하**: 초과 시 `references/` 파일로 분리

### 권장 구조

```markdown
---
name: skill-name
description: 설명
---

# 스킬 제목

## When to use
언제 사용하는지

## Instructions
1. 단계별 지침
2. ...

## Examples
입출력 예시

## Advanced features
**상세 가이드**: See [REFERENCE.md](references/REFERENCE.md)
```

### 파일 참조 규칙

- SKILL.md에서 **1단계 깊이**로만 참조 (중첩 참조 금지)
- Good: `SKILL.md` → `references/guide.md`
- Bad: `SKILL.md` → `advanced.md` → `details.md`
- 100줄 이상 참조 파일에는 목차(TOC) 포함

---

## 5. 설치 및 배포

### 설치 명령

```bash
# GitHub shorthand
npx skills add owner/repo

# 특정 스킬만
npx skills add owner/repo --skill skill-name

# 특정 에이전트만
npx skills add owner/repo -a claude-code -a cursor

# 글로벌 설치
npx skills add owner/repo -g

# 목록 확인
npx skills add owner/repo --list
```

### 설치 범위

| 범위 | 플래그 | 경로 | 용도 |
|------|--------|------|------|
| **Project** | (기본) | `./<agent>/skills/` | 팀 공유, 커밋 |
| **Global** | `-g` | `~/<agent>/skills/` | 모든 프로젝트 |

### 설치 방식

- **Symlink** (권장): 원본에 대한 심볼릭 링크. 단일 소스
- **Copy**: 독립 복사본. 심볼릭 링크 미지원 환경용

### 배포

1. `SKILL.md` 파일이 있는 레포를 public으로 생성
2. 별도 빌드/배포 스텝 없음
3. URL 또는 GitHub shorthand로 공유

### 기타 CLI 명령

| 명령 | 기능 |
|------|------|
| `npx skills list` | 설치된 스킬 목록 |
| `npx skills find [query]` | 스킬 검색 |
| `npx skills remove [skills]` | 스킬 제거 |
| `npx skills check` | 업데이트 확인 |
| `npx skills update` | 전체 업데이트 |
| `npx skills init [name]` | 새 스킬 템플릿 생성 |

---

## 6. 실제 스킬 예시 (vercel-labs/agent-skills)

### deploy-to-vercel 프론트매터

```yaml
---
name: deploy-to-vercel
description: Deploy applications and websites to Vercel. Use when the user requests deployment actions like "deploy my app", "deploy and give me the link", "push this live", or "create a preview deployment".
metadata:
  author: vercel
  version: "3.0.0"
---
```

### react-best-practices 프론트매터

```yaml
---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---
```

### 레포 구조

```
agent-skills/
├── skills/
│   ├── composition-patterns/
│   ├── deploy-to-vercel/
│   │   ├── SKILL.md
│   │   └── resources/
│   │       ├── deploy.sh
│   │       └── deploy-codex.sh
│   ├── react-best-practices/
│   │   ├── SKILL.md
│   │   └── references/
│   ├── react-native-skills/
│   ├── vercel-cli-with-tokens/
│   └── web-design-guidelines/
├── README.md
└── LICENSE
```

---

## 7. Best Practices 체크리스트

### 핵심 품질
- [ ] description이 구체적이고 키워드 포함
- [ ] description에 무엇을 하는지 + 언제 사용하는지 모두 포함
- [ ] SKILL.md 본문 500줄 이하
- [ ] 추가 상세는 별도 파일로 분리
- [ ] 시간에 민감한 정보 없음
- [ ] 일관된 용어 사용
- [ ] 구체적 예시 포함
- [ ] 파일 참조 1단계 깊이
- [ ] Progressive disclosure 적절히 활용
- [ ] 워크플로우에 명확한 단계

### 안티패턴
- Windows 스타일 경로 (`\`) 사용 금지
- 너무 많은 선택지 제시 금지 (기본값 제공)
- 에이전트가 이미 아는 것 설명 금지
- 중첩 참조 금지

---

## 8. 우리 프로젝트에 적용할 사항

### 디렉토리 구조 (확정)

```
wireframe-skill/
├── skills/
│   └── flowframe-wireframe/        ← name과 동일해야 함
│       ├── SKILL.md                ← 핵심 인스트럭션
│       └── references/
│           └── EXAMPLE.md          ← LOGIN.html 예시 + 설명
├── samples/
│   └── LOGIN.html                  ← 실제 산출물 예시
├── schema/
│   └── flowframe-meta.schema.json  ← JSON Schema
├── README.md
├── LICENSE
└── docs/
    └── SKILLS-SPEC-REFERENCE.md    ← 이 문서
```

### 핵심 결정사항

1. **name**: `flowframe-wireframe` (소문자+하이픈, 디렉토리명 일치)
2. **description**: 3인칭, 한국어+영어 키워드 포함
3. **SKILL.md 본문**: 500줄 이하, 예시는 references로 분리
4. **Progressive disclosure**: 메타데이터 스키마 상세는 references로
