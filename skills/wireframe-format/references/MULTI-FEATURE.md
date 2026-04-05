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

(비즈니스 로직 없음 — 화면명세의 Requirement에서 행동 정의)

## 상품 목록

(비즈니스 로직 없음 — 화면명세의 Requirement에서 행동 정의)
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
  <link rel="stylesheet" href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/base.css" />
  <script type="module" src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/bp-components.js"></script>
  <style type="text/tailwindcss">
    @custom-variant dark (&:is(.dark *));
    @theme inline {
      --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      --color-background: var(--background);
      --color-foreground: var(--foreground);
      --color-card: var(--card);
      --color-card-foreground: var(--card-foreground);
      --color-popover: var(--popover);
      --color-popover-foreground: var(--popover-foreground);
      --color-primary: var(--primary);
      --color-primary-foreground: var(--primary-foreground);
      --color-secondary: var(--secondary);
      --color-secondary-foreground: var(--secondary-foreground);
      --color-muted: var(--muted);
      --color-muted-foreground: var(--muted-foreground);
      --color-accent: var(--accent);
      --color-accent-foreground: var(--accent-foreground);
      --color-destructive: var(--destructive);
      --color-border: var(--border);
      --color-input: var(--input);
      --color-ring: var(--ring);
      --radius-sm: calc(var(--radius) * 0.6);
      --radius-md: calc(var(--radius) * 0.8);
      --radius-lg: var(--radius);
      --radius-xl: calc(var(--radius) * 1.4);
      --radius-2xl: calc(var(--radius) * 1.8);
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

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
<body class="bg-background text-foreground font-sans">
  <bp-page description>
    <!-- @SLOT:header -->
    <div slot="header" class="px-6 py-3">
      <span class="text-xs text-muted-foreground">Header</span>
    </div>
    <!-- @END:header -->

    <!-- @SLOT:footer -->
    <div slot="footer" class="px-6 py-3">
      <span class="text-xs text-muted-foreground">Footer</span>
    </div>
    <!-- @END:footer -->

    <!-- PRODUCT -->
    <bp-section data-feature="PRODUCT" data-label="상품" class="flex flex-1">

      <!-- @SLOT:sidebar -->
      <!-- PRODUCT__SEARCH_FILTER -->
      <aside class="w-60 border-r border-border p-4">
        <bp-section data-feature="PRODUCT__SEARCH_FILTER" data-label="검색/필터">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold uppercase text-muted-foreground">필터</span>
            <a class="text-xs text-muted-foreground hover:underline" href="#" data-el="RESET">초기화</a>
          </div>

          <div class="mt-4 flex flex-col gap-4">
            <div data-el="CATEGORY">
              <div class="mb-1.5 text-xs font-medium text-muted-foreground">카테고리</div>
              <div class="flex flex-col gap-1.5">
                <bp-checkbox label="전자기기" checked></bp-checkbox>
                <bp-checkbox label="의류"></bp-checkbox>
                <bp-checkbox label="생활용품"></bp-checkbox>
                <bp-checkbox label="도서"></bp-checkbox>
              </div>
            </div>

            <div data-el="PRICE">
              <div class="mb-1.5 text-xs font-medium text-muted-foreground">가격 범위</div>
              <div class="flex items-center gap-1.5">
                <bp-input type="text" value="30,000" />
                <span class="text-xs text-muted-foreground">~</span>
                <bp-input type="text" value="200,000" />
              </div>
            </div>

            <bp-button data-el="APPLY">필터 적용</bp-button>
          </div>
        </bp-section>
      </aside>
      <!-- @END:sidebar -->

      <!-- @SLOT:content -->
      <!-- PRODUCT__LIST: bp-state-tab으로 상태 전환 -->
      <main class="flex-1 p-5">
        <bp-section data-feature="PRODUCT__LIST" data-label="상품 목록">
          <bp-state-tab>

            <div slot="기본">
              <div class="mb-4 flex items-center justify-between">
                <span class="text-xs text-muted-foreground">총 128개 상품</span>
                <div data-el="SORT">
                  <bp-native-select>
                    <option>인기순</option>
                    <option>최신순</option>
                    <option>가격 낮은순</option>
                    <option>가격 높은순</option>
                  </bp-native-select>
                </div>
              </div>

              <div class="grid grid-cols-4 gap-3" data-el="CARDS">
                <bp-card>
                  <bp-image ratio="4/3"></bp-image>
                  <div class="mt-2 flex flex-col gap-0.5">
                    <span class="text-sm font-medium">무선 블루투스 이어폰</span>
                    <span class="text-xs text-muted-foreground">&#8361;45,000</span>
                    <span class="text-[11px] text-muted-foreground/50">&#9733;&#9733;&#9733;&#9733;&#9734; (234)</span>
                  </div>
                </bp-card>
                <bp-card>
                  <bp-image ratio="4/3"></bp-image>
                  <div class="mt-2 flex flex-col gap-0.5">
                    <span class="text-sm font-medium">스마트 워치 프로</span>
                    <span class="text-xs text-muted-foreground">&#8361;189,000</span>
                    <span class="text-[11px] text-muted-foreground/50">&#9733;&#9733;&#9733;&#9733;&#9733; (89)</span>
                  </div>
                </bp-card>
                <bp-card>
                  <bp-image ratio="4/3"></bp-image>
                  <div class="mt-2 flex flex-col gap-0.5">
                    <span class="text-sm font-medium">USB-C 충전 케이블</span>
                    <span class="text-xs text-muted-foreground">&#8361;12,900</span>
                    <span class="text-[11px] text-muted-foreground/50">&#9733;&#9733;&#9733;&#9733;&#9734; (1,024)</span>
                  </div>
                </bp-card>
                <bp-card>
                  <bp-image ratio="4/3"></bp-image>
                  <div class="mt-2 flex flex-col gap-0.5">
                    <span class="text-sm font-medium">노이즈 캔슬링 헤드폰</span>
                    <span class="text-xs text-muted-foreground">&#8361;320,000</span>
                    <span class="text-[11px] text-muted-foreground/50">&#9733;&#9733;&#9733;&#9733;&#9733; (567)</span>
                  </div>
                </bp-card>
              </div>

              <div class="mt-5" data-el="PAGINATION">
                <bp-pagination total="12" current="1" siblings="1"></bp-pagination>
              </div>
            </div>

            <div slot="결과 없음">
              <div class="mb-4 flex items-center justify-between">
                <span class="text-xs text-muted-foreground">총 0개 상품</span>
                <div data-el="SORT">
                  <bp-native-select>
                    <option>인기순</option>
                  </bp-native-select>
                </div>
              </div>

              <div data-el="CARDS">
                <bp-empty icon="search" title="검색 결과가 없습니다" description="현재 필터 조건을 다시 확인하거나 일부 조건을 해제해 보세요."></bp-empty>
              </div>
            </div>

          </bp-state-tab>
        </bp-section>
      </main>
      <!-- @END:content -->

    </bp-section>

  </bp-page>
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
| bp-page 프레임 | `<bp-page description>` — 메타바 + aside 패널 자동 구성 |
| 고정 영역 | `slot="header"` / `slot="footer"` — `data-feature` 없음. 기본 라벨만 |
| 모든 feature는 `<bp-section>` | `PRODUCT`, `SEARCH_FILTER`, `LIST` 모두 `<bp-section>` |
| 상태 탭 (bp-state-tab) | `LIST`에 `slot="기본"`, `slot="결과 없음"` — 컴포넌트가 자동 탭 생성 |
| bp-* 컴포넌트 사용 | `<bp-checkbox>`, `<bp-input>`, `<bp-button>`, `<bp-native-select>`, `<bp-card>`, `<bp-image>`, `<bp-pagination>`, `<bp-empty>` |
| element는 짧은 키 | `data-el="CATEGORY"`, `data-el="SORT"` — 각각 부모 feature 스코프 내 유니크 |
| 상태 패널 내 data-el 재사용 | `SORT`, `CARDS`가 두 패널에 존재 — 상호배타이므로 허용 |
| description은 비즈니스 의미 | "사용자가 관심 상품 카테고리만 남기도록…" — 단순 라벨이 아닌 역할 설명 |
| 시맨틱 색상 | `text-muted-foreground`, `border-border` — raw zinc 사용 안 함 |
| 화면 참조 문법 | `@PRODUCT/SEARCH_FILTER`, `@PRODUCT/LIST` |
