# bp-tabs

탭 내비게이션 컴포넌트. 탭 트리거와 콘텐츠 패널을 연결한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-tabs` | `defaultvalue` | string | 초기 활성 탭 value (필수에 준함) |
| `bp-tabs` | `orientation` | `"horizontal"` (기본) \| `"vertical"` | 탭 목록 방향 |
| `bp-tabs-list` | `variant` | `"default"` (기본) \| `"line"` | 탭 목록 스타일 |
| `bp-tabs-trigger` | `value` | string (필수) | 이 트리거의 탭 식별값 |
| `bp-tabs-trigger` | `disabled` | boolean | 개별 탭 비활성화 |
| `bp-tabs-content` | `value` | string (필수) | 연결된 탭의 식별값 |

## Composition

```
bp-tabs (defaultvalue)
  bp-tabs-list (variant)
    bp-tabs-trigger (value)
    bp-tabs-trigger (value)
  bp-tabs-content (value)
  bp-tabs-content (value)
```

## shadcn과의 차이

- **`defaultvalue` (모두 소문자)**: React `defaultValue`(camelCase)와 달리 HTML 속성은 대소문자를 구분하지 않으므로 모두 소문자로 작성해야 한다. `defaultValue="account"` 로 쓰면 인식되지 않는다.
- **controlled value 미지원**: shadcn에서는 `value` + `onValueChange`로 제어 가능하지만, bp-tabs는 항상 내부 uncontrolled 상태로 동작한다.
- **`dir`, `activationMode`**: Radix 전용 prop으로 bp-tabs에는 없다.
- **orientation 변경**: shadcn의 `group-data-horizontal/tabs:` 조합 Tailwind 패턴 대신, JS가 직접 orientation을 읽어 className을 분기 조립한다.

## 미지원

- `value` prop (controlled) → 항상 uncontrolled
- `onValueChange` 콜백 → `tabs-change` CustomEvent (`detail: { value }`)
- `dir` prop (RTL)
- `activationMode` (Radix 전용)
- `asChild` / `Slot`

## 예제

```html
<!-- 기본 탭 -->
<bp-tabs defaultvalue="account">
  <bp-tabs-list>
    <bp-tabs-trigger value="account">계정</bp-tabs-trigger>
    <bp-tabs-trigger value="password">비밀번호</bp-tabs-trigger>
  </bp-tabs-list>
  <bp-tabs-content value="account">계정 설정 내용…</bp-tabs-content>
  <bp-tabs-content value="password">비밀번호 변경 내용…</bp-tabs-content>
</bp-tabs>

<!-- line variant -->
<bp-tabs defaultvalue="overview">
  <bp-tabs-list variant="line">
    <bp-tabs-trigger value="overview">개요</bp-tabs-trigger>
    <bp-tabs-trigger value="analytics">분석</bp-tabs-trigger>
    <bp-tabs-trigger value="settings" disabled>설정</bp-tabs-trigger>
  </bp-tabs-list>
  <bp-tabs-content value="overview">개요 내용…</bp-tabs-content>
  <bp-tabs-content value="analytics">분석 내용…</bp-tabs-content>
</bp-tabs>
```
