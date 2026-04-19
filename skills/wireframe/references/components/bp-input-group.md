# bp-input-group

입력 필드에 아이콘·텍스트·버튼을 부착하는 composition 컴포넌트. shadcn `InputGroup` 패밀리 포팅.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-input-group` | — | — | 루트 컨테이너 |
| `bp-input-group-input` | (input 속성 전체) | — | `<input>` 속성을 내부 네이티브 input에 프록시 |
| `bp-input-group-textarea` | `placeholder`, `rows`, `cols` 등 | — | `<textarea>` 속성을 내부 네이티브 textarea에 프록시 |
| `bp-input-group-addon` | `align` | `inline-start`(기본) \| `inline-end` \| `block-start` \| `block-end` | 어댑터 시각적 위치. DOM 순서 무관 |
| `bp-input-group-button` | `variant` | shadcn Button variant (기본 `ghost`) | 어댑터 안 버튼 스타일 |
| `bp-input-group-button` | `size` | `xs`(기본) \| `sm` \| `icon-xs` \| `icon-sm` | 버튼 크기 |
| `bp-input-group-text` | — | — | 어댑터 안 텍스트 스팬 (단위, 접두사 등) |

## Composition

```
bp-input-group
├── bp-input-group-input       (또는 bp-input-group-textarea)
└── bp-input-group-addon       (1개 이상, align으로 위치 지정)
    ├── bp-input-group-text    (선택 — 텍스트 스팬)
    └── bp-input-group-button  (선택 — 버튼)
```

## shadcn과의 차이

- `InputGroupCustom` (react-textarea-autosize 기반) 미지원 → 네이티브 textarea로 대체
- `className` → `class`
- `in-data-[slot=combobox-content]` 컨텍스트 스타일 미지원 (와이어프레임 범위 밖)

## 함정

- **DOM 순서 vs 시각 위치**: `align` 속성(`order-first`/`order-last` CSS)이 시각적 위치를 결정하므로 DOM 순서와 화면 위치가 달라도 정상 렌더링된다. 관례적으로 input/textarea를 먼저 쓰고 addon을 뒤에 쓰지만, CSS가 보정하므로 순서가 달라도 동작한다.
- `bp-input-group-text`는 addon 안에서 텍스트를 감싸는 스팬. 아이콘만 쓸 때는 text 없이 addon에 직접 SVG/bp-icon 삽입.

## 예제

```html
<!-- 아이콘 + 결과 수 (좌우 addon) -->
<bp-input-group>
  <bp-input-group-input placeholder="검색어를 입력하세요..."></bp-input-group-input>
  <bp-input-group-addon><bp-icon name="search"></bp-icon></bp-input-group-addon>
  <bp-input-group-addon align="inline-end">12 results</bp-input-group-addon>
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
