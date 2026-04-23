# bp-toggle-group

토글 버튼 그룹. 단일(single) 또는 복수(multiple) 선택을 지원한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-toggle-group` | `type` | `"single"` (기본) \| `"multiple"` | 선택 모드 |
| `bp-toggle-group` | `value` | string | 현재 선택값. multiple 시 쉼표 구분 |
| `bp-toggle-group` | `variant` | `"default"` (기본) \| `"outline"` | 스타일 변형. 자식 item에 전파 |
| `bp-toggle-group` | `size` | `"default"` (기본) \| `"sm"` \| `"lg"` | 크기. 자식 item에 전파 |
| `bp-toggle-group` | `orientation` | `"horizontal"` (기본) \| `"vertical"` | 배치 방향 |
| `bp-toggle-group-item` | `value` | string (필수) | 이 항목의 값 |
| `bp-toggle-group-item` | `disabled` | boolean | 개별 항목 비활성화 |

## Composition

```
bp-toggle-group (type, value, variant, size, orientation)
  bp-toggle-group-item (value)   ← 아이콘 또는 텍스트
  bp-toggle-group-item (value)
```

## shadcn과의 차이

- **`spacing` 미지원**: shadcn `ToggleGroup`에는 항목 간격을 제어하는 `spacing` prop이 있지만, `bp-toggle-group`은 pill 패턴(항목이 붙어서 캡슐 모양을 형성)만 구현한다. 항목 간에 `gap`을 주는 방식은 지원하지 않는다.
- **복수 선택 value는 쉼표 구분**: `type="multiple"`에서 선택값을 `value="bold,italic"` 처럼 쉼표로 구분한 문자열로 지정한다. shadcn에서는 배열(`value={["bold", "italic"]}`)을 사용하지만 HTML 속성에는 배열이 없기 때문이다.
- **키보드 탐색 미지원**: 화살표 키로 항목 이동 기능이 없다.
- **controlled value 미지원**: 항상 내부 uncontrolled 상태로 동작한다.

## 미지원

- `spacing` prop
- 배열 value (= 쉼표 구분 문자열로 대체)
- `onValueChange` 콜백 → `toggle-group-change` CustomEvent
- 화살표 키 탐색
- `asChild` / `Slot`
- `dir` (RTL)

## 예제

```html
<!-- 텍스트 포맷 (multiple) -->
<bp-toggle-group type="multiple" value="bold,italic">
  <bp-toggle-group-item value="bold" aria-label="굵게">
    <bp-icon name="bold" size="sm"></bp-icon>
  </bp-toggle-group-item>
  <bp-toggle-group-item value="italic" aria-label="기울임">
    <bp-icon name="italic" size="sm"></bp-icon>
  </bp-toggle-group-item>
  <bp-toggle-group-item value="underline" aria-label="밑줄">
    <bp-icon name="underline" size="sm"></bp-icon>
  </bp-toggle-group-item>
</bp-toggle-group>

<!-- 필터 탭 (single, outline variant) -->
<bp-toggle-group variant="outline" type="single" value="active">
  <bp-toggle-group-item value="all">전체</bp-toggle-group-item>
  <bp-toggle-group-item value="active">활성</bp-toggle-group-item>
  <bp-toggle-group-item value="inactive">비활성</bp-toggle-group-item>
</bp-toggle-group>
```
