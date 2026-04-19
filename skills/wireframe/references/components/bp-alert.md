# bp-alert

인라인 알림 배너. shadcn `Alert` 패밀리 1:1 포팅. 아이콘 생략 시 variant에 따라 자동 삽입 (bp 전용).

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-alert` | `variant` | `default`(기본) \| `destructive` | 알림 종류. 자동 아이콘 결정 |
| `bp-alert-title` | — | — | 알림 제목 |
| `bp-alert-description` | — | — | 알림 본문 |
| `bp-alert-action` | — | — | 우측 액션 영역 (버튼 등) |

## Composition

```
bp-alert
├── bp-icon 또는 SVG   (선택 — 생략하면 자동 삽입)
├── bp-alert-title
├── bp-alert-description  (선택)
└── bp-alert-action       (선택)
```

## 자동 아이콘

직접 자식으로 `<svg>` 또는 `<bp-icon>`이 없으면 variant에 따라 아이콘이 자동 삽입된다.

| variant | 자동 아이콘 |
|---|---|
| `default` | `info` (circle + i) |
| `destructive` | `circle-x` (circle + ×) |

커스텀 아이콘을 직접 지정하면 자동 삽입이 억제된다.

## shadcn과의 차이

- `className` → `class`
- `ref` / `forwardRef` / `asChild` 미지원
- `font-heading` 미지원 (tailwind-config 미등록) → `font-medium` 사용
- **아이콘 자동 삽입** (bp 전용 — shadcn에 없음). shadcn은 항상 아이콘을 명시해야 함
- `destructive` 자동 아이콘은 `circle-x`. `triangle-alert` 아님

## 예제

```html
<!-- 자동 아이콘 (SVG 생략) -->
<bp-alert>
  <bp-alert-title>결제 완료</bp-alert-title>
  <bp-alert-description>결제가 정상 처리되었습니다.</bp-alert-description>
</bp-alert>

<bp-alert variant="destructive">
  <bp-alert-title>결제 실패</bp-alert-title>
  <bp-alert-description>결제 수단을 확인해주세요.</bp-alert-description>
</bp-alert>

<!-- 커스텀 아이콘 직접 지정 -->
<bp-alert>
  <bp-icon name="circle-check"></bp-icon>
  <bp-alert-title>저장 완료</bp-alert-title>
  <bp-alert-action><bp-button variant="link" size="sm">확인</bp-button></bp-alert-action>
</bp-alert>
```
