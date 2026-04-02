# CLAUDE.md

## Project Overview

FlowFrame — Claude plugin marketplace 배포를 목표로 하는 Claude Code 플러그인.
기획자가 기능명세/화면명세를 작성하고, HTML 와이어프레임을 생성한다.

- **배포 대상**: Claude plugin marketplace
- **사용자**: 한국어 사용자, IT 서비스 기획자. 개발 경험이 없을 수 있음
- **언어 원칙**: 스킬의 안내·출력·에러 메시지는 한국어, 기획 용어 중심으로 소통

## Architecture

```
agents/
├── planner.md               ← 기획자 에이전트 (판단·대화·오케스트레이션)
├── wireframer.md            ← 와이어프레임 에이전트 (2-pass 생성·업데이트)
└── reviewer.md              ← 리뷰어 에이전트 (읽기 전용, pass/fail 판정)

skills/
├── flowframe-spec/          ← 명세 포맷 지식 (에이전트가 참조)
└── flowframe-wireframe/     ← 와이어프레임 생성

docs/
├── features/                ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── INDEX.md             ← 전체 기능 목록 인덱스
│   ├── AUTH.md
│   └── PAYMENT.md
├── screens/                 ← 화면 단위 폴더
│   └── LOGIN/               ← 화면 ID = 폴더명 (UPPER_KEBAB, 번호 없음)
│       ├── login-intake.md        ← 화면 단위 intake (선택)
│       ├── login-screen.md        ← Screen + Requirement + UserStory 통합
│       ├── login-wireframe.html   ← 와이어프레임 (단일 뷰포트)
│       ├── login-wireframe-pc.html    ← 다중 뷰포트 시
│       └── login-wireframe-mobile.html
```

플러그인은 agent와 skill을 번들로 포함하며, 계속 추가될 수 있다.

현재 agent:
- `agents/planner.md` — 기획자 에이전트. 사용자와 대화하며 명세를 작성
- `agents/wireframer.md` — 와이어프레임 에이전트. 명세를 읽어 HTML 와이어프레임 생성
- `agents/reviewer.md` — 리뷰어 에이전트. 명세·와이어프레임 정합성 검증 (읽기 전용, pass/fail 판정)

현재 skill:
- `skills/planning-workflow/` — 기획 오케스트레이션 하네스. intake → planner → wireframer 흐름 제어
- `skills/flowframe-spec/` — 명세 포맷 지식 (planner 에이전트가 참조)
- `skills/flowframe-wireframe/` — 와이어프레임 포맷 지식 (wireframer 에이전트가 참조)

## ID Rules

**screenId** — 화면 폴더명과 동일, UPPER_KEBAB:
- `LOGIN`, `CHECKOUT`, `PRODUCT-LIST`
- 같은 목적의 변형이 있으면 이름으로 구분: `LOGIN-EMAIL`, `LOGIN-SOCIAL`

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
