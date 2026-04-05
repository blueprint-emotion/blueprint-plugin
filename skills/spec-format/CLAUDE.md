# Spec 작성 규칙

## 역할

기능명세와 화면명세를 작성하는 스킬.
기획자(사람)가 직접 사용하거나, 기획자 에이전트가 참조하여 명세를 작성할 때 사용한다.
이 스킬의 산출물이 wireframe 스킬의 입력이 된다.

## 산출물

| 산출물 | 경로 | 포맷 규칙 |
|--------|------|-----------|
| 기능 명세 | `docs/features/{DOMAIN}.md` | `docs/features/CLAUDE.md` 참조 |
| 화면 명세 | `docs/screens/{SCREEN_ID}/{screenId 소문자}_screen.md` | `docs/screens/CLAUDE.md` 참조 |
| 기능 인덱스 | `docs/features/INDEX.md` | 기능 파일 생성/수정 시 함께 갱신 |

## 정합성 규칙

- frontmatter TOC와 본문 헤딩 구조는 반드시 일치
- TOC의 `id`는 도메인 내 고유, UPPER_SNAKE_CASE
- 화면 frontmatter `features` 배열에 레이아웃에서 참조하는 도메인이 모두 포함
- 레이아웃 참조 `@DOMAIN/PATH`의 PATH가 해당 feature TOC에 존재해야 함

## 콘텐츠 섹션 예약명

아래 헤딩명은 콘텐츠 섹션. 이 외의 같은 뎁스 헤딩은 하위 기능으로 취급.

- `비즈니스 로직` — 비즈니스 규칙. 기능명세의 SSOT. wireframer는 도메인 맥락 참고용으로 읽음
