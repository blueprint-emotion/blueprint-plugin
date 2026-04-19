# bp-accordion

접이식 콘텐츠 컴포넌트. 단일(single) 또는 다중(multiple) 항목 열기를 지원한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-accordion` | `type` | `"single"` (기본) \| `"multiple"` | 열기 모드 |
| `bp-accordion` | `collapsible` | boolean | single 타입에서 열린 항목을 다시 클릭해 닫기 허용 |
| `bp-accordion` | `defaultvalue` | string | 초기 열린 항목 value. multiple 시 콤마 구분 |
| `bp-accordion-item` | `value` | string (필수) | 항목 식별자 |
| `bp-accordion-item` | `disabled` | boolean | 항목 비활성화 |

## Composition

```
bp-accordion (type, collapsible, defaultvalue)
  bp-accordion-item (value)
    bp-accordion-trigger   ← 클릭 가능한 헤더
    bp-accordion-content   ← 펼쳐지는 콘텐츠
  bp-accordion-item (value)
    bp-accordion-trigger
    bp-accordion-content
```

## shadcn과의 차이

- **`defaultvalue` multiple 시 콤마 구분**: `type="multiple"`에서 여러 항목을 초기에 열려면 `defaultvalue="item-1,item-2"` 처럼 쉼표로 구분한다. shadcn에서는 배열(`defaultValue={["item-1", "item-2"]}`)을 사용하지만 HTML 속성에는 배열이 없기 때문이다.
- **화살표 키 탐색 미지원**: shadcn/Radix는 화살표 키로 accordion trigger 간 이동을 지원하지만, `bp-accordion`은 클릭 전용이다.
- **`onValueChange`**: 미지원. 와이어프레임은 정적 표현이므로 인터랙티브 핸들러가 불필요하다.
- **`asChild` / `Slot`**: Radix/React 전용으로 미지원.

## 미지원

- 화살표 키 탐색 (클릭 전용)
- `onValueChange` 콜백
- `value` prop (controlled) → 항상 uncontrolled
- `asChild` / `Slot`
- `dir` (RTL)

## 예제

```html
<!-- single 타입, collapsible -->
<bp-accordion type="single" collapsible defaultvalue="item-1">
  <bp-accordion-item value="item-1">
    <bp-accordion-trigger>접근성이 있나요?</bp-accordion-trigger>
    <bp-accordion-content>네. WAI-ARIA 디자인 패턴을 따릅니다.</bp-accordion-content>
  </bp-accordion-item>
  <bp-accordion-item value="item-2">
    <bp-accordion-trigger>스타일이 있나요?</bp-accordion-trigger>
    <bp-accordion-content>네. 기본 스타일이 포함되어 있습니다.</bp-accordion-content>
  </bp-accordion-item>
</bp-accordion>

<!-- multiple 타입, 초기에 두 항목 열림 -->
<bp-accordion type="multiple" defaultvalue="item-1,item-2">
  <bp-accordion-item value="item-1">
    <bp-accordion-trigger>배송 정책</bp-accordion-trigger>
    <bp-accordion-content>주문 후 2~3일 내 배송됩니다.</bp-accordion-content>
  </bp-accordion-item>
  <bp-accordion-item value="item-2">
    <bp-accordion-trigger>반품 정책</bp-accordion-trigger>
    <bp-accordion-content>수령 후 7일 이내 반품 가능합니다.</bp-accordion-content>
  </bp-accordion-item>
  <bp-accordion-item value="item-3">
    <bp-accordion-trigger>교환 정책</bp-accordion-trigger>
    <bp-accordion-content>제품 불량 시 교환 가능합니다.</bp-accordion-content>
  </bp-accordion-item>
</bp-accordion>
```
