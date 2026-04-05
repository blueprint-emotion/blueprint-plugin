# 예제: 기능 명세 — AUTH 도메인

2단계 깊이(LOGIN > EMAIL_LOGIN, SOCIAL_LOGIN)를 가진 도메인 파일의 완성 예제.

---

## 파일: `docs/features/AUTH.md`

```markdown
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

# 인증

## 로그인

### 비즈니스 로직

- 이메일 형식 검증
- 5회 실패 시 30분 잠금
- 비밀번호 최소 8자, 영문+숫자

### 이메일 로그인

### 소셜 로그인

## 회원가입

### 비즈니스 로직

- 이메일 중복 불가
- 비밀번호 최소 8자, 영문+숫자+특수문자
- 14세 미만 가입 불가
```

---

## 파일: `docs/features/INDEX.md`

```markdown
# Feature Index

- **AUTH** — 인증
```

---

## 핵심 패턴

| 패턴 | 이 예제에서 |
|------|-----------|
| 도메인 = 플랫 파일 | `AUTH.md` 하나에 LOGIN, SIGNUP 등 모든 기능 포함 |
| TOC가 단일 소스 | frontmatter `toc`의 구조 = 본문 헤딩 구조 |
| 2단계 깊이 | LOGIN(H2) > EMAIL_LOGIN(H3), SOCIAL_LOGIN(H3) |
| 예약 섹션 vs 하위 기능 | `비즈니스 로직`(예약)은 콘텐츠, `이메일 로그인`(비예약)은 하위 기능 |
| 콘텐츠 섹션 배치 | 기능 헤딩 바로 아래 뎁스에 `비즈니스 로직` 등 배치 |
| 최소 기준 | `비즈니스 로직` 섹션만 있어도 유효 |
| featureId 파생 | AUTH + LOGIN + EMAIL_LOGIN → `AUTH__LOGIN__EMAIL_LOGIN` |
| INDEX.md 동기화 | 도메인 파일 생성 시 INDEX.md에 등록 |
