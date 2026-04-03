---
name: wireframe-format
description: Blueprint 호환 HTML 와이어프레임의 DOM 구조, 속성 규칙, 메타데이터 포맷, 디자인 원칙을 정의한다. wireframer 에이전트가 와이어프레임을 생성할 때 참조하며, 사용자가 "와이어프레임 포맷", "DOM 규칙" 등을 확인할 때도 사용한다.
user-invocable: false
license: MIT
metadata:
  author: blueprint-emotion
  version: "4.0.0"
---

# Blueprint 와이어프레임 포맷

와이어프레임 HTML의 DOM 구조, 속성 규칙, 메타데이터 포맷, 디자인 원칙을 정의한다.
이 스킬은 `wireframer` 에이전트가 와이어프레임을 생성할 때 참조하는 포맷 지식이다.

## 입력 파일

### 화면 명세 (docs/screens/{SCREEN_ID}/{screenId 소문자}_screen.md)

frontmatter에서 기본 정보를, `## Screen` > `### 레이아웃`에서 기능 배치를 읽는다.

레이아웃 참조 문법: `@{DOMAIN}/{TOC_ID_PATH}`

### 기능 명세 (docs/features/{DOMAIN}.md)

frontmatter TOC에서 기능 계층을 읽고, 본문의 `와이어프레임 요소` 테이블에서 UI 요소를 읽는다.

읽는 콘텐츠 섹션:
- `와이어프레임 요소` — 렌더링 소스
- `상태` — 상태 탭 표현 후보
- `인터랙션` — 리뷰 케이스 파악용
- `비즈니스 로직` — 와이어프레임에 직접 반영하지 않음

---

## DOM 구조

feature 컨테이너는 **중첩**한다 (상위가 하위를 감쌈).
메타데이터 JSON의 계층 구조와 DOM 중첩이 1:1 대응.

```html
<div data-feature="AUTH" data-label="인증">
  <div data-feature="AUTH__LOGIN" data-label="로그인">
    <div data-feature="AUTH__LOGIN__EMAIL_LOGIN" data-label="이메일 로그인">
      <input data-el="EMAIL" placeholder="이메일" />
      <button data-el="SUBMIT">로그인</button>

      <div data-feature="AUTH__LOGIN__EMAIL_LOGIN__MFA" data-label="2단계 인증">
        <input data-el="CODE" placeholder="인증 코드" />
        <button data-el="VERIFY">인증 확인</button>
      </div>
    </div>
  </div>
</div>
```

### 속성 규칙

| 속성 | 대상 | 용도 |
|------|------|------|
| `data-feature` | feature 컨테이너 | featureId 값. 호버 강조 + 코멘트 앵커 |
| `data-label` | feature 컨테이너 | 한국어 표시명 (코멘트 UI용) |
| `data-el` | 개별 UI 요소 | 짧은 ELEMENT_ID. 부모 `data-feature` 스코프 내 유니크 |

### HTML 유효성 규칙

`data-feature` 래퍼는 반드시 **block-level 요소**(`<div>`, `<section>`, `<aside>`, `<nav>`, `<main>`)를 사용한다.

`<span>` 등 inline 요소를 `data-feature` 래퍼로 사용하면 안 된다. inline 요소 안에 block 요소(`<div>`)가 들어가면 브라우저가 DOM을 자동 보정하여 의도한 중첩 구조가 깨진다.

```html
<!-- ✅ 올바름: div로 감싸기 -->
<div data-feature="HISTORY" data-label="버전 히스토리">
  <div data-feature="HISTORY__RESET" data-label="초기화">
    <button data-el="RESET_BTN">초기화</button>
  </div>
</div>

<!-- ❌ 잘못됨: span이 div를 감쌈 — 브라우저가 DOM 보정 -->
<span data-feature="HISTORY" data-label="버전 히스토리">
  <div data-feature="HISTORY__RESET" data-label="초기화">
    <button data-el="RESET_BTN">초기화</button>
  </div>
</span>
```

### `data-el` 래핑 규칙

레이블이 있는 요소는 **가능하면 래퍼 `<div data-el>`로 레이블과 입력을 함께 감싼다.**
레이블 없이 단독으로 쓰이는 버튼·링크는 요소 자체에 `data-el`을 붙인다.

```html
<!-- ✅ 레이블 있는 요소: 래퍼로 감싸기 -->
<div class="flex flex-col gap-1.5" data-el="EMAIL">
  <label>이메일</label>
  <input type="text" />
</div>

<!-- ✅ 단독 버튼: 요소 자체에 -->
<button data-el="SUBMIT">로그인</button>
```

### 고정 영역

메뉴바, 상태바 등 화면 명세에 명시된 고정 영역은 `data-feature`/`data-el` 없이 일반 HTML로 렌더링.

---

## 플랫폼 스크립트 (bp-platform.js)

`bp-platform.js`를 `<script>` 태그로 포함한다. 다음을 자동 처리:

1. **호버 하이라이트** — `data-feature`, `data-el` 요소에 인디고 outline 자동 주입
2. **상태 탭** — `data-state` 기반 상태 전환 탭 자동 생성

```html
<script src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/bp-platform.js"></script>
```

`<style>` 블록에는 다크모드 설정과 Tailwind로 표현할 수 없는 최소한의 커스텀 CSS만 포함한다:

```html
<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>
```

---

## 상태 탭

같은 기능의 2~4개 상호배타 형제 상태를 비교할 때 사용한다.
리뷰 컨트롤이지, 제품 UI가 아니다.

`data-feature` **직접 자식**에 `data-state` 속성을 붙이면 bp-platform.js가 자동으로 탭을 생성한다.

**중요**: `data-state`와 `data-feature` 사이에 래퍼 div가 있으면 상태 탭이 작동하지 않는다.

```html
<!-- ✅ 올바름: data-state가 data-feature 직접 자식 -->
<div data-feature="AUTH__LOGIN" data-label="로그인">
  <div data-state="기본"><!-- 기본 상태 UI --></div>
  <div data-state="에러"><!-- 에러 상태 UI --></div>
</div>

<!-- ❌ 잘못됨: 중간 래퍼로 인해 탭 미작동 -->
<div data-feature="AUTH__LOGIN" data-label="로그인">
  <div class="some-wrapper">
    <div data-state="기본">...</div>
    <div data-state="에러">...</div>
  </div>
</div>
```

- `data-state`가 2개 이상이면 자동으로 상태 탭 생성
- 첫 번째 `data-state`가 기본 표시 상태
- hover 시 탭이 드러나고, 클릭으로 상태 전환
- 라디오 input, `:has()` 규칙, group 클래스 불필요

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
| `elements` | 선택 | 추적 요소 배열. `elements`와 `features` 중 최소 하나 |
| `features` | 선택 | 하위 feature 배열 (재귀). `elements`와 `features` 중 최소 하나 |

### `elements[]` 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `id` | Yes | 짧은 ELEMENT_ID (부모 feature 스코프 내 유니크) |
| `type` | Yes | input, button, text, select, table, list 등 |
| `label` | Yes | 한국어 표시명 |
| `description` | Yes | 기능적 역할 설명. 액션 요소(button, link 등)는 클릭 시 결과도 포함 (예: "클릭 시 인증 요청. 성공: 메인 화면 이동, 실패: 에러 메시지 표시") |

### elementId 네이밍 가이드

wireframer는 기능 명세의 `와이어프레임 요소` 테이블에 정의된 `id` 컬럼을 그대로 사용한다. 즉, `data-el`과 메타데이터 `elements[].id`는 planner가 기능 명세에서 확정한 값을 따른다.

- 기능 명세의 `id` 값은 요소의 기능적 역할을 영문으로 표현한다 (예: "이메일" → EMAIL, "로그인 버튼" → SUBMIT)
- UPPER_SNAKE_CASE만 사용한다 (대문자, 밑줄)
- 부모 data-feature 스코프 내에서 유니크하면 된다
- 가능한 짧게 (1~2 단어) 유지한다
- 한국어 음역이 아닌 영문 의미 번역을 사용한다 (예: "검색창" → SEARCH, not GEOMSAEKCHANG)

---

## 디자인 원칙

- 목표는 **구조 검증**이지 예쁜 UI가 아니다. 하지만 리뷰어가 구조를 편하게 읽을 수 있어야 한다
- 그레이스케일, `zinc` 팔레트만 사용
- 모든 색상 클래스에 `dark:` 변형 포함

### 화면 프레임

와이어프레임은 "캔버스 위의 화면"이다. 풀블리드 앱이 아니다.

```html
<body class="bg-zinc-100 dark:bg-zinc-950 p-8">
  <div class="mx-auto min-w-[1280px] min-h-[calc(100vh-4rem)] flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
    <header class="... rounded-t-xl">...</header>
    <div class="flex flex-1"><!-- 메인 콘텐츠 --></div>
    <footer class="... rounded-b-xl">...</footer>
  </div>
</body>
```

- `body`에 `p-8`으로 캔버스 여백. 배경은 `bg-zinc-100` (화면과 구분)
- 화면 컨테이너: `flex flex-col` + `min-h-[calc(100vh-4rem)]`로 전체 높이 채움
- 메인 영역: `flex flex-1`로 남은 공간 채움. inline style 금지
- 화면 컨테이너에 `overflow-hidden` 금지 — outline 호버가 잘림
- 대신 header에 `rounded-t-xl`, footer에 `rounded-b-xl`로 모서리 처리
- 모바일은 `max-w-[400px]`

### 고정 영역 (헤더/푸터)

기본은 **라벨만 표시**한다. 커스텀이 필요한 화면에서만 내용을 채운다.

```html
<!-- 기본: 라벨만 -->
<header class="flex h-10 items-center border-b border-zinc-200 px-5 dark:border-zinc-700">
  <span class="text-xs text-zinc-300 dark:text-zinc-600">Header</span>
</header>

<!-- 커스텀 필요 시에만 내용 추가 -->
<header class="flex h-10 items-center justify-between border-b border-zinc-200 px-5 dark:border-zinc-700">
  <span class="text-xs text-zinc-400">ShopName</span>
  <div class="flex items-center gap-3 text-xs text-zinc-400">
    <span>검색</span>
    <span>장바구니</span>
  </div>
</header>
```

- 기본 높이: `h-10`. 공간을 지배하지 않는다
- 기본 내용: `Header` 또는 `Footer` 텍스트만. 색상은 `text-zinc-300`으로 매우 연하게
- 커스텀 기준: 화면 명세의 레이아웃에서 헤더/푸터 구성을 명시적으로 기술한 경우에만
- `border-b` 한 줄이면 구분 충분. 배경색 차이 불필요

### 카드와 리스트

- 카드 패딩: `p-3` (콤팩트), 카드 간격: `gap-3`
- 이미지 플레이스홀더: **`aspect-[4/3]`** 또는 `h-28` 고정. `aspect-square` 금지 (너무 큼)
- 이미지 스타일: `bg-zinc-100 dark:bg-zinc-800 rounded-md` (배경보다 미묘하게 연한 톤)
- 카드 텍스트는 3~4줄 이내로 밀도감 있게
- 그리드: PC에서 3~4열, 카드 이미지가 화면을 지배하지 않도록

### 입력 필드와 버튼

- 버튼, 입력: 단순한 박스 형태
- 주요 CTA: `bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900`
- 보조 액션: `border border-zinc-300 text-zinc-600`
- 입력: `border border-zinc-200 rounded-md` — 테두리를 약하게

### 플레이스홀더

- 아이콘: `h-4 w-4 rounded bg-zinc-200 dark:bg-zinc-700` (작게)
- 이미지: `bg-zinc-100 dark:bg-zinc-800 rounded-md` (카드보다 연한 톤)
- 아바타: `h-7 w-7 rounded-full bg-zinc-200 dark:bg-zinc-700`
- 장식 과다 금지: `shadow-sm`은 화면 컨테이너에만, 카드에는 `border`만

### Tailwind

Tailwind CSS v4: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`

- 기본 텍스트: `text-sm`, 보조 텍스트: `text-xs text-zinc-400`
- 헤딩: `text-base font-semibold` (작은 헤딩), `text-lg font-semibold` (큰 헤딩)
- 타이트 그룹: `gap-2`, 카드 그리드: `gap-3`, 섹션 간: `gap-5`

레이아웃 예시: [references/MULTI-FEATURE.md](references/MULTI-FEATURE.md) (두 영역 레이아웃)

---

## 모달 파일

모달(다이얼로그, 확인 팝업 포함)은 메인 와이어프레임에 포함하지 않고 **별도 HTML 파일**로 분리한다.

### 파일명 규칙

`{screenId 소문자}_modal-{slug}.html`

- `{slug}`: 레이아웃의 `모달:` 항목에 planner가 `[slug]` 형식으로 확정한 값을 그대로 사용한다 (예: `모달: 저장 버전 선택 [save-version]` → `save-version`). wireframer는 slug을 자동 생성하지 않는다
- 예: `flow-editor_modal-upload.html`, `flow-editor_modal-save.html`

### 메타데이터

메인 와이어프레임과 동일한 구조에 `modalId` 필드를 추가한다:

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

모달의 상태 변형은 `data-state` 상태 탭으로 표현한다. `data-state`는 `data-feature`의 **직접 자식**이어야 한다.

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
| 8 | `features` 1개 이상, 각 feature에 `elements` 또는 `features` | 차단 |
