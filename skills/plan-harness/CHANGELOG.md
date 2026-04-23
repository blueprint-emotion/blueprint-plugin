# Changelog — plan-harness skill

## 4.0.1 — 2026-04-23

### Added

- `references/convergence-loop.md` 에 "편집 모드 호출 (/bp:edit 진입점)" 섹션 추가. Route A (명세만) / Route C (둘 다 의 명세부) 가 plan-harness 를 재사용하는 방식·입력 차이·최초 planner spawn prompt 의 `mode: 편집 모드` 컨텍스트 규약 명시

### Fixed

- /bp:edit 3.1.0 설계가 "타겟 업데이트 모드" 라는 미정의 용어로 가리킨 부분을 이 섹션이 SSOT 로 대체. intake-branches.md 가 존재하지 않는 참조였던 문제 해소

## 4.0.0 — 2026-04-22

### BREAKING — SendMessage 세션 재진입 → Agent 체이닝 전환

**근거**:
- 공식 문서 권고 (https://code.claude.com/docs/en/sub-agents): "If your workflow requires nested delegation, use Skills or chain subagents from the main conversation"
- Agent Teams (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) 는 experimental — 사용자 환경 의존성이 생기고, `/resume`·`/rewind` 미지원 등 알려진 버그가 있음
- 모든 라운드 상태가 이미 **intake.md + 생성된 명세 파일** 에 저장됨 (durable truth) — 세션 연속성 불필요

### Changed — 구조 변경

- **수렴 루프의 producer 재진입을 매 라운드 새 `Agent(bp:planner)` spawn 으로** — 이전의 "최초 Task spawn + 이후 SendMessage 로 동일 세션 재진입" 패턴 폐기
- agentId 라운드 간 보관 불필요
- 오케스트레이터는 매 Agent 호출 prompt 에 `round: N` 과 `mode` 명시. 새 planner 인스턴스가 intake.md 상태를 읽어 맥락 복원
- **α 프로토콜 α-5 단계 삭제** — SendMessage 로 기존 planner 재호출 → α-4 에 흡수 (다음 라운드 새 Agent 호출 + "α 결정 반영" prompt 템플릿)
- **α + 위반 공존 ORDERING 규칙 추가** — 같은 라운드에 α + 자동 수정 가능 위반이 동시 발생 시 α 결정 반영이 선행, reviewer 를 한 번 더 돌려 최신 상태에서 위반을 재평가. 이유: α 결정으로 파일 구조가 바뀌면 이전 리포트의 라인 번호가 stale 됨
- **`Task` → `Agent` 표기 일원화** — v2.1.63 공식 리네임. 내부적으로 `Task(...)` 는 alias 로 동작하지만 문서·새 코드는 `Agent(...)` 사용
- **불변 규칙 8 추가** — 모든 Agent prompt 에 `round: N` 필수 (새 spawn 이 세션 기억이 없음)

### Removed

- `references/task-tool-invocation.md` — prompt 템플릿은 `convergence-loop.md` 에 통합. SendMessage 관련 절차·message 템플릿·세션 관리 섹션은 체이닝 모델에서 불필요
- `references/resume.md` — 체이닝 모델에선 resume 경로가 "`/bp:plan` 다시 호출" 하나. 기획자 UX 톤은 SKILL.md §"기획자 경험 원칙 8"에 한 문단으로 흡수
- `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` 의존성 제거

### Migration

- 기존 intake.md 는 payload 스키마 무변화라 그대로 호환 (`## _pending_decisions` 섹션 구조 동일)
- 커스텀 agent 가 있다면 "SendMessage 수신" 분기를 제거하고 단일 진입점(`mode` 필드 분기)으로 통합
- 플러그인 사용자는 `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 설정 해제 가능

### 트레이드오프

- α 결정 적용 시 spawn 1회 추가 (기존은 SendMessage 로 기존 세션 재사용). 세션 재진입 비용 제거와 상쇄되며, preload 감소로 전체 토큰은 감소

## 3.0.0 — 2026-04-21

### BREAKING — Producer-Reviewer 수렴 루프를 오케스트레이터 주도로 이관

**설계 전제 확립 (공식 제약 발견)**:

https://code.claude.com/docs/en/sub-agents:
> "Subagents cannot spawn other subagents, so `Agent(agent_type)` has no effect in subagent definitions."

이전 2.0.0 까지의 설계는 planner subagent 가 `Task(subagent_type: "bp:reviewer")` 로 reviewer 를 spawn 하여 수렴 루프를 돌리는 전제였으나, **Anthropic 공식 플랫폼 제약으로 subagent 에는 Task tool 이 존재하지 않음**. `ToolSearch(select:Task)` 를 해도 스키마가 로드되지 않아 호출 자체가 성립하지 않는다. 즉 이전 설계는 플랫폼 단에서 작동하지 않던 것.

### Changed — 핵심 구조 변경

- **수렴 루프 주체**: planner subagent → **오케스트레이터** 로 이관
- **Task(bp:reviewer) 호출**: planner 가 직접 → 오케스트레이터가 전담
- **planner 재진입 방식**: 새 Task 로 re-spawn → 기존 세션에 SendMessage 로 재진입 (Agent Teams 활성 필요, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`)
- **위반 리포트 전달 경로**: reviewer → planner (직접) → reviewer → **오케스트레이터** → SendMessage(planner)
- **α 재진입 재호출**: 새 Task → SendMessage 로 기존 planner 세션 재진입

planner 의 역할은 이제 (1) 최초 명세 작성 (2) SendMessage 로 들어온 위반 반영 — 두 가지만. reviewer 호출·Task 호출·self-check 시도 금지.

### Changed — 파일별 수정

- `SKILL.md` — 책임 분배 다이어그램 재작성, "Producer-Reviewer 수렴 루프 = 오케스트레이터 주도" 명시, 공식 제약 섹션 신설, 불변 규칙 1·2 재작성 (subagent Task 금지 명문화), 호출자 컨텍스트 선언 업데이트
- `references/task-tool-invocation.md` — **전면 재작성**. planner→reviewer Task 템플릿 삭제. 오케스트레이터→planner Task (최초), 오케스트레이터→reviewer Task (매 라운드), 오케스트레이터→planner SendMessage (위반 반영 / α 결정 수신 후) 3종 템플릿으로 재구성. 공식 제약 섹션 신설, 흔한 오류 6종 (§A subagent Task 시도, §D self-check 대체 금지 + advisor 리터럴 지정, §F 로드 실패 분기) 업데이트
- `references/convergence-loop.md` — **전면 재작성**. 알고리즘을 오케스트레이터 실행으로 변경 (Task → reviewer → SendMessage → planner → ... 반복). α-1~α-5 단계에서 α-4 재호출을 SendMessage 로 전환. 최종 보고는 오케스트레이터가 직접 출력
- `agents/planner.md` — §2-0 (ToolSearch + Task 로드 절차) 삭제. §2 "reviewer 호출 및 수렴 루프" 를 "반송 (reviewer 호출 없음)" 으로 교체. §3 "SendMessage 재진입 처리" 신설. 행동 규칙에 "Task tool 사용 금지", "reviewer 직접 호출 금지" 명시
- `agents/reviewer.md` — description · 호출 게이트의 "bp:planner/bp:wireframer 가 호출" 전제를 "오케스트레이터가 Task 로 정식 위임" 으로 갱신. legacy 호환을 위해 구 컨텍스트 선언 문구도 통과 허용. 행동 규칙의 "재검증은 producer 주도" → "재검증은 오케스트레이터 주도 (매 라운드 새 Task)" 로 변경
- `commands/plan.md` — §6 (최초 planner Task) + §7 (오케스트레이터 주도 수렴 루프) 분리. §7 에 Task+SendMessage 알고리즘 의사코드 + 템플릿 참조 추가. §8 α 재진입은 SendMessage 재호출로 전환

### Requires (동반 변경)

- `wireframe-harness` 2.0.0 으로 동반 MAJOR bump — 동일한 구조 변경 (wireframer subagent 도 Task 가 없어 reviewer 를 spawn 할 수 없음)
- `blueprint-plugin` 2.0.0 으로 MAJOR bump — 호환성 매트릭스 갱신
- `bp:planner`, `bp:wireframer`, `bp:reviewer` agent 본문 업데이트 (위 목록)
- `commands/plan.md`, `commands/wireframe.md` 업데이트
- 사용자 프로젝트의 automation 파이프라인이 있으면 Task 호출 주체 변경 반영 필요 (원격 호출 없고 사용자 세션 내 에이전트 간 통신이라 대부분 영향 없음)

### 마이그레이션 가이드

1. **기존 2.0.0 intake.md 가 `awaiting_decision` 상태면**: payload 6필드 그대로 유지. 오케스트레이터가 α-4 에서 SendMessage 로 planner 재진입 시도 시 planner 세션이 이미 종료됐으면 새 Task 로 spawn 후 intake.md 결정 내역을 prompt 에 포함해 위임 (`commands/plan.md` §8 폴백)
2. **사용자 프로젝트 custom planner/wireframer prompt 가 있으면**: Task(bp:reviewer) 호출 삭제. "반송" 으로 변경
3. **플러그인 명령 자동화 스크립트가 있으면**: 단일 Task(bp:planner) 호출로 완결되지 않음을 인지. 오케스트레이터 루프 여러 턴에 걸쳐 진행됨

## 2.0.0 — 2026-04-21

### BREAKING — α 재진입 프로토콜을 옵션 B 로 전환

- planner subagent 는 `## _pending_decisions` 에 **payload 만 기록**하고 턴 종료. 기획자-facing 자연어 질문은 최종 출력에 담지 않는다 (짧은 handoff note 만 허용)
- 질문 번역·수집·재호출은 **오케스트레이터(Claude Code 본인)** 의 책임. 번역 SSOT 가 한 곳에 모여 대화 톤 일관성 확보
- payload 스키마 6필드 확장: `planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority` (blocking/important/optional), 객체화된 `alternatives` (label/trade_off/recommended)
- 기존 `awaiting_decision` turn 에서 planner 가 직접 기획자에게 질문을 출력하던 동작은 금지 — 이에 의존하던 통합은 모두 업데이트 필요

### Added

- `references/α-pending-to-question.md` — **신설**. payload → 자연어 질문 변환 규약. 필드별 해석 규칙·금지어 표·한 턴 묶음 크기 (blocking 2건 max)·질문 템플릿 (단일/2건 묶음)·"나중에" 응답 처리·오케스트레이터 자가점검 체크리스트
- `references/convergence-loop.md` α-1 ~ α-5 섹션 전면 재작성 — planner 책임 = payload 기록만, 오케스트레이터 책임 = 번역/질문/수집/재호출 로 명확히 분리. α-4 "정식 위임" 주어를 오케스트레이터로 정정. 최종 보고 B 를 handoff note 로 변경

### Changed

- `description` frontmatter 에 B1 옵션 B 책임 분리 명시화
- intake 스킬 0.3.0 dependency 명시 (payload 6필드 + priority)
- `commands/plan.md` §7 α 재진입 처리 절차를 옵션 B 에 맞게 재작성 — `α-pending-to-question.md` Read 선행, "나중에" 응답 처리 규약 명시화
- `agents/wireframer.md` / `agents/planner.md` 에 `ToolSearch(select:Task)` 선행 절차 추가
- `references/confirm-gates.md` 게이트 3 섹션 전면 재작성 — 이전 옵션 A 잔재 ("planner 소유", "기획자 facing 질문만") 를 옵션 B ("오케스트레이터 주도, planner payload 기록") 로 정합화. §planner 의 게이트 3 메시지 원칙 → §오케스트레이터의 게이트 3 번역 원칙 으로 재작성
- `agents/reviewer.md` 예시 출력 블록 "적용할까요?" → "(producer 가 auto-fix-policy 로 반영)" 으로 정돈 (행동 규칙과의 모순 해소)
- `commands/wireframe.md` viewport 예고 예시 + `references/wireframer-ux.md` 완료 메시지 예시에 overlay mobile suffix (`wireframe_sheet_{name}_mobile.html`) 누락분 보강
- `references/confirm-gates.md` 상단 §게이트 3종 표와 §B1 책임 분배 도입문도 옵션 B 로 일관화 (파일 상단과 Gate 3 본문이 서로 다른 주체를 서술하던 SSOT 위반 해소)
- 폴더 가이드 `skills/CLAUDE.md` 의 오래된 요약 2건 동기화: (1) "산출물 규약 (4개, 사용자 invocable)" → "user-invocable: false, command/agent 가 참조하는 규약 스킬" 로 실제 frontmatter 와 일치, (2) "유저스토리는 루트에 두지 않는다" → "단일 영역 화면이면 필수, 영역 분할 화면이면 선택" 으로 screen-spec 1.6.x 세분화 규약과 일치

### 마이그레이션 가이드

1. planner.md custom 프롬프트가 있다면 `## _pending_decisions` payload 스키마 6필드로 업데이트
2. 기존 intake.md 가 `awaiting_decision` 상태라면 payload 는 구 스키마 그대로 남겨두고, 오케스트레이터가 Read 시 누락 필드는 빈 값으로 해석. 새 α round 부터 6필드 적용
3. 사용자 프로젝트 단위 통합 (자동화 파이프라인 등) 이 있으면 planner 출력 포맷 검증 로직 제거 — 이제 payload 전용

## 1.0.0 — 2026-04-21

### Added (신규 스킬)
- `/bp:plan` 전용 오케스트레이션 스킬 신설. 이전 `harness` 스킬에서 plan 관련 부분을 분리·재설계
- **B1 실행 모델**: 인터뷰·확정은 오케스트레이터가 인라인 수행, 명세 작성·수렴 루프만 planner subagent 로 위임
- **기획자 경험 원칙 (top-level)** 10개 신설 — 슬롯 노출 금지, 시스템 언어 금지, Gate 3 번역, Delegation 기대치 세팅 등
- **α 재진입 프로토콜** — 수렴 루프의 수동결정 지점에서 planner 가 intake.md 에 상태를 기록하고 턴 종료, 오케스트레이터가 응답 수집 후 새 Task 로 재진입하는 방식 명문화
- 7개 references:
  - `interview-flow.md` — 대화형 인터뷰 전략 (빈칸 중심, 다중 슬롯 흡수)
  - `planner-ux.md` — 기획자 언어 번역 가이드
  - `confirm-gates.md` — intake + 작업 트리 확정 게이트
  - `convergence-loop.md` — 수렴 루프 + α 재진입
  - `auto-fix-policy.md` — feature/screen 위반 분류
  - `resume.md` — 중단된 `/bp:plan` 재개 플로우
  - `task-tool-invocation.md` — planner→reviewer Task 호출 절차

### Context (구 `harness` 스킬로부터의 이관 관계)
- 구 `harness/SKILL.md` + `references/*.md` 에 있던 "Producer-Reviewer 패턴"·"Task 호출 절차"·"auto-fix-policy" 원형을 승계
- 구 `harness` 는 /bp:plan 과 /bp:wireframe 을 한 스킬로 묶었는데, 두 커맨드의 UX 결이 달라 분리:
  - `plan-harness` = 대화형 인터뷰 중심
  - `wireframe-harness` = 입력 검증 → 렌더 중심
- 구 `harness/confirm-gates.md` 의 "게이트 1·2 = planner 가 수행" 규정을 "게이트 1·2 = 오케스트레이터가 수행" 으로 변경 (B1 반영)
- 구 `harness/convergence-loop.md` 의 `ask_user` 추상화를 α 재진입으로 구체화

### Requires (동반 변경)
- `intake` 스킬 ≥ 0.2.0 (awaiting_decision status + _pending_decisions payload 필드 추가)
- `bp:planner` agent: skills: [plan-harness, feature-spec, screen-spec] (구: [harness, intake, feature-spec, screen-spec])
- `bp:reviewer` agent: skills: [plan-harness, wireframe-harness, ...] 듀얼 로드
- `commands/plan.md` 재작성 (인터뷰 흐름을 command 레벨로 흡수)
