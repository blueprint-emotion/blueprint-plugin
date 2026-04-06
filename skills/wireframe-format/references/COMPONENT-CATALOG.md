# 컴포넌트 카탈로그

`bp-*` 웹 컴포넌트. shadcn/ui와 동일한 디자인·패턴. HTML 속성으로 제어.

CDN 참조:
```html
<link rel="stylesheet" href="{CDN}/base.css" />
<script type="module" src="{CDN}/bp-components.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
```

## shadcn 대응 컴포넌트

속성·패턴�� shadcn과 동일. 태그명만 `bp-` 접��사.

### form

| 태그 | shadcn | 비고 |
|------|--------|------|
| `bp-input` | Input | type, placeholder, disabled, value |
| `bp-textarea` | Textarea | placeholder, rows, disabled, value |
| `bp-checkbox` | Checkbox | label, checked, disabled |
| `bp-radio-group` | RadioGroup | name, value. 자식: `bp-radio-item` (value, label) |
| `bp-switch` | Switch | label, checked, disabled |
| `bp-slider` | Slider | min, max, value, step, disabled |
| `bp-input-otp` | InputOTP | length (기본 6) |
| `bp-native-select` | Select | size (default/sm), disabled. 자식: `<option>` |
| `bp-label` | Label | 텍스트 콘텐츠 |
| `bp-button` | Button | variant (default/outline/secondary/ghost/destructive/link), size (xs/sm/default/lg), disabled |

### display

| 태그 | shadcn | 비고 |
|------|--------|------|
| `bp-badge` | Badge | variant (default/secondary/destructive/outline/ghost/link) |
| `bp-avatar` | Avatar | src, fallback, size (sm/md/lg) |

| `bp-progress` | Progress | value (0–100), label |
| `bp-skeleton` | Skeleton | width, height |
| `bp-spinner` | — | 속성 없음. 로딩 회전 아이콘 |
| `bp-kbd` | Kbd | 텍스트 콘텐츠. 인라��� |
| `bp-image` | — | ratio (기본 16/9), width, height, label |
| `bp-alert` | Alert | variant (default/destructive), title, description |

### layout

| 태그 | shadcn | 비고 |
|------|--------|------|
| `bp-card` | Card | title, description, footer. 자식 → card-content |
| `bp-tabs` | Tabs | 자식: `bp-tab` (label, active) |
| `bp-accordion` | Accordion | 자식: `bp-accordion-item` (title, open) |
| `bp-collapsible` | Collapsible | title, open |
| `bp-table` | Table | 자식: 표준 table/thead/tbody/tr/th/td |
| `bp-scroll-area` | ScrollArea | height (기본 auto) |
| `bp-breadcrumb` | Breadcrumb | 자식: `bp-breadcrumb-item` (href) |
| `bp-carousel` | Carousel | 직접 자식이 슬라이드 |
| `bp-pagination` | Pagination | total, current (기본 1), siblings (기본 1) |
| `bp-calendar` | Calendar | 속성 없음. 현재 월 자동 생성 |
| `bp-chart` | Chart | type (bar/line/pie), title, height (기본 200) |
| `bp-sidebar` | Sidebar | — |

### overlay

| 태그 | shadcn | 비고 |
|------|--------|------|
| `bp-dialog` | Dialog | trigger (필수), title, description. 자식 → 본문 |
| `bp-alert-dialog` | AlertDialog | trigger (필수), title, description, confirm-label, cancel-label |
| `bp-drawer` | Drawer | trigger (필수), title, description, side (bottom/top/left/right) |
| `bp-sheet` | Sheet | trigger (필수), title, description, side (right/left/top/bottom) |
| `bp-popover` | Popover | trigger (필수). 자식 → 콘텐츠 |
| `bp-hover-card` | HoverCard | trigger. 자식 → 호버 콘텐츠 |
| `bp-tooltip` | Tooltip | content. 자식 → 트리거 |
| `bp-dropdown` | DropdownMenu | label. 자식: `bp-dropdown-item` (shortcut, disabled, variant), `bp-dropdown-separator`, `bp-dropdown-label` |
| `bp-command` | Command | placeholder. 자식: `bp-command-group` (label) > `bp-command-item` |
| `bp-sonner` | Sonner | trigger (필수), title, description, variant (default/success/error/warning) |

## Blueprint 전용 (shadcn에 없음)

| 태그 | 용도 | 속성 |
|------|------|------|
| `bp-page` | 화면 셸. header/footer 슬롯 자동 구성 | `slot="header"`, `slot="footer"`, `description` (부제 표시) |
| `bp-section` | feature 컨테이너. DOM 중첩 = 기능 계층 | `data-feature`, `data-label` |
| `bp-field` | 라벨 + 컨트롤 + 설명 + 에러 래퍼 | `label`, `description`, `error` (data-invalid 자동) |
| `bp-state-tab` | 상태 전환 탭 (기본/에러/로딩 등) | 자식��� `slot="상태명"` |
| `bp-stat` | 통계 카드 | `label`, `value`, `trend` (up/down/neutral), `trend-value`, `description` |
| `bp-empty` | 빈 상태 안내 | `icon` (inbox/file/search), `title`, `description` |
