# bp-table

데이터를 행/열로 표시하는 테이블 컴포넌트 패밀리.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-table-row` | `data-state` | `"selected"` | 행 선택 상태 강조 |
| `bp-table-cell` | `colspan` | 숫자 | 셀 열 병합 (소문자) |
| `bp-table-head` | `colspan` | 숫자 | 헤더 셀 열 병합 (소문자) |
| `bp-table-cell` | `rowspan` | 숫자 | 셀 행 병합 (소문자) |
| `bp-table-head` | `rowspan` | 숫자 | 헤더 셀 행 병합 (소문자) |

나머지 서브 컴포넌트(bp-table-header, bp-table-body, bp-table-footer, bp-table-caption)는 별도 속성 없음. 외관 조정은 `class`/`style`로.

## Composition

```
bp-table
  bp-table-caption        ← 선택적 설명
  bp-table-header
    bp-table-row
      bp-table-head       ← th 역할
  bp-table-body
    bp-table-row
      bp-table-cell       ← td 역할
  bp-table-footer         ← 선택적 합계/요약 행
    bp-table-row
      bp-table-cell
```

## shadcn과의 차이

- **DOM 변환**: `bp-table`은 connectedCallback에서 자식 트리를 스캔해 네이티브 `<table>/<thead>/<tbody>/<tfoot>/<tr>/<th>/<td>/<caption>`으로 변환한다. 변환 후 원본 `bp-table-*` 요소는 DOM에서 사라진다.
- **소문자 colspan/rowspan**: React shadcn의 camelCase `colSpan`/`rowSpan` 대신 HTML 표준 소문자 `colspan`/`rowspan`을 사용한다. 대문자로 쓰면 효과 없음.
- **서브 클래스는 빈 Custom Element**: 실제 렌더링 로직은 `bp-table`의 변환 로직이 전담한다.

## 미지원

- `className` → 표준 `class` 사용
- camelCase `colSpan` / `rowSpan` → 소문자 `colspan` / `rowspan`
- 변환 후 `querySelector('bp-table-cell')` 접근 불가 (네이티브 요소로 대체됨)

## 함정

- `colspan`/`rowspan`을 camelCase로 쓰면 병합이 일어나지 않는다. 반드시 소문자.
- 테이블 변환은 `DOMContentLoaded` 후 일괄 실행되므로(`initAllTables` + `convertAllTables`), 페이지 파싱 완료 시점부터 네이티브 `<tr>`/`<td>`로 보인다. `data-feature`/`data-element` 등 모든 `data-*` 속성은 변환 시 네이티브 요소(`<tr>`, `<td>`)로 자동 복사된다.
- 셀 안의 `bp-button`, `bp-badge` 같은 커스텀 엘리먼트는 `appendChild`로 이동되어 Custom Element 기능이 유지된다.

## 예제

```html
<!-- 기본 테이블 -->
<bp-table>
  <bp-table-caption>최근 인보이스</bp-table-caption>
  <bp-table-header>
    <bp-table-row>
      <bp-table-head style="width: 100px;">Invoice</bp-table-head>
      <bp-table-head>Status</bp-table-head>
      <bp-table-head style="text-align: right;">Amount</bp-table-head>
    </bp-table-row>
  </bp-table-header>
  <bp-table-body>
    <bp-table-row>
      <bp-table-cell>INV001</bp-table-cell>
      <bp-table-cell>Paid</bp-table-cell>
      <bp-table-cell style="text-align: right;">$250.00</bp-table-cell>
    </bp-table-row>
    <bp-table-row data-state="selected">
      <bp-table-cell>INV002</bp-table-cell>
      <bp-table-cell>Pending</bp-table-cell>
      <bp-table-cell style="text-align: right;">$150.00</bp-table-cell>
    </bp-table-row>
  </bp-table-body>
  <bp-table-footer>
    <bp-table-row>
      <bp-table-cell colspan="2">Total</bp-table-cell>
      <bp-table-cell style="text-align: right;">$400.00</bp-table-cell>
    </bp-table-row>
  </bp-table-footer>
</bp-table>
```
