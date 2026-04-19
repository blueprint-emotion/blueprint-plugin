# bp-radio-group

라디오 버튼 그룹. 여러 항목 중 하나를 선택한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-radio-group` | `value` | string | 초기 선택값 (uncontrolled) |
| `bp-radio-group` | `orientation` | `"vertical"` (기본) \| `"horizontal"` | 항목 배치 방향 |
| `bp-radio-group` | `name` | string | radio name 공유값. 미지정 시 자동 생성 |
| `bp-radio-group` | `disabled` | boolean | 전체 그룹 비활성화 (하위 모두 전파) |
| `bp-radio-group` | `aria-invalid` | boolean | 오류 상태 (하위 input에 전파) |
| `bp-radio-group` | `aria-label` | string | 그룹 접근성 레이블 |
| `bp-radio-item` | `value` | string (필수) | 이 항목의 값 |
| `bp-radio-item` | `disabled` | boolean | 개별 항목 비활성화 |
| `bp-radio-item` | `id` | string | 내부 input으로 전달 (`bp-label for` 연결용) |
| `bp-radio-item` | `aria-invalid` | boolean | 해당 항목만 오류 상태 |

## Composition

```
bp-radio-group (value, orientation)
  bp-field (orientation="horizontal")
    bp-radio-item (id, value)
    bp-label (for)
  bp-field (orientation="horizontal")
    bp-radio-item (id, value)
    bp-label (for)
```

## shadcn과의 차이

shadcn `RadioGroup`은 Radix `RadioGroupPrimitive`를 사용하지만, `bp-radio-group`은 네이티브 `<input type="radio">`를 사용한다. 폼 제출·접근성·키보드 탐색을 네이티브에 위임하기 위함.

- **`loop` prop**: Radix `RadioGroup`에는 포커스가 마지막 항목에서 첫 번째로 순환하는 `loop` prop이 있지만, `bp-radio-group`에는 이에 해당하는 속성이 없다. 네이티브 `<input type="radio">`의 화살표 키 탐색은 브라우저가 처리한다.
- **`defaultValue`**: 별도 prop 없음. `value` 속성이 초기값 역할을 한다.
- **`onValueChange`**: 미지원. 표준 DOM `change` 이벤트 사용.
- **Indicator `<span>`**: shadcn은 별도 Indicator 요소를 렌더링하지만, bp는 `inset box-shadow`로 선택 점을 표현한다.

## 미지원

- `loop` prop (Radix 전용)
- `onValueChange` 콜백 → 표준 DOM `change` 이벤트
- `defaultValue` (= `value` 속성이 동일 역할)
- `asChild` / `Slot`
- `dir` (RTL)

## 예제

```html
<!-- 수직 배치 (기본) -->
<bp-radio-group value="pro" orientation="vertical">
  <bp-field orientation="horizontal">
    <bp-radio-item id="r1" value="free"></bp-radio-item>
    <bp-label for="r1">무료</bp-label>
  </bp-field>
  <bp-field orientation="horizontal">
    <bp-radio-item id="r2" value="pro"></bp-radio-item>
    <bp-label for="r2">프로</bp-label>
  </bp-field>
</bp-radio-group>

<!-- 수평 배치 -->
<bp-radio-group value="email" orientation="horizontal">
  <bp-field orientation="horizontal">
    <bp-radio-item id="n1" value="email"></bp-radio-item>
    <bp-label for="n1">이메일</bp-label>
  </bp-field>
  <bp-field orientation="horizontal">
    <bp-radio-item id="n2" value="sms"></bp-radio-item>
    <bp-label for="n2">문자</bp-label>
  </bp-field>
</bp-radio-group>
```
