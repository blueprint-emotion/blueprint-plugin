# 수렴 루프 + α 재진입 프로토콜

`/bp:plan` 워크플로에서 명세 작성 직후 돌리는 Producer-Reviewer 루프. **오케스트레이터가 루프를 소유**하고 Task(bp:reviewer) 호출과 planner SendMessage 재진입을 전담한다.

## 설계 근거 — 왜 오케스트레이터가 루프를 소유하나

Anthropic 공식 제약: "Subagents cannot spawn other subagents." (https://code.claude.com/docs/en/sub-agents)

즉 planner subagent 는 Task tool 이 없어 `bp:reviewer` 를 spawn 할 수 없다. 수렴 루프의 Task 호출 주체는 반드시 오케스트레이터(parent).

subagent 간 통신은 SendMessage 로 가능 (Agent Teams `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` 활성). 따라서 패턴:

- **Task 는 오케스트레이터만** — planner(최초 1회), reviewer(라운드마다 새 spawn)
- **SendMessage 로 기존 planner 세션 재진입** — 위반 반영 / α 결정 반영

## 알고리즘 (오케스트레이터 실행)

```
# 오케스트레이터 세션에서 실행
round = 1
loop_max = 3

# 1. 최초 planner spawn (Task)
planner_result = Task(subagent_type = "bp:planner", prompt = <최초 템플릿>)
planner_id = planner_result.agentId    # SendMessage 재호출용

if planner_result.status == "α":
    handle_α_protocol(planner_id)      # α-4 → SendMessage 재진입
    return

files = planner_result.files            # 생성·수정된 파일 목록

while round ≤ loop_max:
    # 2. reviewer Task 호출 (매 라운드 새 spawn)
    reviewer_result = Task(
        subagent_type = "bp:reviewer",
        prompt = <검수 템플릿 + 변경 파일 + round>
    )
    violations = parse(reviewer_result)

    if not violations:
        break                           # 수렴 완료

    # 위반 수 비교 (자동 수정이 새 위반 유발했는지 감지)
    if round > 1 and len(violations) > prev_violations:
        halt_on_regression(planner_id, prev_round, round, violations)
        return

    # 3. planner 에게 SendMessage 로 위반 리포트 전달
    SendMessage(
        to = planner_id,
        message = <위반 반영 템플릿 + 리포트 전문 + 라운드>
    )
    # planner 는 "자동 수정 가능" 은 Edit, "자동 수정 불가" 는 α 프로토콜 처리 후 반송
    planner_fix_result = <SendMessage 응답 수신 (task-notification)>

    if planner_fix_result.status == "α":
        handle_α_protocol(planner_id)
        return

    files.update(planner_fix_result.files)
    prev_violations = len(violations)
    round += 1

if round > loop_max:
    hand_back_exceeded(planner_id, remaining_violations)
    return

# 4. 최종 보고 A (수렴 완료) — 오케스트레이터가 기획자 언어로 출력
report_success(files)
```

## 파라미터

| 항목 | 값 | 근거 |
|---|---|---|
| `loop_max` | **3** | 자동 수정 연쇄 차단. 4회 이상은 대개 설계 문제 |
| Task(bp:reviewer) 주체 | **오케스트레이터** | Anthropic 공식 제약 — subagent 재귀 spawn 불가 |
| planner 재진입 | **SendMessage** | 기존 세션 유지, Task 로 새로 spawn 하면 상태 초기화 |
| reviewer 재호출 | **매 라운드 새 Task** | context firewalling 극대화 — 매번 깨끗한 세션에서 검증 |
| 자동 수정 적용 | **planner 가 즉시 Edit, 기획자 컨펌 X** | reviewer 가 "자동 수정 가능" 분류한 것만 |
| 수동 결정 | **α 프로토콜로 planner turn 종료** | handoff 후 오케스트레이터가 응답 수집 |

## 수렴 판정

**위반 0건** = 수렴 완료. 경고(warning) 는 수렴 판정에 포함하지 않음. 경고는 최종 보고서 말미에 부기.

## 자동 수정 적용 방식

planner 가 직접 Edit tool 로 파일 수정 (SendMessage 로 받은 리포트 기반). reviewer 는 파일을 수정하지 않음 (불변 규칙 6).

Edit 시 주의:
- reviewer 리포트의 "권장" 구문 그대로 반영 (재창작 금지)
- 파일 전체 재작성 금지 — 위반 구간만 정밀 교체
- 다른 규약(feature-spec, screen-spec) 위반 유발 금지

## α 재진입 프로토콜

수동 결정 위반이 나오면 planner 는 turn 을 종료해야 한다. Task / SendMessage 응답 경계가 비동기 지점이라 subagent 안에서 기획자 응답을 기다릴 수 없음.

**책임 분리**:
- **planner**: payload 기록 (α-1) + 짧은 handoff note 만 반송 (α-2) + turn 종료 (α-3). 기획자-facing 자연어 질문은 만들지 않는다.
- **오케스트레이터**: payload 읽고 `α-pending-to-question.md` 규약으로 질문 번역 + 기획자 응답 수집 + `decision` 기록 + **SendMessage 로 planner 재호출** (α-4 ~ α-5)

### α-1. intake.md 상태 기록 (planner)

planner 가 intake.md 를 Edit:

```yaml
---
status: awaiting_decision   # 기존 값 (ready 등) 에서 변경
source: ...
target: .
---
```

본문에 `## _pending_decisions` 섹션 생성 (없으면 신설, 있으면 append). **이 섹션은 슬롯이 아니라 메타 섹션이다.** payload 스키마는 `intake` 스킬 0.3.0 — 6필드(`planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority`, 구조화된 `alternatives`) 필수.

```markdown
## _pending_decisions

<!-- planner 가 payload 를 기록하고 오케스트레이터가 질문으로 번역하기 위한 내부 통로입니다. 기획자가 직접 편집하지 않습니다. -->

### round 2 — 2026-04-21 15:42

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

출력 예시 (이 톤·길이 유지):

```
명세 대부분 작성 완료. 수동 결정 필요 항목 {N}건을 intake.md `## _pending_decisions` round {N} 에 기록했어요. 오케스트레이터가 이어서 기획자 질문으로 번역해 주세요.
```

**planner 가 기획자에게 말하는 톤의 문장(예: "~할까요?", "~입니다", 선택지 나열)을 포함하면 규약 위반** — 그 역할은 오케스트레이터가 한다.

### α-3. turn 종료 (planner)

planner 는 handoff note 출력 후 turn 을 종료. Task(최초) 또는 SendMessage(재진입) 의 응답으로 오케스트레이터에게 반환됨.

### α-4. 오케스트레이터의 응답 수집

오케스트레이터가 α 시그널을 받으면:

1. intake.md 의 `## _pending_decisions` → 해당 round 의 payload 전부 Read
2. [`α-pending-to-question.md`](α-pending-to-question.md) 규약으로 기획자 언어 질문 생성 (한 턴 blocking 2건 제한, `priority` / `planner_context` / `user_facing_why` / `source_slots` / `conversation_hint` 활용, 금지어 차단)
3. 기획자 응답을 받아 각 payload 항목의 `decision:` 필드 Edit
4. 기획자가 "나중에" 류로 답하면 → 해당 항목 `decision: _deferred_`, `status: awaiting_decision` 유지, `α-pending-to-question.md` 의 "나중에 응답 처리" 문구로 안내 + 종료. planner 재호출 X
5. 결정을 모두 받았으면 **SendMessage 로 planner 재호출** (task-tool-invocation.md §"Message 템플릿 — α 결정 수신 후"):

   ```
   SendMessage(
     to = planner_id,
     message = <α 결정 반영 템플릿: _pending_decisions round N 의 decision 을 해당 파일에 반영 지시>
   )
   ```

### α-5. planner 재진입 (SendMessage 수신 후)

planner (기존 세션) 가 SendMessage 를 받으면:

1. intake.md Read — `## _pending_decisions` 최신 round 의 `decision` 값 확인
2. 각 결정을 해당 파일에 Edit 으로 반영 (이제 "자동 수정 가능" 격상)
3. intake.md `status` 를 `ready` 로 되돌리고 해당 round 항목들을 `resolved: true` 로 마크 (섹션 보존 — 이력)
4. "반영 완료" 반송 — 오케스트레이터가 다음 reviewer 라운드 진행

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

오케스트레이터가 planner 에게 SendMessage 로 `status: needs_attention` + `## _pending_decisions` 현재 상태 기록 지시 (또는 오케스트레이터가 직접 Edit 해도 됨 — 단순 status 변경이므로).

## 위반이 늘어나는 경우

라운드 N+1 위반 건수 > 라운드 N 이면 **자동 수정이 새 위반을 유발한 것**. 즉시 루프 중단 + 보고:

```
수정하다가 다른 부분이 꼬였어요. 이쯤에서 멈추고 같이 보는 게 좋겠어요.
(라운드 {N}: {X}건 → {N+1}: {Y}건)
```

`status: needs_attention` 으로 기록.

## Context firewalling

Task 로 spawn 된 planner·reviewer 는 각자 고유 세션에서 실행. reviewer 의 내부 탐색·파일 읽기는 오케스트레이터 context 로 누적되지 않음 — Task 결과 요약만 반환. 이게 harness 패턴의 핵심 효율.

**단, 오케스트레이터는 위반 리포트·파일 목록·라운드 간 상태를 자신의 context 로 유지**해야 한다 (이전 설계에서 planner 가 유지하던 역할). SendMessage 로 reviewer 리포트를 planner 에게 전달할 때는 리포트 전문을 그대로 인라인. 요약·재포맷 금지 (Edit 정확도 훼손).

## 라운드 간 상태 추적 (오케스트레이터)

오케스트레이터가 라운드 간 유지:
- 수정한 파일 누적 목록 (planner 가 SendMessage 응답으로 보고)
- 각 라운드 위반 카운트 추이
- 기획자 결정 (intake.md `## _pending_decisions` 에 영구 기록)
- planner agentId (SendMessage 재진입용)

## 자동 수정 분류 기준

각 위반의 "자동 수정 가능/불가" 분류는 [auto-fix-policy.md](auto-fix-policy.md) 참조. 오케스트레이터는 reviewer 리포트의 분류를 그대로 신뢰 (재분류 X) 하고 SendMessage 로 planner 에 전달.

## Task / SendMessage 호출 상세

절차·prompt 템플릿·message 템플릿은 [task-tool-invocation.md](task-tool-invocation.md).
