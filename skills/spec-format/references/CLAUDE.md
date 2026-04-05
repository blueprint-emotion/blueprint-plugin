# Spec References

명세 작성 시 참조하는 완성 예제. 도메인 기능명세와 화면명세의 실제 작성 결과를 보여준다.

## 예제 선택

| 예제 | 파일 | 사용 시점 |
|------|------|----------|
| 기능 명세 | [FEATURE-SPEC.md](FEATURE-SPEC.md) | 도메인 파일 작성 시. TOC, 비즈니스 로직 포함 |
| 화면 명세 | [SCREEN-SPEC.md](SCREEN-SPEC.md) | 화면 통합 문서 작성 시. 3섹션(Screen + Requirement + UserStory) 포함 |

## 작성 순서

1. 기능 명세를 먼저 작성 (도메인 파일 + INDEX.md)
2. 화면 명세를 작성 (기능 명세의 TOC ID를 레이아웃에서 참조)
3. 정합성 검증 (레이아웃 참조 ↔ TOC 일치 확인)

## 공통 규칙 요약

- frontmatter TOC가 기능 계층의 **단일 소스**
- 본문 헤딩은 TOC와 **반드시 일치**
- 최소 작성 기준은 `비즈니스 로직` 섹션
- 화면의 `features` 배열에 참조 도메인을 모두 포함
- 레이아웃 참조 `@DOMAIN/PATH`의 PATH가 해당 도메인 TOC에 존재해야 함
