# bp-checkbox

체크박스 입력 컴포넌트. 불확정(indeterminate) 상태를 지원한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-checkbox` | `checked` | 없음 \| `""` \| `"true"` \| `"indeterminate"` | 없으면 미체크, 존재(빈값/"true")하면 체크, `"indeterminate"` 문자열이면 불확정 상태 |
| `bp-checkbox` | `disabled` | boolean | 비활성화 |
| `bp-checkbox` | `required` | boolean | 폼 필수 입력 |
| `bp-checkbox` | `name` | string | 폼 name |
| `bp-checkbox` | `value` | string | 폼 전송 시 값 (기본 `"on"`) |
| `bp-checkbox` | `form` | string | 연결할 폼 id |
| `bp-checkbox` | `aria-invalid` | boolean | 오류 상태 시각화 |
| `bp-checkbox` | `aria-label` | string | 접근성 레이블 |

## shadcn과의 차이

shadcn `Checkbox`는 `<button role="checkbox">`를 사용하지만, `bp-checkbox`는 네이티브 `<input type="checkbox">`를 사용한다. 폼 제출과 접근성을 네이티브에 위임하기 위함.

- **`checked` 속성**: shadcn은 React `checked` prop(boolean/`"indeterminate"`)을 제어하지만, bp-checkbox는 HTML 속성 문자열로 받는다. 불확정 상태는 반드시 문자열 `"indeterminate"`를 사용해야 한다.
- **`defaultChecked`**: 별도 prop 없음. `checked` 속성이 초기값 역할을 한다(uncontrolled).
- **`onCheckedChange`**: 미지원. 표준 DOM `change` 이벤트 사용.
- **체크마크 시각화**: shadcn은 Radix Indicator를 쓰지만, bp-checkbox는 `bp-icon` 오버레이 + CSS `:checked ~ / :indeterminate ~` 형제 셀렉터로 구현.

## 미지원

- `onCheckedChange` 콜백 → 표준 DOM `change` 이벤트
- `defaultChecked` prop (= `checked` 속성이 동일 역할)
- `asChild` / `Slot`
- `data-checked` 기반 외부 상태 참조

## 함정

`class="..."` 속성은 내부 `<input>`이 아닌 **호스트 요소**에 적용된다. shadcn에서는 `className`이 체크박스 박스 자체에 적용되지만, `bp-checkbox`에서 `class="border-red-500"`을 주면 호스트 래퍼(`relative inline-block size-4`)에 클래스가 머지된다. 내부 input의 border를 바꾸려면 CSS 변수를 사용하거나 `aria-invalid`를 활용한다.

## 예제

```html
<!-- 기본 체크박스 -->
<bp-field orientation="horizontal">
  <bp-checkbox id="terms" name="terms"></bp-checkbox>
  <bp-label for="terms">이용약관에 동의합니다</bp-label>
</bp-field>

<!-- 불확정 상태 (예: 전체 선택 헤더) -->
<bp-checkbox id="select-all" checked="indeterminate"></bp-checkbox>

<!-- 체크된 상태 -->
<bp-checkbox id="agree" checked></bp-checkbox>

<!-- 비활성화 -->
<bp-checkbox disabled></bp-checkbox>
```
