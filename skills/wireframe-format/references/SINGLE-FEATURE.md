# 예제: 단일 feature 화면 — 로그인

> 이 예제는 최종 출력 규격을 따르는 완전한 예시입니다.

단순한 단일 feature 화면의 전체 흐름: 기능 명세 + intake + 화면 명세 → HTML 와이어프레임.

---

## 입력 1: 기능 명세

`docs/features/AUTH.md`

```markdown
---
domain: AUTH
label: 인증
toc:
  - id: LOGIN
    label: 로그인
---

# 인증

## 로그인

### 와이어프레임 요소

| id | 요소 | type | 설명 |
|----|------|------|------|
| EMAIL | 이메일 | input | 이메일 주소 입력 필드 |
| PASSWORD | 비밀번호 | input | 비밀번호 입력 필드 (마스킹) |
| SUBMIT | 로그인 버튼 | button | 인증 요청 주요 액션 버튼 |

### 상태

| 상태 | 설명 |
|------|------|
| 기본 | 폼 비어있음, 로그인 버튼 활성 |
| 에러 | "이메일 또는 비밀번호가 올바르지 않습니다" 메시지 |

### 인터랙션

- 로그인 버튼 클릭 → 인증 API 호출 → 성공 시 대시보드로 이동

### 비즈니스 로직

- 이메일 형식 검증
- 5회 실패 시 30분 잠금
```

---

## 입력 2: intake

`docs/screens/LOGIN/login_intake.md`

```markdown
## 화면 목적

사용자가 이메일과 비밀번호로 서비스에 로그인한다.

## 핵심 행동

- 이메일과 비밀번호를 입력한다
- 로그인 시도 결과를 확인한다

## 화면 구성

- 단일 포커스 로그인 카드

## 모달

없음

## 특수 인터랙션

없음

## viewport

pc

## 제약사항

- 5회 연속 실패 시 계정 잠금 안내가 필요하다
```

---

## 입력 3: 화면 명세

`docs/screens/LOGIN/login_screen.md`

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
features: [AUTH]
---

## Screen

### 레이아웃

1. 전체 화면 — @AUTH/LOGIN

## Requirement

### 인증 — @AUTH/LOGIN
- Given 이메일과 비밀번호 입력 완료 When 로그인 버튼 클릭 Then 인증 요청 후 메인 화면 이동
- Given 이메일 형식 오류 When 로그인 버튼 클릭 Then 이메일 형식 에러 메시지 표시
- Given 5회 연속 로그인 실패 When 6번째 시도 Then 계정 잠금 안내 메시지 표시

## UserStory

### 인증 — @AUTH/LOGIN
- 사용자로서 이메일과 비밀번호로 로그인하고 싶다, 내 계정에 접근하기 위해
- 사용자로서 로그인 실패 시 원인을 알고 싶다, 올바른 정보를 다시 입력하기 위해
```

---

## 출력: 와이어프레임 HTML

`docs/screens/LOGIN/login_wireframe.html`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>로그인</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <script src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframes/shared/bp-platform.js"></script>

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <!-- @META -->
  <script type="application/json" id="blueprint-meta">
  {
    "generator": "blueprint-wireframe-skill",
    "version": "2.0",
    "type": "screen",
    "screenId": "LOGIN",
    "title": "로그인",
    "viewport": "pc",
    "purpose": "사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면",
    "features": [
      {
        "featureId": "AUTH",
        "label": "인증",
        "features": [
          {
            "featureId": "AUTH__LOGIN",
            "label": "로그인",
            "elements": [
              { "id": "EMAIL", "type": "input", "label": "이메일", "description": "사용자가 로그인에 사용할 이메일 주소를 입력하고 형식 오류 여부를 확인하는 입력 필드" },
              { "id": "PASSWORD", "type": "input", "label": "비밀번호", "description": "사용자 계정 인증에 필요한 비밀번호를 마스킹된 상태로 입력하는 보안 입력 필드" },
              { "id": "SUBMIT", "type": "button", "label": "로그인 버튼", "description": "입력한 이메일과 비밀번호로 인증을 요청하고 다음 화면 이동 흐름을 시작하는 주요 실행 버튼" }
            ]
          }
        ]
      }
    ]
  }
  </script>
  <!-- @END:META -->
</head>
<body class="bg-zinc-100 dark:bg-zinc-950 p-8">
  <div class="mx-auto min-w-[1280px] min-h-[calc(100vh-4rem)] flex items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">

    <!-- @SLOT:content -->
    <!-- AUTH: 그루핑 래퍼 (elements 없음, features만) -->
    <div data-feature="AUTH" data-label="인증">

      <!-- AUTH__LOGIN: data-state로 상태 탭 자동 생성 -->
      <div data-feature="AUTH__LOGIN" data-label="로그인"
           class="w-full max-w-md flex flex-col gap-6 rounded-lg border border-zinc-200 p-8 dark:border-zinc-700">

        <!-- 상태 1: 기본 -->
        <div data-state="기본">
          <h1 class="text-lg font-semibold text-center">로그인</h1>
          <div class="flex flex-col gap-4 mt-6">
            <div class="flex flex-col gap-1.5" data-el="EMAIL">
              <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">이메일</label>
              <input class="h-10 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent" type="text" value="user@example.com" readonly />
            </div>
            <div class="flex flex-col gap-1.5" data-el="PASSWORD">
              <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">비밀번호</label>
              <input class="h-10 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent" type="text" value="********" readonly />
            </div>
          </div>
          <button class="h-10 w-full mt-6 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md" data-el="SUBMIT">
            로그인
          </button>
        </div>

        <!-- 상태 2: 에러 -->
        <div data-state="에러">
          <h1 class="text-lg font-semibold text-center">로그인</h1>
          <div class="flex flex-col gap-4 mt-6">
            <div class="flex flex-col gap-1.5" data-el="EMAIL">
              <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">이메일</label>
              <input class="h-10 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent" type="text" value="user@example.com" readonly />
            </div>
            <div class="flex flex-col gap-1.5" data-el="PASSWORD">
              <label class="text-sm font-medium text-zinc-600 dark:text-zinc-400">비밀번호</label>
              <input class="h-10 px-3 text-sm border border-zinc-200 dark:border-zinc-700 rounded-md bg-transparent" type="text" value="********" readonly />
              <div class="text-xs text-red-500 dark:text-red-400">이메일 또는 비밀번호가 올바르지 않습니다</div>
            </div>
          </div>
          <button class="h-10 w-full mt-6 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md" data-el="SUBMIT">
            로그인
          </button>
        </div>

      </div>
    </div>
    <!-- @END:content -->
  </div>
</body>
</html>
```

---

## 핵심 패턴

| 패턴 | 이 예제에서 |
|------|-----------|
| featureId는 TOC 파생 | `domain: AUTH` + `id: LOGIN` → `AUTH__LOGIN` |
| 그루핑 feature | `AUTH`는 `elements` 없이 `features`만 보유 |
| DOM 중첩 | `data-feature="AUTH"` > `data-feature="AUTH__LOGIN"` |
| element는 짧은 키 | `data-el="EMAIL"`, `data-el="SUBMIT"` — 부모 feature 스코프 내 유니크 |
| 상태 탭 (data-state) | `data-state="기본"`, `data-state="에러"` — bp-platform.js가 자동 탭 생성 |
| 상태 패널 내 data-el 재사용 | 같은 `data-el="EMAIL"`이 두 패널에 존재 — 상호배타이므로 허용 |
| 캔버스 프레임 | `bg-zinc-100 p-8` + `rounded-xl border shadow-sm` 컨테이너 |
| 단일 포커스 레이아웃 | 캔버스 내 중앙 카드, 고정 영역 없음 |
| bp-platform.js | 호버 하이라이트 + 상태 탭 자동 처리. `<style>`에는 다크모드만 |
| 화면 참조 문법 | `@AUTH/LOGIN` — 도메인/TOC_ID |
