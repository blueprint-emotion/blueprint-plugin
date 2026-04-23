# 수렴 루프 + α 프로토콜 (plan)

`/bp:plan` 워크플로에서 명세 작성 직후 돌리는 Producer-Reviewer 루프. **오케스트레이터가 루프를 소유**하고 Agent 호출을 전담한다.

## 설계 근거 — 왜 오케스트레이터 주도인가

Anthropic 공식 제약 (https://code.claude.com/docs/en/sub-agents):
> "Subagents cannot spawn other subagents."

planner subagent 는 `Agent(bp:reviewer)` 를 spawn 할 수 없다. 따라서 수렴 루프의 모든 Agent 호출은 오케스트레이터(parent)가 수행한다.

> 참고: `Task` tool 은 v2.1.63 에서 `Agent` 로 리네임됐고 `Task(...)` 는 하위호환 alias 다. 본 문서는 공식 이름 `Agent` 로 표기. 기존 코드에 `Task` 가 남아 있어도 동작에 문제 없음.

## 체이닝 모델 (핵심)

- **매 라운드 planner 를 새 `Agent(bp:planner)` 로 spawn.** 세션 연속성을 쓰지 않는다.
- 모든 상태 (intake.md, `## _pending_decisions`, 생성된 명세 파일) 는 **파일에 저장**되어 있어 새 spawn 도 이어서 작업 가능.
- 오케스트레이터는 prompt 에 `round: N` 과 직전 맥락을 명시해 넘겨주면 됨.

SendMessage 기반 세션 재진입 (Agent Teams) 은 experimental 이라 사용하지 않는다.

## 알고리즘 (오케스트레이터 실행)

```
# 오케스트레이터 세션에서 실행
round = 1
loop_max = 3
prev_violations = None

# 1. 최초 planner spawn
planner_result = Agent(subagent_type = "bp:planner", prompt = <최초 템플릿, round=1>)

if planner_result.status == "α":
    handle_α_protocol(round=1)           # α-4 → 다음 라운드 planner 호출로 이어짐
    # α 수집 후 아래 while 루프를 라운드 2 부터 진입
    round = 2

files = planner_result.files              # 생성·수정된 파일 목록

while round ≤ loop_max:
    # 2. reviewer 호출 (매 라운드 새 spawn — 체이닝과 동일)
    reviewer_result = Agent(
        subagent_type = "bp:reviewer",
        prompt = <검수 템플릿 + 변경 파일 + round>
    )
    violations = parse(reviewer_result)

    if not violations:
        break                             # 수렴 완료

    # 위반 수 비교 (자동 수정이 새 위반 유발했는지 감지)
    if prev_violations is not None and len(violations) > prev_violations:
        halt_on_regression(prev_round, round, violations)
        return

    # 3. planner 재호출 (새 spawn) — 위반 반영 요청
    planner_fix = Agent(
        subagent_type = "bp:planner",
        prompt = <위반 반영 템플릿 + 리포트 전문 + round>
    )

    if planner_fix.status == "α":
        # α + 위반 공존 시 ORDERING 규칙:
        # α 결정 반영이 선행. reviewer 는 다음 라운드에서 다시 돈다.
        handle_α_protocol(round)
        # 기획자 결정 반영이 끝나면 다음 라운드의 첫 단계(reviewer 재호출) 로 진입
        round += 1
        continue

    files.update(planner_fix.files)
    prev_violations = len(violations)
    round += 1

if round > loop_max:
    hand_back_exceeded(remaining_violations)
    return

# 4. 최종 보고 A (수렴 완료) — 오케스트레이터가 기획자 언어로 출력
report_success(files)
```

### α 결정 반영 서브루틴

```
handle_α_protocol(round):
    # intake.md `## _pending_decisions` round N 의 payload 를 읽어 기획자 언어로 질문
    payloads = read_pending_decisions(intake_path, round)
    questions = translate(payloads)        # α-pending-to-question.md 규약
    answers = ask_planner(questions)       # 한 턴 blocking 2건 제한

    if any(answer == "나중에"):
        mark_deferred(intake_path, round)
        notify_user_with_deferred_template()
        return                             # 루프 종료 (planner 재호출 X)

    write_decisions(intake_path, round, answers)   # `decision:` 필드 Edit

    # 다음 라운드에서 새 Agent(bp:planner) 호출로 decision 반영
    planner_apply = Agent(
        subagent_type = "bp:planner",
        prompt = <α 결정 반영 템플릿 + round>
    )
    files.update(planner_apply.files)
```

## 파라미터

| 항목 | 값 | 근거 |
|---|---|---|
| `loop_max` | **3** | 자동 수정 연쇄 차단. 4회 이상은 대개 설계 문제 |
| Agent 호출 주체 | **오케스트레이터** | 공식 제약 — subagent 재귀 spawn 불가 |
| producer 재진입 | **새 Agent spawn** | 상태는 intake.md + 명세 파일. 세션 연속성 불필요 |
| reviewer 재호출 | **매 라운드 새 Agent** | context firewalling — 매번 깨끗한 세션에서 검증 |
| round 전달 | **prompt 에 `round: N` 명시 필수** | 새 spawn 은 세션 기억 없음. payload 섹션 번호 결정 근거 |
| 자동 수정 적용 | **planner 가 즉시 Edit, 기획자 컨펌 X** | reviewer 가 "자동 수정 가능" 분류한 것만 |
| 수동 결정 | **α 프로토콜로 planner turn 종료** | handoff 후 오케스트레이터가 응답 수집 |

## ⚠️ α + 위반 공존 ORDERING 규칙

한 라운드에 α 발생 + 자동 수정 가능 위반이 동시에 있는 경우:

1. **α 결정 반영이 먼저** (다음 라운드의 planner spawn)
2. **reviewer 를 한 번 더 돌려** 최신 상태에서 위반 목록을 새로 뽑는다
3. 그 뒤에 자동 수정 반영

이유:
- α 결정으로 파일 구조가 바뀌면 이전 reviewer 리포트의 라인 번호·파일 경로가 stale 됨
- regression 감지 (`len(violations) > prev_violations`) 가 신뢰 가능하려면 같은 기준선에서 비교해야 함

agent 본문 (planner.md) 의 단일 진입점 분기에도 박아둔다.

## 수렴 판정

**위반 0건** = 수렴 완료. 경고(warning) 는 수렴 판정에 포함하지 않음. 경고는 최종 보고서 말미에 부기.

## 자동 수정 적용 방식

planner 가 직접 Edit tool 로 파일 수정 (Agent prompt 로 받은 리포트 기반). reviewer 는 파일 수정 금지 (불변 규칙 6).

Edit 시 주의:
- reviewer 리포트의 "권장" 구문 그대로 반영 (재창작 금지)
- 파일 전체 재작성 금지 — 위반 구간만 정밀 교체
- 다른 규약(feature-spec, screen-spec) 위반 유발 금지

## α 프로토콜 (수동 결정)

수동 결정 위반이 나오면 planner 는 turn 을 종료해야 한다. Agent 응답 경계가 비동기 지점이라 subagent 안에서 기획자 응답을 기다릴 수 없다.

**책임 분리**:
- **planner**: payload 기록 (α-1) + 짧은 handoff note 만 반송 (α-2) + turn 종료 (α-3). 기획자-facing 자연어 질문은 만들지 않는다.
- **오케스트레이터**: payload 읽고 `α-pending-to-question.md` 규약으로 질문 번역 + 기획자 응답 수집 + `decision` 기록 + **다음 라운드의 새 Agent(bp:planner) 호출로 결정 반영 지시** (α-4)

### α-1. intake.md 상태 기록 (planner)

planner 가 intake.md 를 Edit:

```yaml
---
status: awaiting_decision   # 기존 값 (ready 등) 에서 변경
source: ...
target: .
---
```

본문에 `## _pending_decisions` 섹션 생성 (없으면 신설, 있으면 append). **이 섹션은 슬롯이 아니라 메타 섹션이다.** payload 스키마는 `intake` 스킬 — 6필드(`planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority`, 구조화된 `alternatives`) 필수.

```markdown
## _pending_decisions

<!-- planner 가 payload 를 기록하고 오케스트레이터가 질문으로 번역하기 위한 내부 통로입니다. 기획자가 직접 편집하지 않습니다. -->

### round 2 — 2026-04-22 15:42

- id: v1
  category: [SSOT]
  location: area_option.md:45
  summary: 옵션 조합 규칙의 귀속 위치 판단 필요
  planner_context: area_option 인수조건 정리 중 이 규칙이 화면 고유인지 PRODUCT 공통 rule 인지 확정되지 않아 명세 진행 중단
  user_facing_why: 같은 규칙을 두 군데 쓰지 않고 명세를 마무리하려면 위치를 정해야 함
  source_slots:
    - 유저스토리
    - 동작·인터랙션
  conversation_hint: 기획자가 앞서 "같은 옵션은 합쳐진다" 라고 언급함
  priority: blocking
  recommendation: PRODUCT.md#OPTION 링크로 대체 (리뷰어 권장)
  alternatives:
    - label: 영역 고유 인수조건으로 유지
      trade_off: 이 화면 맥락은 선명하지만 다른 화면에서 같은 규칙 재작성 필요
      recommended: false
    - label: PRODUCT 도메인 rule 로 승격
      trade_off: 중복은 줄지만 상품 공통 규칙으로 봐도 되는지 확정 필요
      recommended: true
  decision: _pending_
```

### α-2. planner 반송 — handoff note 만

planner 의 반송 메시지는 기획자-facing 자연어 질문을 담지 않는다. payload 는 intake 에 이미 기록됐으므로 오케스트레이터에게 상태만 짧게 알림.

```
명세 대부분 작성 완료. 수동 결정 필요 항목 {N}건을 intake.md `## _pending_decisions` round {N} 에 기록했어요. 오케스트레이터가 이어서 기획자 질문으로 번역해 주세요.
```

**planner 가 기획자에게 말하는 톤의 문장(예: "~할까요?", "~입니다", 선택지 나열)을 포함하면 규약 위반** — 그 역할은 오케스트레이터가 한다.

### α-3. turn 종료 (planner)

planner 는 handoff note 출력 후 turn 종료. Agent 응답으로 오케스트레이터에게 반환.

### α-4. 오케스트레이터의 응답 수집 + 재spawn

오케스트레이터가 α 시그널을 받으면:

1. intake.md 의 `## _pending_decisions` → 해당 round 의 payload 전부 Read
2. [`α-pending-to-question.md`](α-pending-to-question.md) 규약으로 기획자 언어 질문 생성 (한 턴 blocking 2건 제한, `priority` / `planner_context` / `user_facing_why` / `source_slots` / `conversation_hint` 활용, 금지어 차단)
3. 기획자 응답을 받아 각 payload 항목의 `decision:` 필드 Edit
4. 기획자가 "나중에" 류로 답하면 → 해당 항목 `decision: _deferred_`, `status: awaiting_decision` 유지, `α-pending-to-question.md` 의 "나중에 응답 처리" 문구로 안내 + 종료. 다음 라운드 진행 X
5. 결정을 모두 받았으면 **다음 라운드 (round+1) 의 `Agent(bp:planner)` 를 새로 spawn** 하면서 "α 결정 반영" prompt 템플릿을 사용

> 이전 설계의 α-5 (SendMessage 로 기존 planner 세션 재호출) 는 없다. 새 Agent 가 intake.md 의 `decision` 필드 값을 읽어 해당 파일에 Edit 하는 것이 α-4 의 일부.

## 최종 보고 포맷 (오케스트레이터 출력)

루프 탈출 시 오케스트레이터가 기획자에게 전달할 메시지.

### A. 수렴 완료 (위반 0건)

```
다 됐어요.

만든·수정한 파일:
- docs/features/PRODUCT.md (리뷰 요약 항목 추가)
- docs/features/REVIEW.md (신설)
- docs/screens/상품/product-detail/screen.md
- docs/screens/상품/product-detail/area_image.md
  (+ area_info.md, area_option.md, sheet_review.md, dialog_zoom.md)

다음 단계: /bp:wireframe docs/screens/상품/product-detail/screen.md
```

경고가 있으면 말미에 한두 줄 부기 (치명 아닌 것):
> "참고: sheet_review.md 에 TBD 표시가 하나 있어요 — 디자인 확정되면 채워주세요."

### B. α 대기 (수동 결정 필요)

α-4 에서 오케스트레이터가 기획자에게 질문을 출력하는 것 자체가 "보고 B". planner 의 handoff note 는 오케스트레이터 컨텍스트에만 들어오고 기획자에게는 노출되지 않는다.

### C. 루프 한계 초과

```
세 번 시도했는데 몇 가지가 계속 걸려요. 같이 보실래요?

걸린 항목:
- {자연어 번역된 위반 1}
- {자연어 번역된 위반 2}

(intake.md 에 남겨뒀어요. /bp:plan 다시 불러주시면 이어갈 수 있어요.)
```

오케스트레이터가 `status: needs_attention` 으로 intake.md 를 직접 Edit 하거나, 다음 라운드 Agent 호출에 "status 변경 후 종료" 를 지시.

## 위반이 늘어나는 경우

라운드 N+1 위반 건수 > 라운드 N 이면 **자동 수정이 새 위반을 유발한 것**. 즉시 루프 중단 + 보고:

```
수정하다가 다른 부분이 꼬였어요. 이쯤에서 멈추고 같이 보는 게 좋겠어요.
(라운드 {N}: {X}건 → {N+1}: {Y}건)
```

`status: needs_attention` 으로 기록.

## Context firewalling

Agent 로 spawn 된 planner·reviewer 는 각자 고유 세션에서 실행. reviewer 의 내부 탐색·파일 읽기는 오케스트레이터 context 로 누적되지 않음 — Agent 결과 요약만 반환. 이게 harness 패턴의 핵심 효율.

**오케스트레이터는 위반 리포트·파일 목록·라운드 간 상태를 자신의 context 로 유지**해야 한다. 재spawn 되는 planner 에게 리포트를 전달할 때는 **리포트 전문 그대로 인라인**. 요약·재포맷 금지 (Edit 정확도 훼손).

## 라운드 간 상태 추적 (오케스트레이터)

체이닝 모델에서 오케스트레이터가 라운드 간 유지:
- 현재 `round` 번호 (Agent prompt 에 매번 포함)
- 수정한 파일 누적 목록 (planner 가 반송으로 보고)
- 각 라운드 위반 카운트 (regression 감지)
- 기획자 결정 (intake.md `## _pending_decisions` 에 영구 기록 — context 소실 방지)

planner agentId 추적은 **필요 없다** (세션 재진입 안 함).

---

## Agent 호출 절차

### 스키마 로드 (오케스트레이터 세션 1회)

Agent 는 오케스트레이터 컨텍스트에서 deferred. 최초 호출 직전 1회 로드:

```
ToolSearch(query = "select:Agent", max_results = 1)
```

세션당 1회면 충분. SendMessage 는 사용하지 않으므로 로드 불필요.

### 호출 기본 형

```
Agent(
  subagent_type = "bp:planner" | "bp:reviewer",
  description   = "…",                # 3~5 단어
  prompt        = "<아래 템플릿>"
)
```

`subagent_type` 은 반드시 `bp:` 접두사 포함.

## Prompt 템플릿 — 최초 planner 호출 (round=1)

통합 확인 게이트 통과 직후:

```
호출자 컨텍스트: 이 호출은 /bp:plan 슬래시 커맨드 워크플로의
명세 작성 단계에서 오케스트레이터가 Agent tool 로 정식 위임한 것입니다.

round: 1
mode: 최초 명세 작성

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
- reviewer 를 직접 호출하지 말 것 (subagent 에 Agent 도구 없음)
- 기획자 facing 메시지는 plan-harness/references/planner-ux.md 언어 원칙 준수

반환 포맷:
- 생성·수정한 파일 절대 경로 목록
- 슬롯 공백 발견 시 α 프로토콜로 intake.md `## _pending_decisions` payload 기록 + 짧은 handoff note
```

## Prompt 템플릿 — reviewer 호출 (매 라운드)

```
호출자 컨텍스트: 이 호출은 /bp:plan 슬래시 커맨드 워크플로의
명세 검토 단계에서 오케스트레이터가 Agent tool 로 정식 위임한 것입니다.
(공식 제약상 subagent 는 Agent 를 호출할 수 없어, Producer-Reviewer
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

## Prompt 템플릿 — planner 재호출 (위반 반영)

reviewer 의 위반 리포트를 받은 뒤 planner 를 **새 Agent 로 spawn**:

```
호출자 컨텍스트: 이 호출은 /bp:plan 수렴 루프의
위반 반영 라운드입니다. 오케스트레이터가 Agent tool 로 위임.

round: {N}
mode: 위반 반영

intake.md 경로: {절대 경로}
대상 폴더: {화면 폴더 절대 경로}

reviewer 리포트 (직전 라운드 결과):
위반 건수: {X}건 (자동 수정 가능 {Y}, 자동 수정 불가 {Z})

<리포트 전문 그대로 전달>

지시:
1. intake.md 와 이미 작성된 명세 파일들을 Read 해서 현재 상태 파악
2. "자동 수정 가능" 위반들을 Edit 으로 반영 (재창작 금지 — 리포트의 "권장" 구문 그대로)
3. "자동 수정 불가" 항목은 α 프로토콜
   (intake.md `## _pending_decisions` 에 payload 6필드 기록, status: awaiting_decision,
    짧은 handoff note 만 반송 — 기획자-facing 질문 금지)
4. 반영 또는 α 기록 완료 후 수정한 파일 목록 + "재검수 대기" 또는 "α" 신호 반송
```

## Prompt 템플릿 — planner 재호출 (α 결정 반영)

`α-pending-to-question.md` 규약대로 기획자 결정을 수집하고 intake.md 에 `decision` 필드까지 Edit 한 뒤:

```
호출자 컨텍스트: 이 호출은 /bp:plan 수렴 루프의
α 결정 반영 라운드입니다. 오케스트레이터가 Agent tool 로 위임.

round: {N}
mode: α 결정 반영

intake.md 경로: {절대 경로}

작업:
1. intake.md Read — `## _pending_decisions` 최신 round 에서 `decision` 값 확인
   (`_pending_` / `_deferred_` 항목은 건너뜀)
2. 각 결정을 해당 파일에 Edit 으로 반영
3. intake.md `status` 를 `ready` 로 되돌리고 해당 round 항목들을 `resolved: true` 로 마크 (섹션은 보존 — 이력)
4. 수정한 파일 목록 + "재검수 대기" 신호 반송 — 오케스트레이터가 다음 라운드 reviewer 호출
```

## 흔한 오류

### A. subagent 가 Agent 호출 시도

```
# planner subagent 안에서
Agent(subagent_type = "bp:reviewer", ...)   # ❌ 공식 제약, 스키마 로드조차 불가
```

subagent 컨텍스트에는 Agent 가 존재하지 않음 — `ToolSearch(query: "select:Agent")` 해도 `<functions>` 블록에 Agent 스키마가 실리지 않는다.

대응: 작업 중단 + 오케스트레이터에게 "명세 작성 완료, reviewer 호출 필요" 또는 "반영 완료" 신호 반송. **advisor() · 인라인 self-review · 다른 subagent 호출 시도 등으로 대체 금지** (plan-harness 불변 규칙 1).

### B. namespace 누락

```
Agent(subagent_type = "reviewer", ...)    # ❌
Agent(subagent_type = "bp:reviewer", ...) # ✅
```

### C. self-check 로 대체

"reviewer 를 못 부르겠다 → 내가 대신 검증" 금지. 구체적으로:

- `advisor()` 호출을 reviewer 대체로 사용
- 인라인 "내가 규약 리뷰했음" 식 자가 진술
- general-purpose / Explore / Plan 같은 다른 subagent 를 reviewer 대체로 spawn
- 리뷰 없이 "수렴 완료" 선언

subagent 가 Agent 미제공 상황을 만나면 **오케스트레이터에게 반송하고 종료**가 유일한 정답.

### D. ToolSearch 건너뛰기

오케스트레이터에서 Agent 스키마 없이 바로 호출하면 `InputValidationError`. 세션당 1회 `ToolSearch(query: "select:Agent")` 선행.

### E. round 누락

Agent prompt 에 `round: N` 을 안 넣으면 planner 가 `## _pending_decisions` 섹션 번호를 결정 못 한다. 최초 호출은 `round: 1`, 위반 반영·α 반영은 오케스트레이터가 관리하는 현재 라운드 값을 기입.

### F. α 결정 반영을 SendMessage 로 시도

이전 설계 (plan-harness ≤ 3.0.0) 에서는 α-5 에서 SendMessage 로 기존 planner 세션을 깨웠다. 4.0.0 부터는 **새 Agent(bp:planner) spawn + "α 결정 반영" 템플릿** 이 정답. SendMessage 사용 금지.

## 역방향 호출 금지

- reviewer 가 planner·오케스트레이터 호출 금지 — reviewer 는 보고 전담
- planner 가 wireframer 호출 금지 — /bp:plan 은 와이어프레임을 만들지 않음
- subagent 간 Agent spawn 금지 (공식 제약)

## 자동 수정 분류 기준

각 위반의 "자동 수정 가능/불가" 분류는 [auto-fix-policy.md](auto-fix-policy.md) 참조. 오케스트레이터는 reviewer 리포트의 분류를 그대로 신뢰 (재분류 X) 하고 planner 에게 전달.

## 편집 모드 호출 (/bp:edit 진입점)

`/bp:edit` 가 Route A (명세만) 또는 Route C (둘 다 의 명세부) 를 실행할 때 이 수렴 루프를 그대로 재사용한다. **새 워크플로가 아니라 입력만 다른 재진입**이다.

### 입력 차이

| 항목 | 일반 `/bp:plan` | 편집 모드 |
|---|---|---|
| 진입 트리거 | 요구사항 md 또는 자연어 | 플랫폼 편집 요청 markdown (파일 경로 + 앵커 + 사용자 지시) |
| intake 상태 | 신규 생성 (or 기존 재검토) | 기존 intake.md 가 있으면 **부분 수정**, 없으면 수정 대상 화면·기능 국한 **제한 범위 intake** 생성 |
| planner 컨텍스트 | 요구사항 + 화면 후보 | 기존 명세 (screen.md, area_*.md, sheet_*.md, dialog_*.md, 관련 features/*.md) + 사용자 지시 + 앵커 |
| 출력 제약 | HTML 은 만들지 않음 (일반) | 동일 — HTML 은 절대 손대지 않음 (Route C 는 수렴 완료 후 wireframe-harness "기존 HTML 수정 모드" 로 체인) |

### 알고리즘 차이

알고리즘 본체 ([위 "알고리즘" 섹션](#알고리즘-오케스트레이터-실행)) 를 그대로 쓰되, **최초 planner spawn 에 "편집 모드" 컨텍스트를 prompt 에 명시**한다:

```
mode: 편집 모드 (부분 수정)
target_files:
  - docs/screens/.../screen.md  (또는 area_*, sheet_*, dialog_*)
  - docs/features/{DOMAIN}.md
anchor: data-feature="{DOMAIN}__{ID}" data-feature-key="{slot}"  (있을 때만)
user_instruction: {기획자가 적은 자연어}

규칙:
- 기존 명세의 다른 섹션은 건드리지 않는다. anchor 로 지정된 영역만 수정.
- intake.md 가 있으면 새 슬롯을 추가하지 말고 기존 슬롯에 반영한다.
- 규칙 변경이면 해당 featureId 의 rules 만, 요소 수정이면 area_*.md 의 elements·인수조건만.
```

체이닝·reviewer 검증·α 프로토콜·루프 한계(3회)는 [일반 루프](#알고리즘-오케스트레이터-실행) 와 동일.

### 수렴 완료 후

- Route A: 명세 수렴 → 오케스트레이터가 기획자 언어로 diff 요약 → 종료
- Route C: 명세 수렴 → **오케스트레이터가 wireframe-harness "기존 HTML 수정 모드" 로 체이닝** (convergence-loop.md[wireframe-harness] 의 "기존 HTML 수정 모드" 섹션 참조)

### 관련 회송

수정 대상이 실은 명세 결함이 아니라 HTML 디테일(색·여백·카피) 뿐으로 판정되면 오케스트레이터가 **Route B 로 격하**해 wireframe-harness 로 넘긴다. 이 판정은 `/bp:edit` 의 "변경 유형 판단" 단계에서 먼저 걸러지지만, 편집 중 planner 가 "명세 변경 불필요" 를 반환하면 오케스트레이터가 즉시 회송.
