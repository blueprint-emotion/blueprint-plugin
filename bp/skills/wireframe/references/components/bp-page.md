# bp-page

bp 전용 — shadcn 포팅 없음. 와이어프레임 최상위 레이아웃 셸. 모든 와이어프레임의 루트 컨테이너.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-page` | — | — | 속성 없음. 레이아웃 전용 구조 컴포넌트 |
| `bp-page-header` | — | — | 속성 없음 |
| `bp-page-content` | — | — | 속성 없음 |
| `bp-page-footer` | — | — | 속성 없음 |

## Composition

```
bp-page                  ← 최상위 셸 (중앙 정렬, min-height 계산, border/radius)
  bp-page-header         ← 고정 상단 슬롯 (border-bottom)
  bp-page-content        ← 본문 (flex: 1, 전체 패딩)
    bp-section ...       ← 기능 영역들
  bp-page-footer         ← 고정 하단 슬롯 (border-top, muted text)
```

## 레이아웃 토큰

| CSS 변수 | 기본값 | 용도 |
|---|---|---|
| `--page-max-width` | `1200px` | 최대 너비 |
| `--page-padding-x` | `1.5rem` | 좌우 패딩 (header/content/footer 공통) |

## 함정

- **셸 CSS 임의 오버라이드 금지**: `--page-max-width`, `--page-padding-x`, `body:has(bp-page)` 패딩, `bp-page`의 border/radius/min-height를 임의로 바꾸지 않는다. 모든 와이어프레임은 동일한 셸·여백을 가져야 한다. 레이아웃 조정은 `bp-page-content` 안쪽에서만 한다.
- `bp-page-header`/`bp-page-footer`는 자유 슬롯이다. 내부에 어떤 HTML이든 배치 가능.
- `bp-page-header` / `bp-page-footer` 둘 다 기본 `text-muted-foreground text-sm` 스타일이 적용된다 — 화면명세에 별도 명시 없으면 `header` / `footer` 단순 텍스트만 두는 placeholder 패턴을 권장.

## 예제

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>화면명</title>
  <link rel="stylesheet" href="https://blueprint-platform-pink.vercel.app/blueprint/v1/base.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://blueprint-platform-pink.vercel.app/blueprint/v1/bp-components.js" defer></script>
</head>
<body>
  <bp-page>
    <bp-page-header>
      <nav class="flex items-center gap-4">
        <span class="font-semibold">로고</span>
        <a href="#">홈</a>
        <a href="#">상품</a>
      </nav>
    </bp-page-header>
    <bp-page-content>
      <bp-section data-feature="PRODUCT__LIST" data-label="상품 목록">
        <!-- 콘텐츠 -->
      </bp-section>
    </bp-page-content>
    <bp-page-footer>
      <p>© 2026 Acme Inc.</p>
    </bp-page-footer>
  </bp-page>
</body>
</html>
```
