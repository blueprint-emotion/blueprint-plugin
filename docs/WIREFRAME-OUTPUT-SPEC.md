# FlowFrame Wireframe Output Spec

> FlowFrame에 업로드 가능한 와이어프레임 HTML을 생성하기 위한 기술 스펙.
> 외부 스킬 프로젝트는 이 문서를 참조하여 산출물을 만든다.

---

## 1. 파일 제약

| 항목 | 조건 |
|------|------|
| 확장자 | `.html` |
| 최대 크기 | 2 MB |
| 인코딩 | UTF-8 |

---

## 2. 필수 메타데이터 블록

`<head>` 안에 아래 형태의 `<script>` 블록이 **반드시** 존재해야 한다.

```html
<script type="application/json" id="flowframe-meta">
{
  "generator": "flowframe-wireframe-skill",
  "version": "1.0",
  "screenId": "LOGIN",
  "title": "로그인",
  "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
  "author": "jay",
  "viewport": "pc",
  "elements": [
    {
      "id": "FEATURE_AUTH_EMAIL",
      "featureId": "AUTH",
      "type": "input",
      "label": "이메일",
      "description": "사용자 이메일 주소를 입력하는 텍스트 필드",
      "spec": "../features/auth.md"
    }
  ]
}
</script>
```

### 필드 정의

| 필드 | 필수 | 타입 | 설명 |
|------|:----:|------|------|
| `generator` | O | `string` | **고정값** `"flowframe-wireframe-skill"`. 이 값이 아니면 업로드 차단. |
| `version` | O | `string` | 스펙 버전. 현재 `"1.0"`. |
| `screenId` | O | `string` | 화면 식별자. FlowFrame의 screen slug와 매칭된다. |
| `title` | O | `string` | 화면 제목. |
| `purpose` | O | `string` | 화면 목적 설명. 와이어프레임 뷰어의 상단 설명으로 표시된다. |
| `author` | | `string` | 작성자. |
| `viewport` | | `"pc"` \| `"mobile"` | 뷰포트 유형. |
| `elements` | O | `Element[]` | 와이어프레임에서 추적할 요소 목록. **1개 이상** 필수. |

### Element 필드

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 추적 요소 ID. `FEATURE_{FEATURE_ID}_{ELEMENT_ID}` 형식 필수. |
| `featureId` | `string` | 부모 feature의 ID. feature spec frontmatter의 `featureId`와 일치한다. |
| `type` | `string` | 요소 유형. `input`, `button`, `link`, `image`, `text`, `select`, `checkbox`, `radio`, `table`, `list` 중 하나. |
| `label` | `string` | 요소 이름 (UI에 표시). |
| `description` | `string` | 요소 설명. |
| `spec` | `string` | 부모 feature spec markdown 파일의 상대 경로. |

---

## 3. 업로드 검증 규칙

아래 순서로 검증하며, 하나라도 실패하면 업로드가 차단된다.

1. 파일 확장자가 `.html`인가
2. 파일 크기가 2MB 이하인가
3. HTML 파싱이 가능한가
4. `<script id="flowframe-meta">` 블록이 존재하는가
5. JSON 파싱이 가능한가
6. `generator` 필드가 `"flowframe-wireframe-skill"`인가
7. 필수 필드(`version`, `screenId`, `title`, `purpose`, `elements`)가 모두 있는가
8. `elements`가 배열이고 1개 이상인가

추가로 경고(업로드는 허용):
- 메타데이터 `screenId`가 현재 화면의 slug와 일치하지 않으면 경고 표시

---

## 4. `data-feature` 속성

HTML body의 요소에 `data-feature="{ELEMENT_ID}"`를 부여하면, FlowFrame 와이어프레임 뷰어에서:
- 디스크립션 패널의 요소 목록과 **양방향 하이라이트** 연동
- 패널에서 요소에 마우스를 올리면 iframe 내 해당 영역이 하이라이트
- iframe 내 해당 영역에 마우스를 올리면 패널의 요소 항목이 하이라이트

```html
<div class="flex flex-col gap-1.5" data-feature="FEATURE_AUTH_EMAIL">
  <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">이메일</label>
  <input class="h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" value="user@example.com" readonly />
</div>
```

- `data-feature`는 metadata `elements[].id`와 1:1 매칭되어야 한다
- 여러 요소가 같은 `featureId`를 공유할 수 있다
- 고정 영역은 `data-feature`를 부여하지 않는다

---

## 5. 제공 CSS/JS 에셋 및 Tailwind CSS v4

FlowFrame은 Tailwind CSS v4를 통해 와이어프레임 스타일링을 지원한다.

### 필수 에셋

```html
<!-- Tailwind CSS v4 (browser JIT — 업로드 시 제거, 뷰어가 재주입) -->
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

<!-- 기본 리셋 + 폰트 -->
<link rel="stylesheet" href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/css/wireframe-base.css" />

<!-- 다크 모드 설정 (필수) -->
<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>

<!-- Feature 하이라이트 + iframe 통신 (선택, 업로드 시 제거) -->
<script src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/js/wireframe-base.js" defer></script>
```

> **참고**: 업로드 시 모든 `<script>` 태그가 보안상 제거된다. FlowFrame 뷰어는 HTML을 srcdoc에 넣기 전에 Tailwind CDN 스크립트를 자동으로 재주입하며, iframe sandbox에 `allow-scripts`를 추가하여 Tailwind JIT 컴파일러가 실행될 수 있도록 한다. `wireframe-base.js`는 독립 브라우저에서 열었을 때의 편의 기능(hover 하이라이트)을 제공한다.

### 스타일링 규칙

- 모든 스타일링은 **Tailwind CSS v4 유틸리티 클래스**를 사용한다
- 컬러 팔레트: **zinc**를 일관되게 사용 (그레이스케일 와이어프레임 미학)
- 모든 색상 클래스에 **`dark:` 변형**을 반드시 포함한다
- `wireframe-base.css`는 CSS 리셋과 폰트 기본값만 제공한다
- 레이아웃, 폼, 버튼, 타이포그래피 등은 모두 Tailwind 유틸리티로 처리한다

### 주요 Tailwind 패턴

| 요소 | Tailwind Classes |
|------|-----------------|
| 페이지 래퍼 | `min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900` |
| 카드 | `w-full max-w-md flex flex-col gap-6 p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm` |
| 컨테이너 | `w-full max-w-5xl mx-auto p-6` |
| 필드 래퍼 | `flex flex-col gap-1.5` |
| 라벨 | `text-sm font-medium text-zinc-600 dark:text-zinc-400` |
| 텍스트 입력 | `h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent` |
| 주요 버튼 | `h-10 px-4 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md` |
| 보조 버튼 | `h-10 px-4 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md` |
| 링크 | `text-sm text-zinc-500 dark:text-zinc-400 hover:underline` |
| 플레이스홀더 | `bg-zinc-200 dark:bg-zinc-700 rounded` |

---

## 6. 다크 모드

FlowFrame은 사용자 테마에 따라 iframe의 `<html>` 요소에 `.dark` 클래스를 자동 토글한다.

Tailwind CSS v4의 기본 다크 모드는 `prefers-color-scheme` 기반이므로, 클래스 기반 다크 모드를 사용하려면 각 와이어프레임 HTML에 아래 설정이 **필수**이다:

```html
<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>
```

모든 색상 관련 클래스에 `dark:` 변형을 포함해야 한다:
- 배경: `bg-white dark:bg-zinc-800`
- 텍스트: `text-zinc-800 dark:text-zinc-200`
- 테두리: `border-zinc-200 dark:border-zinc-700`

---

## 7. ID 규칙

- `screenId`: 화면을 식별하는 고유 ID. 대문자 + 하이픈 권장 (예: `LOGIN`, `DASHBOARD`, `PROJECT-LIST`).
- `featureId`: feature spec을 식별하는 고유 ID. 대문자 + 언더스코어 권장 (예: `AUTH`, `COMMENTS`, `COMPANY_OVERVIEW`).
- `element.id`: `FEATURE_{FEATURE_ID}_{ELEMENT_ID}` 형식 (예: `FEATURE_AUTH_EMAIL`, `FEATURE_AUTH_SUBMIT`).
- 같은 화면 안에서 각 `element.id`는 유일해야 한다.

### `ELEMENT_ID` 도출 규칙

- 요소명에서 의미가 드러나는 핵심 영문 명사를 선택한다.
- 영문 대문자만 사용하고, 여러 단어면 언더스코어로 연결한다.
- `BUTTON`, `TEXT`, `INPUT`처럼 요소 타입만 반복하는 일반어는 피하고 역할 중심으로 이름 짓는다.
- 같은 feature 안에서 중복될 수 있으면 역할이나 위치를 더 붙여 구분한다.

| 요소명 | 권장 `ELEMENT_ID` | 비고 |
|------|-------------------|------|
| 이메일 | `EMAIL` | 입력 타입이 아니라 도메인 의미 사용 |
| 비밀번호 | `PASSWORD` | |
| 로그인 버튼 | `SUBMIT` | 버튼 타입 반복 대신 액션 의미 사용 |
| 등록 버튼 | `SUBMIT` | feature 맥락에서 제출 동작이면 `SUBMIT` |
| 저장 버튼 | `SAVE` | |
| 삭제 버튼 | `DELETE` | |
| 댓글 목록 | `LIST` | feature가 `COMMENTS`이면 `FEATURE_COMMENTS_LIST` |
| 댓글 입력 | `INPUT` | 같은 feature에서 목록과 입력을 구분할 때 허용 |
| 서비스 로고 | `LOGO` | |
| 소셜 로그인 | `SOCIAL` | 버튼 그룹 전체를 하나로 추적할 때 |

모호하면 요소 타입보다 사용자 행동이나 정보 의미를 우선한다.

---

## 8. PC / Mobile 분리

PC와 Mobile은 **별도 HTML 파일**로 생성한다. 하나의 HTML 안에서 CSS 미디어 쿼리로 분리하지 않는다.

- PC 파일: `viewport` 필드를 `"pc"`로 설정
- Mobile 파일: `viewport` 필드를 `"mobile"`로 설정

FlowFrame에서 각각 별도 업로드하고, 뷰포트 토글로 전환하여 확인한다.

---

## 9. 전체 예시 (PC)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>로그인</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="stylesheet" href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/css/wireframe-base.css" />

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "LOGIN",
    "title": "로그인",
    "author": "작성자",
    "viewport": "pc",
    "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
    "elements": [
      {
        "id": "FEATURE_AUTH_EMAIL",
        "featureId": "AUTH",
        "type": "input",
        "label": "이메일",
        "description": "사용자 이메일 주소를 입력하는 텍스트 필드",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_PASSWORD",
        "featureId": "AUTH",
        "type": "input",
        "label": "비밀번호",
        "description": "비밀번호를 입력하는 필드",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_SUBMIT",
        "featureId": "AUTH",
        "type": "button",
        "label": "로그인",
        "description": "인증 요청을 보내는 주요 액션 버튼",
        "spec": "../features/auth.md"
      }
    ]
  }
  </script>
</head>
<body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md flex flex-col gap-6 p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm">

      <h1 class="text-lg font-semibold text-center">로그인</h1>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1.5" data-feature="FEATURE_AUTH_EMAIL">
          <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">이메일</label>
          <input class="h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" value="user@example.com" readonly />
        </div>
        <div class="flex flex-col gap-1.5" data-feature="FEATURE_AUTH_PASSWORD">
          <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">비밀번호</label>
          <input class="h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent" type="text" value="********" readonly />
        </div>
      </div>

      <button class="h-10 w-full text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md" data-feature="FEATURE_AUTH_SUBMIT">
        로그인
      </button>

    </div>
  </div>
</body>
</html>
```
