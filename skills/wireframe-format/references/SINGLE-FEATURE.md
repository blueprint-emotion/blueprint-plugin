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

- 반복 로그인 실패 시 계정 잠금 안내가 필요하다
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
- Given 반복 로그인 실패로 계정이 잠긴 상태 When 로그인 시도 Then 계정 잠금 안내 메시지가 표시된다

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
<body class="bg-background text-foreground font-sans">
  <bp-page description>

    <!-- @SLOT:content -->
    <div class="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <!-- AUTH -->
      <bp-section data-feature="AUTH" data-label="인증">

        <!-- AUTH__LOGIN: bp-state-tab으로 상태 전환 -->
        <bp-section data-feature="AUTH__LOGIN" data-label="로그인">
          <bp-state-tab>

            <div slot="기본" class="w-full max-w-md flex flex-col gap-6 rounded-lg border border-border p-8">
              <h1 class="text-lg font-semibold text-center">로그인</h1>
              <div class="flex flex-col gap-4">
                <bp-field label="이메일" data-el="EMAIL">
                  <bp-input type="email" value="user@example.com" />
                </bp-field>
                <bp-field label="비밀번호" data-el="PASSWORD">
                  <bp-input type="password" value="********" />
                </bp-field>
              </div>
              <bp-button data-el="SUBMIT" class="w-full">로그인</bp-button>
            </div>

            <div slot="에러" class="w-full max-w-md flex flex-col gap-6 rounded-lg border border-border p-8">
              <h1 class="text-lg font-semibold text-center">로그인</h1>
              <div class="flex flex-col gap-4">
                <bp-field label="이메일" data-el="EMAIL">
                  <bp-input type="email" value="user@example.com" />
                </bp-field>
                <bp-field label="비밀번호" error="이메일 또는 비밀번호가 올바르지 않습니다" data-el="PASSWORD">
                  <bp-input type="password" value="********" />
                </bp-field>
              </div>
              <bp-button data-el="SUBMIT" class="w-full">로그인</bp-button>
            </div>

          </bp-state-tab>
        </bp-section>

      </bp-section>
    </div>
    <!-- @END:content -->

  </bp-page>
</body>
</html>
```

---

## 핵심 패턴

| 패턴 | 이 예제에서 |
|------|-----------|
| featureId는 TOC 파생 | `domain: AUTH` + `id: LOGIN` → `AUTH__LOGIN` |
| 모든 feature는 `<bp-section>` | `AUTH`, `AUTH__LOGIN` 모두 `<bp-section>` |
| DOM 중첩 | `data-feature="AUTH"` > `data-feature="AUTH__LOGIN"` |
| element는 짧은 키 | `data-el="EMAIL"`, `data-el="SUBMIT"` — 부모 feature 스코프 내 유니크 |
| bp-field로 입력 래핑 | `<bp-field label="..." data-el="..."><bp-input /></bp-field>` |
| 상태 탭 (bp-state-tab) | `slot="기본"`, `slot="에러"` — 컴포넌트가 자동 탭 생성 |
| 상태 패널 내 data-el 재사용 | 같은 `data-el="EMAIL"`이 두 패널에 존재 — 상호배타이므로 허용 |
| bp-page 프레임 | `<bp-page description>` — 메타바 + aside 패널 자동 구성 |
| 단일 포커스 레이아웃 | 본문 내 중앙 정렬 카드, 고정 영역 없음 |
| 시맨틱 색상 | `border-border`, `bg-background` — raw zinc 사용 안 함 |
| 화면 참조 문법 | `@AUTH/LOGIN` — 도메인/TOC_ID |
