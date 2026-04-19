# skills/ 폴더 가이드

이 폴더의 스킬은 `bp` 플러그인이 사용자 프로젝트에서 산출물을 생성할 때 참조하는 스킬이다. 이 프로젝트 자체에서도 도그푸딩 목적으로 `.claude/skills/`에 심링크로 연결해 사용한다.

스킬은 4개로 구성된다:

- **intake** — `planner` agent의 작업 노트(`intake.md`) 형식·인터뷰 흐름·재실행 정책
- **feature-spec** — 기능명세(`docs/features/{DOMAIN}.md`) 도메인 SSOT
- **screen-spec** — 화면명세(`docs/screens/**/*.md`) 페이지·시트·다이얼로그·영역
- **wireframe** — 와이어프레임 HTML(`docs/screens/**/*.html`) bp-* Web Components

## 버전·변경 이력 관리 (필독)

이 스킬들은 외부 플러그인을 통해 사용자 프로젝트에 배포된다. 우리가 임의로 수정하면 사용자 산출물에 즉시 영향이 가므로 다음 정책을 지킨다.

- 각 스킬 폴더에는 `SKILL.md` frontmatter의 `version` 필드와 `CHANGELOG.md`가 함께 존재해야 한다
- SemVer를 따른다:
  - **MAJOR**: 호환성 깨는 변경 (필드 제거·이름 변경, 기존 산출물 무효화)
  - **MINOR**: 호환성 유지하면서 추가 (새 필드·새 컴포넌트·새 패턴)
  - **PATCH**: 문서 명료화·예제 보강·오타 수정
- 변경 시 두 가지를 같이 한다:
  1. `SKILL.md`의 `version` 필드를 SemVer 규칙대로 bump
  2. `CHANGELOG.md`에 변경 내용을 Added/Changed/Removed/Fixed로 분류하여 추가
- BREAKING 변경은 `CHANGELOG.md`의 해당 버전에 명확히 표기 (예: `### Removed` 항목 또는 `### BREAKING` 별도 섹션)
- 화면명세·기능명세 산출물의 frontmatter 필드 추가 시 sample/references도 함께 갱신

## 스킬 목록

| 스킬 | 역할 | 산출물 |
|------|------|--------|
| `intake` | 화면 작업 노트 (planner agent가 사용) | `docs/screens/**/intake.md` |
| `feature-spec` | 기능명세 생성 | `docs/features/{DOMAIN}.md` |
| `screen-spec` | 화면명세 생성 | `docs/screens/**/{screen,area_*,sheet_*,dialog_*}.md` |
| `wireframe` | 와이어프레임 생성 | `docs/screens/**/*.html` |

## 설계 원칙

### 기능명세 = 도메인 규칙, 화면명세 = 화면 요소

- **기능명세** (rules): "이 도메인은 무엇을 가지고 있고, 어떤 규칙이 적용되는가"
- **화면명세** (elements): "이 화면에서 사용자가 무엇을 보고, 어떻게 표현되는가"

같은 도메인 속성도 화면마다 다르게 표현되므로, elements는 화면명세에 둔다. 기능명세에는 화면에 무관한 비즈니스 규칙만 둔다. **elements에는 기능명세의 구체적 속성명을 쓰지 않고, featureId로 영역만 참조하고 표현 패턴을 기술한다.** 기능명세에서 속성명이 바뀌어도 화면명세를 수정할 필요가 없다.

### 기획자가 쓰고 읽는 문서

기능명세를 작성·검수하는 사람은 기획자다. 비즈니스 언어로 작성하고 DB 스키마 표기(PK, FK, integer 등)는 사용하지 않는다. 단, 구조는 개발자가 이 문서를 근거로 DB 모델링을 할 수 있을 정도로 정돈되어 있어야 한다.

### SSOT + 링크 참조

- 비즈니스 규칙(rules)은 **기능명세에만** 작성
- 화면 요소(elements)는 **화면명세 영역 파일에만** 작성
- 유저스토리·인수조건은 **해당 영역 파일에만** 작성
- 화면명세에서 기능명세를 **링크로 참조** — 규칙을 복사하지 않는다

### 에이전트 컨텍스트 최소화

1. **루트 화면명세** → 전체 레이아웃 파악 + 필요한 영역 파일만 선택
2. **영역 화면명세** → 유저스토리 + elements + 인수조건이 자기완결적
3. **기능명세** `toc` → 목차만 읽고 필요한 `##` 섹션으로 점프

## 문서 간 연결 구조

```
루트 페이지 (screen.md)
  → 전체 레이아웃 + 영역/시트/다이얼로그 링크
  → features: [PRODUCT, QNA]            ← 도메인 단위 참조

영역 (area_image.md)
  → features:
      - id: PRODUCT__IMAGE               ← featureId
        ref: ../../features/PRODUCT.md#IMAGE  ← 비즈니스 규칙 링크
  → 유저스토리 (이 영역의 "왜")
  → elements (featureId 참조 + 표현 패턴)
  → 인수조건 (이 영역의 완성 기준)

시트·다이얼로그 (sheet_*.md, dialog_*.md)
  → 페이지에서 트리거되는 오버레이
  → 자체 screenId, purpose, 상태 전이, 인수조건

플랫폼 우측 패널
  → 영역 파일의 elements (트리 노드)
  → 기능명세의 rules (트리 노드 펼침 시)
```

## 핵심 규칙 요약

### 기능명세

- 위치: `docs/features/{DOMAIN}.md` (도메인별 1파일)
- frontmatter toc의 `id`는 짧은 형태 — `INFO` (O), `PRODUCT__INFO` (X)
- 전체 featureId = `{domain}__{toc.id}` 로 조합
- 본문: `## {ID} (한글명)` 헤딩 아래 `**rules**`만 작성
- rules 첫 항목: "X는 Y, Z를 가진다" — 도메인 구조 선언
- UI 표현·DB 스키마 표기 금지

### 화면명세 — 타입별 파일

| 파일 | type | title 접두사 | 설명 |
|---|---|---|---|
| `screen.md` | `page` | `화면_` | 페이지 (루트 1개/폴더) |
| `sheet_{name}.md` | `sheet` | `시트_` | 시트, 복수 가능 |
| `dialog_{name}.md` | `dialog` | `다이얼로그_` | 다이얼로그, 복수 가능 |
| `area_{name}.md` | `panel` | `영역_` | 페이지의 레이아웃 영역, 복수 가능 |

**페이지(`screen.md`)**:
- frontmatter: `screenId`, `title`, `type: page`, `purpose`, `viewport`, `features` (도메인명 배열), `group`
- 필수 섹션: `## 화면 구성` (레이아웃 + 영역/오버레이 링크), `## 상태`
- 선택 섹션: `## 인수조건` (영역 간/화면 간 규칙만), `## 진입 경로`, `## 비즈니스 규칙`
- 유저스토리는 루트에 두지 않는다 — `purpose` 프론트매터로 충분, 상세는 영역 파일에

**시트·다이얼로그(`sheet_*.md`, `dialog_*.md`)**:
- frontmatter: 페이지와 동일하되 `type: sheet | dialog`
- 트리거 페이지와 같은 폴더에 둔다
- 자체 screenId, 상태 전이, 인수조건을 갖는 독립 명세

**영역(`area_*.md`, `type: panel`)**:
- frontmatter: `title`, `type: panel`, `features` (각 항목: `id`(featureId) + `ref`(기능명세 링크))
- `## 유저스토리` — 이 영역의 "왜"
- `**elements**` — featureId 참조 + 표현 패턴 (속성명 직접 쓰지 않음)
- `## 인수조건` — 이 영역의 완성 기준

기능 영역이 1개면 `screen.md` 하나에 인라인. 2개 이상이면 `screen.md` + `area_*.md`로 분리.
