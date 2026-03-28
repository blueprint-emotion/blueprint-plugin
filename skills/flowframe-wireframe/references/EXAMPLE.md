# Example: End-to-End Wireframe Generation

This example shows the full flow: feature spec + screen spec → wireframe HTML.

## Step 1: Feature Spec (features/auth.md)

```markdown
---
featureId: AUTH
label: 인증
type: section
usedIn:
  - screens/LOGIN.md
---

# 인증

## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 서비스 로고 | image | 상단 브랜드 로고 |
| 이메일 | input | 이메일 주소 입력 필드 |
| 비밀번호 | input | 비밀번호 입력 필드 (마스킹) |
| 로그인 버튼 | button | 인증 요청 주요 액션 버튼 |
| 비밀번호 찾기 | link | 비밀번호 재설정 화면 이동 |
| 회원가입 | link | 신규 계정 생성 화면 이동 |
| 소셜 로그인 | button | Google/GitHub OAuth 버튼 그룹 |

## 상태

| 상태 | 설명 |
|------|------|
| 기본 | 폼 비어있음, 로그인 버튼 활성 |
| 에러 | "이메일 또는 비밀번호가 올바르지 않습니다" 메시지 |
| 로딩 | 로그인 버튼 비활성 + 스피너 |

## 인터랙션

- 로그인 버튼 클릭 → 인증 API 호출 → 성공 시 대시보드로 이동
- 비밀번호 찾기 클릭 → 비밀번호 재설정 화면으로 이동
- 회원가입 클릭 → 회원가입 화면으로 이동
- 소셜 로그인 클릭 → OAuth 팝업

## 비즈니스 로직

- 5회 로그인 실패 시 30분 잠금
- 비밀번호 최소 8자, 영문+숫자
```

## Step 2: Screen Spec (screens/LOGIN.md)

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
---

# 로그인

## 레이아웃

1. 로고 영역
2. 인증 폼 — [@auth](../features/auth.md)
3. 보조 링크 (비밀번호 찾기, 회원가입)
4. 소셜 로그인 — [@auth](../features/auth.md)
```

## Step 3: Generated Wireframe (wireframes/LOGIN.html)

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
    "viewport": "pc",
    "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
    "features": [
      {
        "id": "LOGIN_FEATURE_LOGO",
        "type": "image",
        "label": "서비스 로고",
        "description": "상단 브랜드 로고",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_EMAIL",
        "type": "input",
        "label": "이메일",
        "description": "이메일 주소 입력 필드",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_PASSWORD",
        "type": "input",
        "label": "비밀번호",
        "description": "비밀번호 입력 필드 (마스킹)",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_SUBMIT",
        "type": "button",
        "label": "로그인 버튼",
        "description": "인증 요청 주요 액션 버튼",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_FORGOT",
        "type": "link",
        "label": "비밀번호 찾기",
        "description": "비밀번호 재설정 화면 이동",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_SIGNUP",
        "type": "link",
        "label": "회원가입",
        "description": "신규 계정 생성 화면 이동",
        "spec": "../features/auth.md"
      },
      {
        "id": "LOGIN_FEATURE_SOCIAL",
        "type": "button",
        "label": "소셜 로그인",
        "description": "Google/GitHub OAuth 버튼 그룹",
        "spec": "../features/auth.md"
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

      <!-- 로고 -->
      <div class="logo" data-feature="LOGIN_FEATURE_LOGO">
        <div class="logo-placeholder wf-placeholder" style="border-radius:10px"></div>
        <span class="logo-text">FlowFrame</span>
        <span class="logo-sub">계정에 로그인하세요</span>
      </div>

      <!-- 인증 폼 -->
      <div class="form-group">
        <div class="wf-field" data-feature="LOGIN_FEATURE_EMAIL">
          <label class="wf-label">이메일</label>
          <input class="wf-input" type="text" value="user@example.com" readonly />
        </div>
        <div class="wf-field" data-feature="LOGIN_FEATURE_PASSWORD">
          <label class="wf-label">비밀번호</label>
          <input class="wf-input" type="text" value="********" readonly />
        </div>
      </div>

      <!-- 로그인 버튼 -->
      <button class="wf-btn wf-btn-primary" style="width:100%"
        data-feature="LOGIN_FEATURE_SUBMIT">
        로그인
      </button>

      <!-- 보조 링크 -->
      <div class="links">
        <a href="#" class="wf-link" data-feature="LOGIN_FEATURE_FORGOT">비밀번호 찾기</a>
        <a href="#" class="wf-link" data-feature="LOGIN_FEATURE_SIGNUP">계정이 없으신가요? 회원가입</a>
      </div>

      <!-- 소셜 로그인 -->
      <div class="wf-divider">또는</div>
      <div class="social-group" data-feature="LOGIN_FEATURE_SOCIAL">
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

## Key Patterns

1. **Feature spec → metadata features**: Each row in 와이어프레임 요소 becomes a feature entry with `spec` pointing back to the source
2. **Screen spec → layout**: The layout section determines where features are placed in HTML
3. **ID generation**: `{screenId}_FEATURE_{element name}` — e.g., `LOGIN_FEATURE_EMAIL`
4. **data-feature matching**: Every metadata feature ID has a corresponding `data-feature` attribute in HTML
5. **spec field**: Each feature links to `../features/auth.md` for the full specification
