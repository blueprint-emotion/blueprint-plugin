# Task / SendMessage 호출 방법 (wireframe 맥락)

`/bp:wireframe` 워크플로에서 에이전트 간 통신은 **오케스트레이터가 전담**한다. Anthropic 공식 제약에 의해 **subagent 는 Task tool 을 가질 수 없으며 (재귀 spawn 불가)**, 따라서 Producer-Reviewer 수렴 루프도 오케스트레이터가 주도한다. 이미 spawn 된 wireframer 에게 재진입할 때는 Task 가 아닌 **SendMessage** 로.

## 공식 제약 (설계 전제)

https://code.claude.com/docs/en/sub-agents :
> "Subagents cannot spawn other subagents, so `Agent(agent_type)` has no effect in subagent definitions."

즉 wireframer subagent 안에서 `Task(subagent_type: "bp:reviewer")` 는 성립하지 않는다. subagent 컨텍스트에는 Task 가 존재하지 않음. 수렴 루프는 오케스트레이터 주도.

SendMessage 는 Agent Teams 활성(`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) 시 사용 가능 — 이미 spawn 된 wireframer 세션에 재진입용.

plan-harness 의 [task-tool-invocation.md](../../plan-harness/references/task-tool-invocation.md) 와 구조 동일. 본 문서는 wireframe 맥락의 템플릿만 별도 명시.

## 호출 지점 매트릭스

`/bp:wireframe` 의 통신 포인트:

| # | 호출자 | 도구 | 대상 | 목적 |
|---|---|---|---|---|
| 1 | 오케스트레이터 | Task | bp:wireframer | 최초 HTML 생성 위임 |
| 2 | 오케스트레이터 | Task | bp:reviewer | HTML·명세 교차 검수 (매 라운드) |
| 3 | 오케스트레이터 | SendMessage | bp:wireframer (기존 세션) | 위반 리포트 전달 → 자동 수정 요청 |

α 재진입은 wireframe 에서는 거의 발생하지 않는다 — "자동 수정 불가" 위반이 나오면 대개 명세 결함이라 `/bp:plan` 회송(기획자 facing 메시지) 로 끝난다.

## 절차

### A. Task / SendMessage 스키마 로드 (오케스트레이터 세션 각 1회)

```
ToolSearch(query = "select:Task", max_results = 1)
ToolSearch(query = "select:SendMessage", max_results = 1)
```

세션당 한 번씩 로드.

### B. Task 호출 기본 형

```
Task(
  subagent_type = "bp:wireframer" | "bp:reviewer",
  description   = "…",
  prompt        = "<템플릿>"
)
```

`subagent_type` 반드시 `bp:` 접두사.

### C. SendMessage 호출 기본 형

```
SendMessage(
  to       = "<agentId>",
  summary  = "…",
  message  = "<템플릿>"
)
```

대상은 Task 로 spawn 되어 return 한 wireframer. agentId 는 Task 응답 말미에서 획득.

## Prompt 템플릿 — 오케스트레이터 → wireframer (Task, 최초 위임)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 슬래시 커맨드 워크플로의
HTML 생성 단계에서 오케스트레이터가 Task tool 로 정식 위임한 것입니다.

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
- reviewer 를 직접 호출하지 말 것 (subagent 에 Task 도구 없음 — Anthropic 공식 제약)
- 수렴 루프는 오케스트레이터의 후속 Task(bp:reviewer) 호출 + SendMessage 재진입으로 진행
- 기획자 facing 메시지는 wireframe-harness/references/wireframer-ux.md 원칙 준수

반환 포맷:
- 생성·수정한 파일 절대 경로 목록
- 또는 명세 결함 발견 시 회송 메시지 (기획자 facing, /bp:plan 권고)
```

## Prompt 템플릿 — 오케스트레이터 → reviewer (Task, 매 라운드)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 슬래시 커맨드 워크플로의
와이어프레임 검토 단계에서 오케스트레이터가 Task tool 로 정식 위임한 것입니다.
(Anthropic 공식 제약상 subagent 는 Task 를 가질 수 없어, Producer-Reviewer
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

주의 항목: 메인 UI <bp-section> 의 data-feature / data-feature-key, JSON description sections[] 매칭, viewport 파일 분리 등 wireframe-harness 규약

출력 형식: 위반 리포트 + 각 위반 "자동 수정 가능" / "자동 수정 불가" 분류 (auto-fix-policy.md 기준). 위반 0건이면 "위반 0건, 수렴" 명시.
```

호출자 컨텍스트 한 줄 필수. reviewer 게이트는 parent(오케스트레이터) 호출을 허용하므로 정상 통과.

## Message 템플릿 — 오케스트레이터 → wireframer (SendMessage, 위반 반영 요청)

```
reviewer 리포트가 도착했어요. 수정해 주세요.

round: {N}
위반 건수: {X}건 (자동 수정 가능 {Y}, 자동 수정 불가 {Z})

위반 리포트 원문:
<리포트 전문 그대로 전달>

지시:
1. "자동 수정 가능" 위반들을 Edit 으로 반영 (재창작 금지 — 리포트의 "권장" 구문 그대로)
2. "자동 수정 불가" 항목이 있으면 /bp:plan 회송 조건 점검 (명세 결함이면 회송 메시지 출력 후 turn 종료)
3. 반영 완료 또는 회송 후 "반영 완료" / "회송 완료" 신호 + 수정한 파일 목록 반송
4. 오케스트레이터가 reviewer 재호출 또는 기획자 회송 메시지 전달을 이어서 진행

HTML Edit 시 주의:
- old_string / new_string 을 리포트 정확 구간에 맞춰 정밀 교체
- HTML 구조 깨짐 없게 (태그 짝 맞춤)
- 여러 파일(pc / mobile / sheet / dialog) 에 같은 패턴이면 각 파일에 Edit 반복
- JSON description(`<script type="application/bp-description+json">`) 수정 시 valid JSON 유지
```

## 흔한 오류

plan-harness 와 동일. subagent 의 Task 호출 시도, Skill 도구 오용, namespace 누락, self-check 대체, ToolSearch 건너뛰기, Task 스키마 로드 실패의 6가지 실패 모드. 자세한 설명은 [plan-harness/references/task-tool-invocation.md](../../plan-harness/references/task-tool-invocation.md) "흔한 오류" 섹션 참조.

**추가 주의 (wireframe 특화)**:

- `bp-components.js` 를 fetch/read 하려는 시도 금지 (6,600줄 빌드 산출물). 컴포넌트 사용법은 `wireframe` 스킬의 SKILL.md + `references/components/bp-X.md` 에 모두 있음

## 역방향 호출 금지

- reviewer → wireframer · 오케스트레이터 호출 금지
- wireframer → planner 호출 금지 — /bp:plan 회송은 **기획자 facing 메시지** 로 하고 기획자가 직접 실행
- subagent 간 Task spawn 금지

## /bp:plan 회송 메커니즘

wireframer 가 명세 결함(area features[] 비어 있음, viewport 필드 없음 등) 을 판단하면:

1. 작업 중단 (필요 시 부분 HTML 삭제 또는 `.wip` 접미사)
2. 기획자 facing 메시지로 상황 설명 + `/bp:plan {요구사항 또는 screen.md 경로}` 권고
3. Task turn 종료

wireframer 는 **planner 를 직접 호출하지 않음**. 기획자가 메시지 보고 본인이 `/bp:plan` 실행.

## 결과 반송

### wireframer 의 반송

1. **최초 생성 완료** — 생성·수정 파일 목록 + "reviewer 호출 대기" 신호
2. **위반 반영 완료** — 수정한 파일 목록 + "재검수 대기" 신호
3. **명세 결함 회송** — 기획자 facing 회송 메시지 (`/bp:plan` 권고) + 부분 HTML 상태

### reviewer 의 반송

위반 리포트 (각 항목 "자동 수정 가능" / "자동 수정 불가" 분류) 또는 "위반 0건, 수렴". 파일 수정 없음.

## 세션 관리

- wireframer 는 한 `/bp:wireframe` 호출 동안 **동일 세션 유지** (Task 로 최초 spawn, 이후 SendMessage 로 재진입)
- reviewer 는 라운드마다 **새 Task 로 spawn**
- 오케스트레이터는 wireframer agentId 를 라운드 간 보관
