# bp-combobox

검색 가능한 드롭다운 선택 컴포넌트. Popover + Command 조합 패턴을 단일 컴포넌트로 캡슐화.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-combobox` | `value` | string | 현재 선택된 item의 value. 해당 item 텍스트가 trigger에 표시 |
| `bp-combobox` | `placeholder` | string | 미선택 시 trigger 텍스트 (기본: `"Select..."`) |
| `bp-combobox` | `open` | boolean | 팝오버 패널 열린 상태 고정 |
| `bp-combobox` | `disabled` | boolean | 트리거 비활성화 |
| `bp-combobox-item` | `value` | string (필수) | 선택 시 bp-combobox.value로 설정 |
| `bp-combobox-item` | `disabled` | boolean | 항목 비활성화 |

## Composition

```
bp-combobox (value, placeholder, open, disabled)
  bp-combobox-item (value)   ← 선택 항목, 복수 나열
  bp-combobox-item (value)
  ...
```

내부 구현: trigger 버튼(선택값 텍스트 + ChevronsUpDown 아이콘) + 팝오버 패널(검색 input + item 목록)이 자동 생성된다. 사용자는 `bp-combobox-item`만 자식으로 작성.

## shadcn과의 차이

- **단일 컴포넌트로 래핑**: shadcn Combobox는 독립 컴포넌트가 없고 `Popover + Command` 조합 패턴이다. bp-combobox는 이 패턴을 하나의 Custom Element로 캡슐화한다.
- **Portal 없음**: 팝오버 패널은 bp-combobox 기준 absolute 포지셔닝. 부모 overflow:hidden 컨텍스트에서 잘릴 수 있음.
- **`combobox-change` 이벤트**: `onValueChange` 콜백 대신 `"combobox-change"` CustomEvent 발생 (`detail: { value }`).
- **키보드 목록 탐색 미지원**: 검색 input 타이핑으로 필터링은 가능하나, 목록 내 화살표 키 이동 없음.
- **ChevronsUpDown 아이콘**: shadcn의 ChevronDown 대신 양방향 아이콘 사용.
- `multiple` 선택 / chips 미지원.

## 미지원

- `multiple` 선택 / chips
- `onValueChange` 콜백 → `"combobox-change"` CustomEvent
- `onOpenChange` 콜백 → `"combobox-open-change"` CustomEvent
- 목록 내 화살표 키 탐색 (`autoHighlight`, `keyboard navigation in list`)
- 객체 값 (`itemToStringValue`)
- `asChild` / `forwardRef`

## 함정

- `bp-combobox-item`의 `value` 속성은 필수. 누락 시 선택 상태가 갱신되지 않는다.
- 검색 필터링은 item의 **textContent 기준**으로 동작한다. value 값으로는 검색되지 않음.
- 빈 검색 결과는 `"No results found."` 내장 메시지로 표시됨.

## 예제

```html
<!-- 기본 콤보박스 -->
<bp-combobox placeholder="프레임워크 선택…">
  <bp-combobox-item value="next">Next.js</bp-combobox-item>
  <bp-combobox-item value="nuxt">Nuxt</bp-combobox-item>
  <bp-combobox-item value="remix">Remix</bp-combobox-item>
  <bp-combobox-item value="astro">Astro</bp-combobox-item>
</bp-combobox>

<!-- 초기 선택값 + 팝오버 열린 상태 (정적 표현) -->
<bp-combobox value="next" open placeholder="프레임워크 선택…">
  <bp-combobox-item value="next">Next.js</bp-combobox-item>
  <bp-combobox-item value="nuxt">Nuxt</bp-combobox-item>
  <bp-combobox-item value="remix">Remix</bp-combobox-item>
  <bp-combobox-item value="astro" disabled>Astro (준비 중)</bp-combobox-item>
</bp-combobox>
```
