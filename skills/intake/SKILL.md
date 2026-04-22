---
name: intake
version: 0.3.0
user-invocable: false
description: >
  화면 폴더에 작성하는 intake.md(작업 노트) 형식과 작성·인터뷰 가이드.
  /bp:plan 명령이 자유형식 요구사항 md를 받아 화면 폴더별로 intake.md를 생성·갱신할 때 이 스킬을 사용한다.
  오케스트레이터(Claude Code 본인) 가 요구사항을 파싱해 초안을 작성하고, 빈 슬롯을 식별해 단계별 인터뷰를 진행하고, 답변을 intake.md에 역기록할 때 이 스킬의 슬롯 규약을 따른다.
  planner subagent 는 명세 작성 단계 + 수렴 루프의 α 재진입 단계에서 이 스킬의 `## _pending_decisions` 메타 섹션 규약(payload 기록 전용)을 따른다.
  "intake", "intake.md", "요구사항", "화면 작성 시작", "기획 인터뷰" 키워드에 트리거.
---

# intake.md 작성 가이드

`intake.md`는 한 화면을 만들기 위한 **작업 노트**다. 기획자의 자유형식 요구사항을 오케스트레이터가 정형화한 결과이자, 이후 feature/screen 명세 생성의 입력이 된다.

## 위치

```
docs/screens/{그룹}/{화면폴더}/intake.md   ← 산출물 폴더와 같은 위치
```

같은 폴더에 산출물(`screen.md`, `area_*.md`, `*.html`)이 함께 만들어진다.

## 프론트매터

```yaml
---
status: drafting | interviewing | ready | awaiting_decision | needs_attention | done
source: ../../../requirements.md          # 어느 요구사항 md에서 파생됐나 (상대 경로)
target: .                                 # 산출물 목적지 (자기 폴더 = ".")
---
```

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `status` | Y | 작업 단계. 아래 표 참조 |
| `source` | Y | 입력 요구사항 md 경로. 재실행 시 추적용 |
| `target` | N | 산출물 폴더. 보통 자기 폴더(`.`) |

### status 값

| status | 의미 | 다음 단계 주체 |
|---|---|---|
| `drafting` | 요구사항 파싱 직후. 초안만 있는 상태 | 오케스트레이터 (인터뷰 진입) |
| `interviewing` | 빈 슬롯 인터뷰 진행 중 | 오케스트레이터 (인터뷰 계속) |
| `ready` | 9개 슬롯 모두 채워짐. 명세 작성 가능 | 오케스트레이터 → planner subagent 위임 |
| `awaiting_decision` | planner 수렴 루프 중 수동 결정 대기. `## _pending_decisions` 섹션에 payload 있음 | 오케스트레이터 (기획자 응답 수집 → planner 재호출) |
| `needs_attention` | 루프 한계(3회) 초과 또는 연쇄 실패. 같이 보기 단계 | 기획자 수동 확인 |
| `done` | 명세 산출물 완료 | (와이어프레임 단계로 넘어감) |

`awaiting_decision`·`needs_attention` 은 0.2.0 에서 추가. planner subagent 가 α 재진입 프로토콜로 자동 기록한다 — 기획자가 직접 설정할 일은 없다.

## 슬롯 9개

본문은 다음 9개 `##` 섹션으로 구성한다. **빈 섹션은 인터뷰 트리거**가 된다 — 오케스트레이터가 빈 섹션을 발견하면 해당 슬롯에 대해 기획자에게 질문하고, 답변을 그 섹션에 기록한다.

### 1. `## 무엇을·누가·왜`

이 화면이 무엇을 하는 곳이고, 누가, 왜 사용하는가. 한두 문단의 자연어.

```markdown
## 무엇을·누가·왜

구매자가 상품 정보를 종합적으로 확인하고 옵션을 선택해 장바구니에 담는 화면.
일반 구매자(비로그인 가능), 모바일 우선 사용 패턴이 큼.
구매 결정 직전 단계라 정보 신뢰도와 옵션 선택의 명확성이 핵심.
```

### 2. `## 유저스토리 (Must/Should/Could)`

화면 전체의 큰 목표 1~3개. 각 항목 앞에 **우선순위 라벨** 필수 (`[Must]`, `[Should]`, `[Could]`). 영역별 세부 시나리오는 명세 작성 단계에서 영역 파일에 들어가므로 여기서는 **루트 레벨**만.

```markdown
## 유저스토리 (Must/Should/Could)

- [Must] 구매자로서, 상품 정보를 종합적으로 확인하고 구매 결정을 내리고 싶다
- [Should] 구매자로서, 옵션 조합별 재고를 실시간으로 확인하고 싶다
- [Could] 구매자로서, 다른 구매자의 리뷰를 사진과 함께 보고 싶다
```

### 3. `## 보여야 할 정보`

이 화면에 노출되어야 할 정보. **도메인 후보·featureId 매핑**까지 포함. 기존 `docs/features/*.md`에 매칭되는 기능이 있으면 명시, 없으면 신설 후보로 표시.

```markdown
## 보여야 할 정보

- 상품 기본 정보 (이름, 판매가, 정가) — `PRODUCT__INFO` 기존
- 상품 이미지 여러 장 — `PRODUCT__IMAGE` 기존
- 옵션 선택 (색상·사이즈·재고) — `PRODUCT__OPTION` 기존
- 리뷰 요약 (평점·개수) — `REVIEW__SUMMARY` 신설 필요
- Q&A 탭 — `QNA__LIST` 기존
```

featureId 매핑이 한 줄로 안 잡히면 인터뷰 대상.

### 4. `## 동작·인터랙션`

사용자 액션과 화면 반응. 클릭·스와이프·다이얼로그 트리거·자동 포커스·키보드 단축키 등.

```markdown
## 동작·인터랙션

- 옵션을 모두 선택하면 장바구니 버튼 활성화
- 이미지 클릭 시 확대 다이얼로그 (dialog_zoom)
- 리뷰 더보기 클릭 시 리뷰 시트 (sheet_review)
- 모바일: 이미지 좌우 스와이프로 갤러리 전환
```

### 5. `## 상태 (로딩·빈·에러)`

화면이 정상 흐름 안에서 보여주는 UI 상태. 로딩, 빈 상태, 에러 뷰 등. **외부 시스템 실패는 6번에**.

```markdown
## 상태 (로딩·빈·에러)

- 로딩: 이미지·옵션·가격을 스켈레톤으로 표시
- 옵션 재고 0: 해당 옵션 비활성화 + "품절" 뱃지
- 리뷰 0건: 리뷰 영역에 "아직 리뷰가 없습니다" 안내
```

### 6. `## 예외 케이스 (API 실패·권한 등)`

외부 시스템·환경 요인으로 인한 이탈 처리. API 오류, 네트워크 오프라인, 비로그인 접근, 권한 없음 등.

```markdown
## 예외 케이스 (API 실패·권한 등)

- 상품 조회 API 실패: "일시적 오류" 안내 + 재시도 버튼
- 비로그인 상태에서 장바구니 담기: 로그인 화면으로 리다이렉트, 현재 상품 ID 보존
- 삭제된 상품 접근: 404 페이지로 이동
```

### 7. `## viewport`

지원할 뷰포트. `pc`, `mobile`, 또는 둘 다.

```markdown
## viewport

[pc, mobile]
```

배열 형식 그대로 적는다. wireframer가 이 값을 보고 파일을 각각 생성한다.

### 8. `## 시트·다이얼로그`

페이지에서 트리거되는 오버레이. 각 항목은 파일명 + 한 줄 설명.

```markdown
## 시트·다이얼로그

- `sheet_review.md` — 리뷰 상세 시트 (오른쪽 슬라이드)
- `dialog_zoom.md` — 이미지 확대 다이얼로그
```

오버레이 없으면 비워둔다 (인터뷰에서 "없어요" 답변도 OK).

### 9. `## 진입 경로 · 참고·메모`

이 화면에 도달하는 경로 + 기획자 메모(회의 발언, 스케치 링크, TBD 항목). 산출물에 들어가지 않는 작업 노트성 정보도 여기.

```markdown
## 진입 경로 · 참고·메모

**진입 경로**
- 상품 목록 → 상품 카드 클릭
- 검색 결과 → 상품 카드 클릭
- 추천 위젯 → 상품 카드 클릭

**참고**
- 4월 회의록: 가격 표시는 정가 취소선 + 판매가 강조 합의됨
- 디자이너 스케치: figma.com/... (TBD, 디자인 확정 전)
```

## `## _pending_decisions` 메타 섹션

0.2.0 에서 추가, 0.3.0 에서 payload 스키마 확장된 **메타 섹션**. 슬롯이 아니다 — 인터뷰로 채우는 본문 9개 슬롯과 완전히 별개.

### 용도 (옵션 B — 책임 분리)

planner subagent 가 수렴 루프(Producer-Reviewer 패턴) 중 reviewer 가 "자동 수정 불가" 로 분류한 위반을 만나면, 기획자 결정을 기다리기 위해 turn 을 종료한다. 이때 **payload 기록만** 담당한다 — 기획자-facing 자연어 질문은 planner 가 아니라 오케스트레이터가 이 payload 를 읽고 생성한다.

- planner: payload 기록 (아래 필드 전체) + 짧은 handoff note 만 출력 후 종료
- 오케스트레이터: payload 읽고 `plan-harness/references/α-pending-to-question.md` 규약으로 기획자 언어로 질문 → 응답을 `decision:` 필드에 기록 → **SendMessage 로 기존 planner 세션 재진입** (같은 `/bp:plan` 호출 안에서). 세션 종료 후 resume 시나리오면 새 Task — `resume.md` 참조

### 포맷 (0.3.0 스키마)

```markdown
## _pending_decisions

<!-- 이 섹션은 planner 가 payload 를 기록하고 오케스트레이터가 기획자 질문으로 번역하기 위한 내부 통로입니다. 기획자가 직접 편집하지 않습니다. -->

### round 2 — 2026-04-21 15:42

- id: v1
  category: [SSOT]
  location: area_option.md:45
  summary: 옵션 조합 규칙의 귀속 위치 판단 필요
  planner_context: area_option 인수조건을 정리하던 중, 이 규칙이 화면 고유 조건인지 PRODUCT 공통 rule 인지 확정되지 않아 명세 진행이 멈춤
  user_facing_why: 같은 규칙을 두 군데에 쓰지 않고 명세를 마무리하려면 위치를 정해야 함
  source_slots:
    - 유저스토리
    - 동작·인터랙션
  conversation_hint: 기획자가 앞서 "옵션 다 고르면 장바구니 가능" 과 "같은 옵션은 합쳐진다" 를 같이 언급함
  priority: blocking           # blocking | important | optional
  recommendation: PRODUCT.md#OPTION 링크로 대체 (리뷰어 권장)
  alternatives:
    - label: 영역 고유 인수조건으로 유지
      trade_off: 이 화면 맥락은 선명하지만 다른 화면에서 같은 규칙을 다시 써야 할 수 있음
      recommended: false
    - label: PRODUCT 도메인 rule 로 승격
      trade_off: 중복은 줄지만 상품 전체 공통 규칙으로 봐도 되는지 확정이 필요함
      recommended: true
  decision: _pending_

- id: v2
  ...
```

### 필드 설명

| 필드 | 필수 | 주체 | 설명 |
|---|:---:|---|---|
| `id` | Y | planner | 라운드 내 고유 (v1, v2 …) |
| `category` | Y | planner | reviewer 위반 분류 ([SSOT]/[잔재]/[교차]/[링크]/[구조] 등) |
| `location` | Y | planner | `파일:라인` — reviewer 위반 위치 |
| `summary` | Y | planner | 한 줄 위반 요약 (reviewer 리포트 기반) |
| `planner_context` | Y | planner | 왜 이 결정이 지금 명세 진행을 막는지 (1-2문장) |
| `user_facing_why` | Y | planner | 기획자가 왜 결정해야 하는지 자연어 힌트 (오케스트레이터가 질문 베이스로 사용) |
| `source_slots` | N | planner | 인터뷰 슬롯 이름 배열 — 이 결정이 어느 슬롯 답변과 연결되는지 |
| `conversation_hint` | N | planner | 이전 대화에서 기획자가 언급한 관련 문장·맥락 (대화 흐름 연결용) |
| `priority` | Y | planner | `blocking` / `important` / `optional` — 오케스트레이터가 한 턴 묶음 크기 결정에 사용 |
| `recommendation` | Y | planner | reviewer 권장안을 인용 |
| `alternatives` | Y | planner | 각 대안 객체: `label` (필수), `trade_off` (필수), `recommended` (bool) |
| `decision` | Y | **오케스트레이터** | 초기값 `_pending_`. 기획자 응답 후 오케가 선택 결과 기록 |

상세 포맷·재진입 절차는 `plan-harness/references/convergence-loop.md` 의 α-1 ~ α-5, 질문 번역 규약은 `plan-harness/references/α-pending-to-question.md` 참조.

### 원칙

- **기획자는 이 섹션을 직접 읽거나 편집하지 않는다**. 필요한 내용은 오케스트레이터가 기획자 언어로 번역해 질문한다
- **planner 는 기획자-facing 자연어 질문을 이 섹션에 쓰거나 최종 출력에 포함하지 않는다** — payload 필드만 기록, 오케스트레이터가 번역권 소유
- **슬롯이 아니므로 비어 있음이 인터뷰 트리거가 되지 않는다**. 오케스트레이터는 이 섹션을 인터뷰 대상으로 삼지 않는다
- **이력 보존**: round 가 쌓여도 이전 round 를 지우지 않는다. `resolved: true` 플래그로 마크
- **기획자 facing 메시지에 `_pending_decisions` / `awaiting_decision` / `blocking` / 필드명 등 시스템 언어를 노출하지 않는다**

---

## 오케스트레이터의 인터뷰 흐름 (B1 모델)

0.2.0 부터 인터뷰는 **planner subagent 가 아니라 오케스트레이터(Claude Code 본인)** 가 진행한다. subagent 왕복의 답답함을 없애기 위함. 명세 작성만 planner 에게 위임.

오케스트레이터는 다음 순서로 동작:

1. **요구사항 md 파싱** — 자유형식 입력에서 슬롯 9개에 매핑되는 정보를 추출해 intake.md 초안 작성 (`status: drafting`)
2. **빈 슬롯 식별** — 추출 후 비어있거나 정보가 부족한 슬롯을 인터뷰 대상으로 표시
3. **단계별 인터뷰** — 한 번에 모든 슬롯을 묻지 않는다. 슬롯 단위로 3~5개 질문 묶음 (`status: interviewing`)
4. **답변 역기록** — 기획자 답변을 해당 슬롯 본문에 추가
5. **통합 확인 게이트** — 모든 슬롯이 채워지면 `status: ready` 로 바꾸고 "intake + 만들 산출물 목록" 을 한 턴에 보여주며 검토 요청
6. **planner subagent 위임** — 컨펌 후 Task tool 로 `bp:planner` 에 intake.md 경로 전달. planner 는 feature-spec / screen-spec 호출 + 수렴 루프만 담당
7. **α 재진입 (필요 시)** — planner 가 `status: awaiting_decision` 으로 턴 종료하면 오케스트레이터가 `## _pending_decisions` 읽고 기획자 언어로 질문 → 응답 받아 `decision:` 필드에 기록 → **SendMessage 로 기존 planner 세션 재진입** (같은 `/bp:plan` 호출 안에서. resume 시나리오면 새 Task — `plan-harness/references/resume.md` 참조)
8. **완료** — planner 가 수렴 완료 보고하면 `status: done`

상세 규약은 `plan-harness/` 스킬 참조:
- 인터뷰 패턴 → `plan-harness/references/interview-flow.md`
- 기획자 언어 번역 → `plan-harness/references/planner-ux.md`
- 통합 확인 게이트 → `plan-harness/references/confirm-gates.md`
- α 재진입 → `plan-harness/references/convergence-loop.md`

## 재실행 정책

같은 요구사항 md(또는 같은 화면 폴더)로 `/bp:plan`을 다시 실행하면:

```
기존 intake.md 발견 → "어떻게 처리할까요?" 인터뷰
  ① 신규 화면 추가 (기존은 건드리지 않음)
  ② 부분 수정 (변경된 슬롯만 식별 → 영향 받는 산출물만 재생성)
  ③ 전체 재검토 (모든 슬롯을 다시 인터뷰)
```

부분 수정 시 planner는 변경된 슬롯이 닿는 산출물(feature/screen/wireframe)을 자동 식별해 사용자에게 "이거 같이 처리할까요?" 컨펌을 받는다.

## intake와 산출물의 관계

intake.md는 **작업 노트**이지 산출물이 아니다. 다음 산출물을 만드는 입력일 뿐:

| intake 슬롯 | 흘러가는 산출물 |
|---|---|
| 무엇을·누가·왜 | screen.md `purpose`, area_*.md 유저스토리 컨텍스트 |
| 유저스토리 | screen.md `## 유저스토리`(루트), area_*.md `## 유저스토리`(영역) |
| 보여야 할 정보 | feature spec(도메인 신설/보강), screen.md `features[]`, area_*.md `features[]` |
| 동작·인터랙션 | screen.md `## 인터랙션`, area_*.md `## 인터랙션` |
| 상태 (로딩·빈·에러) | screen.md `## 상태`, area_*.md elements |
| 예외 케이스 | screen.md `## 예외 케이스`, area_*.md `## 예외 케이스` |
| viewport | screen.md frontmatter `viewport`, wireframer가 파일 분기 |
| 시트·다이얼로그 | sheet_*.md, dialog_*.md 파일 생성 |
| 진입 경로 · 참고·메모 | screen.md `## 진입 경로`, screen.md `## 비고` |

intake는 git에 커밋한다. 재실행·디버깅·산출물 추적의 단일 출처.

## 자주 하는 실수

| 실수 | 왜 문제인가 |
|------|------------|
| 빈 슬롯을 그냥 두고 status를 `ready`로 표시 | planner의 인터뷰 트리거가 무력화된다. 빈 칸은 반드시 인터뷰로 채워야 한다 |
| intake.md에 산출물(feature 규칙·element)을 직접 작성 | intake는 작업 노트. SSOT는 feature spec / screen spec. intake를 두껍게 쓰지 말고 슬롯에 맞춰 가볍게 |
| 유저스토리에 우선순위 라벨 누락 | Must/Should/Could 없으면 릴리스 범위 협상 불가. 슬롯 2번의 핵심 |
| `## 상태`와 `## 예외 케이스`를 한 슬롯에 섞기 | 상태(정상 흐름의 UI 뷰)와 예외(외부 실패)는 책임이 다르다. screen-spec 단계에서 분리되므로 intake에서도 분리 |
| viewport를 자연어로 ("PC하고 모바일") | 배열 형식(`[pc, mobile]`)으로 적어야 wireframer가 그대로 사용 가능 |
| 같은 요구사항 md로 재실행 시 기존 intake.md 무시 | 재실행 정책(신규/부분수정/전체재검토)을 항상 사용자에게 묻고 진행 |
| `_pending_decisions` 섹션을 10번째 슬롯처럼 취급 | 메타 섹션이라 인터뷰로 채우지 않음. planner 가 α 재진입 프로토콜로 자동 기록 |
| 기획자 facing 메시지에 `awaiting_decision` / `_pending_decisions` / `priority: blocking` 등 노출 | 시스템 언어는 기획자에게 보이지 않게. 결정이 필요하면 기획자 언어로 번역해 질문 |
| planner 가 `_pending_decisions` 에 자연어 질문을 직접 쓰거나 최종 출력에 질문 문장을 담음 | 0.3.0 옵션 B: 번역은 오케스트레이터 소유. planner 는 payload 필드만 기록 |
| payload 에 `planner_context` / `user_facing_why` / `priority` 생략 | 오케스트레이터가 기획자 질문을 자연스럽게 만들 수 없음. 스키마 필수 필드는 반드시 채움 |
