---
name: wireframe-harness
version: 2.0.0
user-invocable: false
description: >
  /bp:wireframe 커맨드의 오케스트레이션 규약. 화면명세(screen.md) 를 입력으로 받아
  viewport 확정 → wireframer agent 로 HTML 생성 위임 → Producer-Reviewer 수렴 루프
  (오케스트레이터 주도) 까지의 실행 흐름과 "기획자 경험" 원칙을 정의한다.
  Anthropic 공식 제약(subagent 는 Task tool 없음)에 따라 Task(bp:reviewer) 호출과
  SendMessage(wireframer) 재진입은 모두 오케스트레이터가 전담한다.
  /bp:wireframe 커맨드 컨텍스트의 오케스트레이터와 bp:wireframer·bp:reviewer agent 에 preload 된다.
---

# wireframe-harness — /bp:wireframe 오케스트레이션

이 스킬은 "/bp:wireframe 이 어떻게 흘러야 하는가" 를 정한다. `wireframe` 스킬이 HTML 출력 형식을 정한다면, 이 스킬은 **실행 흐름 + 기획자 경험** 을 정한다.

## 적용 범위

- `/bp:wireframe` 커맨드 실행 흐름 (오케스트레이터 = 커맨드를 돌리는 Claude Code 본인)
- `bp:wireframer` agent 의 HTML 생성 + SendMessage 재진입 처리
- `bp:reviewer` agent 의 wireframe 산출물 검토 분류 기준

## 공식 제약 (설계 전제)

https://code.claude.com/docs/en/sub-agents:
> "Subagents cannot spawn other subagents, so `Agent(agent_type)` has no effect in subagent definitions."

즉 wireframer subagent 는 Task tool 자체를 갖지 않는다. **Task(bp:reviewer) 호출과 SendMessage(wireframer) 재진입은 모두 오케스트레이터가 전담**한다.

## 책임 분배

```
/bp:wireframe 실행 흐름:

[오케스트레이터가 수행]
 1. 인자 검증 (screen.md 존재 / frontmatter 유효 / type 확인)
 2. viewport · 생성 파일 목록 예고 (짧은 확인 게이트)
       ↓
 3. Task(bp:wireframer) — HTML 생성 위임. wireframer 는 생성 후 반송
       ↓
[오케스트레이터가 수행 — 수렴 루프 주도]
 4. Task(bp:reviewer) — 검수 (매 라운드 새 spawn)
 5. 위반 있으면 SendMessage(wireframer_id) — 위반 반영 요청
 6. 루프 반복 (최대 3회)
 7. 결과 보고 후 종료 (명세 결함이면 /bp:plan 회송 메시지)
```

**왜 이 구조**
- /bp:wireframe 은 /bp:plan 과 달리 **입력 검증 + 렌더 중심**. 9턴짜리 인터뷰 없음
- 오케스트레이터는 "screen.md 유효한가 + 어떤 파일 만들까" 한 턴으로 확인 후 위임
- 실제 렌더링은 wireframer 가 bp-* 컴포넌트 · 폴더 컨텍스트 수집 등 작업량이 많음. subagent 에서 하는 게 맞음 (context 격리)
- Task 호출 허브만 오케스트레이터가 맡음 — 공식 제약 때문

## 핵심 패턴 — Producer-Reviewer (오케스트레이터 주도)

```
   [오케스트레이터]            [Producer = wireframer]        [Reviewer]
                              
  Task(bp:wireframer) ────▶  HTML 생성 + 자기점검
                  ◀─── 반송 ┘
                              
  Task(bp:reviewer) ──────────────────────▶  와이어 + 명세 교차 검증
                  ◀─── 위반 리포트 ────────┘
                              
  SendMessage(wireframer) ▶  자동 수정 가능 (대부분) → Edit
                              자동 수정 불가 (드묾) → /bp:plan 회송 메시지 반송
                  ◀─── 반송 ┘
                              
  LOOP 최대 3회. 위반 0건이면 종료.
```

**/bp:plan 과의 차이**: wireframe 의 위반은 대부분 규약성(data-feature-key 누락, 표준 리소스 빠짐, 매칭 불일치) 이라 자동 수정 가능 비중이 높다. 자동 수정 불가 위반(예: "영역 추가 필요") 이 나오면 이는 명세 문제라 `/bp:plan` 으로 돌려보내는 게 적절.

## 🌟 기획자 경험 원칙

### 1. 시스템 언어 금지

`/bp:plan` 과 동일한 원칙. 컨펌·게이트·status·payload·Task·SendMessage·subagent 같은 단어 노출 X. [planner-ux.md 번역 가이드](../plan-harness/references/planner-ux.md) 의 톤을 공유.

### 2. 빠르게, 기대치 먼저

와이어프레임 생성은 기획자 입장에서 "명세 다 썼으니 그림 보고 싶다" 단계. 대화 최소화 + 빠른 결과가 핵심.

```
좋아요, 그릴게요.
- PC 버전 (wireframe.html)
- 모바일 버전 (wireframe_mobile.html)
- 리뷰 시트, 이미지 확대 다이얼로그도 같이

1~2분 걸려요.
```

### 3. 명세 누락 발견 시 기획자에게 돌려보냄

wireframe-harness 는 **명세를 고치지 않는다**. 검증 중 명세 결함(영역 누락, features[] 빈 배열 등) 이 발견되면:

```
이 부분이 screen.md 에 아직 안 잡혀 있어요 — {뭐}.
/bp:plan 으로 한 번 손보고 다시 /bp:wireframe 해주세요.
```

### 4. 결과는 파일 경로로

```
다 됐어요.

- docs/screens/상품/product-detail/wireframe.html
- docs/screens/상품/product-detail/wireframe_mobile.html
- ...

브라우저로 열어서 확인해 주세요.
```

### 5. 덮어쓰기 주의

같은 폴더에 이미 `wireframe*.html` 이 있으면 한 번 확인:

```
이 폴더에 이미 와이어프레임이 있네요. 덮어써서 다시 그릴까요?
(기존 파일: wireframe.html, wireframe_mobile.html)
```

## 불변 규칙

1. **self-check 로 reviewer 호출 대체 금지** — 오케스트레이터가 반드시 Task tool 로 bp:reviewer 호출. subagent 가 advisor 등으로 우회 시도도 금지
2. **subagent 가 Task 호출 시도 금지** — wireframer 에는 Task tool 이 없음 (공식 제약). Task 스키마 로드 실패 → 오케스트레이터 반송 + 종료
3. **명세(screen/area/feature 등) 직접 수정 금지** — wireframe-harness 는 와이어프레임만 생성·수정. 명세 문제는 `/bp:plan` 으로 돌려보냄
4. **`bp-components.js` fetch/read 금지** — 6,600줄 빌드 산출물. 컴포넌트 사용법은 `wireframe` 스킬의 SKILL.md + `references/components/bp-X.md` 에 모두 있음
5. **viewport 분리 엄격** — 한 파일에 한 viewport. `[pc, mobile]` 이면 파일 2개
6. **루프 한계 3회**
7. **reviewer 는 파일 수정 금지** — 보고·분류만

## 세부 규약 — references

- **[wireframer-ux.md](references/wireframer-ux.md)** — 기획자 언어 (빠른 확인, 결과 보고)
- **[confirm-gates.md](references/confirm-gates.md)** — viewport · 파일 목록 확인 게이트 (덮어쓰기 분기)
- **[convergence-loop.md](references/convergence-loop.md)** — 오케스트레이터 주도 수렴 루프 알고리즘
- **[auto-fix-policy.md](references/auto-fix-policy.md)** — HTML/bp-* 위반 분류 기준
- **[visual-review.md](references/visual-review.md)** — 생성된 HTML 의 구조적 자기점검 가이드 (wireframer 가 반송 전 1차 체크)
- **[task-tool-invocation.md](references/task-tool-invocation.md)** — 오케스트레이터의 Task/SendMessage 호출 절차

## 호출자 컨텍스트 선언 (오케스트레이터 → reviewer)

```
호출자 컨텍스트: 이 호출은 /bp:wireframe 슬래시 커맨드 워크플로의
와이어프레임 검토 단계에서 오케스트레이터가 Task tool 로 정식 위임한 것입니다.
(Anthropic 공식 제약상 subagent 는 Task 를 가질 수 없어, Producer-Reviewer
수렴 루프는 오케스트레이터가 주도합니다.)
```

## 버전

MAJOR bump 는 Producer-Reviewer 책임 분배·viewport 규약·기획자 UX 원칙의 구조 변경. agent 본문·command 본문·`wireframe` 스킬 동반 검토.

2.0.0 은 Anthropic 공식 제약(subagent 재귀 spawn 불가) 에 맞춰 **Producer-Reviewer 수렴 루프를 wireframer 주도 → 오케스트레이터 주도로 이관**한 MAJOR 전환. 이전 버전의 "wireframer→reviewer Task 호출" 설계는 플랫폼 단에서 작동하지 않던 것.
