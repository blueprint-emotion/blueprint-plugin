# Wireframe 생성 규칙

## DOM 구조

- feature 컨테이너는 **중첩**한다 (상위가 하위를 감쌈)
- 메타데이터 JSON의 계층 구조와 DOM 중첩이 1:1 대응
- 모든 feature → `<bp-section data-feature="..." data-label="...">` — elements와 하위 features 공존 가능

## 속성 규칙

| 속성 | 대상 | 용도 |
|------|------|------|
| `data-feature` | feature 컨테이너 | featureId 값. 호버 강조 + 코멘트 앵커 |
| `data-label` | feature 컨테이너 | 한국어 표시명 (코멘트 UI용) |
| `data-el` | 개별 UI 요소 | ELEMENT_ID 짧은 키. 부모 `data-feature` 스코프 내 유니크 |

### `data-el` 배치 규칙

- 레이블 입력 → `<bp-field data-el="...">`로 래핑
- 단독 버튼/링크 → 요소 자체에 `data-el`
- 복합 영역 → `<div data-el="...">`

```html
<bp-section data-feature="AUTH" data-label="인증">
  <bp-section data-feature="AUTH__LOGIN" data-label="로그인">
    <bp-field label="이메일" data-el="EMAIL">
      <bp-input type="email" placeholder="이메일" />
    </bp-field>
    <bp-button data-el="SUBMIT">로그인</bp-button>

    <bp-section data-feature="AUTH__LOGIN__MFA" data-label="2단계 인증">
      <bp-input-otp length="6" data-el="CODE"></bp-input-otp>
      <bp-button data-el="VERIFY">인증 확인</bp-button>
    </bp-section>
  </bp-section>
</bp-section>
```

## 컴포넌트 시스템

`bp-*` 웹 컴포넌트 라이브러리를 사용한다. Head에 `base.css` + `bp-components.js` + Tailwind CDN 포함.

- UI 요소는 `bp-*` 컴포넌트 사용 (raw `<input>`, `<button>` 금지)
- 색상은 시맨틱 토큰 (`bg-primary`, `text-foreground`, `bg-muted` 등)
- raw 색상 (`bg-zinc-*`, `text-red-*` 등) 사용 금지
- 다크모드: `base.css`가 자동 처리. 수동 `dark:` 접두사 불필요

## 상태 탭

`<bp-state-tab>` 컴포넌트로 상태 전환. 자식에 `slot="상태명"` 사용:

```html
<bp-state-tab>
  <div slot="기본">기본 상태 UI</div>
  <div slot="에러">에러 상태 UI</div>
</bp-state-tab>
```

## 화면 프레임

`<bp-page>` 컴포넌트가 셸 자동 구성:

```html
<body class="bg-background text-foreground font-sans">
  <bp-page description>
    <div slot="header" class="px-6 py-3">Header</div>
    <div slot="footer" class="px-6 py-3">Footer</div>
    <!-- 메인 콘텐츠 -->
  </bp-page>
</body>
```

## 메타데이터 (`blueprint-meta`)

`<head>` 내 `<!-- @META -->` ~ `<!-- @END:META -->` 마커 안에 `<script type="application/json" id="blueprint-meta">`로 배치.

```json
{
  "generator": "blueprint-wireframe-skill",
  "version": "2.0",
  "type": "screen",
  "screenId": "LOGIN",
  "title": "로그인",
  "viewport": "pc",
  "purpose": "화면 목적 설명",
  "features": [...]
}
```

- `features[]`는 재귀 (하위 feature 중첩)
- 각 feature에 elements와 features 공존 가능
- `elements[].id`는 ELEMENT_ID (featureId 접두사 없이 짧은 키)

## 고정 영역

화면 명세에 헤더/푸터에 대한 언급이 없으면 기존 헤더/푸터를 건드리지 않는다. 화면 명세에 명시된 고정 영역은 `data-feature`/`data-el` 없이 `<bp-page>`의 header/footer 슬롯에 렌더링.
