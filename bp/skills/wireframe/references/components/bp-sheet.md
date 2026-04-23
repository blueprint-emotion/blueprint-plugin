# bp-sheet

화면 엣지에서 슬라이드인하는 사이드 패널. Dialog의 변형. X 닫기 버튼 자동 삽입.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-sheet` | `open` | boolean | 패널 표시 여부. 없으면 숨김 |
| `bp-sheet-content` | `side` | `right`(기본) \| `left` \| `top` \| `bottom` | 패널이 나타나는 방향 |

그 외 자식 컴포넌트(`bp-sheet-trigger`, `bp-sheet-portal`, `bp-sheet-overlay`, `bp-sheet-header`, `bp-sheet-footer`, `bp-sheet-title`, `bp-sheet-description`, `bp-sheet-close`)는 별도 prop이 없다.

## Composition

```
bp-sheet [open]
├── bp-sheet-trigger        (클릭 → 부모 bp-sheet의 open 토글)
└── bp-sheet-content [side] (오버레이 + 패널. X 닫기 버튼 내장)
    ├── bp-sheet-header
    │   ├── bp-sheet-title
    │   └── bp-sheet-description
    └── bp-sheet-footer
        └── bp-sheet-close  (클릭 → 부모 bp-sheet의 open 제거)
```

- `bp-sheet-portal` / `bp-sheet-overlay` — pass-through 역할. 생략해도 동작하지만 shadcn composition 호환을 위해 정의
- X 닫기 버튼은 `bp-sheet-content` 내부에 자동 삽입된다

## shadcn과의 차이

shadcn `<Sheet>`는 `tailwindcss-animate`에 의존하는 `animate-in` / `slide-in-from-*` 유틸로 진입 애니메이션을 구현한다. bp-sheet는 **`tailwindcss-animate` 미포함**(CDN Play 미지원) 환경에서 동작하므로 애니메이션이 단순화되어 있다.

| 항목 | shadcn | bp-sheet |
|---|---|---|
| 진입 애니메이션 | `animate-in slide-in-from-right` 등 | **없음** (즉시 표시/숨김) |
| `tailwindcss-animate` 의존 | 있음 | **없음** |
| `modal` prop | 있음 | **미지원** |
| `onOpenChange` 콜백 | 있음 | **미지원** |

## 미지원

- 애니메이션 (`animate-in`, `slide-in-from-*`, `duration-*` 등 `tailwindcss-animate` 유틸)
- `onOpenChange` 콜백
- `modal` / modality prop
- `asChild` / Slot / `forwardRef` / ref

## 예제

```html
<!-- 기본: 우측에서 열리는 설정 패널 -->
<bp-sheet>
  <bp-sheet-trigger>
    <bp-button variant="outline">설정 열기</bp-button>
  </bp-sheet-trigger>
  <bp-sheet-content side="right">
    <bp-sheet-header>
      <bp-sheet-title>설정</bp-sheet-title>
      <bp-sheet-description>설정을 변경하세요.</bp-sheet-description>
    </bp-sheet-header>
    <div style="flex: 1; padding: 0 1rem; overflow-y: auto;">
      <!-- 콘텐츠 -->
    </div>
    <bp-sheet-footer>
      <bp-button>저장</bp-button>
      <bp-sheet-close><bp-button variant="outline">취소</bp-button></bp-sheet-close>
    </bp-sheet-footer>
  </bp-sheet-content>
</bp-sheet>

<!-- 와이어프레임용: 초기에 열린 상태 고정 -->
<bp-sheet open>
  <bp-sheet-content side="bottom">
    <bp-sheet-header>
      <bp-sheet-title>하단 시트</bp-sheet-title>
    </bp-sheet-header>
  </bp-sheet-content>
</bp-sheet>
```
