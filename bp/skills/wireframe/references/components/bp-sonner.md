# bp-sonner

토스트 알림의 정적 시각 표현 컴포넌트. shadcn `Toaster`(sonner) 포팅이지만 **동적 `toast()` 함수 미지원** — 와이어프레임 전용 단순화.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-sonner` | `position` | `bottom-right`(기본) \| `bottom-center` \| `bottom-left` \| `top-right` \| `top-center` \| `top-left` | 화면 내 토스트 컨테이너 위치 |
| `bp-toast` | `type` | `default`(기본) \| `success` \| `error` \| `warning` \| `info` \| `loading` | 토스트 종류. 아이콘과 색상 자동 결정 |
| `bp-toast` | `description` | 문자열 | 선택. 두 번째 줄 보조 텍스트 (HTML 속성) |

## Composition

```
bp-sonner
└── bp-toast  (1개 이상)
```

## 자동 아이콘 (type별)

| type | 아이콘 |
|---|---|
| `default` | 없음 |
| `success` | `circle-check` |
| `info` | `info` |
| `warning` | `triangle-alert` |
| `error` | `circle-x` |
| `loading` | `loader` (회전 애니메이션) |

## shadcn과의 차이

- **`toast()` 함수 미지원** — 동적 토스트 생성 불가. `<bp-toast>` 태그를 HTML에 직접 선언
- `duration` / `onDismiss` / `onAutoClose` 등 동적 콜백 미지원
- `richColors` / `expand` / `closeButton` 미지원 (와이어프레임 범위 밖)
- promise toast 미지원 → `type="loading"`으로 정적 표현

## 함정

- **`toast()` 함수 없음**: 실제 sonner에서는 `toast.success("...")` 등으로 JS에서 호출하지만, 와이어프레임에서는 동작하지 않는다. 반드시 `<bp-toast>` 태그를 직접 작성한다.
- `bp-sonner`는 와이어프레임 내 `<bp-page>` 어딘가에 위치하면 되지만, 실제 토스트처럼 화면 고정 오버레이 위에 띄우려면 `position` 속성으로 원하는 위치를 지정한다.

## 예제

```html
<!-- 기본 위치 (bottom-right) -->
<bp-sonner>
  <bp-toast>변경사항이 저장되었습니다.</bp-toast>
</bp-sonner>

<!-- 여러 타입 동시 표현 -->
<bp-sonner position="bottom-right">
  <bp-toast type="success">프로필이 업데이트되었습니다.</bp-toast>
  <bp-toast type="error" description="다시 시도해주세요.">오류가 발생했습니다.</bp-toast>
  <bp-toast type="loading">업로드 중...</bp-toast>
</bp-sonner>
```
