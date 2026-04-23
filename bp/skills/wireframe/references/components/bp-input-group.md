# bp-input-group

입력 필드에 아이콘·텍스트·버튼을 부착하는 composition 컴포넌트. shadcn `InputGroup` 패밀리 포팅.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-input-group` | — | — | 루트 컨테이너 |
| `bp-input-group-input` | (input 속성 전체) | — | **이 컴포넌트 자체가 input이다.** 내부 네이티브 `<input>`에 속성을 프록시. `<bp-input>`·`<input>`을 중첩하지 말 것 |
| `bp-input-group-textarea` | `placeholder`, `rows`, `cols` 등 | — | **이 컴포넌트 자체가 textarea다.** 내부 네이티브 `<textarea>`에 속성을 프록시. `<bp-textarea>`·`<textarea>`를 중첩하지 말 것 |
| `bp-input-group-addon` | `align` | `inline-start`(기본) \| `inline-end` \| `block-start` \| `block-end` | 어댑터 시각적 위치. DOM 순서 무관. **모든 text·button·아이콘은 반드시 이 안에 넣는다** |
| `bp-input-group-button` | `variant` | shadcn Button variant (기본 `ghost`) | 어댑터 안 버튼 스타일 |
| `bp-input-group-button` | `size` | `xs`(기본) \| `sm` \| `icon-xs` \| `icon-sm` | 버튼 크기. `bp-button`의 `icon`과 다른 토큰 집합 — `size="icon"`은 **무효** |
| `bp-input-group-text` | — | — | 어댑터 안 텍스트 스팬 (단위, 접두사 등) |

## Composition

```
bp-input-group
├── bp-input-group-input       (또는 bp-input-group-textarea — 자체가 input/textarea)
└── bp-input-group-addon       (0개 이상, align으로 위치 지정)
    ├── bp-input-group-text    (선택 — 텍스트 스팬)
    ├── bp-input-group-button  (선택 — 버튼)
    └── <bp-icon>              (선택 — 아이콘은 text 없이 addon에 직접)
```

**강제 규칙**:
- `bp-input-group-input`/`-textarea`는 그룹당 1개. 내부에 다른 input 컴포넌트를 **중첩 금지**.
- 버튼·텍스트·아이콘 같은 부착 요소는 **반드시 `bp-input-group-addon`의 자식으로** 넣는다. addon 없이 `bp-input-group`의 최상위 자식으로 두면 정렬이 붙지 않아 input 바깥에 블록으로 뜬다.

## shadcn과의 차이

- `InputGroupCustom` (react-textarea-autosize 기반) 미지원 → 네이티브 textarea로 대체
- `className` → `class`
- `in-data-[slot=combobox-content]` 컨텍스트 스타일 미지원 (와이어프레임 범위 밖)

## 함정

- **"`-input`이 이름에 있으니 wrapper겠지" 오해 금지**: `bp-input-group-input`은 이름과 달리 **자체가 input**이다. shadcn의 `<Input />` 습관으로 안에 `<bp-input>`을 또 넣으면 바깥 래퍼와 안쪽 input이 둘 다 스타일을 가져 박스가 어긋난다.
- **버튼/아이콘을 addon 밖에 두지 말 것**: composition 트리가 시사할 뿐이라 놓치기 쉽다. `bp-input-group-button`·`<bp-icon>`·텍스트는 **무조건 `bp-input-group-addon`의 자식**. addon을 건너뛰면 input 옆에 붙지 않고 아래 블록으로 떨어진다.
- **`size="icon"`은 `bp-button` 토큰이다**: `bp-input-group-button`은 `icon-xs`/`icon-sm`을 쓴다. 두 컴포넌트의 size 집합이 비슷해 보여도 다름 — 아이콘 전용 버튼은 `size="icon-xs"`(기본 높이) 또는 `size="icon-sm"`.
- **DOM 순서 vs 시각 위치**: `align` 속성(`order-first`/`order-last` CSS)이 시각적 위치를 결정하므로 DOM 순서와 화면 위치가 달라도 정상 렌더링된다. 관례적으로 input/textarea를 먼저 쓰고 addon을 뒤에 쓰지만, CSS가 보정하므로 순서가 달라도 동작한다.
- `bp-input-group-text`는 addon 안에서 텍스트를 감싸는 스팬. 아이콘만 쓸 때는 text 없이 addon에 직접 `<bp-icon>` 삽입.

## 예제

```html
<!-- 아이콘 + 결과 수 (좌우 addon) -->
<bp-input-group>
  <bp-input-group-input placeholder="검색어를 입력하세요..."></bp-input-group-input>
  <bp-input-group-addon><bp-icon name="search"></bp-icon></bp-input-group-addon>
  <bp-input-group-addon align="inline-end">12 results</bp-input-group-addon>
</bp-input-group>

<!-- 비밀번호 + 가시성 토글 (가장 흔한 패턴) -->
<bp-input-group>
  <bp-input-group-input type="password" placeholder="비밀번호"></bp-input-group-input>
  <bp-input-group-addon align="inline-end">
    <bp-input-group-button size="icon-xs" variant="ghost">
      <bp-icon name="eye"></bp-icon>
    </bp-input-group-button>
  </bp-input-group-addon>
</bp-input-group>

<!-- 통화 접두사·접미사 -->
<bp-input-group>
  <bp-input-group-addon><bp-input-group-text>$</bp-input-group-text></bp-input-group-addon>
  <bp-input-group-input placeholder="0.00"></bp-input-group-input>
  <bp-input-group-addon align="inline-end"><bp-input-group-text>USD</bp-input-group-text></bp-input-group-addon>
</bp-input-group>

<!-- textarea + 하단 툴바 -->
<bp-input-group>
  <bp-input-group-textarea placeholder="댓글을 입력하세요..."></bp-input-group-textarea>
  <bp-input-group-addon align="block-end">
    <bp-input-group-text>0/280</bp-input-group-text>
    <bp-input-group-button variant="default" size="sm" style="margin-left: auto;">Post</bp-input-group-button>
  </bp-input-group-addon>
</bp-input-group>
```
