# bp-navigation-menu

호버 기반 드롭다운 내비게이션 메뉴.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-navigation-menu-link` | `href` | URL 문자열 | 링크 대상 |
| `bp-navigation-menu-link` | `active` | boolean | 활성 상태 (`data-active` 설정) |
| `bp-navigation-menu-content` | `open` | boolean | 드롭다운 패널 강제 표시 (정적 와이어프레임용) |

`bp-navigation-menu-trigger`에는 별도 prop이 없다. 콘텐츠 표시 여부는 hover로 자동 제어된다.

## Composition

```
bp-navigation-menu
└── bp-navigation-menu-list
    ├── bp-navigation-menu-item
    │   ├── bp-navigation-menu-trigger  (hover → content 표시)
    │   └── bp-navigation-menu-content  [open]
    │       └── bp-navigation-menu-link [href] [active]
    └── bp-navigation-menu-item
        └── bp-navigation-menu-link [href] [active]

bp-navigation-menu-viewport  (선택적 — 구조 호환용, 실제 Radix 뷰포트 애니메이션 없음)
bp-navigation-menu-indicator (선택적 — 활성 항목 인디케이터)
```

- `bp-navigation-menu-content` — trigger 아래 item 기준 absolute 포지셔닝 드롭다운 패널
- `bp-navigation-menu-viewport` — 태그는 정의되어 있으나 Radix의 animated viewport 기능은 동작하지 않음. content는 항상 item 기준 absolute로 직접 배치됨 (구조 호환용으로만 사용)

## shadcn과의 차이

shadcn `<NavigationMenu>`는 Radix UI를 기반으로 `value` / `onValueChange` prop으로 열림 상태를 제어하며, Viewport 컴포넌트가 애니메이션을 담당한다. bp-navigation-menu는 **CSS hover만으로 동작**하며 Viewport 없이 item 기준 absolute 포지셔닝으로 content를 표시한다.

| 항목 | shadcn (Radix) | bp-navigation-menu |
|---|---|---|
| 열림 제어 | `value` / `onValueChange` | **mouseenter/mouseleave** (100ms 딜레이로 닫힘) |
| Viewport 애니메이션 | 지원 (animated container switching) | **미지원** — 태그만 존재, item 기준 absolute 직접 배치 |
| 와이어프레임 정적 표현 | 별도 방법 없음 | `open` 속성으로 강제 표시 |
| `open` prop | 없음 | `bp-navigation-menu-content`에 추가 |

## 미지원

- `value` / `onValueChange` 콜백 — 호버 자동 제어만 지원
- `viewport` prop — 항상 viewport 없는 absolute 모드로 동작
- `dir` (RTL)
- `asChild` / Slot / Portal
- `navigationMenuTriggerStyle()` 함수 — `cn()` 인라인으로 대체
- 키보드 포커스 트래핑 / 고급 접근성 (방향키 내비게이션)

## 예제

```html
<!-- 기본 호버 메뉴 -->
<bp-navigation-menu>
  <bp-navigation-menu-list>
    <bp-navigation-menu-item>
      <bp-navigation-menu-trigger>시작하기</bp-navigation-menu-trigger>
      <bp-navigation-menu-content>
        <ul style="list-style:none; padding:0; margin:0; width:16rem;">
          <li><bp-navigation-menu-link href="/docs">소개</bp-navigation-menu-link></li>
          <li><bp-navigation-menu-link href="/install">설치</bp-navigation-menu-link></li>
        </ul>
      </bp-navigation-menu-content>
    </bp-navigation-menu-item>
    <bp-navigation-menu-item>
      <bp-navigation-menu-link href="/about" active>소개</bp-navigation-menu-link>
    </bp-navigation-menu-item>
  </bp-navigation-menu-list>
</bp-navigation-menu>

<!-- 와이어프레임 정적 표현: content 강제 표시 -->
<bp-navigation-menu>
  <bp-navigation-menu-list>
    <bp-navigation-menu-item>
      <bp-navigation-menu-trigger>메뉴</bp-navigation-menu-trigger>
      <bp-navigation-menu-content open>
        <bp-navigation-menu-link href="/a">항목 A</bp-navigation-menu-link>
        <bp-navigation-menu-link href="/b">항목 B</bp-navigation-menu-link>
      </bp-navigation-menu-content>
    </bp-navigation-menu-item>
  </bp-navigation-menu-list>
</bp-navigation-menu>
```
