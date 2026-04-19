# bp-scroll-area

스크롤 영역 래퍼. 네이티브 스크롤바를 CSS로 스타일링.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-scroll-area` | (없음) | — | 크기·외관은 `class`/`style`로 지정 |
| `bp-scroll-bar` | `orientation` | `"vertical"` (기본) \| `"horizontal"` | 스크롤바 방향 |

## Composition

```
bp-scroll-area (class="h-* w-* ...")
  <!-- 스크롤될 콘텐츠 -->
  <div class="p-4">…</div>
  bp-scroll-bar (orientation="vertical")    ← 추가 시 해당 방향 overflow 활성화
```

`bp-scroll-bar`를 추가하면 해당 방향의 overflow가 활성화되고 스크롤바 시각 스타일이 적용된다. 방향별로 각각 추가 가능.

## shadcn과의 차이

- **네이티브 스크롤바 CSS 스타일링**: shadcn ScrollArea는 Radix UI가 커스텀 스크롤바 로직(JS 기반 자동 hide/show)을 제공한다. bp-scroll-area는 내부 뷰포트에 `overflow: auto`를 적용하고 네이티브 스크롤바를 CSS로 스타일링한다.
- **bp-scroll-bar 추가 시 해당 방향 overflow 활성화**: bp-scroll-bar의 connectedCallback 이후 `data-scrollbar-*` 속성이 설정되고 CSS에서 overflow 전환이 처리된다.
- **`scrollHideDelay` / `type` / `dir` 미지원**: Radix 전용 속성.

## 미지원

- Radix ScrollArea JS 기반 스크롤바 자동 hide/show
- `scrollHideDelay` (Radix 전용)
- `type` (Radix 전용)
- `dir` (RTL, Radix 전용)

## 함정

- `bp-scroll-area`에 반드시 높이(또는 너비)를 지정해야 스크롤이 활성화된다. 높이가 없으면 콘텐츠가 그냥 늘어남.
- 수평 스크롤 시 `whitespace-nowrap` 또는 `w-max` 등으로 콘텐츠가 줄바꿈되지 않도록 설정해야 함.
- `bp-scroll-bar`를 추가하지 않아도 overflow:hidden으로 동작하나, 스크롤 자체는 내부 뷰포트에서 가능. 스타일링된 스크롤바가 필요할 때만 추가.

## 예제

```html
<!-- 수직 스크롤 영역 -->
<bp-scroll-area class="h-72 w-48 rounded-md border">
  <div class="p-4">
    <p class="font-semibold mb-2">태그 목록</p>
    <div class="space-y-2">
      <p>React</p><p>Vue</p><p>Angular</p><p>Svelte</p>
      <p>Next.js</p><p>Nuxt</p><p>Remix</p><p>Astro</p>
    </div>
  </div>
  <bp-scroll-bar orientation="vertical"></bp-scroll-bar>
</bp-scroll-area>

<!-- 수평 스크롤 영역 -->
<bp-scroll-area class="w-96 rounded-md border whitespace-nowrap">
  <div class="flex w-max space-x-4 p-4">
    <div class="w-32 h-20 rounded bg-muted flex items-center justify-center">항목 1</div>
    <div class="w-32 h-20 rounded bg-muted flex items-center justify-center">항목 2</div>
    <div class="w-32 h-20 rounded bg-muted flex items-center justify-center">항목 3</div>
    <div class="w-32 h-20 rounded bg-muted flex items-center justify-center">항목 4</div>
  </div>
  <bp-scroll-bar orientation="horizontal"></bp-scroll-bar>
</bp-scroll-area>
```
