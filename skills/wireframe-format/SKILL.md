---
name: wireframe-format
description: Blueprint 호환 HTML 와이어프레임의 DOM 구조, 속성 규칙, 컴포넌트 시스템, 메타데이터 포맷, 디자인 원칙을 정의한다. wireframer 에이전트가 와이어프레임을 생성할 때 참조하며, 사용자가 "와이어프레임 포맷", "DOM 규칙" 등을 확인할 때도 사용한다.
user-invocable: false
license: MIT
metadata:
  author: blueprint-emotion
  version: "5.0.0"
---

# Blueprint 와이어프레임 포맷

와이어프레임 HTML의 DOM 구조, 속성 규칙, 컴포넌트 시스템, 메타데이터 포맷, 디자인 원칙을 정의한다.
이 스킬은 `wireframer` 에이전트가 와이어프레임을 생성할 때 참조하는 포맷 지식이다.

## 입력 파일

### 화면 명세 (docs/screens/{SCREEN_ID}/{screenId 소문자}_screen.md)

frontmatter에서 기본 정보를, `## Screen` > `### 레이아웃`에서 기능 배치를 읽는다.

레이아웃 참조 문법: `@{DOMAIN}/{TOC_ID_PATH}`

### 기능 명세 (docs/features/{DOMAIN}.md)

frontmatter TOC에서 기능 계층을 읽는다. 비즈니스 로직 — 도메인 맥락 참고용 (wireframer가 UI를 자율 판단하는 데 참고).

화면명세의 레이아웃 + Requirement + UserStory가 wireframer의 주 입력 소스이며, 기능 명세는 도메인 맥락을 보충하는 보조 입력이다.

---

## DOM 구조

feature 컨테이너는 **중첩**한다 (상위가 하위를 감쌈).
메타데이터 JSON의 계층 구조와 DOM 중첩이 1:1 대응.

### feature 컨테이너

**모든 feature**: `<bp-section data-feature="..." data-label="...">` — feature는 elements와 하위 features를 동시에 가질 수 있다.

```html
<bp-section data-feature="AUTH" data-label="인증">
  <bp-section data-feature="AUTH__LOGIN" data-label="로그인">
    <bp-field label="이메일" data-el="EMAIL">
      <bp-input type="email" placeholder="이메일" />
    </bp-field>
    <bp-button data-el="SUBMIT">로그인</bp-button>

    <!-- 하위 feature -->
    <bp-section data-feature="AUTH__LOGIN__MFA" data-label="2단계 인증">
      <bp-input-otp length="6" data-el="CODE"></bp-input-otp>
      <bp-button data-el="VERIFY">인증 확인</bp-button>
    </bp-section>
  </bp-section>
</bp-section>
```

### 속성 규칙

| 속성 | 대상 | 용도 |
|------|------|------|
| `data-feature` | feature 컨테이너 | featureId 값. 호버 강조 + 코멘트 앵커 |
| `data-label` | feature 컨테이너 | 한국어 표시명 (코멘트 UI용) |
| `data-el` | 개별 UI 요소 | 짧은 ELEMENT_ID. 부모 `data-feature` 스코프 내 유니크 |

### `data-el` 배치 규칙

- 레이블이 있는 입력 요소 → `<bp-field>` 래퍼에 `data-el` (bp-field가 레이블+컨트롤을 함께 감쌈)
- 단독 버튼·링크 → 요소 자체에 `data-el`
- 복합 영역 (카드 목록, 필터 그룹 등) → 래퍼 `<div>`에 `data-el`

```html
<!-- bp-field로 감싸진 입력 요소 -->
<bp-field label="이메일" data-el="EMAIL">
  <bp-input type="email" placeholder="이메일" />
</bp-field>

<!-- 단독 버튼 -->
<bp-button data-el="SUBMIT">로그인</bp-button>

<!-- 복합 영역 -->
<div data-el="CARDS" class="grid grid-cols-3 gap-3">
  <bp-card title="상품 1">...</bp-card>
  <bp-card title="상품 2">...</bp-card>
</div>
```

### HTML 유효성 규칙

`data-feature` 래퍼는 반드시 **block-level 요소**(`<div>`, `<bp-section>`, `<section>`, `<aside>`, `<nav>`, `<main>`)를 사용한다.

`<span>` 등 inline 요소를 `data-feature` 래퍼로 사용하면 안 된다. inline 요소 안에 block 요소가 들어가면 브라우저가 DOM을 자동 보정하여 의도한 중첩 구조가 깨진다.

### 고정 영역

메뉴바, 상태바 등 화면 명세에 명시된 고정 영역은 `data-feature`/`data-el` 없이 `<bp-page>`의 header/footer 슬롯에 렌더링.

---

## 컴포넌트 시스템

Blueprint 와이어프레임은 `bp-*` 웹 컴포넌트 라이브러리를 사용한다. `<head>`에 다음을 포함한다:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{화면 제목}</title>
  <link rel="stylesheet" href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/base.css" />
  <script type="module" src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/bp-components.js"></script>
  <style type="text/tailwindcss">
    @custom-variant dark (&:is(.dark *));
    @theme inline {
      --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      --color-background: var(--background);
      --color-foreground: var(--foreground);
      --color-card: var(--card);
      --color-card-foreground: var(--card-foreground);
      --color-popover: var(--popover);
      --color-popover-foreground: var(--popover-foreground);
      --color-primary: var(--primary);
      --color-primary-foreground: var(--primary-foreground);
      --color-secondary: var(--secondary);
      --color-secondary-foreground: var(--secondary-foreground);
      --color-muted: var(--muted);
      --color-muted-foreground: var(--muted-foreground);
      --color-accent: var(--accent);
      --color-accent-foreground: var(--accent-foreground);
      --color-destructive: var(--destructive);
      --color-border: var(--border);
      --color-input: var(--input);
      --color-ring: var(--ring);
      --radius-sm: calc(var(--radius) * 0.6);
      --radius-md: calc(var(--radius) * 0.8);
      --radius-lg: var(--radius);
      --radius-xl: calc(var(--radius) * 1.4);
      --radius-2xl: calc(var(--radius) * 1.8);
    }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- @META -->
  <script type="application/json" id="blueprint-meta">{ ... }</script>
  <!-- @END:META -->
</head>
```

**로딩 순서** (반드시 준수):
1. `base.css` — CSS 커스텀 프로퍼티 (디자인 토큰, 다크모드 변수)
2. `bp-components.js` (`type="module"`) — 웹 컴포넌트 등록
3. `<style type="text/tailwindcss">` — 다크모드 변형 + Tailwind ↔ CSS 변수 매핑 (`@theme inline`)
4. Tailwind CDN v4

### 색상 시스템

시맨틱 색상 토큰을 사용한다. raw 색상(`zinc-800`, `red-500` 등) 사용 금지.

| 토큰 | 용도 | Tailwind 예시 |
|------|------|---------------|
| `background` / `foreground` | 페이지 기본 | `bg-background text-foreground` |
| `card` / `card-foreground` | 카드 | `bg-card text-card-foreground` |
| `primary` / `primary-foreground` | 주요 액션 | `bg-primary text-primary-foreground` |
| `secondary` / `secondary-foreground` | 보조 액션 | `bg-secondary text-secondary-foreground` |
| `muted` / `muted-foreground` | 음소거/보조 | `bg-muted text-muted-foreground` |
| `destructive` | 위험/삭제 | `text-destructive` |
| `border` | 테두리 | `border-border` |
| `input` | 입력 테두리 | `border-input` |

**다크모드**: `base.css`가 `.dark` 클래스에서 모든 토큰을 자동 전환한다. `dark:bg-zinc-800` 같은 수동 다크모드 클래스 불필요.

---

## 컴포넌트 카탈로그

UI 요소는 raw HTML 대신 `bp-*` 컴포넌트를 사용한다. 각 컴포넌트는 속성(attributes)으로 설정한다.

### 입력

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-input>` | `placeholder`, `type`, `disabled`, `value` | 텍스트 입력 |
| `<bp-textarea>` | `placeholder`, `rows`, `disabled`, `value` | 여러 줄 입력 |
| `<bp-checkbox>` | `label`, `checked`, `disabled` | 체크박스 |
| `<bp-radio-group>` | `name`, `value` | 라디오 컨테이너 |
| `<bp-radio-item>` | `value`, `label` | 라디오 항목 (bp-radio-group 자식) |
| `<bp-switch>` | `label`, `checked`, `disabled` | 토글 스위치 |
| `<bp-slider>` | `min`, `max`, `value`, `step`, `disabled` | 슬라이더 |
| `<bp-field>` | `label`, `description`, `error` | 폼 필드 래퍼 (자식을 컨트롤로 배치) |
| `<bp-label>` | (텍스트 콘텐츠) | 라벨 |
| `<bp-input-otp>` | `length` | OTP 입력 (기본 6자리) |
| `<bp-native-select>` | `size`, `disabled` | 셀렉트 (자식 `<option>`) |

### 액션

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-button>` | `variant`, `size`, `disabled` | 버튼. variant: default / outline / secondary / ghost / destructive / link. size: xs / sm / default / lg |
| `<bp-dropdown>` | `label` | 드롭다운. 자식: `<bp-dropdown-item>`, `<bp-dropdown-separator>`, `<bp-dropdown-label>` |

### 레이아웃

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-card>` | `title`, `description`, `footer` | 카드 (자식 → content) |
| `<bp-accordion>` + `<bp-accordion-item>` | `title`, `open` | 아코디언 |
| `<bp-collapsible>` | `title`, `open` | 접기/펼치기 |
| `<bp-separator>` | `orientation`, `label` | 구분선 |
| `<bp-scroll-area>` | `height` | 스크롤 영역 |
| `<bp-sidebar>` | `width`, `side` | 사이드바 레이아웃. 자식: `<bp-sidebar-content>` + `<bp-sidebar-main>` |

### 데이터 표시

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-table>` | — | 테이블 래퍼 (자식 `<table>`, 스타일 자동 적용) |
| `<bp-badge>` | `variant` | 뱃지. variant: default / secondary / destructive / outline |
| `<bp-avatar>` | `src`, `fallback`, `size` | 아바타. size: sm / md / lg |
| `<bp-stat>` | `label`, `value`, `trend`, `trend-value`, `description` | KPI 카드. trend: up / down / neutral |
| `<bp-chart>` | `type`, `title`, `height` | 차트. type: bar / line / pie |
| `<bp-kbd>` | (텍스트 콘텐츠) | 키보드 단축키 |
| `<bp-spinner>` | — | 로딩 스피너 |
| `<bp-skeleton>` | `width`, `height` | 로딩 스켈레톤 |
| `<bp-progress>` | `value`, `label` | 진행률 (0–100) |
| `<bp-carousel>` | — | 캐러셀 (직접 자식 = 슬라이드) |
| `<bp-empty>` | `icon`, `title`, `description` | 빈 상태. icon: inbox / file / search |
| `<bp-calendar>` | — | 달력 |
| `<bp-image>` | `ratio`, `width`, `height`, `label` | 이미지 플레이스홀더 |

### 네비게이션

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-tabs>` + `<bp-tab>` | `label`, `active` | 탭 |
| `<bp-breadcrumb>` + `<bp-breadcrumb-item>` | `href` | 브레드크럼 |
| `<bp-pagination>` | `total`, `current`, `siblings` | 페이지네이션 |

### 오버레이 / 피드백

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-dialog>` | `trigger`, `title`, `description` | 다이얼로그 (trigger 없으면 인라인 미리보기) |
| `<bp-alert-dialog>` | `trigger`, `title`, `description`, `confirm-label`, `cancel-label` | 확인 다이얼로그 |
| `<bp-drawer>` | `trigger`, `title`, `description`, `side` | 드로어. side: bottom / top / left / right |
| `<bp-sheet>` | `trigger`, `title`, `description`, `side` | 시트. side: right / left / top / bottom |
| `<bp-popover>` | `trigger` | 팝오버 (자식 → 콘텐츠) |
| `<bp-hover-card>` | `trigger` | 호버 카드 (자식 → 카드) |
| `<bp-tooltip>` | `content` | 툴팁 (자식 → 트리거) |
| `<bp-command>` | `placeholder` | 커맨드 팔레트. 자식: `<bp-command-group>` > `<bp-command-item>` |
| `<bp-sonner>` | `trigger`, `title`, `description`, `variant` | 토스트. variant: default / success / error / warning |
| `<bp-alert>` | `variant`, `title`, `description` | 인라인 알림. variant: default / destructive |

### 와이어프레임 전용

| 컴포넌트 | 주요 속성 | 용도 |
|---------|----------|------|
| `<bp-page>` | `description` | 와이어프레임 셸. 메타바 + 본문 프레임 자동 생성. `description` 시 aside 요소 패널 표시. 자식의 `slot="header"` / `slot="footer"` 배분 |
| `<bp-section>` | `data-feature`, `data-label` | feature 컨테이너. 라벨 자동 표시 |
| `<bp-state-tab>` | — | 상태 탭 (자식에 `slot="상태명"`) |

---

## 상태 탭

같은 기능의 2~4개 상호배타 형제 상태를 비교할 때 사용한다.
리뷰 컨트롤이지, 제품 UI가 아니다.

상태는 화면명세 Requirement의 Given/When/Then 시나리오에서 파생한다. wireframer가 시나리오를 분석하여 렌더링이 필요한 상태를 자율적으로 판단한다.

`<bp-state-tab>` 컴포넌트를 사용하며, 자식에 `slot="상태명"` 속성으로 각 상태 패널을 정의한다.

```html
<bp-section data-feature="AUTH__LOGIN" data-label="로그인">
  <bp-state-tab>
    <div slot="기본">
      <!-- 기본 상태 UI -->
      <bp-field label="이메일" data-el="EMAIL">
        <bp-input type="email" placeholder="이메일" />
      </bp-field>
      <bp-button data-el="SUBMIT">로그인</bp-button>
    </div>
    <div slot="에러">
      <!-- 에러 상태 UI -->
      <bp-field label="비밀번호" error="비밀번호가 올바르지 않습니다" data-el="PASSWORD">
        <bp-input type="password" />
      </bp-field>
      <bp-button data-el="SUBMIT">로그인</bp-button>
    </div>
  </bp-state-tab>
</bp-section>
```

- `slot` 속성값이 탭 이름이 된다
- 첫 번째 slot이 기본 표시 상태
- 클릭으로 상태 전환
- `bp-state-tab`은 `bp-section`(`data-feature`) 내부에 배치

렌더링할 만한 케이스:
- 빈 상태 / 로딩 / 에러
- 활성 vs 비활성 액션
- 권한 기반 가용성
- 성공 / 실패 피드백

상태 패널 내 `data-el` 재사용: 같은 요소가 여러 패널에 존재해도 상호배타이므로 허용.

구현 예시: [references/SINGLE-FEATURE.md](references/SINGLE-FEATURE.md), [references/MULTI-FEATURE.md](references/MULTI-FEATURE.md)

---

## 메타데이터 (`blueprint-meta`)

`<head>` 내 `<!-- @META -->` ~ `<!-- @END:META -->` 마커 안에 `<script type="application/json" id="blueprint-meta">`로 배치. partial-update 시 @META 블록 전체가 교체 단위.
> 기계 판독 가능한 메타데이터 스키마: [`schema/blueprint-meta.schema.json`](../../schema/blueprint-meta.schema.json)

```json
{
  "generator": "blueprint-wireframe-skill",
  "version": "2.0",
  "type": "screen",
  "screenId": "LOGIN",
  "title": "로그인",
  "viewport": "pc",
  "purpose": "화면 목적 설명",
  "features": [
    {
      "featureId": "AUTH",
      "label": "인증",
      "features": [
        {
          "featureId": "AUTH__LOGIN",
          "label": "로그인",
          "elements": [
            { "id": "EMAIL", "type": "input", "label": "이메일", "description": "역할 설명" }
          ]
        }
      ]
    }
  ]
}
```

### 필수 최상위 필드

`generator` (고정 `"blueprint-wireframe-skill"`), `version` (`"2.0"`), `type` (`"screen"` | `"modal"`), `screenId`, `title`, `purpose`, `features` (1개 이상).

`type`이 `"modal"`이면 `modalId`도 필수.

선택: `viewport` (`"pc"` | `"mobile"`).

### `features[]` 필드 (재귀)

| 필드 | 필수 | 설명 |
|------|------|------|
| `featureId` | Yes | TOC 파생 ID |
| `label` | Yes | 한국어 표시명 |
| `elements` | 선택 | 추적 요소 배열. elements와 features는 공존 가능 |
| `features` | 선택 | 하위 feature 배열 (재귀). elements와 features는 공존 가능 |

### `elements[]` 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `id` | Yes | 짧은 ELEMENT_ID (부모 feature 스코프 내 유니크) |
| `type` | Yes | input, button, text, select, table, list 등 |
| `label` | Yes | 한국어 표시명 |
| `description` | Yes | 기능적 역할 설명. 액션 요소는 클릭 시 결과도 포함 |

### elementId 네이밍 가이드

wireframer는 화면명세의 Requirement와 레이아웃을 분석하여 필요한 UI 요소를 판단하고, UPPER_SNAKE_CASE 형식의 element ID를 자율적으로 부여한다.

- UPPER_SNAKE_CASE만 사용 (대문자, 밑줄)
- 부모 data-feature 스코프 내에서 유니크
- 가능한 짧게 (1~2 단어)
- 한국어 음역이 아닌 영문 의미 번역 (예: "검색창" → SEARCH)

---

## 디자인 원칙

- 목표는 **구조 검증**이지 예쁜 UI가 아니다. 하지만 리뷰어가 구조를 편하게 읽을 수 있어야 한다
- 시맨틱 색상 토큰만 사용 (컴포넌트 시스템 섹션 참조)
- 컴포넌트가 존재하는 UI 요소는 반드시 `bp-*` 컴포넌트를 사용

### 화면 프레임

`<bp-page>` 컴포넌트가 와이어프레임 셸을 자동 구성한다:

```html
<body class="bg-background text-foreground font-sans">
  <bp-page description>
    <div slot="header" class="px-6 py-3">Header</div>
    <div slot="footer" class="px-6 py-3">Footer</div>

    <!-- 메인 콘텐츠 -->
  </bp-page>
</body>
```

- `<bp-page>`: 메타바(상단) + 본문 프레임(header/main/footer) 자동 생성
- `description` 속성: aside 패널에 요소 목록 표시 + 호버 하이라이트
- `slot="header"` / `slot="footer"`: 헤더/푸터. 없으면 빈 영역
- 나머지 자식 → main 슬롯
- 모바일은 body에 `class="... max-w-[400px] mx-auto"` 추가

### 고정 영역 (헤더/푸터)

기본은 **라벨만 표시**한다. 커스텀이 필요한 화면에서만 내용을 채운다.

```html
<!-- 기본: 라벨만 -->
<div slot="header" class="px-6 py-3">Header</div>

<!-- 커스텀 필요 시 -->
<div slot="header" class="flex items-center justify-between px-6 py-3">
  <span class="text-xs text-muted-foreground">ShopName</span>
  <div class="flex items-center gap-3 text-xs text-muted-foreground">
    <span>검색</span>
    <span>장바구니</span>
  </div>
</div>
```

### 컴포넌트 사용 원칙

| 케이스 | 사용 |
|--------|------|
| 텍스트 입력 | `<bp-field label="..."><bp-input /></bp-field>` |
| 버튼 | `<bp-button variant="...">텍스트</bp-button>` |
| 셀렉트 | `<bp-native-select><option>...</option></bp-native-select>` |
| 카드 | `<bp-card title="...">내용</bp-card>` |
| 빈 상태 | `<bp-empty icon="..." title="..." description="..." />` |
| 이미지 자리 | `<bp-image ratio="4/3" label="..." />` |
| KPI 통계 | `<bp-stat label="..." value="..." trend="up" trend-value="+12%" />` |
| 테이블 | `<bp-table><table>...</table></bp-table>` |
| 확인 팝업 | `<bp-alert-dialog trigger="삭제" title="..." description="..." />` |

### 플레이스홀더

- 아이콘: `<div class="size-4 rounded bg-muted"></div>`
- 이미지: `<bp-image ratio="4/3" label="..." />`
- 아바타: `<bp-avatar fallback="AB" size="sm" />`
- 장식 과다 금지: `shadow-sm`이나 `ring-1`은 컴포넌트가 처리

### Tailwind

Tailwind CSS v4: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`

- 기본 텍스트: `text-sm`, 보조 텍스트: `text-xs text-muted-foreground`
- 헤딩: `text-base font-semibold`, 큰 헤딩: `text-lg font-semibold`
- 타이트 그룹: `gap-2`, 카드 그리드: `gap-3`, 섹션 간: `gap-5`
- **금지**: `bg-zinc-*`, `text-zinc-*`, `border-zinc-*` 등 raw 색상 클래스. 시맨틱 토큰을 사용

레이아웃 예시: [references/MULTI-FEATURE.md](references/MULTI-FEATURE.md) (두 영역 레이아웃)

---

## 모달 파일

모달(다이얼로그, 확인 팝업 포함)은 메인 와이어프레임에 포함하지 않고 **별도 HTML 파일**로 분리한다.

### 파일명 규칙

`{screenId 소문자}_modal-{slug}.html`

- `{slug}`: 레이아웃의 `모달:` 항목에 planner가 `[slug]` 형식으로 확정한 값을 그대로 사용
- 예: `flow-editor_modal-upload.html`, `flow-editor_modal-save.html`

### 모달 HTML 구조

모달 파일도 동일한 head 설정(base.css, bp-components.js, Tailwind)과 blueprint-meta 메타데이터를 사용한다.
단, 추가로 `modalId` 필드를 포함한다.

```html
<body class="bg-background text-foreground font-sans p-8 flex items-center justify-center min-h-screen">
  <bp-dialog title="모달 제목" description="모달 설명">
    <!-- 모달 내용 -->
  </bp-dialog>
</body>
```

trigger 속성 없이 `<bp-dialog>`를 사용하면 **인라인 미리보기 모드**로 렌더링된다.

### 메타데이터

```json
{
  "generator": "blueprint-wireframe-skill",
  "version": "2.0",
  "type": "modal",
  "screenId": "FLOW-EDITOR",
  "modalId": "upload",
  "title": "플로우 업로드",
  "viewport": "pc",
  "purpose": "MD 파일을 선택하고 형식 검증 후 캔버스에 반영하는 모달",
  "features": [...]
}
```

### 모달 내 상태

모달의 상태 변형은 `<bp-state-tab>`으로 표현한다.

```html
<bp-dialog title="플로우 업로드">
  <bp-section data-feature="FLOW__UPLOAD" data-label="플로우 업로드">
    <bp-state-tab>
      <div slot="파일 선택 전"><!-- 상태 A UI --></div>
      <div slot="검증 성공"><!-- 상태 B UI --></div>
    </bp-state-tab>
  </bp-section>
</bp-dialog>
```

---

## Blueprint 업로드 검증

| # | 검사 항목 | 실패 시 |
|---|----------|---------|
| 1 | `.html` 확장자 | 차단 |
| 2 | ≤ 2MB | 차단 |
| 3 | HTML 파싱 가능 | 차단 |
| 4 | `<script id="blueprint-meta">` 존재 | 차단 |
| 5 | JSON 파싱 가능 | 차단 |
| 6 | `generator` = `"blueprint-wireframe-skill"` | 차단 |
| 7 | 필수 필드 존재 | 차단 |
| 8 | `features` 1개 이상 | 차단 |
