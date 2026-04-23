# bp-empty

빈 상태(Empty State)를 표현하는 composition 컴포넌트. shadcn `Empty` 패밀리 포팅.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-empty` | — | — | 루트 컨테이너. 중앙 정렬 + 점선 테두리 |
| `bp-empty-header` | — | — | 미디어·제목·설명을 묶는 래퍼 |
| `bp-empty-media` | `variant` | `default`(기본) \| `icon` | `icon`: 아이콘 전용 크기(size-12) + 미묘한 bg 원형. `default`: 아바타·이미지용 |
| `bp-empty-title` | — | — | 제목 텍스트 |
| `bp-empty-description` | — | — | 부제목/설명 텍스트 |
| `bp-empty-content` | — | — | 버튼 등 액션 영역 |

## Composition

```
bp-empty
├── bp-empty-header
│   ├── bp-empty-media          (선택 — 아이콘 또는 아바타)
│   │   └── bp-icon (또는 bp-avatar 등)
│   ├── bp-empty-title
│   └── bp-empty-description    (선택)
└── bp-empty-content            (선택 — 버튼 등)
```

## shadcn과의 차이

- `className` → `class`
- `asChild` 미지원

## 함정

- **`variant="icon"` 필수**: `bp-empty-media` 안에 `bp-icon`을 쓸 때 반드시 `variant="icon"` 지정. 생략하면 `default` 처리되어 아이콘이 너무 작게 또는 잘못된 크기로 렌더링된다.
  - 올바른 예: `<bp-empty-media variant="icon"><bp-icon name="inbox"></bp-icon></bp-empty-media>`
  - 잘못된 예: `<bp-empty-media><bp-icon name="inbox"></bp-icon></bp-empty-media>`
- `bp-empty-title` / `bp-empty-description`은 커스텀 엘리먼트라 기본 display가 `inline`. 내부적으로 `block`이 적용되어 있으나, 추가 margin/padding 등은 `class`로 재정의한다.

## 예제

```html
<!-- 아이콘 + CTA -->
<bp-empty>
  <bp-empty-header>
    <bp-empty-media variant="icon">
      <bp-icon name="message-square"></bp-icon>
    </bp-empty-media>
    <bp-empty-title>등록된 문의가 없습니다</bp-empty-title>
    <bp-empty-description>첫 번째 문의를 작성해보세요.</bp-empty-description>
  </bp-empty-header>
  <bp-empty-content>
    <bp-button>문의 작성</bp-button>
  </bp-empty-content>
</bp-empty>

<!-- 아바타형 미디어 (default variant) -->
<bp-empty>
  <bp-empty-header>
    <bp-empty-media>
      <bp-avatar size="lg"><bp-avatar-image src=""></bp-avatar-image></bp-avatar>
    </bp-empty-media>
    <bp-empty-title>팀원이 없습니다</bp-empty-title>
  </bp-empty-header>
</bp-empty>
```
