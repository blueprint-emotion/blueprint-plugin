# bp-sidebar

레이아웃 내 배치형 사이드바. collapsible, variant, side 3축으로 제어.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-sidebar-provider` | `default-open` | boolean (기본 **true**) | 초기 열림 상태 |
| `bp-sidebar-provider` | `open` | boolean | 열림 상태 강제 지정 |
| `bp-sidebar` | `side` | `left`(기본) \| `right` | 사이드바 위치 |
| `bp-sidebar` | `variant` | `sidebar`(기본) \| `floating` \| `inset` | 표시 스타일 |
| `bp-sidebar` | `collapsible` | `offcanvas`(기본) \| `icon` \| `none` | 접기 동작 |
| `bp-sidebar-menu-button` | `active` | boolean | 활성 메뉴 항목 (shadcn `isActive`) |
| `bp-sidebar-menu-button` | `size` | `default`(기본) \| `sm` \| `lg` | 버튼 크기 |
| `bp-sidebar-menu-sub-button` | `active` | boolean | 활성 서브메뉴 항목 |

### collapsible 동작

| 값 | closed 시 동작 |
|---|---|
| `offcanvas` | width → 0 (완전 숨김) |
| `icon` | width → 3rem (아이콘만 표시) |
| `none` | 항상 표시 (접기 불가) |

## Composition

```
bp-sidebar-provider [default-open] [open]
├── bp-sidebar [side] [variant] [collapsible]
│   ├── bp-sidebar-header
│   ├── bp-sidebar-content
│   │   └── bp-sidebar-group
│   │       ├── bp-sidebar-group-label
│   │       ├── bp-sidebar-group-content
│   │       │   └── bp-sidebar-menu
│   │       │       └── bp-sidebar-menu-item
│   │       │           ├── bp-sidebar-menu-button [active] [size]
│   │       │           └── bp-sidebar-menu-sub
│   │       │               └── bp-sidebar-menu-sub-item
│   │       │                   └── bp-sidebar-menu-sub-button [active]
│   │       └── bp-sidebar-separator
│   ├── bp-sidebar-footer
│   └── bp-sidebar-rail  (접기 클릭 핸들)
└── bp-sidebar-inset
    ├── bp-sidebar-trigger  (toggle 버튼)
    └── <!-- 메인 콘텐츠 -->
```

## shadcn과의 차이

shadcn `<SidebarProvider>`는 React Context + cookie 기반으로 열림 상태를 유지하며, mobile 환경에서는 Sheet로 자동 전환한다. bp-sidebar는 **Web Components DOM 트리 탐색**으로 상태를 전파하며, mobile Sheet 분기와 cookie 지속이 없다.

| 항목 | shadcn | bp-sidebar |
|---|---|---|
| 상태 전파 | React Context | DOM 탐색 |
| 모바일 Sheet 전환 | 자동 (`isMobile`) | **미지원** |
| cookie 지속 | `SIDEBAR_COOKIE_NAME` | **미지원** |
| `onOpenChange` | 지원 | **미지원** |
| `SidebarMenuAction` / `SidebarMenuBadge` / `SidebarMenuSkeleton` | 지원 | **미지원** |
| `SidebarGroupAction` / `SidebarInput` | 지원 | **미지원** |
| 키보드 단축키 (`Ctrl+B`) | 지원 | **미지원** |

## 미지원

- `onOpenChange` 콜백
- `isMobile` / mobile Sheet 자동 분기
- cookie 지속 (`SIDEBAR_COOKIE_NAME`)
- `SidebarMenuAction`, `SidebarMenuBadge`, `SidebarMenuSkeleton`
- `SidebarGroupAction`, `SidebarInput`
- 키보드 단축키 (Ctrl+B)
- `asChild` / Slot

## 함정

**`default-open` 기본값은 `true`** — `bp-sidebar-provider`에 `default-open`을 명시하지 않으면 **사이드바가 항상 열린 상태로 시작**한다. 와이어프레임에서 초기 상태를 닫힌 채로 표현하려면 반드시 `default-open="false"`를 명시해야 한다.

```html
<!-- 잘못된 예 — 의도는 닫힌 상태지만 default-open이 true라 열린 채로 표시됨 -->
<bp-sidebar-provider>
  ...
</bp-sidebar-provider>

<!-- 올바른 예 — 닫힌 상태로 시작 -->
<bp-sidebar-provider default-open="false">
  ...
</bp-sidebar-provider>
```

## 예제

```html
<!-- 기본 사이드바 (열린 상태) -->
<bp-sidebar-provider>
  <bp-sidebar>
    <bp-sidebar-header>로고</bp-sidebar-header>
    <bp-sidebar-content>
      <bp-sidebar-group>
        <bp-sidebar-group-label>메뉴</bp-sidebar-group-label>
        <bp-sidebar-menu>
          <bp-sidebar-menu-item>
            <bp-sidebar-menu-button active>대시보드</bp-sidebar-menu-button>
          </bp-sidebar-menu-item>
          <bp-sidebar-menu-item>
            <bp-sidebar-menu-button>설정</bp-sidebar-menu-button>
          </bp-sidebar-menu-item>
        </bp-sidebar-menu>
      </bp-sidebar-group>
    </bp-sidebar-content>
    <bp-sidebar-footer>사용자 정보</bp-sidebar-footer>
  </bp-sidebar>
  <bp-sidebar-inset>
    <bp-sidebar-trigger></bp-sidebar-trigger>
    <!-- 메인 콘텐츠 -->
  </bp-sidebar-inset>
</bp-sidebar-provider>

<!-- 아이콘 모드 + 우측 배치 + 닫힌 초기 상태 -->
<bp-sidebar-provider default-open="false">
  <bp-sidebar side="right" collapsible="icon" variant="floating">
    <bp-sidebar-content>
      <bp-sidebar-group>
        <bp-sidebar-menu>
          <bp-sidebar-menu-item>
            <bp-sidebar-menu-button>
              <bp-icon name="home"></bp-icon>
              <span>홈</span>
            </bp-sidebar-menu-button>
          </bp-sidebar-menu-item>
        </bp-sidebar-menu>
      </bp-sidebar-group>
    </bp-sidebar-content>
    <bp-sidebar-rail></bp-sidebar-rail>
  </bp-sidebar>
  <bp-sidebar-inset>
    <bp-sidebar-trigger></bp-sidebar-trigger>
    <!-- 콘텐츠 -->
  </bp-sidebar-inset>
</bp-sidebar-provider>
```
