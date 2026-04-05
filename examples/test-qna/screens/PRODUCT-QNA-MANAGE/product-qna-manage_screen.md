---
screenId: PRODUCT-QNA-MANAGE
title: 상품 Q&A 관리
purpose: 관리자가 상품 문의를 조회하고 답변을 관리하는 화면
viewport: pc
features: [QNA]
---

## Screen

### 레이아웃

1. 상단 탭 네비게이션 — 상품관리 메뉴 탭
2. 필터 영역 — @QNA/LIST/FILTER
3. 목록 테이블 — @QNA/LIST/TABLE
4. 하단 페이지네이션

## Requirement

### 필터 — @QNA/LIST/FILTER
- Given 필터 영역이 표시됨 When 문의 유형을 선택 Then 해당 유형의 문의만 목록에 표시된다
- Given 필터 영역이 표시됨 When 답변 상태를 선택 Then 해당 상태의 문의만 목록에 표시된다
- Given 필터 영역이 표시됨 When 기간을 설정 Then 해당 기간의 문의만 목록에 표시된다
- Given 필터 영역이 표시됨 When 검색어를 입력하고 검색 버튼 클릭 Then 상품명 또는 문의 내용에 검색어가 포함된 문의가 표시된다
- Given 필터가 적용된 상태 When 초기화 버튼 클릭 Then 모든 필터가 해제되고 전체 목록이 표시된다

### 목록 테이블 — @QNA/LIST/TABLE
- Given 문의 목록이 표시됨 When 행을 클릭 Then 해당 문의의 상세 내용이 펼쳐진다
- Given 문의 상세가 펼쳐짐 When 답변 작성 버튼 클릭 Then 답변 입력 영역이 표시된다
- Given 체크박스로 여러 문의를 선택 When 일괄 삭제 버튼 클릭 Then 선택된 문의가 삭제 처리된다
- Given 목록이 표시됨 When 컬럼 헤더 클릭 Then 해당 컬럼 기준으로 정렬된다

### 답변 관리 — @QNA/REPLY
- Given 답변 입력 영역이 표시됨 When 답변을 작성하고 등록 버튼 클릭 Then 답변이 저장되고 문의 상태가 변경된다
- Given 이미 답변이 등록된 문의 When 답변 수정 버튼 클릭 Then 답변 수정 영역이 표시된다
- Given 답변이 등록된 문의 When 답변 삭제 버튼 클릭 Then 답변이 삭제되고 문의 상태가 복원된다

## UserStory

### 필터 — @QNA/LIST/FILTER
- 관리자로서 미답변 문의만 필터링하고 싶다, 우선 처리할 문의를 빠르게 찾기 위해
- 관리자로서 특정 상품의 문의만 검색하고 싶다, 해당 상품 관련 이슈를 파악하기 위해

### 목록 테이블 — @QNA/LIST/TABLE
- 관리자로서 문의 목록에서 바로 상세 내용을 확인하고 싶다, 페이지 이동 없이 빠르게 답변하기 위해
- 관리자로서 여러 문의를 한 번에 삭제하고 싶다, 스팸/중복 문의를 효율적으로 정리하기 위해

### 답변 관리 — @QNA/REPLY
- 관리자로서 문의에 답변을 등록하고 싶다, 고객 문의에 응대하기 위해
- 관리자로서 등록한 답변을 수정하고 싶다, 잘못된 내용을 정정하기 위해
