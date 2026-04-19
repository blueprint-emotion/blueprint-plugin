# bp-drawer

모바일 바텀시트 및 4방향 슬라이드 패널. vaul 드래그 미사용.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-drawer` | `open` | boolean | 드로어 표시 여부. 없으면 숨김 |
| `bp-drawer` | `direction` | `bottom`(기본) \| `top` \| `left` \| `right` | 패널이 나타나는 방향 |

그 외 자식 컴포넌트(`bp-drawer-trigger`, `bp-drawer-overlay`, `bp-drawer-content`, `bp-drawer-header`, `bp-drawer-footer`, `bp-drawer-title`, `bp-drawer-description`, `bp-drawer-close`)는 별도 prop이 없다.

## Composition

```
bp-drawer [open] [direction]
├── bp-drawer-trigger       (클릭 → 부모 bp-drawer의 open 토글)
└── bp-drawer-portal        (생략 가능 — pass-through)
    ├── bp-drawer-overlay   (반투명 배경)
    └── bp-drawer-content
        ├── bp-drawer-header
        │   ├── bp-drawer-title
        │   └── bp-drawer-description
        └── bp-drawer-footer
            └── bp-drawer-close  (클릭 → 부모 bp-drawer의 open 제거)
```

- `bp-drawer-overlay` — `bp-drawer-portal` 없이 `bp-drawer` 직하에 배치해도 동작
- `bp-drawer-content` — `direction`에 따라 fixed 패널 (`bottom`/`top`에서 핸들 막대 자동 삽입)

## shadcn과의 차이

shadcn `<Drawer>`는 [vaul](https://github.com/emilkowalski/vaul) 라이브러리를 래핑하며 드래그로 닫기, snapPoints, shouldScaleBackground 같은 native-app 수준 제스처를 지원한다. bp-drawer는 **vaul 없이 CSS transition으로만 구현**한 정적 패널이다.

| 항목 | shadcn (vaul) | bp-drawer |
|---|---|---|
| 드래그로 닫기 | 지원 | **미지원** |
| `snapPoints` | 지원 | **미지원** |
| `fadeFromIndex` | 지원 | **미지원** |
| `shouldScaleBackground` | 지원 | **미지원** |
| `dismissible` | 지원 | **미지원** |
| `direction` | vaul prop | 동일하게 지원 (4종) |

## 미지원

- `dismissible` / `snapPoints` / `fadeFromIndex` — vaul 전용
- `shouldScaleBackground` — vaul 전용
- `onOpenChange` 콜백 — 와이어프레임은 정적 표현
- `asChild` / Slot

## 예제

```html
<!-- 기본 (bottom 방향) -->
<bp-drawer open>
  <bp-drawer-overlay></bp-drawer-overlay>
  <bp-drawer-content>
    <bp-drawer-header>
      <bp-drawer-title>목표 설정</bp-drawer-title>
      <bp-drawer-description>일일 활동 목표를 설정하세요.</bp-drawer-description>
    </bp-drawer-header>
    <div style="padding: 1rem;">
      <!-- 콘텐츠 -->
    </div>
    <bp-drawer-footer>
      <bp-button>저장</bp-button>
      <bp-drawer-close><bp-button variant="outline">취소</bp-button></bp-drawer-close>
    </bp-drawer-footer>
  </bp-drawer-content>
</bp-drawer>

<!-- 우측에서 슬라이드 (direction="right") -->
<bp-drawer open direction="right">
  <bp-drawer-overlay></bp-drawer-overlay>
  <bp-drawer-content>
    <bp-drawer-header>
      <bp-drawer-title>필터</bp-drawer-title>
    </bp-drawer-header>
    <bp-drawer-footer>
      <bp-button>적용</bp-button>
    </bp-drawer-footer>
  </bp-drawer-content>
</bp-drawer>
```
