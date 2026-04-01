# CLAUDE.md

## Project Overview

FlowFrame — Claude plugin marketplace 배포를 목표로 하는 Claude Code 플러그인.
기획자가 기능명세/화면명세를 작성하고, HTML 와이어프레임을 생성한다.

- **배포 대상**: Claude plugin marketplace
- **사용자**: 한국어 사용자, IT 서비스 기획자. 개발 경험이 없을 수 있음
- **언어 원칙**: 스킬의 안내·출력·에러 메시지는 한국어, 기획 용어 중심으로 소통

## Architecture

플랫 파일 2-layer 구조:

```
docs/
├── features/                ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── CLAUDE.md            ← feature 파일 포맷 규칙
│   ├── INDEX.md             ← 전체 기능 목록 인덱스
│   ├── AUTH.md
│   └── PAYMENT.md
├── screens/                 ← 화면 단위 통합 문서 + 와이어프레임
│   ├── CLAUDE.md            ← screen 파일 포맷 규칙
│   ├── LOGIN-001.md         ← Screen + Requirement + UserStory 통합
│   ├── LOGIN-001.html       ← 생성된 와이어프레임
│   └── CHECKOUT-001-pc.html ← 다중 뷰포트 시 접미사
```

플러그인은 skill과 agent를 번들로 포함하며, 계속 추가될 수 있다.

현재 skill:
- `skills/flowframe-spec/` — 기능명세·화면명세 작성
- `skills/flowframe-wireframe/` — 명세 → HTML 와이어프레임 생성

## ID Rules

**featureId** — TOC 경로에서 파생, `__`로 깊이 구분:
- `AUTH`, `AUTH__LOGIN`, `AUTH__LOGIN__EMAIL_LOGIN`
- DOM 속성: `data-feature="AUTH__LOGIN"`

**elementId** — feature 스코프 내 짧은 영문 키:
- `EMAIL`, `SUBMIT`, `CODE`
- DOM 속성: `data-el="EMAIL"`
- 와이어프레임 내에서 같은 `data-feature` 안에서만 유니크하면 됨

## Plugin Conventions

- SKILL.md는 소문자+하이픈, 부모 디렉토리명과 일치
- SKILL.md 본문 500줄 이하, 참조는 `references/` 하위에만
