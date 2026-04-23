# bp-icon

bp 전용 — shadcn에 없는 유틸리티 컴포넌트. Lucide 아이콘 이름을 `name` 속성으로 받아 SVG를 렌더링. 에이전트가 SVG path를 몰라도 아이콘을 사용할 수 있게 한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-icon` | `name` | 아이콘 이름 (필수) | Lucide 이름 그대로 사용 |
| `bp-icon` | `size` | `xs` \| `sm` \| `md` \| `lg` \| `xl` \| `full` | 생략 시 `1em` (부모 `font-size` 상속). `full`은 부모 크기 100% 채움 |

### size 픽셀 대응

| size | 크기 |
|------|------|
| `xs` | 0.75rem (12px) |
| `sm` | 0.875rem (14px) |
| `md` | 1rem (16px) |
| `lg` | 1.25rem (20px) |
| `xl` | 1.5rem (24px) |
| `full` | 부모 컨테이너 크기 100% |
| 생략 | `1em` (부모 font-size 기준) |

## 내장 아이콘 목록 (60+개)

| 카테고리 | 이름 |
|----------|------|
| 동작 | `plus`, `minus`, `x`, `check`, `search`, `filter`, `sort-asc`, `sort-desc`, `edit`, `trash`, `copy`, `download`, `upload`, `external-link`, `refresh-cw` |
| 방향 | `chevron-down`, `chevron-up`, `chevron-left`, `chevron-right`, `chevrons-up-down`, `arrow-left`, `arrow-right`, `arrow-up`, `arrow-down` |
| 상태 | `info`, `circle-check`, `circle-x`, `circle-alert`, `triangle-alert`, `loader` |
| 객체 | `user`, `users`, `settings`, `bell`, `mail`, `heart`, `star`, `bookmark`, `home`, `file`, `folder`, `image`, `calendar`, `clock`, `map-pin`, `shopping-cart`, `credit-card`, `package`, `tag`, `link`, `globe` |
| UI | `eye`, `eye-off`, `lock`, `unlock`, `log-in`, `log-out`, `message-square`, `phone`, `share`, `menu`, `more-horizontal`, `more-vertical`, `grip-vertical`, `moon`, `sun`, `monitor`, `panel-left`, `target`, `scroll` |

## 미지원

- `strokeWidth` 커스텀 (항상 2)
- `fill` 변경 (항상 `none`)
- 내장 목록에 없는 아이콘 (미등록 이름은 빈 SVG 렌더링)

## 함정

- `name`에 존재하지 않는 아이콘 이름을 쓰면 path가 없는 빈 `<svg>`가 렌더링된다 (호스트 크기는 그대로 차지하나 시각적으로 보이지 않음). 콘솔 경고 없으니 위 목록에서 정확한 이름을 확인할 것.
- 컴포넌트 안에 배지 아이콘을 넣을 때는 `data-icon="inline-start|end"` 속성을 `bp-icon`에 지정한다 (예: `bp-badge`).
- 색상은 `currentColor`를 상속한다. `class="text-destructive"` 등으로 부모에서 색상을 지정하면 된다.

## 예제

```html
<!-- 기본 -->
<bp-icon name="heart"></bp-icon>
<bp-icon name="search" size="lg"></bp-icon>

<!-- 아이콘 버튼 -->
<bp-button size="icon"><bp-icon name="plus"></bp-icon></bp-button>

<!-- 배지 안 인라인 아이콘 -->
<bp-badge variant="outline">
  <bp-icon name="check" data-icon="inline-start"></bp-icon>
  인증됨
</bp-badge>

<!-- alert (아이콘 명시) -->
<bp-alert><bp-icon name="info"></bp-icon><bp-alert-title>안내</bp-alert-title></bp-alert>

<!-- empty 상태 미디어 -->
<bp-empty-media variant="icon"><bp-icon name="message-square"></bp-icon></bp-empty-media>
```
