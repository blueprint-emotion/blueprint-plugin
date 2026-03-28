# Example: Product Listing Page (Multi-Feature, Sidebar Layout)

This example demonstrates a **multi-feature screen** with sidebar + main grid layout.
Compare with [EXAMPLE.md](EXAMPLE.md) (single-feature, card-centered) and [LAYOUT-GUIDE.md](LAYOUT-GUIDE.md) (5-region editor).

## Table of Contents

- [Step 1: Feature Specs](#step-1-feature-specs)
- [Step 2: Screen Spec](#step-2-screen-spec)
- [Step 3: Generated Wireframe](#step-3-generated-wireframe)
- [Key Patterns](#key-patterns)

## Step 1: Feature Specs

### docs/features/search-filter.md

```markdown
---
featureId: SEARCH_FILTER
label: 검색/필터
type: section
usedIn:
  - docs/screens/PRODUCT_LIST.md
---

# 검색/필터

## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 카테고리 필터 | list | 상품 카테고리 체크박스 목록 |
| 가격 범위 | input | 최소~최대 가격 입력 필드 |
| 필터 적용 버튼 | button | 선택한 필터를 적용하는 버튼 |
| 필터 초기화 | link | 모든 필터를 초기 상태로 되돌리는 링크 |

## 상태

| 상태 | 설명 |
|------|------|
| 기본 | 모든 카테고리 선택 해제, 가격 범위 비어있음 |
| 필터 적용 중 | 선택된 카테고리 하이라이트, 가격 범위 표시 |

## 인터랙션

- 카테고리 체크 → 즉시 상품 목록 필터링
- 가격 범위 입력 → 필터 적용 버튼 클릭 시 반영
- 필터 초기화 클릭 → 모든 필터 해제 + 전체 상품 표시
```

### docs/features/product-list.md

```markdown
---
featureId: PRODUCT_LIST
label: 상품 목록
type: section
usedIn:
  - docs/screens/PRODUCT_LIST.md
---

# 상품 목록

## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 정렬 선택 | select | 인기순, 최신순, 가격순 정렬 드롭다운 |
| 상품 카드 | list | 상품 이미지, 이름, 가격, 평점을 보여주는 카드 그리드 |
| 페이지네이션 | button | 이전/다음 페이지 이동 버튼 |

## 상태

| 상태 | 설명 |
|------|------|
| 기본 | 상품 카드 그리드 표시, 인기순 정렬 |
| 빈 상태 | "검색 결과가 없습니다" 메시지 + 필터 초기화 안내 |
| 로딩 | 스켈레톤 카드 UI (6개) |

## 인터랙션

- 정렬 변경 → 상품 목록 재정렬
- 상품 카드 클릭 → 상품 상세 화면으로 이동
- 페이지 버튼 클릭 → 해당 페이지 상품 로드
```

## Step 2: Screen Spec

`docs/screens/PRODUCT_LIST.md`

```markdown
---
screenId: PRODUCT_LIST
title: 상품 목록
purpose: 사용자가 카테고리와 가격으로 상품을 필터링하고 원하는 상품을 찾는 화면
viewport: pc
---

# 상품 목록

## 레이아웃

1. 상단 헤더 — 로고, 검색바, 장바구니 아이콘, 프로필
2. 좌측 사이드바 — [@search-filter](../features/search-filter.md)
3. 메인 영역 — [@product-list](../features/product-list.md)
```

## Step 3: Generated Wireframe

`docs/wireframes/PRODUCT_LIST.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>상품 목록</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "PRODUCT_LIST",
    "title": "상품 목록",
    "viewport": "pc",
    "purpose": "사용자가 카테고리와 가격으로 상품을 필터링하고 원하는 상품을 찾는 화면",
    "elements": [
      {
        "id": "FEATURE_SEARCH_FILTER_CATEGORY",
        "featureId": "SEARCH_FILTER",
        "type": "list",
        "label": "카테고리 필터",
        "description": "상품 카테고리 체크박스 목록",
        "spec": "../features/search-filter.md"
      },
      {
        "id": "FEATURE_SEARCH_FILTER_PRICE",
        "featureId": "SEARCH_FILTER",
        "type": "input",
        "label": "가격 범위",
        "description": "최소~최대 가격 입력 필드",
        "spec": "../features/search-filter.md"
      },
      {
        "id": "FEATURE_SEARCH_FILTER_APPLY",
        "featureId": "SEARCH_FILTER",
        "type": "button",
        "label": "필터 적용 버튼",
        "description": "선택한 필터를 적용하는 버튼",
        "spec": "../features/search-filter.md"
      },
      {
        "id": "FEATURE_SEARCH_FILTER_RESET",
        "featureId": "SEARCH_FILTER",
        "type": "link",
        "label": "필터 초기화",
        "description": "모든 필터를 초기 상태로 되돌리는 링크",
        "spec": "../features/search-filter.md"
      },
      {
        "id": "FEATURE_PRODUCT_LIST_SORT",
        "featureId": "PRODUCT_LIST",
        "type": "select",
        "label": "정렬 선택",
        "description": "인기순, 최신순, 가격순 정렬 드롭다운",
        "spec": "../features/product-list.md"
      },
      {
        "id": "FEATURE_PRODUCT_LIST_CARDS",
        "featureId": "PRODUCT_LIST",
        "type": "list",
        "label": "상품 카드",
        "description": "상품 이미지, 이름, 가격, 평점을 보여주는 카드 그리드",
        "spec": "../features/product-list.md"
      },
      {
        "id": "FEATURE_PRODUCT_LIST_PAGINATION",
        "featureId": "PRODUCT_LIST",
        "type": "button",
        "label": "페이지네이션",
        "description": "이전/다음 페이지 이동 버튼",
        "spec": "../features/product-list.md"
      }
    ]
  }
  </script>
</head>
<body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
  <div class="flex flex-col h-screen">

    <!-- Fixed: Header (no data-feature) -->
    <header class="h-14 px-6 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
        <span class="font-semibold">ShopName</span>
      </div>
      <div class="flex-1 max-w-md mx-6">
        <input class="w-full h-9 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" placeholder="상품 검색..." readonly />
      </div>
      <div class="flex items-center gap-4">
        <div class="w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <div class="w-8 h-8 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">

      <!-- Left sidebar: Search/Filter -->
      <aside class="w-64 border-r border-zinc-200 dark:border-zinc-700 p-5 overflow-y-auto bg-white dark:bg-zinc-800">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold">필터</span>
          <a href="#" class="text-xs text-zinc-500 dark:text-zinc-400 hover:underline" data-feature="FEATURE_SEARCH_FILTER_RESET">초기화</a>
        </div>

        <div class="flex flex-col gap-5">
          <!-- Category filter -->
          <div data-feature="FEATURE_SEARCH_FILTER_CATEGORY">
            <div class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">카테고리</div>
            <div class="flex flex-col gap-2">
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600" checked disabled />
                전자기기
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600" disabled />
                의류
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600" disabled />
                식품
              </label>
              <label class="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" class="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600" disabled />
                도서
              </label>
            </div>
          </div>

          <!-- Price range -->
          <div data-feature="FEATURE_SEARCH_FILTER_PRICE">
            <div class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">가격 범위</div>
            <div class="flex items-center gap-2">
              <input class="h-9 w-full px-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" placeholder="최소" readonly />
              <span class="text-zinc-400">~</span>
              <input class="h-9 w-full px-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" placeholder="최대" readonly />
            </div>
          </div>

          <!-- Apply button -->
          <button class="h-9 w-full text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md" data-feature="FEATURE_SEARCH_FILTER_APPLY">
            필터 적용
          </button>
        </div>
      </aside>

      <!-- Main: Product list -->
      <main class="flex-1 p-6 overflow-y-auto">
        <!-- Sort + count -->
        <div class="flex items-center justify-between mb-5">
          <span class="text-sm text-zinc-500 dark:text-zinc-400">총 128개 상품</span>
          <div data-feature="FEATURE_PRODUCT_LIST_SORT">
            <select class="h-9 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" disabled>
              <option>인기순</option>
              <option>최신순</option>
              <option>가격 낮은순</option>
              <option>가격 높은순</option>
            </select>
          </div>
        </div>

        <!-- Product card grid -->
        <div class="grid grid-cols-3 gap-4" data-feature="FEATURE_PRODUCT_LIST_CARDS">
          <!-- Card 1 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">무선 블루투스 이어폰</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩45,000</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★★☆</span>
              <span class="text-xs text-zinc-400">(234)</span>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">스마트 워치 프로</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩189,000</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★★★</span>
              <span class="text-xs text-zinc-400">(89)</span>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">USB-C 충전 케이블</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩12,900</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★★☆</span>
              <span class="text-xs text-zinc-400">(1,024)</span>
            </div>
          </div>
          <!-- Card 4 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">노이즈 캔슬링 헤드폰</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩320,000</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★★★</span>
              <span class="text-xs text-zinc-400">(567)</span>
            </div>
          </div>
          <!-- Card 5 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">미니 보조 배터리</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩29,900</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★☆☆</span>
              <span class="text-xs text-zinc-400">(412)</span>
            </div>
          </div>
          <!-- Card 6 -->
          <div class="flex flex-col gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800">
            <div class="w-full aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
            <span class="text-sm font-semibold truncate">키보드 기계식 텐키리스</span>
            <span class="text-sm text-zinc-500 dark:text-zinc-400">₩89,000</span>
            <div class="flex items-center gap-1">
              <span class="text-xs text-zinc-400">★★★★☆</span>
              <span class="text-xs text-zinc-400">(178)</span>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-2 mt-6" data-feature="FEATURE_PRODUCT_LIST_PAGINATION">
          <button class="h-9 px-3 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md">이전</button>
          <button class="h-9 w-9 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md">1</button>
          <button class="h-9 w-9 text-sm text-zinc-500 dark:text-zinc-400">2</button>
          <button class="h-9 w-9 text-sm text-zinc-500 dark:text-zinc-400">3</button>
          <span class="text-zinc-400">...</span>
          <button class="h-9 w-9 text-sm text-zinc-500 dark:text-zinc-400">12</button>
          <button class="h-9 px-3 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md">다음</button>
        </div>
      </main>

    </div>
  </div>
</body>
</html>
```

## Key Patterns

1. **Two features in one screen**: `SEARCH_FILTER` (sidebar) and `PRODUCT_LIST` (main) are separate feature specs, each with their own `featureId` and `spec` path
2. **Fixed header**: Top bar has no `data-feature`, not in metadata — it's UI chrome (logo, search bar, cart icon)
3. **Sidebar + main layout**: `flex flex-1 overflow-hidden` for horizontal split, sidebar with fixed `w-64`, main with `flex-1`
4. **Grid layout**: `grid grid-cols-3 gap-4` for product cards — a common pattern for list/card-type features
5. **Multiple tracked elements per feature**: `SEARCH_FILTER` has 4 elements (category, price, apply, reset), `PRODUCT_LIST` has 3 elements (sort, cards, pagination)
6. **Placeholder images**: `aspect-square bg-zinc-200 dark:bg-zinc-700 rounded-md` for product thumbnails
7. **All dark: variants present**: Every color class has its `dark:` counterpart
