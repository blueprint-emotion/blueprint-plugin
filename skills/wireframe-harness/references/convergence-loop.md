# 수렴 루프 — wireframe

**오케스트레이터가 루프를 소유**한다. Task(bp:reviewer) 호출과 wireframer SendMessage 재진입을 전담. plan-harness 의 루프와 구조 동일 — [plan-harness/references/convergence-loop.md](../../plan-harness/references/convergence-loop.md) 참조. 본 문서는 wireframe 특화 차이만 명시.

wireframe 루프는 **자동 수정 가능 위반이 비중 높음** — 대부분 한 라운드에서 수렴한다. "자동 수정 불가" 가 나오면 대개 명세 결함이라 `/bp:plan` 회송(기획자 facing 메시지) 로 종료.

## 설계 근거

Anthropic 공식 제약: subagent 는 Task tool 을 갖지 않는다 (https://code.claude.com/docs/en/sub-agents). wireframer subagent 는 reviewer 를 직접 spawn 할 수 없으므로 수렴 루프는 오케스트레이터 주도.

## 알고리즘 (오케스트레이터 실행)

```
# 오케스트레이터 세션에서 실행
round = 1
loop_max = 3

# 1. 최초 wireframer spawn (Task)
wf_result = Task(subagent_type = "bp:wireframer", prompt = <최초 템플릿>)
wireframer_id = wf_result.agentId

if wf_result.status == "명세 결함 회송":
    report_spec_defect_to_user(wf_result.message)  # 기획자에게 /bp:plan 권고 전달
    return

files = wf_result.files

while round ≤ loop_max:
    # 2. reviewer Task 호출 (매 라운드 새 spawn)
    reviewer_result = Task(
        subagent_type = "bp:reviewer",
        prompt = <검수 템플릿 + 생성 파일 + round>
    )
    violations = parse(reviewer_result)

    if not violations:
        break

    if round > 1 and len(violations) > prev_violations:
        halt_on_regression(wireframer_id, prev_round, round, violations)
        return

    # 3. wireframer 에게 SendMessage 로 위반 리포트 전달
    SendMessage(
        to = wireframer_id,
        message = <위반 반영 템플릿 + 리포트 전문 + round>
    )
    # wireframer 는 "자동 수정 가능" Edit 또는 명세 결함이면 /bp:plan 회송 메시지
    wf_fix_result = <SendMessage 응답 수신>

    if wf_fix_result.status == "명세 결함 회송":
        report_spec_defect_to_user(wf_fix_result.message)
        return

    files.update(wf_fix_result.files)
    prev_violations = len(violations)
    round += 1

if round > loop_max:
    hand_back_exceeded(wireframer_id, remaining_violations)
    return

# 4. 최종 보고 A (수렴 완료)
report_success(files)
```

## 파라미터

| 항목 | 값 |
|---|---|
| `loop_max` | **3** |
| Task(bp:reviewer) 주체 | **오케스트레이터** (공식 제약) |
| wireframer 재진입 | **SendMessage** |
| reviewer 재호출 | **매 라운드 새 Task** |
| 자동 수정 컨펌 | **없음 (wireframer 가 즉시 Edit)** |
| 수동 결정 | **/bp:plan 회송** (wireframer 가 직접 해결 X, 기획자 facing 메시지로 안내) |

## 자동 수정 — 와이어 HTML 특화 주의

wireframer 가 Edit 적용 시:
- `old_string`/`new_string` 은 reviewer 리포트의 정확한 구간에 맞게
- HTML 구조 깨지지 않게 (태그 짝 맞춤)
- 여러 파일(pc / mobile / sheet / dialog) 에 같은 패턴 위반이 있으면 각 파일에 Edit 반복
- JSON description(`<script type="application/bp-description+json">`) 수정 시 valid JSON 유지

## /bp:plan 회송 조건

다음 중 하나라도 "자동 수정 불가" 로 분류되면 wireframer 는 turn 종료 후 회송:

- area_*.md `features[]` 가 비어 있음 (무엇을 그릴지 모름)
- screen.md frontmatter 에 viewport / features 없음
- reviewer 가 "새 area 추가 필요" 로 판단한 구조적 결함
- feature spec 이 존재하지 않는 featureId 를 area 가 참조

wireframer 는 **기획자 facing 회송 메시지**를 반송한다 ([wireframer-ux.md](wireframer-ux.md) "명세 결함 발견" 템플릿). 오케스트레이터가 이 메시지를 기획자에게 그대로 또는 다듬어 전달 + `/bp:plan` 권고.

wireframer 는 planner 를 직접 호출하지 않는다. 기획자가 `/bp:plan` 실행 여부를 판단.

## 최종 보고 (오케스트레이터 출력)

### A. 수렴 완료 (보통 여기)

```
다 됐어요.

- {파일 경로들}

브라우저로 열어서 확인해 주세요.
```

경고는 말미 한 줄.

### B. 명세 결함 회송

wireframer 가 반송한 [wireframer-ux.md](wireframer-ux.md) "명세 결함 발견" 템플릿을 오케스트레이터가 기획자에게 전달. 부분 생성된 HTML 은 삭제하거나 `.wip` 접미사 (wireframer 가 처리).

### C. 루프 한계 초과

```
세 번 시도했는데 자잘한 게 계속 남아 있어요.

- {자연어 번역된 위반들}

만들어둔 HTML 은 그대로 있어요. 같이 보시고 필요하면 손으로 고치거나 /bp:plan 으로 명세 먼저 점검해 주세요.
```

## 위반 증가 감지

라운드 N+1 위반 수 > 라운드 N 이면 자동 수정이 역효과. 즉시 중단 + 회송.

## Context firewalling

Task 로 spawn 된 wireframer·reviewer 는 각자 고유 세션. reviewer 의 내부 탐색·파일 읽기는 오케스트레이터 context 로 누적되지 않음. 교차 검증 범위(명세 파일 + HTML) 가 커도 비용 제어됨.

**단 오케스트레이터는 위반 리포트·파일 목록·라운드 간 상태를 유지**. SendMessage 로 전달 시 리포트 전문 인라인 (요약·재포맷 금지 — Edit 정확도 훼손).

## Task / SendMessage 호출

절차·템플릿은 [task-tool-invocation.md](task-tool-invocation.md).
