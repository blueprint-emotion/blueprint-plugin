# FlowFrame Wireframe Skill 빌드 가이드

> 이 문서는 별도 GitHub 레포에서 FlowFrame 와이어프레임 생성 스킬을 만들고 배포하기 위한 완전한 가이드다.
> 다른 에이전트가 이 문서만 보고 스킬을 구현할 수 있어야 한다.

---

## 1. 목표

사용자의 AI 에이전트(Claude Code, Cursor, Copilot 등)가 **md 기획서를 입력받아 FlowFrame에 업로드 가능한 HTML 와이어프레임을 생성**할 수 있게 하는 스킬을 만든다.

배포는 [skills.sh](https://skills.sh) 플랫폼을 사용한다:
```bash
npx skills add flowframe/wireframe-skill
```

---

## 2. 레포 구조

```
flowframe-wireframe-skill/
├── skills/
│   └── wireframe/
│       └── SKILL.md              ← 에이전트 인스트럭션 (핵심 산출물)
├── examples/
│   └── LOGIN.html                ← 산출물 예시 (이 가이드 §7 전문 포함)
├── schema/
│   └── flowframe-meta.schema.json ← JSON Schema (선택, 에이전트 참고용)
├── README.md
└── LICENSE
```

- `skills/wireframe/SKILL.md` — skills.sh CLI가 스캔하는 표준 경로
- `examples/` — 에이전트가 참고할 실제 산출물 예시
- `schema/` — 메타데이터 JSON Schema (에이전트가 검증용으로 참고)

---

## 3. SKILL.md 프론트매터

```yaml
---
name: flowframe-wireframe
description: md 기획서를 FlowFrame 업로드 규격에 맞는 HTML 와이어프레임으로 변환하는 스킬. 화면 구조와 기능 목록을 시각화하여 FlowFrame에서 플로우 확인 및 코멘트가 가능한 산출물을 생성한다.
---
```

---

## 4. FlowFrame 메타데이터 스키마 (업로드 검증 통과 조건)

FlowFrame은 업로드 시 아래 조건을 **모두** 검사한다. 하나라도 실패하면 업로드이 차단된다.

### 검증 항목 (순서대로)

| # | 검사 | 실패 시 |
|---|------|---------|
| 1 | 파일 확장자 `.html` | 차단 |
| 2 | 파일 크기 2MB 이하 | 차단 |
| 3 | HTML 파싱 가능 (DOMParser) | 차단 |
| 4 | `<script id="flowframe-meta">` 블록 존재 | 차단 |
| 5 | JSON 파싱 가능 | 차단 |
| 6 | `generator` === `"flowframe-wireframe-skill"` | 차단 |
| 7 | 필수 필드 모두 존재: `screenId`, `title`, `purpose`, `features` | 차단 |
| 8 | `features`가 배열이고 1개 이상 | 차단 |
| 9 | `screenId`와 화면 slug 일치 | **경고만** (차단 안 함) |

### 메타데이터 JSON 구조

```typescript
interface FlowFrameMeta {
  generator: "flowframe-wireframe-skill";  // 고정값 (필수)
  version: string;                          // 스킬 버전 (필수)
  screenId: string;                         // 화면 ID (필수)
  title: string;                            // 화면 제목 (필수)
  purpose: string;                          // 화면 목적 설명 (필수)
  features: FlowFrameMetaFeature[];         // 기능 목록 (필수, 1개 이상)
  author?: string;                          // 작성자 (선택)
  viewport?: "pc" | "mobile";              // 뷰포트 (선택)
}

interface FlowFrameMetaFeature {
  id: string;          // 기능 ID (FEATURE_xxx 규칙)
  type: string;        // 기능 유형 (input, button, link, image, text, select, checkbox, radio, table, list)
  label: string;       // 기능 라벨
  description: string; // 기능 설명
}
```

### ID 규칙

- `screenId`: 사용자가 정의 (예: `LOGIN`, `DASHBOARD`, `CANVAS-001`)
- `features[].id`: `FEATURE_{이름}` (예: `FEATURE_EMAIL`, `FEATURE_SUBMIT`)

---

## 5. HTML 구조 요구사항

### 필수 요소

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{화면 제목}</title>

  <!-- 공용 Base CSS (필수) -->
  <link rel="stylesheet"
    href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/css/wireframe-base.css" />

  <!-- FlowFrame 메타데이터 (필수) -->
  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "SCREEN_ID",
    "title": "화면 제목",
    "purpose": "이 화면의 목적 설명",
    "features": [
      {
        "id": "FEATURE_XXX",
        "type": "button",
        "label": "기능명",
        "description": "기능 설명"
      }
    ]
  }
  </script>

  <!-- 화면 고유 스타일 (필요 시) -->
  <style>
    /* base CSS에 없는 화면 고유 스타일만 */
  </style>

  <!-- 공용 Base JS (필수, defer) -->
  <script
    src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/js/wireframe-base.js"
    defer></script>
</head>
<body>
  <div class="wf-page">
    <div class="wf-card">
      <!-- data-feature 속성으로 기능과 HTML 요소를 연결 -->
      <div data-feature="FEATURE_XXX">
        ...
      </div>
    </div>
  </div>
</body>
</html>
```

### `data-feature` 속성 규칙

- 메타데이터 `features[].id`와 HTML 요소의 `data-feature` 값이 **정확히 일치**해야 한다
- FlowFrame은 이 연결을 통해 **양방향 호버 하이라이트**를 제공한다:
  - 우측 기능 목록에서 호버 → iframe 내 해당 요소에 outline 표시
  - iframe 내 요소 호버 → 우측 기능 목록에서 해당 항목 강조
- `data-feature`가 없는 요소는 하이라이트 대상에서 제외된다

### Base CSS 클래스 (사용 가능)

| 클래스 | 용도 |
|--------|------|
| `wf-page` | 페이지 컨테이너 (센터 정렬) |
| `wf-card` | 카드/패널 컨테이너 |
| `wf-field` | 폼 필드 래퍼 |
| `wf-label` | 필드 라벨 |
| `wf-input` | 텍스트 입력 |
| `wf-btn` | 버튼 기본 |
| `wf-btn-primary` | 주요 버튼 |
| `wf-btn-secondary` | 보조 버튼 |
| `wf-link` | 텍스트 링크 |
| `wf-divider` | 구분선 (텍스트 포함 가능) |
| `wf-placeholder` | 이미지/아이콘 플레이스홀더 (회색 박스) |

### 다크모드 지원

Base CSS는 `.dark` 클래스 기반 다크모드를 지원한다. FlowFrame이 자동으로 iframe의 `<html>`에 `.dark` 클래스를 토글한다. 스킬이 별도로 처리할 것은 없다. 단, 화면 고유 `<style>`에서 색상을 하드코딩할 경우 CSS 변수(`var(--wf-text)`, `var(--wf-bg)` 등)를 사용해야 다크모드에서도 정상 표시된다.

---

## 6. 스킬 인스트럭션 (SKILL.md 본문) 작성 가이드

SKILL.md 본문에는 에이전트가 따라야 할 규칙을 작성한다. 반드시 포함해야 할 내용:

### 6.1 입력과 출력

- **입력**: md 기획서 (사용자가 제공)
- **출력**: 단일 HTML 파일

### 6.2 생성 절차

1. md 기획서에서 화면 ID, 제목, 목적을 추출한다
2. 화면의 주요 기능을 식별하고 feature 목록을 구성한다
3. `flowframe-meta` JSON을 작성한다
4. HTML 구조를 작성하고 각 기능 영역에 `data-feature` 속성을 부여한다
5. Base CSS 클래스를 활용하여 와이어프레임 스타일을 적용한다

### 6.3 디자인 원칙

- 목표는 **구조 확인**이지 예쁜 UI가 아니다
- 회색조 중심, 와이어프레임다운 중립적 모습
- 버튼, 입력, 카드 등은 단순한 박스 형태로 표현
- 이미지/아이콘은 `wf-placeholder`(회색 박스)로 대체

### 6.4 ID 규칙

- `screenId`: 사용자가 기획서에서 정의한 화면 ID 사용
- `features[].id`: `FEATURE_{기능명}` 패턴
- 예: `FEATURE_EMAIL`, `FEATURE_SUBMIT` (화면 독립적, 여러 화면에서 재사용 가능)

### 6.5 품질 기준

- 화면 기획서를 읽지 않은 사람도 구조를 이해할 수 있어야 한다
- 기획서의 핵심 기능이 빠지지 않아야 한다
- 모든 feature에 대응하는 `data-feature` 요소가 HTML에 있어야 한다
- 파일을 브라우저에서 직접 열어 확인할 수 있어야 한다
- 파일 크기 2MB 이하

---

## 7. 예시 산출물 (LOGIN.html)

아래는 실제 FlowFrame 업로드 검증을 통과하는 완전한 예시다.
스킬의 `examples/LOGIN.html`에 포함하고, SKILL.md에서 참조한다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>로그인</title>
  <link rel="stylesheet"
    href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/css/wireframe-base.css" />

  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "LOGIN",
    "title": "로그인",
    "author": "jay",
    "viewport": "pc",
    "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
    "features": [
      {
        "id": "FEATURE_LOGO",
        "type": "image",
        "label": "서비스 로고",
        "description": "상단에 위치한 서비스 브랜드 로고"
      },
      {
        "id": "FEATURE_EMAIL",
        "type": "input",
        "label": "이메일",
        "description": "사용자 이메일 주소를 입력하는 텍스트 필드"
      },
      {
        "id": "FEATURE_PASSWORD",
        "type": "input",
        "label": "비밀번호",
        "description": "비밀번호를 입력하는 필드. 기본적으로 마스킹 처리"
      },
      {
        "id": "FEATURE_SUBMIT",
        "type": "button",
        "label": "로그인",
        "description": "입력한 자격 증명으로 인증 요청을 보내는 주요 액션 버튼"
      },
      {
        "id": "FEATURE_FORGOT",
        "type": "link",
        "label": "비밀번호 찾기",
        "description": "비밀번호 재설정 화면으로 이동하는 보조 링크"
      },
      {
        "id": "FEATURE_SIGNUP",
        "type": "link",
        "label": "회원가입",
        "description": "신규 계정 생성 화면으로 이동하는 보조 링크"
      },
      {
        "id": "FEATURE_SOCIAL",
        "type": "button",
        "label": "소셜 로그인",
        "description": "Google/GitHub 등 외부 OAuth 로그인 버튼 그룹"
      }
    ]
  }
  </script>

  <style>
    .logo { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .logo-placeholder { width: 48px; height: 48px; }
    .logo-text { font-size: 20px; font-weight: 700; color: var(--wf-text); }
    .logo-sub { font-size: 13px; color: var(--wf-text-muted); }
    .form-group { display: flex; flex-direction: column; gap: 16px; }
    .links { display: flex; justify-content: space-between; }
    .social-group { display: flex; gap: 12px; }
    .social-icon { width: 18px; height: 18px; }
  </style>

  <script
    src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/js/wireframe-base.js"
    defer></script>
</head>
<body>
  <div class="wf-page">
    <div class="wf-card">

      <div class="logo" data-feature="FEATURE_LOGO">
        <div class="logo-placeholder wf-placeholder" style="border-radius:10px"></div>
        <span class="logo-text">FlowFrame</span>
        <span class="logo-sub">계정에 로그인하세요</span>
      </div>

      <div class="form-group">
        <div class="wf-field" data-feature="FEATURE_EMAIL">
          <label class="wf-label">이메일</label>
          <input class="wf-input" type="text" value="user@example.com" readonly />
        </div>
        <div class="wf-field" data-feature="FEATURE_PASSWORD">
          <label class="wf-label">비밀번호</label>
          <input class="wf-input" type="text" value="********" readonly />
        </div>
      </div>

      <button class="wf-btn wf-btn-primary" style="width:100%"
        data-feature="FEATURE_SUBMIT">
        로그인
      </button>

      <div class="links">
        <a href="#" class="wf-link" data-feature="FEATURE_FORGOT">비밀번호 찾기</a>
        <a href="#" class="wf-link" data-feature="FEATURE_SIGNUP">계정이 없으신가요? 회원가입</a>
      </div>

      <div class="wf-divider">또는</div>
      <div class="social-group" data-feature="FEATURE_SOCIAL">
        <button class="wf-btn wf-btn-secondary" style="flex:1">
          <span class="social-icon wf-placeholder" style="border-radius:4px"></span>
          Google
        </button>
        <button class="wf-btn wf-btn-secondary" style="flex:1">
          <span class="social-icon wf-placeholder" style="border-radius:4px"></span>
          GitHub
        </button>
      </div>

    </div>
  </div>
</body>
</html>
```

---

## 8. 배포 절차

### 8.1 레포 생성

GitHub에 `flowframe/wireframe-skill` (또는 원하는 이름) 레포를 생성한다.

### 8.2 파일 배치

§2의 레포 구조대로 파일을 배치한다:
- `skills/wireframe/SKILL.md` — 스킬 본체
- `examples/LOGIN.html` — §7의 전문
- `README.md` — 설치 안내

### 8.3 README.md 예시

```markdown
# FlowFrame Wireframe Skill

md 기획서를 [FlowFrame](https://flowframe.dev)에 업로드 가능한 HTML 와이어프레임으로 변환하는 AI 에이전트 스킬.

## 설치

\`\`\`bash
npx skills add flowframe/wireframe-skill
\`\`\`

## 사용법

에이전트에게 md 기획서를 전달하면 FlowFrame 규격 HTML 와이어프레임을 생성합니다.

## 지원 에이전트

Claude Code, Cursor, GitHub Copilot, Windsurf, Cline 외 40+ 에이전트 자동 지원.
```

### 8.4 검증

배포 전 로컬에서 테스트:
```bash
# 로컬 디렉토리에서 설치 테스트
npx skills add ./flowframe-wireframe-skill

# 설치 확인
npx skills list
```

---

## 9. 열린 질문 (스킬 설계 시 결정 필요)

| 질문 | 배경 |
|------|------|
| PC/모바일 뷰를 한 파일에 담을지 별도 파일로 할지 | intake 문서에 열린 질문으로 남아 있음. 현재 메타데이터에 `viewport` 필드 있음 |
| 복수 상태(Default/Empty/Error) 표현 방식 | 한 파일 내 섹션 분리 vs 상태별 파일 분리 |
| base CSS/JS CDN URL을 SKILL.md에 하드코딩할지 | CDN URL 변경 시 스킬 업데이트 필요. 변수화 고려 |
| feature type 종류를 제한할지 | 현재 FlowFrame UI가 지원하는 type: input, button, link, image, text, select, checkbox, radio, table, list |
