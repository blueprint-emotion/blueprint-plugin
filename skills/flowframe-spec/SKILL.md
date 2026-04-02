---
name: flowframe-spec
description: FlowFrame 프로젝트의 기능 명세(docs/features/)와 화면 명세(docs/screens/)의 포맷 지식과 검증 규칙을 제공한다. 기획자 에이전트(planner)가 명세를 작성할 때 참조하며, 사용자가 직접 "명세 포맷", "템플릿", "정합성 규칙" 등을 확인할 때도 사용한다.
license: MIT
metadata:
  author: flowframehq
  version: "3.0.0"
---

# FlowFrame 명세 포맷

기능명세와 화면명세의 포맷 규칙, 템플릿, 검증 기준을 정의한다.
이 스킬의 산출물이 `flowframe-wireframe` 스킬의 입력이 된다.

## 프로젝트 구조

```
docs/
├── features/                ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── INDEX.md             ← 전체 기능 목록 인덱스
│   ├── AUTH.md              ← 도메인 파일
│   └── PAYMENT.md
├── screens/                 ← 화면 단위 폴더
│   └── LOGIN/               ← 화면 ID = 폴더명
│       ├── login-intake.md        ← 화면 단위 intake (선택)
│       ├── login-screen.md        ← Screen + Requirement + UserStory 통합
│       └── login-wireframe.html   ← 생성된 와이어프레임
```

---

## 기능 명세 (docs/features/{DOMAIN}.md)

### Frontmatter

```yaml
---
domain: AUTH
label: 인증
toc:
  - id: LOGIN
    label: 로그인
    children:
      - id: EMAIL_LOGIN
        label: 이메일 로그인
      - id: SOCIAL_LOGIN
        label: 소셜 로그인
  - id: SIGNUP
    label: 회원가입
---
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `domain` | Yes | 영문 UPPER_SNAKE_CASE 도메인 ID |
| `label` | Yes | 한국어 표시명 |
| `toc` | Yes | 기능 계층 목차 (단일 소스) |

### TOC 규칙

- `id`: 영문 UPPER_SNAKE_CASE, 도메인 내 고유
- `label`: 한국어 표시명
- `children`: 하위 기능 배열 (최대 4단계: domain → L1 → L2 → L3)
- TOC가 기능 계층의 **단일 소스**. 본문 헤딩과 반드시 일치

### 본문 구조

- H1 = 도메인 제목 (frontmatter `label`과 동일)
- H2~H4 = 기능 계층 (TOC의 L1~L3에 대응)
- 기능 헤딩 바로 아래 뎁스에 콘텐츠 섹션 배치

### 예약 콘텐츠 섹션

아래 헤딩명은 콘텐츠 섹션으로 취급. 이 외의 같은 뎁스 헤딩은 하위 기능.

| 섹션명 | 목적 | 읽는 주체 |
|--------|------|-----------|
| `와이어프레임 요소` | 렌더링할 UI 요소 테이블 | Wireframe 스킬 |
| `상태` | 상태 정의 테이블 | Planner + Designer |
| `인터랙션` | 사용자 인터랙션 목록 | Planner + Designer |
| `비즈니스 로직` | 비즈니스 규칙 (와이어프레임 미반영) | Planner + Dev |

### 와이어프레임 요소 테이블

```markdown
### 와이어프레임 요소
| 요소 | type | 설명 |
|------|------|------|
| 이메일 | input | 이메일 주소 입력 필드 |
| 로그인 버튼 | button | 인증 요청 주요 액션 |
```

- `요소`: 한국어 표시명
- `type`: `input`, `button`, `text`, `select`, `checkbox`, `radio`, `table`, `list`, `link`, `image`
- `설명`: 리뷰어가 명세를 열지 않고도 역할을 이해할 수 있는 수준

### 상태 테이블

```markdown
### 상태
| 상태 | 설명 |
|------|------|
| 기본 | 폼 비어있음, 로그인 버튼 활성 |
| 에러 | "이메일 또는 비밀번호가 올바르지 않습니다" 메시지 |
```

### featureId 파생

TOC 경로에서 파생. 도메인 ID와 TOC `id`를 `__`로 연결:

| TOC 경로 | featureId |
|----------|-----------|
| AUTH | `AUTH` |
| AUTH > LOGIN | `AUTH__LOGIN` |
| AUTH > LOGIN > EMAIL_LOGIN | `AUTH__LOGIN__EMAIL_LOGIN` |

### INDEX.md

기능 파일 생성/수정 시 함께 갱신한다.

```markdown
# Feature Index

- **AUTH** — 인증
- **PAYMENT** — 결제
```

---

## 화면 명세 (docs/screens/{SCREEN_ID}/{screenId 소문자}-screen.md)

### Frontmatter

```yaml
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 이메일과 비밀번호로 서비스에 로그인하는 화면
viewport: pc
features: [AUTH]
---
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `screenId` | Yes | 폴더명과 동일 (UPPER_KEBAB, 번호 없음). 파일명에는 소문자로 사용 |
| `title` | Yes | 화면 제목 (한국어) |
| `purpose` | Yes | 화면 목적 한 줄 설명 |
| `viewport` | Yes | `pc` \| `mobile` \| `[pc, mobile]` |
| `features` | Yes | 참조하는 도메인 ID 배열 |

### 본문 3섹션

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

### 레이아웃 참조 문법

`@{DOMAIN}/{TOC_ID_PATH}` 형식으로 기능을 참조한다.

- `@AUTH/LOGIN` → AUTH.md의 LOGIN 기능
- `@AUTH/LOGIN/EMAIL_LOGIN` → AUTH.md의 LOGIN > EMAIL_LOGIN
- `@PAYMENT/CARD` → PAYMENT.md의 CARD 기능

`features` 배열에 참조하는 도메인이 모두 포함되어야 한다.

### 와이어프레임 출력 위치

같은 화면 폴더 안에 생성:

- 단일 뷰포트: `docs/screens/{SCREEN_ID}/{screenId 소문자}-wireframe.html`
- 다중 뷰포트: `{screenId 소문자}-wireframe-pc.html`, `{screenId 소문자}-wireframe-mobile.html`

---

## 정합성 검증 기준

| # | 검증 항목 |
|---|----------|
| 1 | 화면의 모든 `@DOMAIN/PATH`에 대응하는 기능이 도메인 파일 TOC에 존재 |
| 2 | frontmatter `features` 배열에 레이아웃에서 참조하는 모든 도메인 포함 |
| 3 | 도메인 파일의 TOC 구조와 본문 헤딩이 일치 |
| 4 | 참조된 기능에 `와이어프레임 요소` 테이블 또는 하위 기능 존재 |
| 5 | 모든 도메인 파일이 INDEX.md에 등록 |
| 6 | 와이어프레임의 `data-feature`가 현재 기능 구조와 일치 |

---

## 가이드라인

- 명세는 **한국어**로 작성한다
- 모호하면 작성 전에 확인 질문을 한다. 추정으로 채우지 않는다
- 처음부터 모든 섹션을 채울 필요 없다. 최소 기준은 `와이어프레임 요소` 테이블
- 유저스토리 형식: `{역할}으로서 {행동}하고 싶다, {목적}을 위해`
- 인수조건 형식: Given-When-Then
- 한 개발 에이전트가 범위를 닫을 수 있는 크기를 선호한다
