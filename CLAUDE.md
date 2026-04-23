# Blueprint Plugin (`bp`)

기획자가 Claude Code에서 사용하는 **기능명세 / 화면명세 / 와이어프레임** 생성 플러그인. 이 저장소는 플러그인 자체의 코드(메타·command·agent·skill)를 담는다.

## 관련 저장소

| 저장소 | 역할 |
|--------|------|
| [`blueprint-platform`](https://github.com/blueprint-emotion/blueprint-platform) | 와이어프레임 뷰어 + 코멘트 협업 플랫폼 |
| [`blueprint-plugin`](https://github.com/blueprint-emotion/blueprint-plugin) | **이 프로젝트.** Claude Code 플러그인 |
| [`blueprint-example`](https://github.com/blueprint-emotion/blueprint-example) | 플러그인 사용 예제 프로젝트 |

**전체 흐름**: 기획자가 자신의 프로젝트에 플러그인 설치 → `/bp:plan`·`/bp:wireframe` 명령으로 산출물 생성 → Git push → 플랫폼이 GitHub API로 fetch하여 렌더링

## 프로젝트 구조

```
blueprint-plugin/
├── .claude-plugin/
│   ├── plugin.json              ← 플러그인 메타 (name: "bp")
│   └── marketplace.json         ← GitHub 마켓 메타
├── commands/                    ← /bp:* 슬래시 명령
│   ├── plan.md                  ← /bp:plan
│   └── wireframe.md             ← /bp:wireframe
├── agents/                      ← bp:* 서브에이전트 (skills: frontmatter 로 스킬 preload)
│   ├── planner.md               ← 요구사항 → 명세 (와이어 X)
│   ├── wireframer.md            ← screen.md → 와이어 HTML
│   └── reviewer.md              ← 산출물 검증 (오케스트레이터가 Task 로 호출, 공식 제약상 subagent 는 Task 없음)
└── skills/                      ← 플러그인 스킬
    ├── CLAUDE.md                ← 스킬 폴더 가이드
    ├── plan-harness/            ← /bp:plan 오케스트레이션 + 기획자 UX 원칙 (user-invocable: false)
    ├── wireframe-harness/       ← /bp:wireframe 오케스트레이션 (user-invocable: false)
    ├── intake/                  ← intake.md 형식·슬롯·_pending_decisions 메타 섹션
    ├── feature-spec/            ← 기능명세 SSOT
    ├── screen-spec/             ← 화면명세
    └── wireframe/               ← 와이어프레임 HTML + bp-* 컴포넌트
```

> 참고: 플러그인 내부에서 `.claude/` 디렉터리는 사용하지 않는다 (이전 구조의 `.claude/skills/` 도그푸딩 심링크는 제거됨). 모노레포 루트(`blueprint-emotion/`)에 `.claude/` 를 두고 루트 `.claude/{skills,agents,commands}` 를 `blueprint-plugin/{skills,agents,commands}` 로 심링크하는 구조.

## 호출 흐름

```
/bp:plan → 인자 검증 → [오케스트레이터] 인터뷰·확정 → Agent(bp:planner, round=1) 명세 작성
                    → [오케스트레이터] 수렴 루프 (체이닝): 매 라운드 Agent(bp:reviewer) + Agent(bp:planner) 새 spawn
                    → α 재진입 필요 시 오케스트레이터가 기획자 언어로 질문·수집 → 최종 보고

/bp:wireframe → 인자 검증 → [오케스트레이터] viewport 예고·덮어쓰기 분기 → Agent(bp:wireframer, round=1) HTML 생성
              → [오케스트레이터] 수렴 루프 (체이닝): 매 라운드 Agent(bp:reviewer) + Agent(bp:wireframer) 새 spawn
              → 명세 결함이면 /bp:plan 회송 안내, 아니면 생성 파일 보고
```

**규약 SSOT** — 이 흐름의 알고리즘·프롬프트·기획자 UX 원칙·α 프로토콜은 오케스트레이션 스킬 본문:

- `skills/plan-harness/SKILL.md` + `references/` (인터뷰·확인 게이트·수렴 루프·α 재진입·Agent 호출 템플릿)
- `skills/wireframe-harness/SKILL.md` + `references/`

공식 제약(subagent 는 Agent tool 이 없음)상 `Agent(bp:reviewer)` 는 **오케스트레이터만** 호출 가능. producer 재진입은 체이닝 모델 — **매 라운드 새 `Agent(bp:planner|wireframer)` spawn** 으로 처리하며 상태는 intake.md + 생성된 명세·HTML 파일에서 복원. SendMessage 기반 세션 재진입은 사용하지 않는다 (experimental Agent Teams 의존성 제거).

> `Task` tool 은 v2.1.63 공식 리네임으로 `Agent` 가 됐고 `Task(...)` 는 하위호환 alias. 본 문서는 공식 이름 `Agent` 로 표기.

## 6개 스킬·3개 에이전트·2개 명령

| 명령 | 수행 주체 | 사용 skill | 산출물 |
|---|---|---|---|
| `/bp:plan {요구사항.md}` | 오케스트레이터(인터뷰·확정) → `bp:planner`(명세 작성·수렴) → `bp:reviewer` | plan-harness, intake, feature-spec, screen-spec | intake.md, features/*.md, screens/**/*.md |
| `/bp:wireframe {screen.md}` | 오케스트레이터(viewport 예고) → `bp:wireframer`(HTML 생성·수렴) → `bp:reviewer` | wireframe-harness, wireframe, screen-spec | screens/**/*.html |

**책임 분리**:
- **commands** = 인자 검증 + 오케스트레이터 규약 진입점 (harness 스킬 로드)
- **오케스트레이터(Claude Code 본인)** = 기획자와의 인터뷰·컨펌·α 재진입 결정 수집
- **agents** = 고유 워크플로 수행 (명세/HTML 생성·수렴 루프·검증)
- **skills — 두 종류**:
  - **산출물 규약** (`intake`, `feature-spec`, `screen-spec`, `wireframe`) = "결과물이 어떻게 생겨야 하는가" (SSOT)
  - **오케스트레이션** (`plan-harness`, `wireframe-harness`) = "실행 흐름이 어떻게 이어져야 하는가" — Producer-Reviewer 수렴 루프·컨펌 게이트·Agent 호출·기획자 UX 원칙. `user-invocable: false` 로 사용자 메뉴에서 숨김, command 와 agent `skills:` frontmatter 로 preload

## 핵심 설계 원칙

- **기능명세 = 도메인 규칙 (SSOT)**: 비즈니스 규칙만. UI 표현 금지
- **화면명세 = 화면 요소**: featureId로 기능명세를 참조. 속성명 직접 사용 금지
- **와이어프레임 = 정적 HTML**: bp-* Web Components (shadcn/ui 1:1 포팅) + Tailwind
- **intake = 작업 노트**: 산출물 아님. planner의 인터뷰 결과·재실행 추적용
- **SSOT + 링크 참조**: 정보를 한 곳에만 작성하고 나머지는 링크로

## 토큰 효율적 문서 읽기

산출물 문서(기능명세, 화면명세)는 frontmatter에 TOC를 갖는다. 참조 시 전체를 읽지 않는다:

1. frontmatter `toc`만 읽어 구조 파악
2. Grep으로 필요한 `## {ID}` 헤딩의 줄번호 찾기
3. Read의 `offset`/`limit`로 해당 섹션만 읽기

와이어프레임 스킬에서 **`bp-components.js`를 절대 fetch/read하지 않는다** — 6,600줄 빌드 산출물. 컴포넌트 사용법은 SKILL.md의 빠른 참조표 + `references/components/bp-X.md` 분할 파일에 모두 있음.

## 버전 관리 정책

각 스킬은 독립 SemVer를 갖는다 (skills/{name}/SKILL.md frontmatter `version` + `CHANGELOG.md`).

플러그인 자체(`plugin.json` `version`)는 별도 SemVer.

### 호환성 매트릭스

플러그인 한 버전이 6개 스킬을 한 세트로 pin한다:

| 플러그인 버전 | plan-harness | wireframe-harness | intake | feature-spec | screen-spec | wireframe |
|---|---|---|---|---|---|---|
| 0.1.0 | — | — | 0.1.1 | 1.4.2 | 1.6.1 | 4.1.2 |
| 0.2.0 | 1.0.0 | 1.0.0 | 0.2.0 | 1.4.2 | 1.6.1 | 4.1.2 |
| 1.0.0 | 2.0.0 | 1.0.1 | 0.3.0 | 1.4.2 | 1.6.2 | 4.1.3 |
| 2.0.0 | 3.0.0 | 2.0.0 | 0.3.0 | 1.4.2 | 1.6.2 | 4.1.3 |
| **3.0.0** | **4.0.0** | **3.0.0** | **0.3.1** | 1.4.2 | 1.6.2 | **4.5.0** |

> 0.1.0 의 `harness` 스킬은 0.2.0 에서 `plan-harness` + `wireframe-harness` 로 분리됐다. 0.2.0 은 BREAKING — agents 의 `skills:` frontmatter 도 함께 바뀌었다.
>
> 2.0.0 은 BREAKING — 공식 제약(subagent 는 Task tool 없음)에 맞춰 **Producer-Reviewer 수렴 루프를 subagent 주도 → 오케스트레이터 주도로 이관**. Task(bp:reviewer) 호출은 오케스트레이터만 가능하고, planner/wireframer 재진입은 SendMessage 로 처리 (Agent Teams `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 활성 필요). 이전 설계의 "planner→reviewer Task 호출" 은 플랫폼 단에서 작동하지 않던 것이었다.
>
> 3.0.0 은 BREAKING — 수렴 루프를 **SendMessage 세션 재진입 → Agent 체이닝 (매 라운드 새 spawn)** 으로 전환. 근거: (1) 공식 문서 권고 "chain subagents from the main conversation", (2) Agent Teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`) 가 experimental 로 사용자 환경 의존성, (3) 상태가 전부 intake.md + 명세 파일(durable truth)에 있어 세션 연속성 불필요. plan-harness 3.0.0 → 4.0.0, wireframe-harness 2.0.0 → 3.0.0 으로 동반 MAJOR. agent 본문 단일 진입점으로 재작성, α 프로토콜 α-5 단계(SendMessage 로 planner 재호출) 삭제 — α-4 에 흡수 (다음 라운드 새 Agent 호출 + "α 결정 반영" 템플릿). `Task` → `Agent` 표기 일원화 (v2.1.63 공식 리네임). 동반으로 wireframe 스킬은 **커스텀 엘리먼트 self-closing 금지 규칙**을 reviewer 검증 카테고리·visual-review 체크항목·auto-fix-policy 에 추가 (MINOR 4.5.0). intake 는 문서 내 SendMessage 언급 제거 (PATCH 0.3.1). 구 SendMessage 기반 경로로 생성된 intake.md 는 payload 스키마 무변화라 그대로 호환. 트레이드오프: α 결정 적용 시 spawn 1회 추가 — 세션 재진입 비용 제거와 상쇄.
>
> 1.0.0 은 BREAKING — α 재진입 프로토콜이 **옵션 B** 로 전환됐다. planner subagent 는 `## _pending_decisions` 에 payload 6필드(`planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority`, 객체화된 `alternatives`) 만 기록하고 기획자-facing 질문을 **최종 출력에 담지 않는다**. 질문 번역·수집은 **오케스트레이터**가 `plan-harness/references/α-pending-to-question.md` 규약으로 수행한다. 기존 `awaiting_decision` 출력 포맷에 의존하던 통합은 모두 업데이트 필요. intake 는 payload 스키마 확장으로 MINOR bump (0.3.0), screen-spec/wireframe 은 overlay viewport 독립 규약·suffix 파일명 명시화로 PATCH bump.

**산출물 규약 스킬** (intake, feature-spec, screen-spec, wireframe): "결과물이 어떻게 생겨야 하는가"
**오케스트레이션 스킬** (plan-harness, wireframe-harness): "실행 흐름이 어떻게 이어져야 하는가". `user-invocable: false`, command 컨텍스트와 agent `skills:` frontmatter 로 preload

스킬을 개별 bump할 때:
- **MAJOR (스킬)** = 산출물 호환성 깨짐 → **MAJOR (플러그인)** 같이 bump
- **MINOR (스킬)** = 새 슬롯·새 패턴 추가 → **MINOR (플러그인)** 같이 bump
- **PATCH (스킬)** = 문서 명료화·예제 보강 → **PATCH (플러그인)**

## 개발 시 주의사항

### 스킬 수정

- `skills/CLAUDE.md`에 전체 설계 원칙·문서 간 연결 구조가 정의되어 있음
- 각 `SKILL.md`는 2단계 참조: 스킬 파일만으로 작성 가능 → 필요 시 references 참조
- 변경 시 SKILL.md `version` bump + CHANGELOG.md 항목 추가 (Added/Changed/Removed/Fixed)
- BREAKING 변경은 마이그레이션 가이드 함께 작성

### Agent 수정

- agent 본문은 워크플로 단계만 명시. 산출물 형식은 skill 가이드라인 따르라고 위임
- agent가 다른 agent 호출 시 `subagent_type: "bp:{name}"` 형태
- 새 agent 추가 시 namespace 충돌 주의 (`bp:` 안에서 unique)

### Command 수정

- **command 파일은 오케스트레이터 규약 진입점** (B1 모델). 인자 검증·인터뷰·컨펌 게이트·α 재진입·viewport 예고는 **오케스트레이터(Claude Code 본인)** 가 command 문서를 레퍼런스로 직접 수행한다. subagent 는 명세 작성/HTML 생성/검증 같은 고유 워크플로만 담당
- $ARGUMENTS placeholder로 사용자 인자 받음
- 엣지 케이스(파일 없음, 형식 위반)는 command 의 "인자 검증" 섹션에서 거르고 subagent 에 위임하지 않음
- command 문서는 `plan-harness` / `wireframe-harness` 스킬의 references 를 링크로 참조하며, 자체가 과도하게 두꺼워지지 않도록 주의 (SSOT)

### 도그푸딩 & 테스트

이 플러그인을 개발·테스트하는 방법은 두 가지:

**A. 모노레포 루트에서 심링크 경유 사용 (권장 — 현재 구조)**

`blueprint-emotion/` 루트에 `.claude/{skills,agents,commands}` 가 `blueprint-plugin/{skills,agents,commands}` 로 심링크되어 있어, 모노레포 루트에서 Claude Code 를 시작하면 스킬·에이전트·커맨드가 모두 활성화된다. 스킬 자동 트리거도 이 심링크 구조로 동작 (예: 화면명세 파일을 만들면 `screen-spec` 스킬 트리거).

**B. plugin-dir 모드로 직접 로드**

명령·에이전트의 namespace 동작을 격리 검증하려면:

```bash
claude --plugin-dir .
```

이 디렉터리(`blueprint-plugin/`)를 플러그인으로 로드해 `/bp:plan`, `/bp:wireframe` 명령이 활성화된다. 테스트용 화면을 만들고 싶으면 `docs/screens/test/` 같은 임시 폴더를 만들어 돌려보고, 결과 산출물은 git에 커밋하지 않고 정리.

> 과거에는 `blueprint-plugin/.claude/skills/` 가 `blueprint-plugin/skills/` 로 심링크되어 있었으나, 모노레포 루트 `.claude/` 로 통합하면서 플러그인 내부 `.claude/` 는 제거됨.

## 사용자 프로젝트와 이 저장소의 차이

이 저장소(`blueprint-plugin`)는 **플러그인의 소스**. 사용자가 자신의 프로젝트에 이 플러그인을 설치하면, 사용자 프로젝트에서 `/bp:plan`·`/bp:wireframe` 명령이 동작한다.

- 이 저장소: 플러그인 코드 (commands, agents, skills) 작성·유지
- 사용자 프로젝트: 산출물(`docs/features/`, `docs/screens/`) 생성

스킬·agent의 모든 동작 가이드는 **사용자 프로젝트의 `docs/` 폴더**를 가정하고 작성되어야 한다.
