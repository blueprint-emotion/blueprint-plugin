# Changelog — wireframe-harness skill

## 3.0.1 — 2026-04-23

### Added

- `references/convergence-loop.md` 에 "기존 HTML 수정 모드 (/bp:edit 진입점)" 섹션 추가. Route B (와이어만) / Route C (둘 다 의 와이어부) 가 wireframer producer + reviewer 체이닝을 재사용해 타겟 블록만 수정하는 규약 명시
- "Route B 자동 수정 불가 회송 규칙" 서브섹션 — reviewer 가 "자동 수정 불가" 를 반환하면 루프 지속 금지(reviewer 분류 신뢰 원칙), 위반 성격별 **회송 경로만** 분기: 명세-HTML 드리프트 → `/bp:plan` 회송으로 Route C 승격, 그 외(와이어 규약·외부 의존성) → 기획자 facing 회송 메시지 + 루프 종료

### Fixed

- /bp:edit 3.1.0 설계가 Route B 를 "HTML 직접 Edit + reviewer 만 호출" 로 기술했던 부분을 이 섹션이 SSOT 로 대체. 체이닝 모델·루프 한계·자동 수정 분기가 일반 /bp:wireframe 경로와 일관되도록 규약 복원

## 3.0.0 — 2026-04-22

### BREAKING — SendMessage 세션 재진입 → Agent 체이닝 전환

plan-harness 4.0.0 과 동반 MAJOR. 동일한 체이닝 모델 전환을 wireframe 워크플로에 적용.

- **wireframer 재진입을 매 라운드 새 `Agent(bp:wireframer)` spawn 으로** — SendMessage 기반 세션 재진입 폐기
- 생성된 HTML 파일이 durable state 역할 — 새 wireframer 인스턴스가 기존 HTML 을 Read 해 맥락 복원
- agentId 라운드 간 보관 불필요
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 의존성 제거
- **`Task` → `Agent` 표기 일원화** (v2.1.63 공식 리네임)
- **불변 규칙 8 추가** — 모든 Agent prompt 에 `round: N` 필수

### Added — 커스텀 엘리먼트 self-closing 금지 규칙

reviewer 검증 카테고리 + auto-fix-policy + visual-review 체크항목 신설:

- **reviewer 위반 카테고리 `[HTML-CLOSING]`** — 커스텀 엘리먼트(`bp-*` 포함) self-closing(`<bp-input ... />`) 발견 시 감지
- **자동 수정 가능** 으로 분류 (기계적 치환, 기획 의사결정 불필요)
- **visual-review 자기점검** 에 "커스텀 엘리먼트 self-closing 없음" 체크 추가
- **auto-fix-policy** 에 치환 지침 추가 — `<bp-xxx ... />` → `<bp-xxx ...></bp-xxx>`
- **불변 규칙 9 추가** — 커스텀 엘리먼트 self-closing 금지

**근거**: HTML 은 void 요소(`img`/`input`/`br`/`hr`/`meta`/`link`/`area`/`base`/`col`/`embed`/`source`/`track`/`wbr`)만 self-closing 허용. 커스텀 엘리먼트의 `/>` 는 브라우저가 **무시**하고 뒤의 형제 요소를 자식으로 삼켜 레이아웃을 파괴한다 (예: `<bp-input />` 뒤의 `<bp-input-group-button>` 이 bp-input 자식으로 흡수됨). 규칙 상세는 `wireframe` 스킬 4.5.0 참조.

### Removed

- `references/task-tool-invocation.md` — prompt 템플릿은 `convergence-loop.md` 에 통합

### Migration

- 기존 생성된 HTML 은 그대로 호환. reviewer 가 구 HTML 에서 `[HTML-CLOSING]` 위반을 새로 감지할 수 있으나 자동 수정 가능 분류라 다음 `/bp:wireframe` 라운드에서 반영됨

## 2.1.0 — 2026-04-22

### Changed — 시트·다이얼로그 와이어 분리 정책 뒤집음

이전: 같은 폴더에 `sheet_*.md` / `dialog_*.md` 가 있으면 와이어 생성기가 **자동으로 별도 파일**(`wireframe_sheet_{name}.html` 등) 을 생성. 메인 와이어 안 fragment 표현은 자율 (가이드 모호).

이후: **기본은 메인 와이어 안에 fragment 로 모두 포함**. 별도 파일은 기획자가 명시적으로 이름을 말한 경우에만 opt-in 생성. 명세 분리(`sheet_*.md` / `dialog_*.md`)는 그대로 SSOT 단위 (자체 screenId · 상태 · AC) 이지만, 와이어 표현 단위는 메인에 합치는 것이 기본.

### Added — 게이트 2

- `confirm-gates.md` — viewport 예고 게이트(게이트 1) 다음에 **게이트 2** 신설. `sheet_*.md` / `dialog_*.md` 가 1개 이상 있을 때만 발동. 목록을 보여주고 "별도 파일로도 뽑을 게 있을까요?" 한 번 질의. 기본 응답("없음" / 무응답) 은 메인 fragment 만, 이름을 말하면 그 이름들만 별도 파일 추가 (메인 fragment 는 유지)
- 응답 처리 표 (없음 / 일부 이름 / 전부 / 알 수 없는 이름)
- 별도 파일 생성 시 viewport 분기 규약 유지 (각 overlay 의 viewport 배열을 독립적으로 따름)

### Changed — SKILL.md

- §책임 분배 다이어그램의 게이트를 1단계 → 2단계로 분리 (viewport 예고 / 시트·다이얼로그 분리)
- §기획자 경험 원칙 #2 의 예시 메시지를 게이트 2 포함 형태로 갱신

### Why

- 검토자 입장에서 메인 와이어 한 파일만 열어도 "어디서 어떤 오버레이가 뜨는지" 한눈에 보이는 것이 기본값으로 더 가치 있음
- 별도 파일은 추가 생성·렌더·관리 비용. 정말 풍부한 상태 변형이 있을 때만 정당화됨
- 명세 SSOT 분리(`sheet_*.md`) 와 와이어 표현 단위는 직교 — 명세는 도메인·AC 단위, 와이어는 시각 단위

### Requires

- `wireframe` 스킬 4.3.1 (오버레이 섹션에 "기본 메인 fragment, 별도 파일은 opt-in" 명시)
- `blueprint-plugin` MINOR bump 검토

## 2.0.0 — 2026-04-21

### BREAKING — Producer-Reviewer 수렴 루프를 오케스트레이터 주도로 이관

plan-harness 3.0.0 과 동일한 근본 원인 (Anthropic 공식 제약 — subagent 는 Task 없음). wireframer subagent 도 `bp:reviewer` 를 Task 로 spawn 할 수 없음. 루프 주체를 **wireframer → 오케스트레이터** 로 이관.

### Changed — 핵심 구조 변경

- **수렴 루프 주체**: wireframer subagent → **오케스트레이터**
- **Task(bp:reviewer) 호출**: wireframer 가 직접 → 오케스트레이터 전담
- **wireframer 재진입 방식**: 새 Task 로 re-spawn → 기존 세션에 SendMessage 로 재진입 (Agent Teams 활성 필요)
- **위반 리포트 전달 경로**: reviewer → wireframer (직접) → reviewer → **오케스트레이터** → SendMessage(wireframer)
- **명세 결함 회송 경로**: wireframer 가 기획자에게 메시지 → wireframer 가 회송 메시지를 오케스트레이터로 반송 → 오케스트레이터가 기획자에게 전달

wireframer 의 역할은 (1) 최초 HTML 생성 + 자기점검 (2) SendMessage 로 들어온 위반 반영 또는 명세 결함 회송 메시지 작성 — 두 가지만.

### Changed — 파일별 수정

- `SKILL.md` — 책임 분배 다이어그램 재작성, "Producer-Reviewer 수렴 루프 = 오케스트레이터 주도" 명시, 공식 제약 섹션 신설, 불변 규칙 1·2 재작성, 호출자 컨텍스트 선언 업데이트
- `references/task-tool-invocation.md` — **전면 재작성**. wireframer→reviewer Task 템플릿 삭제. 오케스트레이터→wireframer Task, 오케스트레이터→reviewer Task, 오케스트레이터→wireframer SendMessage (위반 반영 요청) 로 재구성. 공식 제약 섹션 신설, plan-harness 와의 구조 일치 명시
- `references/convergence-loop.md` — **전면 재작성**. 알고리즘을 오케스트레이터 실행으로 변경 (Task → reviewer → SendMessage → wireframer → ... 반복). plan-harness 와 구조 공유, wireframe 특화 차이만 별도 명시
- `agents/wireframer.md` — §7-0 (ToolSearch + Task 로드 절차) 삭제. §7 "reviewer 호출 및 수렴 루프" 를 "자기점검 + 반송" 으로 교체. §8 "SendMessage 재진입 처리" 신설. 행동 규칙에 "Task tool 사용 금지", "reviewer 직접 호출 금지" 명시
- `agents/reviewer.md` — plan-harness 와 동반 업데이트 (호출자 컨텍스트 정책 갱신)
- `commands/wireframe.md` — §4 (최초 wireframer Task) + §5 (오케스트레이터 주도 수렴 루프) 분리. §5 에 Task+SendMessage 알고리즘 의사코드 + 템플릿 참조 추가. §6 최종 보고 재작성

### Requires (동반 변경)

- `plan-harness` 3.0.0 으로 동반 MAJOR bump
- `blueprint-plugin` 2.0.0 으로 MAJOR bump
- `bp:wireframer`, `bp:reviewer` agent 본문 업데이트

### 마이그레이션 가이드

1. 사용자 프로젝트의 custom wireframer prompt 가 있으면: Task(bp:reviewer) 호출 삭제. "반송" 으로 변경
2. `/bp:wireframe` 자동화 스크립트: 단일 Task(bp:wireframer) 호출로 끝나지 않음을 인지. 오케스트레이터 루프 여러 턴에 걸쳐 진행

## 1.0.1 — 2026-04-21

### Changed

- `references/confirm-gates.md` viewport 예고 섹션의 overlay 파일 생성 규약을 pc 단일 파일 요약에서 **overlay viewport 독립 규약** 으로 보강 — `[pc]`/`[mobile]`/`[pc, mobile]` 각 케이스별 생성 파일 명시 (`wireframe_sheet_{name}.html`, `wireframe_sheet_{name}_mobile.html` 등). commands/wireframe.md:87 및 wireframe/SKILL.md:51 과 SSOT 일치화 (이전에는 요약이 느슨해서 overlay 가 항상 pc 1개로 해석될 여지가 있었음)

## 1.0.0 — 2026-04-21

### Added (신규 스킬)
- `/bp:wireframe` 전용 오케스트레이션 스킬 신설. 이전 `harness` 스킬에서 wireframe 관련 부분을 분리·재설계
- **오케스트레이터 = 확인 + 위임, wireframer = 렌더 + 수렴** 책임 분배
- **기획자 UX 원칙**: 빠른 확인 → 렌더 → 결과. 인터뷰 없음
- **명세 경계 원칙**: 명세(screen/area/feature) 문제 발견 시 /bp:plan 으로 돌려보냄 (wireframe-harness 는 와이어프레임만 손댐)
- 6개 references:
  - `wireframer-ux.md` — 기획자 언어 (결과 중심 톤)
  - `confirm-gates.md` — viewport + 파일 목록 확인, 덮어쓰기 분기
  - `convergence-loop.md` — 수렴 루프 (자동수정 비중 높음)
  - `auto-fix-policy.md` — HTML/bp-* 위반 분류
  - `visual-review.md` — wireframer 의 1차 자기점검 체크리스트
  - `task-tool-invocation.md` — Task 호출 절차

### Context (구 `harness` 스킬로부터의 이관)
- 구 `harness/SKILL.md` 의 Producer-Reviewer 패턴을 wireframe 맥락으로 특화
- 구 `harness/convergence-loop.md` 의 `ask_user` 추상화는 wireframe 에서는 거의 발동하지 않음 (수동 결정 드묾). 발동 시 /bp:plan 으로 돌려보내는 것이 원칙
- 구 `harness/auto-fix-policy.md` 의 wireframe 관련 예시를 이 스킬 안으로 이관 + 확장

### Requires (동반 변경)
- `bp:wireframer` agent: skills: [wireframe-harness, wireframe, screen-spec]
- `bp:reviewer` agent: skills: [plan-harness, wireframe-harness, ...] 듀얼 로드
- `commands/wireframe.md` 경미 업데이트 (harness 포인팅만 변경)
