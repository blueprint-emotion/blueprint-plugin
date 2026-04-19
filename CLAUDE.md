# Blueprint Plugin (`bp`)

기획자가 Claude Code에서 사용하는 **기능명세 / 화면명세 / 와이어프레임** 생성 플러그인. 이 저장소는 플러그인 자체의 코드(메타·command·agent·skill)를 담는다.

## 관련 저장소

| 저장소 | 역할 |
|--------|------|
| [`blueprint-platform`](https://github.com/blueprint-emotion/blueprint-platform) | 와이어프레임 뷰어 + 코멘트 협업 플랫폼 |
| [`blueprint-plugin`](https://github.com/blueprint-emotion/blueprint-plugin) | **이 프로젝트.** Claude Code 플러그인 |
| [`blueprint-example`](https://github.com/blueprint-emotion/blueprint-example) | 플러그인 사용 예제 프로젝트 |

**전체 흐름**: 기획자가 자신의 프로젝트에 플러그인 설치 → `/bp:plan`·`/bp:wireframe` 명령으로 산출물 생성 → Git push → 플랫폼이 GitHub API로 fetch하여 렌더링

## 프로젝트 구조

```
blueprint-plugin/
├── .claude-plugin/
│   ├── plugin.json              ← 플러그인 메타 (name: "bp")
│   └── marketplace.json         ← GitHub 마켓 메타
├── commands/                    ← /bp:* 슬래시 명령
│   ├── plan.md                  ← /bp:plan
│   └── wireframe.md             ← /bp:wireframe
├── agents/                      ← bp:* 서브에이전트
│   ├── planner.md               ← 요구사항 → 명세 (와이어 X)
│   ├── wireframer.md            ← screen.md → 와이어 HTML
│   └── reviewer.md              ← 산출물 검증 (자동 호출)
├── skills/                      ← 모델 자동 트리거 스킬
│   ├── CLAUDE.md                ← 스킬 폴더 가이드
│   ├── intake/                  ← intake.md 형식·인터뷰 흐름
│   ├── feature-spec/            ← 기능명세 SSOT
│   ├── screen-spec/             ← 화면명세
│   └── wireframe/               ← 와이어프레임 HTML + bp-* 컴포넌트
└── .claude/skills/              ← 도그푸딩 심링크 (skills/로)
```

## 호출 흐름

```
기획자: /bp:plan docs/requirements/product-detail.md
   ↓
[command plan.md]
   - 인자 검증 (파일 존재? 자연어?)
   - bp:planner agent를 Task tool로 호출
   ↓
[agent planner]
   - 요구사항 파싱 → 화면 후보 식별
   - intake 스킬 따라 intake.md 초안 생성
   - 빈 슬롯 단계별 인터뷰
   - 컨펌 게이트 (intake 완료 후 + 작업 트리 후)
   - feature-spec 스킬 호출 → docs/features/*.md
   - screen-spec 스킬 호출 → docs/screens/**/*.md
   - bp:reviewer agent를 Task tool로 호출 (자동)
   ↓
[agent reviewer]
   - SSOT/featureId/링크/frontmatter/교차 검증
   - 위반 리포트 + 자동 수정 제안
   ↓
사용자에게 안내: "/bp:wireframe screen.md 하면 와이어 그려져요"

────────────────────────

기획자: /bp:wireframe docs/screens/상품/product-detail/screen.md
   ↓
[command wireframe.md]
   - 인자 검증 (screen.md frontmatter)
   - bp:wireframer agent를 Task tool로 호출
   ↓
[agent wireframer]
   - 같은 폴더의 area_*.md, sheet_*.md, dialog_*.md 자동 읽기
   - features[].ref 따라 기능명세 rules 참조
   - wireframe 스킬 따라 viewport별 HTML 생성
   - bp:reviewer agent 자동 호출
   ↓
[agent reviewer]
   - 와이어프레임 + 명세 교차 검증
```

## 4개 스킬·3개 에이전트·2개 명령

| 명령 | 호출 agent | 사용 skill | 산출물 |
|---|---|---|---|
| `/bp:plan {요구사항.md}` | `bp:planner` → `bp:reviewer` | intake, feature-spec, screen-spec | intake.md, features/*.md, screens/**/*.md |
| `/bp:wireframe {screen.md}` | `bp:wireframer` → `bp:reviewer` | wireframe (screen-spec 검증용) | screens/**/*.html |

**책임 분리**:
- **commands** = 인자 검증 + agent 호출 (얇은 wrapper)
- **agents** = 워크플로 오케스트레이션 + skill dispatch
- **skills** = 산출물 형식 규약 + 작성 가이드 (SSOT)

## 핵심 설계 원칙

- **기능명세 = 도메인 규칙 (SSOT)**: 비즈니스 규칙만. UI 표현 금지
- **화면명세 = 화면 요소**: featureId로 기능명세를 참조. 속성명 직접 사용 금지
- **와이어프레임 = 정적 HTML**: bp-* Web Components (shadcn/ui 1:1 포팅) + Tailwind
- **intake = 작업 노트**: 산출물 아님. planner의 인터뷰 결과·재실행 추적용
- **SSOT + 링크 참조**: 정보를 한 곳에만 작성하고 나머지는 링크로

## 토큰 효율적 문서 읽기

산출물 문서(기능명세, 화면명세)는 frontmatter에 TOC를 갖는다. 참조 시 전체를 읽지 않는다:

1. frontmatter `toc`만 읽어 구조 파악
2. Grep으로 필요한 `## {ID}` 헤딩의 줄번호 찾기
3. Read의 `offset`/`limit`로 해당 섹션만 읽기

와이어프레임 스킬에서 **`bp-components.js`를 절대 fetch/read하지 않는다** — 6,600줄 빌드 산출물. 컴포넌트 사용법은 SKILL.md의 빠른 참조표 + `references/components/bp-X.md` 분할 파일에 모두 있음.

## 버전 관리 정책

각 스킬은 독립 SemVer를 갖는다 (skills/{name}/SKILL.md frontmatter `version` + `CHANGELOG.md`).

플러그인 자체(`plugin.json` `version`)는 별도 SemVer.

### 호환성 매트릭스

플러그인 한 버전이 4개 스킬을 한 세트로 pin한다:

| 플러그인 버전 | intake | feature-spec | screen-spec | wireframe |
|---|---|---|---|---|
| 0.1.0 | 0.1.1 | 1.4.2 | 1.6.1 | 4.1.2 |

스킬을 개별 bump할 때:
- **MAJOR (스킬)** = 산출물 호환성 깨짐 → **MAJOR (플러그인)** 같이 bump
- **MINOR (스킬)** = 새 슬롯·새 패턴 추가 → **MINOR (플러그인)** 같이 bump
- **PATCH (스킬)** = 문서 명료화·예제 보강 → **PATCH (플러그인)**

## 개발 시 주의사항

### 스킬 수정

- `skills/CLAUDE.md`에 전체 설계 원칙·문서 간 연결 구조가 정의되어 있음
- 각 `SKILL.md`는 2단계 참조: 스킬 파일만으로 작성 가능 → 필요 시 references 참조
- 변경 시 SKILL.md `version` bump + CHANGELOG.md 항목 추가 (Added/Changed/Removed/Fixed)
- BREAKING 변경은 마이그레이션 가이드 함께 작성

### Agent 수정

- agent 본문은 워크플로 단계만 명시. 산출물 형식은 skill 가이드라인 따르라고 위임
- agent가 다른 agent 호출 시 `subagent_type: "bp:{name}"` 형태
- 새 agent 추가 시 namespace 충돌 주의 (`bp:` 안에서 unique)

### Command 수정

- command는 얇게 유지. 인자 검증 + agent 호출만
- $ARGUMENTS placeholder로 사용자 인자 받음
- 엣지 케이스(파일 없음, 형식 위반)는 command에서 거르고 agent로 안 넘김

### 도그푸딩

이 저장소에서 `.claude/skills/`가 `skills/`로 심링크되어 있어 **스킬 자동 트리거**는 자기 자신에서 테스트 가능 (예: 화면명세 파일을 만들어보면 screen-spec 스킬이 트리거).

명령(`/bp:plan`, `/bp:wireframe`)과 에이전트(`bp:planner` 등)를 테스트하려면 namespace 컨텍스트가 필요하므로 **plugin-dir 모드로 Claude Code를 시작**해야 한다:

```bash
claude --plugin-dir .
```

이 저장소 루트에서 실행하면 `bp` 플러그인이 로드되어 `/bp:plan`, `/bp:wireframe` 명령이 활성화된다. 테스트용 화면을 만들고 싶으면 `docs/screens/test/` 같은 임시 폴더를 만들어 돌려보고, 결과 산출물은 git에 커밋하지 않고 정리.

심링크와 plugin-dir 모드 둘 다 활성화된 환경에서는 plugin-dir이 우선이라 같은 스킬이 중복 로드되지 않는다.

## 사용자 프로젝트와 이 저장소의 차이

이 저장소(`blueprint-plugin`)는 **플러그인의 소스**. 사용자가 자신의 프로젝트에 이 플러그인을 설치하면, 사용자 프로젝트에서 `/bp:plan`·`/bp:wireframe` 명령이 동작한다.

- 이 저장소: 플러그인 코드 (commands, agents, skills) 작성·유지
- 사용자 프로젝트: 산출물(`docs/features/`, `docs/screens/`) 생성

스킬·agent의 모든 동작 가이드는 **사용자 프로젝트의 `docs/` 폴더**를 가정하고 작성되어야 한다.
