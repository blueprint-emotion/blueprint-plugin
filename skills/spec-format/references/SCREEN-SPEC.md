# 예제: 화면 명세 — LOGIN

단일 feature 화면과 다중 feature 화면의 intake + 화면명세 2가지를 보여준다.

---

## 예제 1: 단일 feature 화면

`docs/screens/LOGIN/login_intake.md`

```markdown
## 화면 목적

사용자가 이메일과 비밀번호로 서비스에 로그인한다.

## 핵심 행동

- 이메일과 비밀번호를 입력한다
- 로그인 시도 결과를 확인한다

## 화면 구성

- 단일 포커스 로그인 카드

## 모달

없음

## 특수 인터랙션

없음

## viewport

pc

## 제약사항

- 반복 로그인 실패 시 계정 잠금 안내가 필요하다
```

---

`docs/screens/LOGIN/login_screen.md`

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
features: [AUTH]
---

## Screen

### 레이아웃

1. 전체 화면 — @AUTH/LOGIN

## Requirement

### 인증 — @AUTH/LOGIN
- Given 이메일과 비밀번호 입력 완료 When 로그인 버튼 클릭 Then 다음 화면으로 이동한다
- Given 이메일 형식이 유효하지 않음 When 로그인 버튼 클릭 Then 입력 필드에 에러 메시지가 표시된다
- Given 반복 로그인 실패로 계정이 잠긴 상태 When 로그인 시도 Then 계정 잠금 안내 메시지가 표시된다

## UserStory

### 인증 — @AUTH/LOGIN
- 사용자로서 이메일과 비밀번호로 로그인하고 싶다, 내 계정에 접근하기 위해
- 사용자로서 로그인 실패 시 원인을 알고 싶다, 올바른 정보를 다시 입력하기 위해
```

---

## 예제 2: 다중 feature 화면

`docs/screens/PRODUCT-LIST/product-list_intake.md`

```markdown
## 화면 목적

사용자가 카테고리와 가격으로 상품을 필터링하고 원하는 상품을 찾는다.

## 핵심 행동

- 카테고리와 가격 조건으로 상품을 좁혀 본다
- 정렬 기준을 바꿔 상품을 비교한다
- 결과가 없을 때 조건을 다시 조정한다

## 화면 구성

- 상단 헤더
- 좌측 사이드바 필터
- 메인 목록 영역
- 하단 푸터

## 모달

없음

## 특수 인터랙션

없음

## viewport

pc

## 제약사항

없음
```

---

`docs/screens/PRODUCT-LIST/product-list_screen.md`

```markdown
---
screenId: PRODUCT-LIST
title: 상품 목록
purpose: 사용자가 카테고리와 가격으로 상품을 필터링하고 원하는 상품을 찾는 화면
viewport: pc
features: [PRODUCT]
---

## Screen

### 레이아웃

1. 상단 헤더 — 로고, 검색 입력, 장바구니, 프로필
2. 좌측 사이드바 — @PRODUCT/SEARCH_FILTER
3. 메인 목록 영역 — @PRODUCT/LIST
4. 하단 푸터

## Requirement

### 검색 및 필터 — @PRODUCT/SEARCH_FILTER
- Given 카테고리와 가격 범위를 선택 When 필터 적용 버튼 클릭 Then 조건이 상품 목록에 반영된다
- Given 필터가 적용된 상태 When 필터 초기화 클릭 Then 기본 목록으로 돌아간다

### 상품 목록 탐색 — @PRODUCT/LIST
- Given 상품 목록이 존재 When 사용자가 정렬 기준을 변경 Then 동일한 결과 집합이 새 순서로 다시 표시된다
- Given 조건에 맞는 상품이 없음 When 목록 조회 완료 Then 상품 카드 대신 빈 상태 안내가 표시된다

## UserStory

### 검색 및 필터 — @PRODUCT/SEARCH_FILTER
- 사용자로서 카테고리와 가격 조건으로 상품을 좁혀 보고 싶다, 원하는 상품만 빠르게 찾기 위해

### 상품 목록 탐색 — @PRODUCT/LIST
- 사용자로서 정렬 기준을 바꾸며 상품을 비교하고 싶다, 내 기준에 맞는 상품을 고르기 위해
- 사용자로서 검색 결과가 없을 때 현재 조건이 너무 좁은지 바로 파악하고 싶다, 조건을 다시 조정하기 위해
```

---

## 핵심 패턴

| 패턴 | 예제 1 (LOGIN) | 예제 2 (PRODUCT-LIST) |
|------|-------------------|--------------------------|
| intake 선행 입력 | `login_intake.md` 생성 후 `login_screen.md` 작성 | `product-list_intake.md` 생성 후 `product-list_screen.md` 작성 |
| screenId 형식 | `LOGIN` | `PRODUCT-LIST` |
| features 배열 | `[AUTH]` — 단일 도메인 | `[PRODUCT]` — 단일 도메인 내 여러 기능 |
| 레이아웃 참조 | `@AUTH/LOGIN` | `@PRODUCT/SEARCH_FILTER`, `@PRODUCT/LIST` |
| 고정 영역 | 없음 (단일 포커스) | 헤더 (기능 참조 없이 텍스트로 기술) |
| Requirement 그룹 | `### 인증 — @AUTH/LOGIN` | `### 검색 및 필터 — @PRODUCT/SEARCH_FILTER`, `### 상품 목록 탐색 — @PRODUCT/LIST` |
| Given-When-Then | 각 인수조건에 적용 | 각 인수조건에 적용 |
| UserStory 형식 | `{역할}으로서 {행동}하고 싶다, {목적}을 위해` | 동일 |
| viewport | `pc` (단일) | `pc` (단일) |

### 다중 뷰포트일 경우

```yaml
viewport: [pc, mobile]
```

이 경우 `## Screen` 아래에 `### 레이아웃 (PC)`, `### 레이아웃 (Mobile)`를 각각 둔다:

```markdown
### 레이아웃 (PC)
1. 좌측 사이드바 — @PRODUCT/SEARCH_FILTER
2. 메인 목록 영역 — @PRODUCT/LIST

### 레이아웃 (Mobile)
1. 상단 필터 토글 — @PRODUCT/SEARCH_FILTER
2. 전체 화면 목록 — @PRODUCT/LIST
```

와이어프레임 출력: `product-list_wireframe-pc.html`, `product-list_wireframe-mobile.html`
