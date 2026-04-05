# CLAUDE.md

## Project Overview
Blueprint — Claude plugin marketplace 배포를 목표로 하는 Claude Code 플러그인.
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
├── plan/                    ← 기획 오케스트레이션 하네스
├── spec/                    ← 명세 포맷 지식 (에이전트가 참조)
└── wireframe/               ← 와이어프레임 생성

.claude-plugin/
└── plugin.json              ← Claude plugin marketplace 배포용 매니페스트

docs/
├── features/                ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── INDEX.md             ← 전체 기능 목록 인덱스
│   ├── AUTH.md
│   └── PAYMENT.md
├── screens/                 ← 화면 단위 폴더
│   └── LOGIN/               ← 화면 ID = 폴더명 (UPPER-KEBAB, 순차 번호 금지 (001, 002 등). V2 같은 의미 있는 숫자는 허용)
│       ├── login_intake.md        ← 화면 단위 intake (워크플로우가 생성, 리뷰 시 필수)
│       ├── login_screen.md        ← Screen + Requirement + UserStory 통합
│       ├── login_wireframe.html   ← 와이어프레임 (단일 뷰포트)
│       ├── login_wireframe-pc.html    ← 다중 뷰포트 시
│       ├── login_wireframe-mobile.html
│       └── login_modal-{slug}.html    ← 모달 (개별 파일)
```

> docs/ 하위 경로(LOGIN/, AUTH.md 등)는 명명 규칙 예시입니다. 사용자가 기획을 시작하면 생성됩니다.

플러그인은 agent와 skill을 번들로 포함하며, 계속 추가될 수 있다.

현재 agent:
- `agents/planner.md` — 기획자 에이전트. 사용자와 대화하며 명세를 작성
- `agents/wireframer.md` — 와이어프레임 에이전트. 명세를 읽어 HTML 와이어프레임 생성
- `agents/reviewer.md` — 리뷰어 에이전트. **하네스 내부 전용** — 사용자가 직접 호출하지 않는다. plan 하네스가 워크플로우 내에서 자동 호출하며, 명세·와이어프레임 정합성 검증 (읽기 전용, pass/fail 판정)

현재 skill:
- `skills/plan/` — 기획 오케스트레이션 하네스. intake → planner → reviewer gate → wireframer → reviewer gate 오케스트레이션
- `skills/spec/` — 명세 포맷 지식 (planner 에이전트가 참조)
- `skills/wireframe/` — 와이어프레임 포맷 지식 (wireframer 에이전트가 참조)

## SSOT & Document Roles

| 문서 | 위치 | 역할 (SSOT) | 포함 내용 |
|------|------|-------------|-----------|
| 기능명세 | `docs/features/*.md` | 비즈니스 로직의 SSOT | 도메인 규칙, 정책, 비즈니스 플로우 |
| 화면명세 | `docs/screens/{ID}/*_screen.md` | 화면 UI의 SSOT | 화면 레이아웃, UI 요소, 유저스토리, 인수조건 |
| 와이어프레임 | `docs/screens/{ID}/*_wireframe*.html` | 시각적 프로토타입 | 기능명세 + 화면명세를 참조하여 생성 |

**원칙:**
- 기능명세에 UI 요소를 넣지 않는다. 화면명세에 비즈니스 규칙을 넣지 않는다. 관심사를 분리한다.
- 와이어프레임은 **두 문서 모두**를 참조하여 생성한다.

### 의존 방향: 단방향

```
기능명세(upstream)  ←  화면명세(downstream)  ←  와이어프레임(산출물)
독립적, 자기완결        features: [...]로          화면명세의 features로
비즈니스만 기술         기능을 참조                필요한 기능명세만 선택 참조
```

- 기능명세는 자신을 참조하는 화면을 알 필요가 없다 (역참조 금지)
- 역방향 조회가 필요하면 하네스가 계산한다: `grep -l "AUTH__LOGIN" docs/screens/*/**_screen.md`

### 프론트매터로 참조 연결

화면명세는 프론트매터에 참조할 기능을 선언하여, 와이어프레이머가 문서 전체를 읽지 않고도 필요한 기능명세만 가져올 수 있게 한다.

**화면명세 프론트매터:**
```yaml
---
screenId: LOGIN
title: 로그인 화면
features:            # 이 화면이 참조하는 기능명세 featureId 목록
  - AUTH__LOGIN
  - AUTH__LOGIN__EMAIL_LOGIN
viewport: single     # single | multi
---
```

**기능명세 프론트매터:**
```yaml
---
domain: AUTH
label: 인증
toc: [...]           # 기능 계층 목차만. 화면 역참조 없음
---
```

## ID Rules

**screenId** — 화면 폴더명과 동일, UPPER-KEBAB:
- `LOGIN`, `CHECKOUT`, `PRODUCT-LIST`
- 같은 목적의 변형이 있으면 이름으로 구분: `LOGIN-EMAIL`, `LOGIN-SOCIAL`

**featureId** — TOC 경로에서 파생, `__`로 깊이 구분:
- `AUTH`, `AUTH__LOGIN`, `AUTH__LOGIN__EMAIL_LOGIN`
- DOM 속성: `data-feature="AUTH__LOGIN"`

**elementId** — feature 스코프 내 짧은 영문 키:
- `EMAIL`, `SUBMIT`, `CODE`
- DOM 속성: `data-el="EMAIL"`
- wireframer가 화면명세를 분석하여 자율적으로 부여하며, 같은 `data-feature` 안에서만 유니크하면 됨

## Plugin Conventions

- SKILL.md는 소문자+하이픈, 부모 디렉토리명과 일치
- SKILL.md 본문 500줄 이하, 참조는 `references/` 하위에만. 단, 프로젝트 루트의 공유 스키마(`schema/`)는 직접 참조 허용
