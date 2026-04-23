# bp-card

shadcn `Card` 1:1 포팅. 헤더/타이틀/설명/액션/콘텐츠/푸터로 구성되는 카드 레이아웃 컴포넌트.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-card` | `size` | `default`(기본) \| `sm` | 패딩/gap 크기 조정 |
| `bp-card-header` | — | — | 속성 없음 |
| `bp-card-title` | — | — | 속성 없음 |
| `bp-card-description` | — | — | 속성 없음 |
| `bp-card-action` | — | — | 속성 없음. 헤더 우상단 액션 슬롯 |
| `bp-card-content` | — | — | 속성 없음 |
| `bp-card-footer` | — | — | 속성 없음 |

## Composition

```
bp-card (size="default|sm")
  bp-card-header
    bp-card-title        ← 제목
    bp-card-description  ← 부제목/설명
    bp-card-action       ← 헤더 우상단 액션 (버튼, 링크 등)
  bp-card-content        ← 본문 자유 슬롯
  bp-card-footer         ← 하단 (배경 muted, border-top)
```

- `bp-card-header`/`bp-card-content`/`bp-card-footer`는 각각 독립 사용 가능. 셋 다 필수는 아님.
- `bp-card-action`은 `bp-card-header` 안에서만 사용. 헤더 우상단 grid 영역으로 배치됨.

## shadcn과의 차이

| 항목 | shadcn | bp-card |
|---|---|---|
| `font-heading` | CardTitle에 적용 | tailwind-config에 heading 폰트 미정의 → `font-medium`만 사용 |
| `@container/card-header` | 컨테이너 쿼리 레이아웃 분기 | 미사용 (와이어프레임에서 불필요) |
| `[.border-b]:pb-4` | Tailwind v4 전용 selector | 생략 |
| `className` | React prop | 표준 `class` 속성 사용 |

## CSS 구조 동작 (`:has` 기반)

다음 동작은 CSS로 처리되며 별도 속성 없이 자동 적용된다.

| 조건 | 동작 |
|------|------|
| `bp-card-footer` 존재 | 카드 하단 padding 제거 (footer 자체 padding 사용) |
| `bp-card > img:first-child` | 카드 상단 padding 제거 + 상단 border-radius |
| `bp-card > img:last-child` | 하단 border-radius |
| `bp-card-action` 존재 | `bp-card-header` grid-template-columns 분기 |

## 예제

```html
<!-- 로그인 카드 -->
<bp-card>
  <bp-card-header>
    <bp-card-title>로그인</bp-card-title>
    <bp-card-description>계정 정보를 입력하세요.</bp-card-description>
    <bp-card-action><bp-button variant="link">회원가입</bp-button></bp-card-action>
  </bp-card-header>
  <bp-card-content>
    <bp-field>
      <bp-label for="login-email">이메일</bp-label>
      <bp-input id="login-email" type="email"></bp-input>
    </bp-field>
    <bp-field>
      <bp-label for="login-pw">비밀번호</bp-label>
      <bp-input id="login-pw" type="password"></bp-input>
    </bp-field>
  </bp-card-content>
  <bp-card-footer>
    <bp-button class="w-full">로그인</bp-button>
  </bp-card-footer>
</bp-card>

<!-- 작은 사이즈 카드 -->
<bp-card size="sm">
  <bp-card-header>
    <bp-card-title>알림</bp-card-title>
  </bp-card-header>
  <bp-card-content>
    <p>새 코멘트가 3개 있습니다.</p>
  </bp-card-content>
</bp-card>
```
