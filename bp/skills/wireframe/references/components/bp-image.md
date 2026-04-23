# bp-image

bp 전용 — shadcn에 없는 와이어프레임 전용 컴포넌트. `src` 없으면 플레이스홀더(muted 배경 + 이미지 아이콘), 있으면 `<figure>/<img>` 실제 이미지.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-image` | `src` | URL | 이미지 URL. 생략 시 플레이스홀더 |
| `bp-image` | `alt` | 문자열 | alt 텍스트. 플레이스홀더일 때는 레이블로 표시됨 |
| `bp-image` | `aspect-ratio` | CSS 비율 (기본 `"16/9"`) | `"1/1"`, `"4/3"`, `"3/2"` 등 |
| `bp-image` | `width` | CSS width (기본 `"100%"`) | 컨테이너 너비 |
| `bp-image` | `height` | CSS height | 지정 안 하면 `aspect-ratio`로 자동 결정 |
| `bp-image` | `fit` | `cover`(기본) \| `contain` \| `fill` \| `none` | CSS `object-fit` |
| `bp-image` | `rounded` | boolean | 있으면 `rounded-lg` 적용 |
| `bp-image` | `caption` | 문자열 | `<figcaption>` 텍스트 (실제 이미지 아래에 표시) |

## shadcn과의 차이

shadcn 포팅이 아닌 자체 컴포넌트이므로 비교 대상은 Next.js `<Image>`다.

## 미지원

Next.js `<Image>` 전용 prop: `priority`, `sizes`, `fill` (layout fill), `placeholder="blur"`, `blurDataURL`.

## 함정

- `caption`은 `src`가 있을 때만 `<figcaption>`으로 렌더링된다. 플레이스홀더 상태에서는 무시된다.
- `alt`를 지정하면 플레이스홀더 상태에서 이미지 아이콘 아래에 레이블 텍스트로 표시된다.
- `width`와 `height`를 둘 다 지정하면 `aspect-ratio`는 무시된다.

## 예제

```html
<!-- 플레이스홀더 -->
<bp-image aspect-ratio="16/9"></bp-image>
<bp-image aspect-ratio="1/1" width="8rem" alt="프로필 사진"></bp-image>

<!-- 실제 이미지 -->
<bp-image src="https://picsum.photos/800/450" alt="풍경" aspect-ratio="16/9" rounded></bp-image>

<!-- 캡션 + contain fit -->
<bp-image
  src="https://picsum.photos/400/400"
  alt="로고"
  aspect-ratio="1/1"
  fit="contain"
  caption="Figure 1. 제품 로고"
></bp-image>
```
