# bp-input-otp

OTP(일회용 비밀번호) 인증코드 입력 컴포넌트. 개별 슬롯 박스로 구성.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-input-otp` | `maxlength` | 숫자 (기본 `6`) | 총 자릿수 |
| `bp-input-otp` | `disabled` | boolean | 전체 비활성화 |
| `bp-input-otp` | `id` | string | 폼 연결용 |
| `bp-input-otp` | `name` | string | 폼 submit 시 필드명 |
| `bp-input-otp` | `required` | boolean | 필수 입력 |
| `bp-input-otp-slot` | `index` | 숫자 (0-based, 필수) | 슬롯 위치 지정 |
| `bp-input-otp-slot` | `aria-invalid` | boolean | 유효성 오류 표시 |

## Composition

```
bp-input-otp (maxlength)
  bp-input-otp-group
    bp-input-otp-slot (index="0")
    bp-input-otp-slot (index="1")
    bp-input-otp-slot (index="2")
  bp-input-otp-separator        ← 그룹 사이 구분자 (기본 MinusIcon)
  bp-input-otp-group
    bp-input-otp-slot (index="3")
    bp-input-otp-slot (index="4")
    bp-input-otp-slot (index="5")
```

내부적으로 숨겨진 `<input type="text" inputmode="numeric">` 하나로 실제 입력 처리.

## shadcn과의 차이

- **pattern 미지원**: shadcn InputOTP의 `input-otp` 라이브러리 `pattern` 속성(숫자/영문자 제한 등) 미지원. 와이어프레임 정적 표현 목적으로는 불필요.
- **클릭 → 포커스 → 캐럿**: 슬롯 클릭 시 숨겨진 input에 포커스, 현재 입력 위치에 CSS animation 캐럿 표시.
- **항상 uncontrolled**: controlled `value`와 `defaultValue` 구분 없음.
- **`otp-change` 이벤트**: `onChange`/`onComplete` 콜백 대신 `"otp-change"` CustomEvent (`detail: { value }`).

## 미지원

- `pattern` (input-otp 라이브러리 전용)
- `onComplete` / `onChange` 콜백 → `"otp-change"` CustomEvent
- controlled `value` (항상 내부 uncontrolled)
- `defaultValue` vs `value` 구분
- `autoFocus`

## 함정

- `bp-input-otp-slot`의 `index` 속성은 필수. 누락 시 슬롯 위치가 잘못 표시됨.
- 슬롯 수는 `maxlength` 값과 일치해야 한다. 불일치 시 일부 슬롯이 비활성 표시될 수 있음.
- 그룹 수·슬롯 배분은 자유롭게 지정 가능 (3+3, 4+4, 6 단일 그룹 등).

## 예제

```html
<!-- 6자리 OTP (3+3 그룹) -->
<bp-input-otp maxlength="6">
  <bp-input-otp-group>
    <bp-input-otp-slot index="0"></bp-input-otp-slot>
    <bp-input-otp-slot index="1"></bp-input-otp-slot>
    <bp-input-otp-slot index="2"></bp-input-otp-slot>
  </bp-input-otp-group>
  <bp-input-otp-separator></bp-input-otp-separator>
  <bp-input-otp-group>
    <bp-input-otp-slot index="3"></bp-input-otp-slot>
    <bp-input-otp-slot index="4"></bp-input-otp-slot>
    <bp-input-otp-slot index="5"></bp-input-otp-slot>
  </bp-input-otp-group>
</bp-input-otp>

<!-- 4자리 OTP (단일 그룹, 오류 상태) -->
<bp-input-otp maxlength="4">
  <bp-input-otp-group>
    <bp-input-otp-slot index="0" aria-invalid></bp-input-otp-slot>
    <bp-input-otp-slot index="1" aria-invalid></bp-input-otp-slot>
    <bp-input-otp-slot index="2" aria-invalid></bp-input-otp-slot>
    <bp-input-otp-slot index="3" aria-invalid></bp-input-otp-slot>
  </bp-input-otp-group>
</bp-input-otp>
```
