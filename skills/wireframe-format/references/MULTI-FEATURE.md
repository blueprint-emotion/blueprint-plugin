# 예제: 다중 feature 화면 — 상품 목록

> 이 예제는 최종 출력 규격을 따르는 완전한 예시입니다.

사이드바(필터) + 메인(목록) 두 영역 레이아웃. 고정 영역(헤더/푸터)과 빈 상태 상태 탭을 포함한다. 입력 세트에는 intake를 포함한다.

---

## 입력 1: 기능 명세

`docs/features/PRODUCT.md`

```markdown
---
domain: PRODUCT
label: 상품
toc:
  - id: SEARCH_FILTER
    label: 검색/필터
  - id: LIST
    label: 상품 목록
---

# 상품

## 검색/필터

### 와이어프레임 요소

| id | 요소 | type | 설명 |
|----|------|------|------|
| CATEGORY | 카테고리 필터 | list | 상품 카테고리 체크박스 목록 |
| PRICE | 가격 범위 | input | 최소~최대 가격 입력 필드 |
| APPLY | 필터 적용 버튼 | button | 선택한 조건을 목록에 반영하는 실행 버튼 |
| RESET | 필터 초기화 | link | 적용된 필터를 모두 해제하는 링크 |

### 상태

| 상태 | 설명 |
|------|------|
| 기본 | 모든 필터 비활성, 전체 목록 조회 상태 |
| 필터 적용 중 | 일부 카테고리 선택, 가격 범위 입력 완료 |

### 인터랙션

- 카테고리 체크 → 목록 조건 즉시 변경
- 가격 범위 입력 → 필터 적용 버튼 클릭 시 반영
- 필터 초기화 클릭 → 모든 필터 해제

## 상품 목록

### 와이어프레임 요소

| id | 요소 | type | 설명 |
|----|------|------|------|
| SORT | 정렬 선택 | select | 인기순, 최신순, 가격순 정렬 드롭다운 |
| CARDS | 상품 카드 | list | 상품 이미지, 이름, 가격, 평점을 보여주는 카드 그리드 |
| PAGINATION | 페이지네이션 | button | 이전/다음 페이지 이동 버튼 |

### 상태

| 상태 | 설명 |
|------|------|
| 기본 | 상품 카드 그리드 표시, 인기순 정렬 |
| 빈 상태 | "검색 결과가 없습니다" 메시지와 조건 재확인 안내 |

### 인터랙션

- 정렬 변경 → 상품 목록 재정렬
- 상품 카드 클릭 → 상품 상세 화면으로 이동
- 페이지 버튼 클릭 → 다음 결과 페이지 조회
```

---

## 입력 2: intake

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

## 입력 3: 화면 명세

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

1. 상단 헤더
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

## 출력: 와이어프레임 HTML

`docs/screens/PRODUCT-LIST/product-list_wireframe.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>상품 목록</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/bp-platform.js"></script>

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <!-- @META -->
  <script type="application/json" id="blueprint-meta">
  {
    "generator": "blueprint-wireframe-skill",
    "version": "2.0",
    "type": "screen",
    "screenId": "PRODUCT-LIST",
    "title": "상품 목록",
    "viewport": "pc",
    "purpose": "사용자가 카테고리와 가격으로 상품을 필터링하고 원하는 상품을 찾는 화면",
    "features": [
      {
        "featureId": "PRODUCT",
        "label": "상품",
        "features": [
          {
            "featureId": "PRODUCT__SEARCH_FILTER",
            "label": "검색/필터",
            "elements": [
              { "id": "CATEGORY", "type": "list", "label": "카테고리 필터", "description": "사용자가 관심 상품 카테고리만 남기도록 체크박스 조건을 조정하는 필터 목록" },
              { "id": "PRICE", "type": "input", "label": "가격 범위", "description": "예산 구간만 조회되도록 최소 가격과 최대 가격을 입력하는 필터 영역" },
              { "id": "APPLY", "type": "button", "label": "필터 적용 버튼", "description": "선택한 카테고리와 가격 조건을 실제 목록 조회 결과에 반영하는 실행 버튼" },
              { "id": "RESET", "type": "link", "label": "필터 초기화", "description": "현재 적용된 필터 조건을 모두 제거하고 전체 상품 목록으로 되돌리는 초기화 링크" }
            ]
          },
          {
            "featureId": "PRODUCT__LIST",
            "label": "상품 목록",
            "elements": [
              { "id": "SORT", "type": "select", "label": "정렬 선택", "description": "인기순, 최신순, 가격순 중 하나를 골라 같은 결과 집합의 우선순위를 바꾸는 정렬 선택 영역" },
              { "id": "CARDS", "type": "list", "label": "상품 카드", "description": "상품 이미지, 이름, 가격, 평점을 카드 단위로 보여 주는 메인 결과 목록" },
              { "id": "PAGINATION", "type": "button", "label": "페이지네이션", "description": "현재 결과 페이지를 기준으로 이전이나 다음 결과 묶음으로 이동하는 하단 제어 영역" }
            ]
          }
        ]
      }
    ]
  }
  </script>
  <!-- @END:META -->
</head>
<body class="bg-zinc-100 dark:bg-zinc-950 p-8">
  <div class="mx-auto min-w-[1280px] min-h-[calc(100vh-4rem)] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">

    <!-- @SLOT:header -->
    <header class="flex h-10 items-center rounded-t-xl border-b border-zinc-200 px-5 dark:border-zinc-700">
      <span class="text-xs text-zinc-300 dark:text-zinc-600">Header</span>
    </header>
    <!-- @END:header -->

    <!-- PRODUCT: 루트 feature 래퍼 (elements 없음, features만) -->
    <div data-feature="PRODUCT" data-label="상품" class="flex flex-1">

      <!-- @SLOT:sidebar -->
      <!-- PRODUCT__SEARCH_FILTER -->
      <aside data-feature="PRODUCT__SEARCH_FILTER" data-label="검색/필터"
             class="w-60 border-r border-zinc-200 p-4 dark:border-zinc-700">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-zinc-500 uppercase dark:text-zinc-400">필터</span>
          <a class="text-xs text-zinc-400 hover:underline dark:text-zinc-500" href="#" data-el="RESET">초기화</a>
        </div>

        <div class="mt-4 flex flex-col gap-4">
          <div data-el="CATEGORY">
            <div class="mb-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">카테고리</div>
            <div class="flex flex-col gap-1.5">
              <label class="flex items-center gap-2 text-sm"><input class="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-600" type="checkbox" checked disabled /> 전자기기</label>
              <label class="flex items-center gap-2 text-sm"><input class="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-600" type="checkbox" disabled /> 의류</label>
              <label class="flex items-center gap-2 text-sm"><input class="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-600" type="checkbox" disabled /> 생활용품</label>
              <label class="flex items-center gap-2 text-sm"><input class="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-600" type="checkbox" disabled /> 도서</label>
            </div>
          </div>

          <div data-el="PRICE">
            <div class="mb-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500">가격 범위</div>
            <div class="flex items-center gap-1.5">
              <input class="h-8 w-full rounded-md border border-zinc-200 bg-transparent px-2 text-xs dark:border-zinc-700" type="text" value="30,000" readonly />
              <span class="text-xs text-zinc-300 dark:text-zinc-600">~</span>
              <input class="h-8 w-full rounded-md border border-zinc-200 bg-transparent px-2 text-xs dark:border-zinc-700" type="text" value="200,000" readonly />
            </div>
          </div>

          <button class="h-8 rounded-md bg-zinc-800 text-xs font-medium text-white dark:bg-zinc-200 dark:text-zinc-900" data-el="APPLY">
            필터 적용
          </button>
        </div>
      </aside>
      <!-- @END:sidebar -->

      <!-- @SLOT:content -->
      <!-- PRODUCT__LIST: data-state로 상태 탭 자동 생성 -->
      <main class="flex-1 p-5">
        <div data-feature="PRODUCT__LIST" data-label="상품 목록">

          <div data-state="기본">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs text-zinc-400 dark:text-zinc-500">총 128개 상품</span>
              <div data-el="SORT">
                <select class="h-8 rounded-md border border-zinc-200 bg-transparent px-2 text-xs dark:border-zinc-700" disabled>
                  <option>인기순</option>
                  <option>최신순</option>
                  <option>가격 낮은순</option>
                  <option>가격 높은순</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-4 gap-3" data-el="CARDS">
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">무선 블루투스 이어폰</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;45,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9734; (234)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">스마트 워치 프로</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;189,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9733; (89)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">USB-C 충전 케이블</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;12,900</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9734; (1,024)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">노이즈 캔슬링 헤드폰</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;320,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9733; (567)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">미니 보조 배터리</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;29,900</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9734;&#9734; (412)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">기계식 텐키리스 키보드</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;89,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9734; (178)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">무선 충전 패드</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;25,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9734;&#9734; (98)</span>
                </div>
              </div>
              <div class="rounded-lg border border-zinc-100 p-2.5 dark:border-zinc-800">
                <div class="aspect-[4/3] rounded-md bg-zinc-100 dark:bg-zinc-800"></div>
                <div class="mt-2 flex flex-col gap-0.5">
                  <span class="text-sm font-medium">포터블 블루투스 스피커</span>
                  <span class="text-xs text-zinc-500 dark:text-zinc-400">&#8361;67,000</span>
                  <span class="text-[11px] text-zinc-300 dark:text-zinc-600">&#9733;&#9733;&#9733;&#9733;&#9734; (312)</span>
                </div>
              </div>
            </div>

            <div class="mt-5 flex items-center justify-center gap-1.5" data-el="PAGINATION">
              <button class="h-8 rounded-md border border-zinc-200 px-2.5 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">이전</button>
              <button class="h-8 w-8 rounded-md bg-zinc-800 text-xs font-medium text-white dark:bg-zinc-200 dark:text-zinc-900">1</button>
              <button class="h-8 w-8 text-xs text-zinc-400 dark:text-zinc-500">2</button>
              <button class="h-8 w-8 text-xs text-zinc-400 dark:text-zinc-500">3</button>
              <span class="text-xs text-zinc-300 dark:text-zinc-600">...</span>
              <button class="h-8 w-8 text-xs text-zinc-400 dark:text-zinc-500">12</button>
              <button class="h-8 rounded-md border border-zinc-200 px-2.5 text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">다음</button>
            </div>
          </div>

          <div data-state="결과 없음">
            <div class="mb-4 flex items-center justify-between">
              <span class="text-xs text-zinc-400 dark:text-zinc-500">총 0개 상품</span>
              <div data-el="SORT">
                <select class="h-8 rounded-md border border-zinc-200 bg-transparent px-2 text-xs dark:border-zinc-700" disabled>
                  <option>인기순</option>
                </select>
              </div>
            </div>

            <div data-el="CARDS" class="rounded-lg border border-dashed border-zinc-200 p-10 text-center dark:border-zinc-700">
              <div class="mx-auto h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800"></div>
              <div class="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">검색 결과가 없습니다</div>
              <p class="mt-1 text-xs text-zinc-400 dark:text-zinc-500">현재 필터 조건을 다시 확인하거나 일부 조건을 해제해 보세요.</p>
            </div>
          </div>

        </div>
      </main>
      <!-- @END:content -->

    </div>

    <!-- @SLOT:footer -->
    <footer class="flex h-10 items-center rounded-b-xl border-t border-zinc-200 px-5 dark:border-zinc-700">
      <span class="text-xs text-zinc-300 dark:text-zinc-600">Footer</span>
    </footer>
    <!-- @END:footer -->

  </div>
</body>
</html>
```

---

## 핵심 패턴

| 패턴 | 이 예제에서 |
|------|-----------|
| 한 도메인에 여러 L1 기능 | `PRODUCT` 도메인 안에 `SEARCH_FILTER`, `LIST` 두 기능 |
| featureId 파생 | `domain: PRODUCT` + `id: SEARCH_FILTER` → `PRODUCT__SEARCH_FILTER` |
| 두 영역 레이아웃 | 사이드바(`SEARCH_FILTER`) + 메인(`LIST`). 메인이 시각적 중심 |
| 캔버스 프레임 | `bg-zinc-100 p-8` + `rounded-xl border shadow-sm` 컨테이너 |
| 고정 영역 | 헤더/푸터에 `data-feature` 없음. 기본 라벨만 표시 |
| 상태 탭 (data-state) | `LIST`에 `data-state="기본"`, `data-state="결과 없음"` — bp-platform.js가 자동 탭 생성 |
| element는 짧은 키 | `data-el="CATEGORY"`, `data-el="SORT"` — 각각 부모 feature 스코프 내 유니크 |
| 상태 패널 내 data-el 재사용 | `SORT`, `CARDS`가 두 패널에 존재 — 상호배타이므로 허용 |
| description은 비즈니스 의미 | "사용자가 관심 상품 카테고리만 남기도록…" — 단순 라벨이 아닌 역할 설명 |
| bp-platform.js | 호버 하이라이트 + 상태 탭 자동 처리. `<style>`에는 다크모드만 |
| 화면 참조 문법 | `@PRODUCT/SEARCH_FILTER`, `@PRODUCT/LIST` |
