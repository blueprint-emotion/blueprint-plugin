# Example: Login Screen Wireframe

This is a complete working example that passes FlowFrame upload validation.

## Source Spec (Summary)

- **Screen ID**: `LOGIN`
- **Title**: 로그인
- **Purpose**: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면

### Features

| ID | Type | Label |
|----|------|-------|
| `LOGIN_FEATURE_LOGO` | image | 서비스 로고 |
| `LOGIN_FEATURE_EMAIL` | input | 이메일 |
| `LOGIN_FEATURE_PASSWORD` | input | 비밀번호 |
| `LOGIN_FEATURE_SUBMIT` | button | 로그인 |
| `LOGIN_FEATURE_FORGOT` | link | 비밀번호 찾기 |
| `LOGIN_FEATURE_SIGNUP` | link | 회원가입 |
| `LOGIN_FEATURE_SOCIAL` | button | 소셜 로그인 |

## Output HTML

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
        "id": "LOGIN_FEATURE_LOGO",
        "type": "image",
        "label": "서비스 로고",
        "description": "상단에 위치한 서비스 브랜드 로고"
      },
      {
        "id": "LOGIN_FEATURE_EMAIL",
        "type": "input",
        "label": "이메일",
        "description": "사용자 이메일 주소를 입력하는 텍스트 필드"
      },
      {
        "id": "LOGIN_FEATURE_PASSWORD",
        "type": "input",
        "label": "비밀번호",
        "description": "비밀번호를 입력하는 필드. 기본적으로 마스킹 처리"
      },
      {
        "id": "LOGIN_FEATURE_SUBMIT",
        "type": "button",
        "label": "로그인",
        "description": "입력한 자격 증명으로 인증 요청을 보내는 주요 액션 버튼"
      },
      {
        "id": "LOGIN_FEATURE_FORGOT",
        "type": "link",
        "label": "비밀번호 찾기",
        "description": "비밀번호 재설정 화면으로 이동하는 보조 링크"
      },
      {
        "id": "LOGIN_FEATURE_SIGNUP",
        "type": "link",
        "label": "회원가입",
        "description": "신규 계정 생성 화면으로 이동하는 보조 링크"
      },
      {
        "id": "LOGIN_FEATURE_SOCIAL",
        "type": "button",
        "label": "소셜 로그인",
        "description": "Google/GitHub 등 외부 OAuth 로그인 버튼 그룹"
      }
    ]
  }
  </script>

  <style>
    /* Screen-specific styles — only what base CSS doesn't cover */
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

      <!-- Logo -->
      <div class="logo" data-feature="LOGIN_FEATURE_LOGO">
        <div class="logo-placeholder wf-placeholder" style="border-radius:10px"></div>
        <span class="logo-text">FlowFrame</span>
        <span class="logo-sub">계정에 로그인하세요</span>
      </div>

      <!-- Form fields -->
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

      <!-- Submit button -->
      <button class="wf-btn wf-btn-primary" style="width:100%"
        data-feature="LOGIN_FEATURE_SUBMIT">
        로그인
      </button>

      <!-- Secondary links -->
      <div class="links">
        <a href="#" class="wf-link" data-feature="LOGIN_FEATURE_FORGOT">비밀번호 찾기</a>
        <a href="#" class="wf-link" data-feature="LOGIN_FEATURE_SIGNUP">계정이 없으신가요? 회원가입</a>
      </div>

      <!-- Social login -->
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

## Key Patterns to Note

1. **Metadata ↔ HTML alignment**: Every `features[].id` has a matching `data-feature` attribute
2. **CSS variables**: Custom styles use `var(--wf-text)`, `var(--wf-text-muted)` for dark mode
3. **Base CSS classes**: `wf-page`, `wf-card`, `wf-field`, `wf-input`, `wf-btn`, `wf-placeholder`
4. **Readonly inputs**: Form inputs use `readonly` since this is a wireframe, not a functional form
5. **Placeholder pattern**: Images/icons use `wf-placeholder` class for gray box rendering
