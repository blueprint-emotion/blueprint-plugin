# bp-field

폼 요소(input/checkbox/switch 등)를 레이블·설명·에러와 함께 구조화하는 composition 컴포넌트. shadcn `Field` 패밀리 1:1 포팅.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-field` | `orientation` | `vertical`(기본) \| `horizontal` | 레이블·입력 배치 방향 |
| `bp-field` | `data-invalid` | `"true"` | 에러 상태. 자식 입력·에러 메시지에 스타일 전파 |
| `bp-field-legend` | `variant` | `legend`(기본) \| `label` | legend: text-base / label: text-sm |
| `bp-field-group` | — | — | 복수 field를 gap-5 수직 스택으로 배치 |
| `bp-field-set` | — | — | field-group들을 gap-4로 묶는 최상위 래퍼 |
| `bp-field-description` | — | — | 보조 설명 텍스트 |
| `bp-field-error` | — | — | 에러 메시지 (data-invalid="true"일 때 표시) |

## Composition

```
bp-field-set
└── bp-field-legend          (선택 — 그룹 제목)
└── bp-field-group
    └── bp-field
        ├── bp-label
        ├── bp-input (또는 bp-textarea, bp-checkbox 등)
        ├── bp-field-description  (선택)
        └── bp-field-error        (선택, data-invalid 시 표시)
```

단일 필드는 `bp-field-set` / `bp-field-group` 없이 `bp-field` 단독 사용 가능.

## shadcn과의 차이

- `orientation="responsive"` 미지원 (`@container` 쿼리 의존)
- `FieldContent`, `FieldTitle`, `FieldSeparator` 미지원
- `group/peer` 유틸 (React 전용) 미지원
- `has-data-checked:*` (checkbox 중첩 스타일) 미지원

## 함정

- **`data-invalid`는 `<bp-field>`에 설정**, 에러 스타일이 자식 전체에 전파됨. `<bp-input>`에 직접 걸지 않는다.
- `bp-field-error`는 `data-invalid="true"` 없이도 DOM에 존재하면 노출될 수 있으므로, 에러 상태일 때만 추가하거나 항상 `data-invalid`와 함께 사용한다.
- `orientation="horizontal"`은 checkbox/radio/switch처럼 레이블이 우측에 붙는 경우에만 사용. input 필드에는 vertical 유지.

## 예제

```html
<!-- 기본 폼 그룹 (이메일 + 비밀번호) -->
<bp-field-set>
  <bp-field-legend variant="label">계정 정보</bp-field-legend>
  <bp-field-group>
    <bp-field>
      <bp-label for="email">이메일</bp-label>
      <bp-input id="email" type="email"></bp-input>
      <bp-field-description>로그인에 사용됩니다.</bp-field-description>
    </bp-field>
    <bp-field data-invalid="true">
      <bp-label for="pw">비밀번호</bp-label>
      <bp-input id="pw" type="password"></bp-input>
      <bp-field-error>8자 이상 입력하세요.</bp-field-error>
    </bp-field>
  </bp-field-group>
</bp-field-set>

<!-- 수평 레이아웃 (checkbox) -->
<bp-field orientation="horizontal">
  <bp-checkbox id="terms"></bp-checkbox>
  <bp-label for="terms">이용약관에 동의합니다</bp-label>
</bp-field>
```
