# Feature 파일 규칙

## 파일 형식

도메인 단위 플랫 파일: `docs/features/{DOMAIN}.md`

## Frontmatter

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

## TOC 규칙

- `id`: 영문 UPPER_SNAKE_CASE, 도메인 내 고유
- `label`: 한국어 표시명
- `children`: 하위 기능 배열 (최대 4단계 깊이: domain → L1 → L2 → L3)
- TOC가 기능 계층의 **단일 소스**. 본문 헤딩 구조와 반드시 일치

## 본문 구조

- H1 = 도메인 제목 (frontmatter `label`과 동일)
- H2~H4 = 기능 계층 (TOC의 L1~L3에 대응)
- 기능 헤딩 바로 아래 뎁스에 콘텐츠 섹션 배치

### 예약된 콘텐츠 섹션명

아래 이름의 헤딩은 콘텐츠 섹션으로 취급. 이 외의 같은 뎁스 헤딩은 하위 기능.

- `와이어프레임 요소` — UI 요소 테이블 (와이어프레임 렌더링 소스)
- `상태` — 상태 정의 테이블
- `인터랙션` — 사용자 인터랙션 목록
- `비즈니스 로직` — 비즈니스 규칙 (와이어프레임에 직접 반영하지 않음)

## 와이어프레임 요소 테이블

```markdown
### 와이어프레임 요소
| 요소 | type | 설명 |
|------|------|------|
| 이메일 | input | 이메일 주소 입력 필드 |
| 로그인 버튼 | button | 클릭 시 인증 요청. 성공: 메인 화면 이동, 실패: "이메일 또는 비밀번호가 올바르지 않습니다" 에러 표시 |
```

- `요소`: 한국어 표시명
- `type`: `input`, `textarea`, `button`, `text`, `select`, `checkbox`, `radio`, `table`, `list`, `link`, `image`, `toggle`
- `설명`: 리뷰어가 명세를 열지 않고도 역할을 이해할 수 있는 수준. 액션 요소(button, link 등)는 클릭 시 성공/실패 결과를 포함

## featureId 파생

TOC 경로에서 파생. 도메인 ID와 TOC `id`를 `__`로 연결:

| TOC 경로 | featureId |
|----------|-----------|
| AUTH | `AUTH` |
| AUTH > LOGIN | `AUTH__LOGIN` |
| AUTH > LOGIN > EMAIL_LOGIN | `AUTH__LOGIN__EMAIL_LOGIN` |

## 예시

```markdown
# 인증

## 로그인
### 와이어프레임 요소
| 요소 | type | 설명 |
|------|------|------|
| 이메일 | input | 이메일 주소 입력 필드 |
| 비밀번호 | input | 비밀번호 입력 필드 (마스킹) |
| 로그인 버튼 | button | 인증 요청 주요 액션 |
### 상태
| 상태 | 설명 |
|------|------|
| 기본 | 폼 비어있음 |
| 에러 | 인증 실패 메시지 표시 |
### 이메일 로그인
#### 와이어프레임 요소
...
### 소셜 로그인
#### 와이어프레임 요소
...

## 회원가입
### 와이어프레임 요소
...
```

## INDEX.md

기능 파일 생성/수정 시 `INDEX.md`도 함께 갱신한다.

```markdown
# Feature Index

- **AUTH** — 인증
- **PAYMENT** — 결제
- **ORDER** — 주문
```
