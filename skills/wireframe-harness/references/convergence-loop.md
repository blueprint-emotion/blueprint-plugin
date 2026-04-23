# 수렴 루프 (wireframe)

**오케스트레이터가 루프를 소유**한다. Agent 호출 (wireframer / reviewer) 을 전담. plan-harness 의 루프와 구조 동일 — [plan-harness/references/convergence-loop.md](../../plan-harness/references/convergence-loop.md) 참조. 본 문서는 wireframe 특화 차이만 명시.

wireframe 루프는 **자동 수정 가능 위반 비중이 높음** — 대부분 한 라운드에서 수렴. "자동 수정 불가" 가 나오면 대개 명세 결함이라 `/bp:plan` 회송(기획자 facing 메시지) 으로 종료.

## 설계 근거

공식 제약: subagent 는 Agent tool 을 갖지 않는다 (https://code.claude.com/docs/en/sub-agents). wireframer subagent 는 reviewer 를 직접 spawn 할 수 없으므로 수렴 루프는 오케스트레이터 주도.

체이닝 모델: **매 라운드 wireframer 를 새 `Agent(bp:wireframer)` 로 spawn**. 세션 연속성 없이 파일 상태로 맥락 복원.

> `Task` → `Agent` 리네임 (v2.1.63) 로 공식 이름은 `Agent`. 본 문서 표기 기준.

## 알고리즘 (오케스트레이터 실행)

```
# 오케스트레이터 세션에서 실행
round = 1
loop_max = 3
prev_violations = None

# 1. 최초 wireframer spawn
wf_result = Agent(subagent_type = "bp:wireframer", prompt = <최초 템플릿, round=1>)

if wf_result.status == "명세 결함 회송":
    report_spec_defect_to_user(wf_result.message)   # 기획자에게 /bp:plan 권고 전달
    return

files = wf_result.files

while round ≤ loop_max:
    # 2. reviewer 호출 (매 라운드 새 spawn)
    reviewer_result = Agent(
        subagent_type = "bp:reviewer",
        prompt = <검수 템플릿 + 생성 파일 + round>
    )
    violations = parse(reviewer_result)

    if not violations:
        break

    if prev_violations is not None and len(violations) > prev_violations:
        halt_on_regression(prev_round, round, violations)
        return

    # 3. wireframer 재호출 (새 spawn) — 위반 반영 요청
    wf_fix = Agent(
        subagent_type = "bp:wireframer",
        prompt = <위반 반영 템플릿 + 리포트 전문 + round>
    )

    if wf_fix.status == "명세 결함 회송":
        report_spec_defect_to_user(wf_fix.message)
        return

    files.update(wf_fix.files)
    prev_violations = len(violations)
    round += 1

if round > loop_max:
    hand_back_exceeded(remaining_violations)
    return

# 4. 최종 보고 A (수렴 완료)
report_success(files)
```

## 파라미터

| 항목 | 값 |
|---|---|
| `loop_max` | **3** |
| Agent 호출 주체 | **오케스트레이터** (공식 제약) |
| producer 재진입 | **새 Agent spawn** (체이닝) |
| reviewer 재호출 | **매 라운드 새 Agent** |
| round 전달 | **prompt 에 `round: N` 명시 필수** |
| 자동 수정 컨펌 | **없음 (wireframer 가 즉시 Edit)** |
| 수동 결정 | **/bp:plan 회송** (wireframer 가 해결 X, 기획자 facing 메시지로 안내) |

wireframe 에서는 α 프로토콜이 거의 발동하지 않는다 — "자동 수정 불가" 는 대개 명세 결함이라 `/bp:plan` 회송으로 종료. α 패턴이 필요한 경우가 생기면 [plan-harness/references/convergence-loop.md](../../plan-harness/references/convergence-loop.md) 의 α-1 ~ α-4 를 그대로 적용 가능.

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

Agent 로 spawn 된 wireframer·reviewer 는 각자 고유 세션. reviewer 의 내부 탐색·파일 읽기는 오케스트레이터 context 로 누적되지 않음. 교차 검증 범위(명세 파일 + HTML) 가 커도 비용 제어됨.

**오케스트레이터는 위반 리포트·파일 목록·라운드 간 상태를 유지**. 재spawn wireframer 에게 전달 시 리포트 전문 인라인 (요약·재포맷 금지 — Edit 정확도 훼손).

---

## Agent 호출 절차

### 스키마 로드 (오케스트레이터 세션 1회)

```
ToolSearch(query = "select:Agent", max_results = 1)
```

세션당 1회. SendMessage 는 사용하지 않으므로 로드 불필요.

### 호출 기본 형

```
Agent(
  subagent_type = "bp:wireframer" | "bp:reviewer",
  description   = "…",
  prompt        = "<템플릿>"
)
```

`subagent_type` 반드시 `bp:` 접두사.

## Prompt 템플릿 — 최초 wireframer 호출 (round=1)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 슬래시 커맨드 워크플로의
HTML 생성 단계에서 오케스트레이터가 Agent tool 로 정식 위임한 것입니다.

round: 1
mode: 최초 HTML 생성

입력:
- screen.md 경로: {절대 경로}
- 화면 폴더: {절대 경로}
- viewport: {[pc] | [mobile] | [pc, mobile]}
- 생성 파일 예상 목록: {...}
- 덮어쓰기: {yes | no} (기존 wireframe*.html 유무 기반)
- extract_overlays: {[] | ["sheet_review", "dialog_zoom", ...]}
  ← 게이트 2 응답. 빈 배열이면 메인 fragment 만 (기본). 이름이 있으면 그 overlay 들을 별도 파일로도 추가 생성.

작업:
1. 같은 폴더의 area_*.md, sheet_*.md, dialog_*.md 자동 수집
2. features[].ref 따라 기능명세 rules 참조
3. wireframe 스킬 가이드 따라 viewport 별 HTML 생성
   - 메인 wireframe 안에 모든 sheet/dialog 를 `<bp-fragment>` + `<bp-sheet open>` / `<bp-dialog open>` 정적 카드로 포함
   - extract_overlays 에 명시된 이름은 별도 파일도 추가 (메인 fragment 는 유지)
4. 자기점검 (visual-review.md 체크리스트) — 명세 결함이면 이 단계에서 회송 판단
5. 생성·수정한 파일 목록을 반송하고 turn 종료 — reviewer 호출은 오케스트레이터가 담당

주의:
- 명세(screen/area/feature) 직접 수정 금지 — 결함 발견 시 /bp:plan 회송 메시지
- bp-components.js fetch/read 금지
- 한 파일에 한 viewport
- 커스텀 엘리먼트 self-closing 금지 (wireframe SKILL.md §"커스텀 엘리먼트 닫는 태그")
- reviewer 를 직접 호출하지 말 것 (subagent 에 Agent 도구 없음)
- 기획자 facing 메시지는 wireframer-ux.md 원칙 준수

반환 포맷:
- 생성·수정한 파일 절대 경로 목록
- 또는 명세 결함 발견 시 회송 메시지 (기획자 facing, /bp:plan 권고)
```

## Prompt 템플릿 — reviewer 호출 (매 라운드)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 슬래시 커맨드 워크플로의
와이어프레임 검토 단계에서 오케스트레이터가 Agent tool 로 정식 위임한 것입니다.
(공식 제약상 subagent 는 Agent 를 호출할 수 없어, Producer-Reviewer
수렴 루프는 오케스트레이터가 주도합니다.)

검토 대상 폴더: {화면 폴더 절대 경로}
검토 범위: 와이어프레임 HTML + 명세와의 교차 검증
생성된 파일 (집중 검토):
- {wireframe.html}
- {wireframe_mobile.html}
- {wireframe_sheet_*.html / wireframe_dialog_*.html ...}
명세 참조:
- screen.md, area_*.md, sheet_*.md, dialog_*.md
- docs/features/ (area features[].ref 경로)

round: {현재 라운드 번호}

주의 항목: 메인 UI <bp-section> 의 data-feature / data-feature-key, JSON description sections[] 매칭, viewport 파일 분리, 커스텀 엘리먼트 닫는 태그 등 wireframe-harness 규약

출력 형식: 위반 리포트 + 각 위반 "자동 수정 가능" / "자동 수정 불가" 분류 (auto-fix-policy.md 기준). 위반 0건이면 "위반 0건, 수렴" 명시.
```

## Prompt 템플릿 — wireframer 재호출 (위반 반영)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 수렴 루프의
위반 반영 라운드입니다. 오케스트레이터가 Agent tool 로 위임.

round: {N}
mode: 위반 반영

대상 폴더: {화면 폴더 절대 경로}

reviewer 리포트 (직전 라운드 결과):
위반 건수: {X}건 (자동 수정 가능 {Y}, 자동 수정 불가 {Z})

<리포트 전문 그대로 전달>

지시:
1. 이미 생성된 HTML 파일들을 Read 해서 현재 상태 파악
2. "자동 수정 가능" 위반들을 Edit 으로 반영 (재창작 금지 — 리포트의 "권장" 구문 그대로)
3. "자동 수정 불가" 항목이 있으면 /bp:plan 회송 조건 점검 (명세 결함이면 회송 메시지 출력 후 turn 종료)
4. 반영 또는 회송 후 "반영 완료" / "회송 완료" 신호 + 수정한 파일 목록 반송

HTML Edit 시 주의:
- old_string / new_string 을 리포트 정확 구간에 맞춰 정밀 교체
- HTML 구조 깨짐 없게 (태그 짝 맞춤)
- 여러 파일(pc / mobile / sheet / dialog) 에 같은 패턴이면 각 파일에 Edit 반복
- JSON description(`<script type="application/bp-description+json">`) 수정 시 valid JSON 유지
- 커스텀 엘리먼트 self-closing(`<bp-* ... />`) 발견 시 명시적 닫는 태그로 교체
```

## 흔한 오류

plan-harness 와 동일. subagent 의 Agent 호출 시도, namespace 누락, self-check 대체, ToolSearch 건너뛰기, round 누락, SendMessage 로 wireframer 재호출 시도 등 6가지 실패 모드. 자세한 설명은 [plan-harness/references/convergence-loop.md](../../plan-harness/references/convergence-loop.md) "흔한 오류" 섹션 참조.

**추가 주의 (wireframe 특화)**: `bp-components.js` fetch/read 시도 금지 (6,600줄 빌드 산출물). 컴포넌트 사용법은 `wireframe` 스킬의 SKILL.md + `references/components/bp-X.md` 에 모두 있음.

## 역방향 호출 금지

- reviewer → wireframer · 오케스트레이터 호출 금지
- wireframer → planner 호출 금지 — /bp:plan 회송은 **기획자 facing 메시지** 로 하고 기획자가 직접 실행
- subagent 간 Agent spawn 금지

## 결과 반송

### wireframer 의 반송

1. **최초 생성 완료** — 생성·수정 파일 목록 + "reviewer 호출 대기" 신호
2. **위반 반영 완료** — 수정한 파일 목록 + "재검수 대기" 신호
3. **명세 결함 회송** — 기획자 facing 회송 메시지 (`/bp:plan` 권고) + 부분 HTML 상태

### reviewer 의 반송

위반 리포트 (각 항목 "자동 수정 가능" / "자동 수정 불가" 분류) 또는 "위반 0건, 수렴". 파일 수정 없음.
