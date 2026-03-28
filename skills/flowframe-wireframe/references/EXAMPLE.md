# Example: End-to-End Wireframe Generation

This example shows the full flow: feature spec + screen spec → wireframe HTML.

## Table of Contents

- [Step 1](#step-1)
- [Step 2](#step-2)
- [Step 3](#step-3)
- [Key Patterns](#key-patterns)

## Step 1

```markdown
---
featureId: AUTH
label: 인증
type: section
usedIn:
  - docs/screens/LOGIN.md
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

## Step 2

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
---

# 로그인

## 레이아웃

1. 전체 화면 — [@auth](../features/auth.md)
```

## Step 3

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>로그인</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "LOGIN",
    "title": "로그인",
    "viewport": "pc",
    "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
    "elements": [
      {
        "id": "FEATURE_AUTH_LOGO",
        "featureId": "AUTH",
        "type": "image",
        "label": "서비스 로고",
        "description": "상단 브랜드 로고",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_EMAIL",
        "featureId": "AUTH",
        "type": "input",
        "label": "이메일",
        "description": "이메일 주소 입력 필드",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_PASSWORD",
        "featureId": "AUTH",
        "type": "input",
        "label": "비밀번호",
        "description": "비밀번호 입력 필드 (마스킹)",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_SUBMIT",
        "featureId": "AUTH",
        "type": "button",
        "label": "로그인 버튼",
        "description": "인증 요청 주요 액션 버튼",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_FORGOT",
        "featureId": "AUTH",
        "type": "link",
        "label": "비밀번호 찾기",
        "description": "비밀번호 재설정 화면 이동",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_SIGNUP",
        "featureId": "AUTH",
        "type": "link",
        "label": "회원가입",
        "description": "신규 계정 생성 화면 이동",
        "spec": "../features/auth.md"
      },
      {
        "id": "FEATURE_AUTH_SOCIAL",
        "featureId": "AUTH",
        "type": "button",
        "label": "소셜 로그인",
        "description": "Google/GitHub OAuth 버튼 그룹",
        "spec": "../features/auth.md"
      }
    ]
  }
  </script>
</head>
<body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md flex flex-col gap-6 p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm">

      <div class="flex flex-col gap-6">
        <div class="flex flex-col items-center gap-2" data-feature="FEATURE_AUTH_LOGO">
        <div class="w-12 h-12 bg-zinc-200 dark:bg-zinc-700 rounded-lg"></div>
        <span class="text-xl font-semibold">FlowFrame</span>
        <span class="text-sm text-zinc-500 dark:text-zinc-400">계정에 로그인하세요</span>
        </div>

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

        <div class="flex justify-between">
          <a href="#" class="text-sm text-zinc-500 dark:text-zinc-400 hover:underline" data-feature="FEATURE_AUTH_FORGOT">비밀번호 찾기</a>
          <a href="#" class="text-sm text-zinc-500 dark:text-zinc-400 hover:underline" data-feature="FEATURE_AUTH_SIGNUP">계정이 없으신가요? 회원가입</a>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
          <span class="text-xs text-zinc-400">또는</span>
          <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
        </div>
        <div class="flex gap-3" data-feature="FEATURE_AUTH_SOCIAL">
          <button class="h-10 flex-1 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md flex items-center justify-center gap-1.5">
            <span class="w-4.5 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded"></span>
            Google
          </button>
          <button class="h-10 flex-1 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md flex items-center justify-center gap-1.5">
            <span class="w-4.5 h-4.5 bg-zinc-200 dark:bg-zinc-700 rounded"></span>
            GitHub
          </button>
        </div>
      </div>

    </div>
  </div>
</body>
</html>
```

## Key Patterns

1. **Feature spec → metadata elements**: Each row in the `## 와이어프레임 요소` table becomes one tracked metadata element linked back to the same parent feature spec
2. **Screen spec → layout**: The layout section determines where features are placed in HTML
3. **ID generation**: `FEATURE_{featureId}_{element}` — e.g., `FEATURE_AUTH_EMAIL`
4. **Parent linkage**: Multiple tracked elements can share the same `featureId` and `spec` (e.g., all auth elements point to `AUTH` and `../features/auth.md`)
5. **All styling uses Tailwind CSS v4 utility classes — no custom CSS classes or inline `<style>` blocks needed**
