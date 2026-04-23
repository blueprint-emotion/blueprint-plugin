# bp-select

커스텀 드롭다운 선택 컴포넌트. `bp-native-select`와 다른 별도 컴포넌트.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-select` | `value` | string | 현재 선택된 item의 value |
| `bp-select` | `open` | boolean | content 패널 열린 상태 고정 |
| `bp-select-trigger` | `size` | `"default"` \| `"sm"` | 트리거 크기 |
| `bp-select-trigger` | `disabled` | boolean | 트리거 비활성화 |
| `bp-select-value` | `placeholder` | string | 미선택 시 표시 텍스트 |
| `bp-select-item` | `value` | string (필수) | 선택 시 bp-select.value로 설정 |
| `bp-select-item` | `disabled` | boolean | 항목 비활성화 |

## Composition

```
bp-select
  bp-select-trigger
    bp-select-value (placeholder="...")
  bp-select-content
    bp-select-group           ← 선택적 그룹
      bp-select-label         ← 그룹 레이블
      bp-select-item (value)  ← 선택 항목
    bp-select-separator       ← 그룹 간 구분선 (선택적)
    bp-select-scroll-up-button    ← 스크롤 위 버튼 (장식)
    bp-select-scroll-down-button  ← 스크롤 아래 버튼 (장식)
```

## shadcn과의 차이

- **키보드 탐색 미지원**: 클릭 전용. shadcn/Radix의 화살표 키·Enter로 항목 이동 없음.
- **Portal 없음**: `bp-select-content`는 bp-select 기준 absolute 포지셔닝. 부모 overflow:hidden 컨텍스트에서 잘릴 수 있음.
- **정적 value 표현**: `value="X"` 속성으로 초기 선택값을 정적으로 지정. `defaultValue`/`defaultOpen` 구분 없음.
- **오픈 상태 고정**: `open` 속성 추가 시 드롭다운이 열린 상태로 고정 (와이어프레임 정적 표현용).
- `position="item-aligned"` 미지원, popper 고정.

## 미지원

- `onValueChange` / `onOpenChange` 콜백 → 표준 DOM `change` 이벤트
- `defaultValue` / `defaultOpen`
- `position="item-aligned"`
- Portal (absolute 포지셔닝으로 대체)
- `asChild` / `Slot`
- `dir` (RTL)
- 키보드 탐색

## 함정

- `bp-select-item`에 `value` 속성은 필수. 누락 시 선택 상태가 갱신되지 않는다.
- 부모에 `overflow: hidden` 또는 `overflow: auto`가 있으면 content가 잘린다. 이 경우 `bp-native-select` 사용을 고려.
- `open` 속성은 정적 표현 전용. 실제 사용 시나리오에서는 트리거 클릭으로 토글.
- **chevron 자동 삽입**: `bp-select-trigger`의 우측 ChevronDown 아이콘은 컴포넌트가 자동으로 추가한다(`<span class="bp-select-chevron">` 생성 + CSS `::after`로 그림). 별도 자식으로 넣지 말 것. `bp-select-scroll-up-button` / `bp-select-scroll-down-button`도 마찬가지로 위/아래 chevron이 자동 삽입됨.

## 예제

```html
<!-- 기본 선택 -->
<bp-select>
  <bp-select-trigger style="width: 12rem;">
    <bp-select-value placeholder="과일 선택"></bp-select-value>
  </bp-select-trigger>
  <bp-select-content>
    <bp-select-group>
      <bp-select-label>과일</bp-select-label>
      <bp-select-item value="apple">사과</bp-select-item>
      <bp-select-item value="banana">바나나</bp-select-item>
      <bp-select-item value="orange">오렌지</bp-select-item>
    </bp-select-group>
  </bp-select-content>
</bp-select>

<!-- 초기 선택값 + 드롭다운 열린 상태 (정적 표현) -->
<bp-select value="banana" open>
  <bp-select-trigger style="width: 12rem;">
    <bp-select-value placeholder="과일 선택"></bp-select-value>
  </bp-select-trigger>
  <bp-select-content>
    <bp-select-group>
      <bp-select-label>과일</bp-select-label>
      <bp-select-item value="apple">사과</bp-select-item>
      <bp-select-item value="banana">바나나</bp-select-item>
      <bp-select-item value="orange" disabled>오렌지 (품절)</bp-select-item>
    </bp-select-group>
  </bp-select-content>
</bp-select>
```
