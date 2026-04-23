# bp-chart-container

정적 SVG 차트 컴포넌트. 6종 차트 타입 지원. `data` 없으면 타입별 플레이스홀더 표시.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-chart-container` | `type` | `"bar"` (기본) \| `"line"` \| `"area"` \| `"pie"` \| `"donut"` \| `"radial"` | 차트 종류 |
| `bp-chart-container` | `height` | CSS 높이 문자열 (기본 `"200px"`) | 차트 높이 |
| `bp-chart-container` | `data` | JSON 배열 문자열 (선택) | 차트 데이터. 각 항목은 숫자 값 필드 포함 |
| `bp-chart-legend-item` | `name` | string | 범례 항목 이름 |
| `bp-chart-legend-item` | `color` | CSS 색상 값 (기본 `var(--chart-1)`) | 범례 색상 |

## Composition

```
bp-chart-container (type, height, data)

<!-- 범례 포함 시 bp-card-footer 안에 -->
bp-chart-legend-content
  bp-chart-legend-item (name, color)
  bp-chart-legend-item (name, color)

<!-- 정적 툴팁 표현 시 -->
bp-chart-tooltip-content
```

`bp-chart-tooltip-content`와 `bp-chart-legend-content`는 정적 표현 전용으로 속성 없음.

## shadcn과의 차이

- **Recharts 미사용**: shadcn ChartContainer는 Recharts 기반이다. bp-chart-container는 바닐라 SVG로 정적 차트를 직접 렌더링한다.
- **ChartConfig/ChartStyle 미지원**: React Context 기반 색상·레이블 구성 불가. 색상은 `--chart-1` ~ `--chart-5` CSS 변수를 자동 순환.
- **실제 인터랙션 없음**: hover tooltip, 클릭 이벤트, 애니메이션 없음. 정적 SVG만 렌더링.
- **data 구조 단순화**: 각 항목의 첫 번째 숫자 값 필드만 추출하여 렌더링. 다중 데이터 시리즈는 첫 번째 시리즈만 표시.
- **격자선·축 레이블 생략**: 와이어프레임 수준 시각화. 세밀한 축 설정 불가.

## 미지원

- `ChartConfig` / `ChartStyle` (React Context 기반)
- `ChartTooltip` (Recharts Tooltip)
- `ChartLegend` (Recharts Legend)
- `indicator="line|dot|dashed"`, `hideLabel`, `hideIndicator`, `formatter` 등 동적 tooltip props
- 실제 인터랙션 (hover tooltip, 클릭 이벤트)
- 다중 데이터 시리즈 (첫 번째 숫자 필드만 사용)

## 함정

- `data` 속성값은 JSON 배열 문자열이다. 작은따옴표로 감싸고, JSON 내부는 큰따옴표 사용: `data='[{"key":"값","num":100}]'`
- `data` 없으면 타입에 맞는 플레이스홀더 SVG가 자동 표시된다. 레이아웃 확인용으로 활용 가능.
- 범례(`bp-chart-legend-content`)는 bp-chart-container 외부에 위치시킨다 (보통 `bp-card-footer`).

## 예제

```html
<!-- 플레이스홀더 차트 -->
<bp-chart-container type="bar" height="200px"></bp-chart-container>

<!-- 데이터 포함 + 범례 -->
<bp-card>
  <bp-card-header>
    <bp-card-title>월별 방문자</bp-card-title>
  </bp-card-header>
  <bp-card-content>
    <bp-chart-container
      type="bar"
      height="200px"
      data='[{"month":"1월","desktop":186,"mobile":80},{"month":"2월","desktop":305,"mobile":200},{"month":"3월","desktop":237,"mobile":120}]'
    ></bp-chart-container>
  </bp-card-content>
  <bp-card-footer>
    <bp-chart-legend-content>
      <bp-chart-legend-item name="Desktop" color="var(--chart-1)"></bp-chart-legend-item>
      <bp-chart-legend-item name="Mobile" color="var(--chart-2)"></bp-chart-legend-item>
    </bp-chart-legend-content>
  </bp-card-footer>
</bp-card>

<!-- 도넛 차트 -->
<bp-chart-container type="donut" height="250px"
  data='[{"label":"Chrome","value":60},{"label":"Safari","value":25},{"label":"기타","value":15}]'
></bp-chart-container>
```
