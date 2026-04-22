# Task / SendMessage 호출 방법 (plan 맥락)

`/bp:plan` 워크플로에서 에이전트 간 통신은 **오케스트레이터가 전담**한다. Anthropic 공식 제약에 의해 **subagent 는 Task tool 을 가질 수 없으며 (재귀 spawn 불가)**, 따라서 Producer-Reviewer 수렴 루프도 오케스트레이터가 주도한다. 이미 spawn 된 subagent 에게 다시 맥락을 넘길 때는 Task 가 아닌 **SendMessage** 로 재진입한다.

## 공식 제약 (설계 전제)

https://code.claude.com/docs/en/sub-agents :
> "Subagents cannot spawn other subagents, so `Agent(agent_type)` has no effect in subagent definitions."

즉 planner subagent 안에서 `Task(subagent_type: "bp:reviewer")` 를 시도하면 스키마 자체가 컨텍스트에 로드되지 않아 호출이 성립하지 않는다 (`ToolSearch(query: "select:Task")` 응답의 `<functions>` 블록이 비어 있음).

SendMessage 는 Agent Teams 활성(`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) 시 사용 가능. **이미 spawn 되어 return 한 subagent** 에게 메시지를 보내 resume 시킬 수 있다. 새 subagent 를 spawn 할 수는 없음.

## 호출 지점 매트릭스

`/bp:plan` 의 통신 포인트:

| # | 호출자 | 도구 | 대상 | 목적 |
|---|---|---|---|---|
| 1 | 오케스트레이터 | Task | bp:planner | 최초 명세 작성 위임 |
| 2 | 오케스트레이터 | Task | bp:reviewer | 산출물 검수 (매 라운드) |
| 3 | 오케스트레이터 | SendMessage | bp:planner (기존 세션) | 위반 리포트 전달 → 자동 수정 요청 |
| 4 | 오케스트레이터 | SendMessage | bp:planner (기존 세션) | α 재진입 — 기획자 결정 전달 |

**subagent 끼리 Task 로 직접 호출하지 않는다.** planner 가 reviewer 를 부르지 않고, reviewer 도 planner 를 부르지 않는다. 오케스트레이터가 허브 역할.

## 절차

### A. Task tool 스키마 로드 (오케스트레이터 세션 1회)

Task 는 오케스트레이터 컨텍스트에서 deferred 상태. 최초 호출 직전 1회 로드:

```
ToolSearch(query = "select:Task", max_results = 1)
```

응답 `<functions>` 블록에 Task 스키마 실리면 이후 Task 호출 가능. 세션당 1회면 충분.

### B. SendMessage tool 스키마 로드 (오케스트레이터 세션 1회)

SendMessage 도 deferred. 최초 사용 전 1회:

```
ToolSearch(query = "select:SendMessage", max_results = 1)
```

### C. Task 호출 기본 형

```
Task(
  subagent_type = "bp:planner" | "bp:reviewer",
  description   = "…",                # 3~5 단어
  prompt        = "<아래 템플릿>"
)
```

`subagent_type` 은 반드시 `bp:` 접두사 포함.

### D. SendMessage 호출 기본 형

```
SendMessage(
  to       = "<agentId>",
  summary  = "…",                     # 5~10 단어 프리뷰
  message  = "<아래 템플릿>"
)
```

대상은 이미 Task 로 spawn 되어 return 한 subagent. Task 응답 말미에 `agentId: xxxxx (use SendMessage with to: 'xxxxx' to continue this agent)` 가 포함됨 — 그 id 를 기록해뒀다가 재호출에 사용한다.

## Prompt 템플릿 — 오케스트레이터 → planner (Task, 최초 위임)

통합 확인 게이트 통과 직후:

```
호출자 컨텍스트: 이 호출은 /bp:plan 슬래시 커맨드 워크플로의
명세 작성 단계에서 오케스트레이터가 Task tool 로 정식 위임한 것입니다.

입력:
- intake.md 경로: {절대 경로}
- 화면 폴더: {절대 경로}
- 원본 요구사항: {경로 또는 "자연어 인자"}
- 작업 트리: {확정된 산출물 목록}

작업:
1. intake.md 전체 Read (status 가 ready 인지 확인)
2. feature-spec / screen-spec 스킬 따라 명세 작성
3. 생성·수정한 파일 목록을 반송하고 turn 종료 — reviewer 호출은 오케스트레이터가 담당

주의:
- 와이어프레임(*.html) 생성 금지 — /bp:wireframe 이 별도 처리
- intake.md 슬롯에 없는 정보 지어내지 말 것
- reviewer 를 직접 호출하지 말 것 (subagent 에 Task 도구 없음 — Anthropic 공식 제약)
- 수렴 루프는 오케스트레이터의 후속 Task(bp:reviewer) 호출 + SendMessage 재진입으로 진행
- 기획자 facing 메시지는 plan-harness/references/planner-ux.md 언어 원칙 준수

반환 포맷:
- 생성·수정한 파일 절대 경로 목록
- 슬롯 공백 발견 시 α 프로토콜로 intake.md `## _pending_decisions` payload 기록 + 짧은 handoff note
```

## Prompt 템플릿 — 오케스트레이터 → reviewer (Task, 매 라운드)

```
호출자 컨텍스트: 이 호출은 /bp:plan 슬래시 커맨드 워크플로의
명세 검토 단계에서 오케스트레이터가 Task tool 로 정식 위임한 것입니다.
(Anthropic 공식 제약상 subagent 는 Task 를 가질 수 없어, Producer-Reviewer
수렴 루프는 오케스트레이터가 주도합니다.)

검토 대상 폴더: {화면 폴더 절대 경로}
검토 범위: feature spec + screen spec (와이어프레임 제외)
변경된 파일 (집중 검토):
- {feature md 1}
- {feature md 2}
- {screen.md, area_*.md, sheet_*.md, dialog_*.md ...}
추가 검토 대상 (연관):
- {다른 폴더에 걸친 부수 수정이 있으면 나열}

round: {현재 라운드 번호}

출력 형식: 위반 사항 리포트 + 각 위반에 "자동 수정 가능" / "자동 수정 불가" 분류 (auto-fix-policy.md 기준). 위반 0건이면 "위반 0건, 수렴" 명시.
```

호출자 컨텍스트 한 줄은 **필수**. reviewer 의 호출 게이트를 통과시킨다. reviewer.md 게이트는 "parent 에이전트가 /bp:plan 또는 /bp:wireframe 워크플로에서 호출한 경우 허용" 이므로 오케스트레이터 직접 호출도 정상 통과.

## Message 템플릿 — 오케스트레이터 → planner (SendMessage, 위반 반영 요청)

reviewer 의 위반 리포트를 받은 뒤 planner 를 재진입시킨다:

```
reviewer 리포트가 도착했어요. 수정해 주세요.

round: {N}
위반 건수: {X}건 (자동 수정 가능 {Y}, 자동 수정 불가 {Z})

위반 리포트 원문:
<리포트 전문 그대로 전달>

지시:
1. "자동 수정 가능" 위반들을 Edit 으로 반영 (재창작 금지 — 리포트의 "권장" 구문 그대로)
2. "자동 수정 불가" 항목은 α 프로토콜
   (intake.md `## _pending_decisions` 에 payload 6필드 기록, status: awaiting_decision,
    짧은 handoff note 만 반송 — 기획자-facing 질문 금지)
3. 반영 또는 α 기록 완료 후 "반영 완료" 신호 + 수정한 파일 목록 반송
4. 오케스트레이터가 reviewer 재호출 또는 α 응답 수집을 이어서 진행
```

## Message 템플릿 — 오케스트레이터 → planner (SendMessage, α 결정 수신 후)

`α-pending-to-question.md` 규약대로 기획자 결정을 수집한 뒤:

```
기획자 결정 도착. intake.md `## _pending_decisions` round {N} 에 `decision` 필드 기록해뒀어요. 반영해 주세요.

작업:
1. intake.md `## _pending_decisions` 최신 round 에서 `decision` 값 읽기 (`_pending_` / `_deferred_` 제외)
2. 각 결정을 해당 파일에 Edit 으로 반영
3. intake.md `status` 를 `ready` 로 되돌리고 해당 round 항목들을 `resolved: true` 로 마크 (섹션은 보존 — 이력)
4. "반영 완료" 신호 + 수정한 파일 목록 반송 — 오케스트레이터가 reviewer 재호출로 수렴 루프 재개
```

## 흔한 오류

### A. subagent 가 Task 호출 시도

```
# planner/wireframer subagent 안에서
Task(subagent_type = "bp:reviewer", ...)   # ❌ 플랫폼 제약, 스키마 로드조차 불가
```

Anthropic 공식 제약. subagent 컨텍스트에는 Task 가 존재하지 않음 — `ToolSearch(query: "select:Task")` 해도 `<functions>` 블록에 Task 스키마가 실리지 않는다.

subagent 가 이 상황을 맞닥뜨렸을 때 대응: 작업 중단 + 오케스트레이터에게 "명세 작성 완료, reviewer 호출 필요" 또는 "반영 완료" 신호 반송. **advisor() · 인라인 self-review · 다른 subagent 호출 시도 등으로 대체 금지** (plan-harness 불변 규칙 1).

### B. Skill 도구로 agent 호출 시도

```
Skill(skill = "bp:reviewer", ...)   # ❌ Unknown skill
```

reviewer 는 **agent** 이지 skill 이 아니다. Task tool (오케스트레이터 세션) 이 정답.

### C. namespace 누락

```
Task(subagent_type = "reviewer", ...)    # ❌
Task(subagent_type = "bp:reviewer", ...) # ✅
```

### D. self-check 로 대체

"reviewer 를 못 부르겠다 → 내가 대신 검증" 금지. 구체적으로 금지되는 것:

- `advisor()` 호출을 reviewer 대체로 사용
- 인라인 "내가 규약 리뷰했음" 식 자가 진술
- general-purpose / Explore / Plan 같은 다른 subagent 를 reviewer 대체로 spawn
- 리뷰 없이 "수렴 완료" 선언

subagent 가 Task 미제공 상황을 만나면 **오케스트레이터에게 반송하고 종료**가 유일한 정답.

### E. ToolSearch 건너뛰기

오케스트레이터에서 Task / SendMessage 스키마 없이 바로 호출하면 `InputValidationError`. 도구별 `ToolSearch(query: "select:TOOL")` 를 세션당 1회 선행. (세션을 새로 시작했으면 다시 로드 필요.)

### F. Task 스키마 끝내 로드 실패

- **subagent 컨텍스트에서 실패**: 정상. subagent 는 Task 를 갖지 않음 → 작업 종료 + 오케스트레이터로 반송.
- **오케스트레이터 컨텍스트에서 실패**: 환경 이상. 사용자에게 보고 후 종료:
  ```
  검증 도구를 로드하지 못해 진행할 수 없어요.
  만든 파일은 그대로 있어요: {경로}
  Claude Code 재시작하고 /bp:plan 다시 불러주시면 이어갈 수 있어요.
  ```

## 역방향 호출 금지

- reviewer 가 planner·오케스트레이터 호출 금지 — reviewer 는 보고 전담
- planner 가 wireframer 호출 금지 — /bp:plan 은 와이어프레임을 만들지 않음
- subagent 간 Task spawn 금지 (공식 제약 + 하네스 규약)

## 결과 반송 (subagent → 오케스트레이터)

### planner 의 반송 종류

1. **최초 작성 완료** — 생성·수정 파일 목록 + "reviewer 호출 대기" 신호
2. **위반 반영 완료** — 수정한 파일 목록 + "재검수 대기" 신호
3. **α 프로토콜** — handoff note ("payload 를 intake.md `## _pending_decisions` round {N} 에 기록했어요. 오케스트레이터가 이어서 기획자 질문으로 번역해 주세요.")
4. **α 결정 반영 완료** — 수정 파일 목록 + "재검수 대기" 신호

### reviewer 의 반송

위반 리포트 (각 항목 "자동 수정 가능" / "자동 수정 불가" 분류) 또는 "위반 0건, 수렴" 메시지. 파일은 수정하지 않음 (불변 규칙 6).

## 세션 관리

- planner 는 한 `/bp:plan` 호출 동안 **동일 세션 유지** (최초 Task 로 spawn, 이후 SendMessage 로 재진입 반복)
- reviewer 는 라운드마다 **새 Task 로 spawn** (context firewalling 극대화 — 매번 깨끗한 세션에서 검증)
- 오케스트레이터는 planner agentId 를 라운드 간 보관

## 참고

- 수렴 루프 알고리즘과 α-1 ~ α-5 단계: [convergence-loop.md](convergence-loop.md)
- 기획자 결정 번역: [α-pending-to-question.md](α-pending-to-question.md)
- 자동 수정 분류 기준: [auto-fix-policy.md](auto-fix-policy.md)
