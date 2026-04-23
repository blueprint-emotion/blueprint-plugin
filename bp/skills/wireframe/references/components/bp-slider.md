# bp-slider

범위 슬라이더 입력 컴포넌트. 단일 값·수평 방향만 지원한다.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-slider` | `value` | number | 현재 값 |
| `bp-slider` | `min` | number | 최솟값 (기본 0) |
| `bp-slider` | `max` | number | 최댓값 (기본 100) |
| `bp-slider` | `step` | number | 스텝 단위 (기본 1) |
| `bp-slider` | `disabled` | boolean | 비활성화 |
| `bp-slider` | `name` | string | 폼 name |
| `bp-slider` | `aria-label` | string | 접근성 레이블 |
| `bp-slider` | `aria-valuetext` | string | 현재 값 접근성 텍스트 |

## shadcn과의 차이

shadcn `Slider`는 Radix 기반으로 배열 value와 다중 thumb, vertical orientation을 지원하지만, `bp-slider`는 네이티브 `<input type="range">`를 사용하므로 두 가지 하드 제약이 있다.

- **단일 값만 지원**: shadcn에서는 `value={[25, 75]}` 처럼 배열로 다중 thumb을 만들 수 있지만, `bp-slider`는 단일 숫자 값만 받는다.
- **vertical 미지원**: shadcn의 `orientation="vertical"` 기능이 없다. `<input type="range">`의 writing-mode 기반 수직 트릭은 브라우저별로 불안정하여 의도적으로 제외했다.
- **채워진 영역 시각화**: Radix는 별도 Track/Range 요소로 구현하지만, bp-slider는 `linear-gradient`로 input 자체의 배경을 동적으로 계산한다.

## 미지원

- 배열 value (다중 thumb)
- `orientation="vertical"`
- `onValueChange`, `onValueCommit` 콜백 → 표준 DOM `input` / `change` 이벤트
- `inverted` prop
- `asChild` / `Slot`

## 예제

```html
<!-- 기본 슬라이더 -->
<bp-slider value="50" min="0" max="100" step="1"></bp-slider>

<!-- 소수점 스텝 -->
<bp-slider value="3" min="0" max="10" step="0.5"></bp-slider>

<!-- 비활성화 -->
<bp-slider disabled value="75"></bp-slider>
```
