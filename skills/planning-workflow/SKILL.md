---
name: planning-workflow
description: intake 문서를 시작점으로 기획 워크플로우를 오케스트레이션한다. planner 에이전트에게 명세 작성을, wireframer 에이전트에게 와이어프레임 생성을 위임한다. "기획 시작해", "intake 기준으로 기획해", "기획 워크플로우 실행" 등의 요청에 사용한다.
license: MIT
metadata:
  author: flowframehq
  version: "3.0.0"
---

# 기획 워크플로우

intake 문서를 시작점으로 기획 전체 흐름을 오케스트레이션하는 하네스.
이 스킬은 직접 명세를 작성하지 않는다. 단계 순서와 리뷰 게이트를 통제하고, 실행은 에이전트에게 위임한다.

## 위임 구조

```
이 스킬 (하네스)
  ├── planner 에이전트 → 기능명세·화면명세 작성
  ├── reviewer 에이전트 → 명세·와이어프레임 정합성 검증 (읽기 전용)
  └── wireframer 에이전트 → HTML 와이어프레임 생성
```

## 사용 시점

사용한다:
- intake 문서 기준으로 기획을 시작할 때
- 여러 화면을 한 번에 기획할 때
- planner → reviewer → gate 흐름을 실행할 때

사용하지 않는다:
- 기존 명세 하나만 수정할 때 → planner 에이전트 직접 사용
- 와이어프레임만 생성할 때 → wireframer 에이전트 직접 사용

## 시작점

기본 입력: `docs/intake.md`

사용자가 다른 경로를 주면 해당 경로를 사용한다.
intake 파일이 없으면 진행하지 않고 경로를 확인한다.

사용자 명령 예시:
- `intake.md 기준으로 기획 시작해`
- `기획 워크플로우 실행해`

---

## 단계 모델

고정 순서로 실행한다. 단계를 건너뛰지 않는다.

### 1단계. Intake 정규화

intake 문서를 읽고 아래 구조로 정리한다:

- 제품/운영 목표
- 범위에 포함되는 화면
- 범위에서 제외되는 항목
- 사용자 역할
- 주요 작업
- 정책/운영 제약
- 열린 질문

자유형식 문서면 구조화 요약으로 변환한다. 요약이 안정되기 전에 다음 단계로 가지 않는다.

### 2단계. 화면 경계 도출

intake에서 화면 목록을 도출한다. 각 화면 후보:

| 항목 | 내용 |
|------|------|
| screenId | UPPER-KEBAB (번호 없음) |
| 목적 | 한 줄 설명 |
| 핵심 사용자 행동 | 주요 태스크 |
| 관련 도메인 | 참조할 feature 도메인 |
| viewport | pc / mobile / 둘 다 |

화면 목록을 사용자에게 보여주고 확인받는다.

### 3단계. 도메인 구조 도출

화면 목록에서 필요한 기능 도메인을 도출한다:

- 어떤 도메인 파일이 필요한지
- 각 도메인 안에 어떤 기능이 들어가는지 (TOC 초안)
- 여러 화면에서 공유되는 도메인은 무엇인지

도메인 구조를 사용자에게 보여주고 확인받는다.

### 4단계. Spec 작성 (planner 에이전트 위임)

planner 에이전트에게 화면별로 명세 작성을 위임한다.

순서: 공유 도메인 기능 먼저 → 화면별 고유 기능 → 화면 명세

각 화면에 대해 planner가:
1. 책임 단위 분해
2. 기능 명세 작성 (도메인 파일에 추가)
3. 화면 명세 작성 (Screen + Requirement + UserStory)
4. INDEX.md 갱신

### 5단계. Review gate (reviewer 에이전트 위임)

reviewer 에이전트에게 `spec-review`를 위임한다.

1. reviewer 에이전트를 호출하여 4단계에서 작성된 모든 명세를 대상으로 `spec-review` 실행
2. reviewer가 반환한 판정을 확인:
   - **PASS** → 6단계로 진행
   - **FAIL** → `needs_revision` 상태로 멈추고, reviewer의 이슈 목록을 사용자에게 전달
3. `needs_revision`이면 planner 에이전트로 수정을 위임하고, 수정 완료 후 reviewer를 재호출

reviewer가 검증하는 항목 (상세: `agents/reviewer.md`):
- S1~S8: frontmatter, TOC-본문 일치, 와이어프레임 요소, 레이아웃 참조, features 배열, INDEX.md 등

수동 체크리스트 (reviewer가 자동 검증하지 않는 판단 영역):
- [ ] 모든 기능이 경계가 분명한 책임을 갖는가
- [ ] Requirement의 각 항목이 화면이나 기능에 반영되는가
- [ ] 인수조건이 테스트 가능하고 관찰 가능한가

### 6단계. 마무리 + 와이어프레임 핸드오프

review 통과 후:

```
기획 상태: 통과
입력: docs/intake.md

기획된 화면:
- LOGIN: 사용자 로그인
- CHECKOUT: 주문 결제

산출물:
- docs/features/AUTH.md
- docs/features/PAYMENT.md
- docs/screens/LOGIN/login-screen.md
- docs/screens/CHECKOUT/checkout-screen.md

열린 이슈:
- (있으면 나열)

다음 권장 단계:
- 와이어프레임 생성 (wireframer 에이전트)
```

사용자가 동의하면 wireframer 에이전트에게 화면별 와이어프레임 생성을 위임한다.

### 7단계. 와이어프레임 검증 (reviewer 에이전트 위임)

wireframer 완료 후 reviewer 에이전트에게 `wireframe-review`를 위임한다.

1. reviewer 에이전트를 호출하여 생성된 모든 와이어프레임을 대상으로 `wireframe-review` 실행
2. 판정 확인:
   - **PASS** → 완료
   - **FAIL** → 이슈 목록을 사용자에게 전달, wireframer에게 수정 위임

---

## Review gate 상태

- `drafting` — 작성 중
- `needs_revision` — reviewer 리뷰 미통과, planner가 수정 필요
- `spec_passed` — 명세 리뷰 통과, 와이어프레임 진행 가능
- `wireframe_review` — 와이어프레임 생성 완료, reviewer 검증 중
- `completed` — 명세 + 와이어프레임 모두 리뷰 통과

`needs_revision`이면 와이어프레임으로 넘기지 않는다.

## 중단 조건

아래 경우 중단하고 gap report를 출력한다:

- intake 파일이 없을 때
- intake에서 화면 경계를 도출할 수 없을 때
- 어떤 화면이 렌더링 가능한 기능을 참조하지 못할 때
- 인수조건을 테스트 가능하게 만들 수 없을 때
- 같은 책임이 여러 기능에 중복될 때

부족한 내용을 추정해서 채우지 않는다. 정확한 gap report와 함께 멈춘다.

## 가드레일

- intake에 없는 백엔드 정책을 임의로 만들지 않는다
- 여러 사용자 목표를 하나의 거대한 화면으로 합치지 않는다
- 기능을 버튼 수준으로 과도하게 쪼개지 않는다
- 레이아웃 근접성만으로 다른 책임을 하나의 기능으로 뭉치지 않는다
- review gate를 우회하지 않는다
- 사용자에게 하위 스킬을 수동 실행하게 시키지 않는다
