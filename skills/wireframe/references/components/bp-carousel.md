# bp-carousel

CSS transform 기반 슬라이더. Embla 미사용, 순수 JS + CSS transform으로 구현.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-carousel` | `orientation` | `horizontal`(기본) \| `vertical` | 슬라이드 방향 |
| `bp-carousel-item` | `basis` | CSS flex-basis 값 (기본 `"100%"`) | 슬라이드 너비/높이 비율 |

## Composition

```
bp-carousel [orientation]
├── bp-carousel-content
│   └── bp-carousel-item [basis]  (여러 개)
├── bp-carousel-previous
└── bp-carousel-next
```

- `bp-carousel-content` — 슬라이드 flex 컨테이너
- `bp-carousel-item` — 개별 슬라이드 셀. `basis`로 한 화면에 표시할 개수 조정
- `bp-carousel-previous` — 이전 버튼. 첫 슬라이드에서 `aria-disabled`
- `bp-carousel-next` — 다음 버튼. 마지막 슬라이드에서 `aria-disabled`

## shadcn과의 차이

shadcn `<Carousel>`은 Embla Carousel(`embla-carousel-react`)을 래핑하며 `opts`, `plugins`, `setApi` 같은 Embla 전용 API를 제공한다. bp-carousel은 **Embla 없이 순수 CSS `transform: translateX/Y(-index * 100%)`** 로 슬라이딩을 구현한다.

| 항목 | shadcn (Embla) | bp-carousel |
|---|---|---|
| 엔진 | embla-carousel-react | 순수 CSS transform + JS |
| `opts` (loop, align 등) | 지원 | **미지원** |
| `plugins` (Autoplay 등) | 지원 | **미지원** |
| `setApi` 콜백 | 지원 | `carousel-change` CustomEvent로 대체 |
| 드래그/스와이프 | 지원 | **미지원** |

## 미지원

- `opts` — Embla 옵션 전체 (loop, align, containScroll 등)
- `plugins` — Autoplay, WheelGestures 등 Embla 플러그인
- `setApi` 콜백 — `carousel-change` CustomEvent (`detail: { index, total }`)로 대체
- 드래그/스와이프 제스처
- orientation별 화살표 키 이외의 고급 키보드 제어

## 예제

```html
<!-- 기본: 한 번에 1개 표시 -->
<bp-carousel>
  <bp-carousel-content>
    <bp-carousel-item>
      <bp-card>
        <bp-card-content style="display:flex; aspect-ratio:1/1; align-items:center; justify-content:center;">
          슬라이드 1
        </bp-card-content>
      </bp-card>
    </bp-carousel-item>
    <bp-carousel-item>
      <bp-card>
        <bp-card-content style="display:flex; aspect-ratio:1/1; align-items:center; justify-content:center;">
          슬라이드 2
        </bp-card-content>
      </bp-card>
    </bp-carousel-item>
    <bp-carousel-item>
      <bp-card>
        <bp-card-content style="display:flex; aspect-ratio:1/1; align-items:center; justify-content:center;">
          슬라이드 3
        </bp-card-content>
      </bp-card>
    </bp-carousel-item>
  </bp-carousel-content>
  <bp-carousel-previous></bp-carousel-previous>
  <bp-carousel-next></bp-carousel-next>
</bp-carousel>

<!-- 한 번에 2개 표시: basis="50%" -->
<bp-carousel>
  <bp-carousel-content>
    <bp-carousel-item basis="50%">슬라이드 A</bp-carousel-item>
    <bp-carousel-item basis="50%">슬라이드 B</bp-carousel-item>
    <bp-carousel-item basis="50%">슬라이드 C</bp-carousel-item>
    <bp-carousel-item basis="50%">슬라이드 D</bp-carousel-item>
  </bp-carousel-content>
  <bp-carousel-previous></bp-carousel-previous>
  <bp-carousel-next></bp-carousel-next>
</bp-carousel>
```
