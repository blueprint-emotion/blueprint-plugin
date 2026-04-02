# 예제: 화면 명세 — LOGIN

단일 feature 화면과 다중 feature 화면의 화면명세 2가지를 보여준다.

---

## 예제 1: 단일 feature 화면

`docs/screens/LOGIN/login-screen.md`

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

### 인증
- Given 이메일과 비밀번호 입력 완료 When 로그인 버튼 클릭 Then 인증 요청 후 메인 화면 이동
- Given 이메일 형식 오류 When 로그인 버튼 클릭 Then 이메일 형식 에러 메시지 표시
- Given 5회 연속 로그인 실패 When 6번째 시도 Then 계정 잠금 안내 메시지 표시

## UserStory

### 인증
- 사용자로서 이메일과 비밀번호로 로그인하고 싶다, 내 계정에 접근하기 위해
- 사용자로서 로그인 실패 시 원인을 알고 싶다, 올바른 정보를 다시 입력하기 위해
```

---

## 예제 2: 다중 feature 화면

`docs/screens/PRODUCT-LIST/product-list-screen.md`

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

## Requirement

### 검색 및 필터
- Given 카테고리와 가격 범위를 선택 When 필터 적용 버튼 클릭 Then 조건이 상품 목록에 반영된다
- Given 필터가 적용된 상태 When 필터 초기화 클릭 Then 기본 목록으로 돌아간다

### 상품 목록 탐색
- Given 상품 목록이 존재 When 사용자가 정렬 기준을 변경 Then 동일한 결과 집합이 새 순서로 다시 표시된다
- Given 조건에 맞는 상품이 없음 When 목록 조회 완료 Then 상품 카드 대신 빈 상태 안내가 표시된다

## UserStory

### 검색 및 필터
- 사용자로서 카테고리와 가격 조건으로 상품을 좁혀 보고 싶다, 원하는 상품만 빠르게 찾기 위해

### 상품 목록 탐색
- 사용자로서 정렬 기준을 바꾸며 상품을 비교하고 싶다, 내 기준에 맞는 상품을 고르기 위해
- 사용자로서 검색 결과가 없을 때 현재 조건이 너무 좁은지 바로 파악하고 싶다, 조건을 다시 조정하기 위해
```

---

## 핵심 패턴

| 패턴 | 예제 1 (LOGIN) | 예제 2 (PRODUCT-LIST) |
|------|-------------------|--------------------------|
| screenId 형식 | `LOGIN` | `PRODUCT-LIST` |
| features 배열 | `[AUTH]` — 단일 도메인 | `[PRODUCT]` — 단일 도메인 내 여러 기능 |
| 레이아웃 참조 | `@AUTH/LOGIN` | `@PRODUCT/SEARCH_FILTER`, `@PRODUCT/LIST` |
| 고정 영역 | 없음 (단일 포커스) | 헤더 (기능 참조 없이 텍스트로 기술) |
| Requirement 그룹 | `### 인증` 하나 | `### 검색 및 필터`, `### 상품 목록 탐색` |
| Given-When-Then | 각 인수조건에 적용 | 각 인수조건에 적용 |
| UserStory 형식 | `{역할}으로서 {행동}하고 싶다, {목적}을 위해` | 동일 |
| viewport | `pc` (단일) | `pc` (단일) |

### 다중 뷰포트일 경우

```yaml
viewport: [pc, mobile]
```

이 경우 `### 레이아웃` 아래에 뷰포트별 하위 섹션을 추가:

```markdown
### 레이아웃 (PC)
1. 좌측 사이드바 — @PRODUCT/SEARCH_FILTER
2. 메인 목록 영역 — @PRODUCT/LIST

### 레이아웃 (Mobile)
1. 상단 필터 토글 — @PRODUCT/SEARCH_FILTER
2. 전체 화면 목록 — @PRODUCT/LIST
```

와이어프레임 출력: `product-list-wireframe-pc.html`, `product-list-wireframe-mobile.html`
