# bp-calendar

정적 달력 그리드 컴포넌트. 월간 뷰 표시 및 날짜 선택.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-calendar` | `month` | `"YYYY-MM"` (기본: 현재 월) | 표시할 월 |
| `bp-calendar` | `selected` | `"YYYY-MM-DD"` | 선택된 날짜 (single mode) |
| `bp-calendar` | `mode` | `"single"` (기본) \| `"range"` \| `"multiple"` | 선택 모드. range/multiple은 정적 표현 전용 |
| `bp-calendar` | `disabled-dates` | 쉼표 구분 `"YYYY-MM-DD"` 목록 | 클릭 비활성화 날짜 (muted 표시) |
| `bp-calendar` | `show-outside-days` | boolean (기본: `true`) | 이전/다음 달 날짜 표시 여부 |

## shadcn과의 차이

- **react-day-picker 미사용**: shadcn Calendar는 react-day-picker 기반이다. bp-calendar는 바닐라 JS로 정적 그리드를 직접 렌더링한다.
- **날짜 선택 이벤트**: `onSelect` 콜백 대신 `"calendar-select"` CustomEvent 발생 (`detail: { date }`). 와이어프레임은 정적 HTML이므로 `<script>`로 이벤트를 핸들링하지 않는다. 특정 날짜가 선택된 상태를 표현하려면 `selected` 속성으로 초기값을 지정하는 것으로 충분.
- **range/multiple 정적 표현 전용**: 실제 멀티 선택 동작 없음. 초기 상태를 시각적으로 표현하는 용도만.
- **`disabled-dates`**: 쉼표 구분 날짜 문자열. Radix의 `disabled` prop(함수/날짜 배열 조합) 미지원.

## 미지원

- `captionLayout="dropdown"` (연/월 드롭다운 네비게이션)
- `locale` / `formatters` (다국어 날짜 포맷)
- `showWeekNumber`
- `fixedWeeks`
- `numberOfMonths > 1` (다중 월 뷰)
- `onMonthChange` 콜백 → `"calendar-month-change"` CustomEvent
- `className` → 표준 `class` 사용
- `asChild` / `ref` / `forwardRef`

## 함정

- `selected` 속성은 `month` 속성과 같은 월이어야 강조 표시된다. 다른 월을 지정하면 표시되지 않음.
- `disabled-dates` 날짜는 클릭해도 selected 변경 없음.
- `popover-content` 또는 `card-content` 내부에 삽입 시 `bg-transparent` 자동 적용.

## 예제

```html
<!-- 현재 월 기본 표시 -->
<bp-calendar></bp-calendar>

<!-- 특정 월 + 날짜 선택 표시 -->
<bp-calendar month="2026-04" selected="2026-04-15"></bp-calendar>

<!-- 비활성 날짜 포함 -->
<bp-calendar
  month="2026-04"
  selected="2026-04-10"
  disabled-dates="2026-04-01,2026-04-25,2026-04-30"
></bp-calendar>
```
