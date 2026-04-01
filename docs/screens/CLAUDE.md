# Screen 파일 규칙

## 파일 형식

화면 단위 통합 문서: `docs/screens/{SCREEN_ID}.md`

Screen + Requirement + UserStory를 하나의 파일에 작성한다.

## Frontmatter

```yaml
---
screenId: LOGIN-001
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
features: [AUTH]
---
```

- `screenId`: 파일명과 동일 (UPPER_KEBAB + 번호)
- `title`: 화면 제목 (한국어)
- `purpose`: 이 화면의 목적 한 줄 설명
- `viewport`: `pc` | `mobile` | `[pc, mobile]`
- `features`: 이 화면이 참조하는 도메인 ID 배열

## 본문 3섹션

```markdown
## Screen
### 레이아웃
1. 전체 화면 — @AUTH/LOGIN/EMAIL_LOGIN
2. 하단 링크 — @AUTH/SIGNUP

## Requirement
### 인증
- Given 이메일과 비밀번호 입력 완료 When 로그인 버튼 클릭 Then 인증 요청 후 메인 화면 이동

## UserStory
### 인증
- 사용자로서 이메일과 비밀번호로 로그인하고 싶다, 내 계정에 접근하기 위해
```

Grep으로 필요한 섹션만 읽기: `## Screen`, `## Requirement`, `## UserStory` 헤딩 기반.

## 레이아웃 참조 문법

`@{DOMAIN}/{TOC_ID_PATH}` 형식으로 기능을 참조한다.

- `@AUTH/LOGIN` → AUTH.md의 LOGIN 기능
- `@AUTH/LOGIN/EMAIL_LOGIN` → AUTH.md의 LOGIN > EMAIL_LOGIN 기능
- `@PAYMENT/CARD` → PAYMENT.md의 CARD 기능

frontmatter `features` 배열에 참조하는 도메인이 모두 포함되어야 한다.

## 와이어프레임 출력

- 단일 뷰포트: `{SCREEN_ID}.html`
- 다중 뷰포트: `{SCREEN_ID}-pc.html`, `{SCREEN_ID}-mobile.html`

와이어프레임은 같은 `docs/screens/` 폴더에 생성된다.
