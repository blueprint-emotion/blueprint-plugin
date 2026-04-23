# feature-spec — Changelog

이 스킬의 변경 이력. SemVer(MAJOR.MINOR.PATCH)를 따른다.

- **MAJOR**: 파일 구조·frontmatter 필드·featureId 네이밍의 호환성 깨는 변경
- **MINOR**: 새 선택 필드·새 패턴 추가 (호환성 유지)
- **PATCH**: 문서 명료화·예제 보강·오타 수정

## [1.4.2] - 2026-04-20

### Added

- `user-invocable: false` frontmatter — 슬래시 명령(`/bp:feature-spec`) 노출 방지. planner agent에서만 자동 트리거

## [1.4.1] - 2026-04-15

### Added
- description에 데이터 생명주기 관련 키워드 (`데이터 생명주기`, `데이터 갱신`, `실시간 반영`) 추가 — 자동 트리거 정확도 향상
- description 첫 문장에 "비즈니스 규칙(rules)과 **데이터 생명주기**를 SSOT로 관리"로 명시

## [1.4.0] - 2026-04-15

### Added
- `## 데이터 생명주기` 선택 섹션 규약 — 도메인 데이터의 갱신 주기·실시간 여부를 **기획자 언어**로 기술. 개발자는 이 내용을 근거로 DB.md의 스키마·구독 전략을 작성·갱신 (feature-spec → DB.md 단방향 파생 관계 명시)
- 어휘 가이드 — "실시간 반영 / 사용자 행동 시 갱신 / 세션 동안 고정 / 변경 저빈도 / 관리자 수정 시점만 변경" 5종으로 일관성 확보
- "기본 정책 + 예외" 작성 구조. feature별로 생명주기가 다른 경우만 예외로 나열
- toc와의 관계 명문화 — 데이터 생명주기는 UI 구분 단위가 아니므로 **toc 밖 예약 섹션**
- 자주 하는 실수 3항목:
  - 데이터 생명주기에 구현 용어(Postgres Changes·Redis TTL 등) 사용
  - `## 데이터 생명주기`를 toc에 포함
  - 화면명세에 데이터 갱신 주기를 직접 서술

### 배경
- 데이터 갱신 주기를 화면마다 중복 서술하는 대신 **도메인 레벨 SSOT**에 둔다는 원칙 유지. screen-spec은 features[] 링크로 자동 연결

## [1.3.0] - 2026-04-14

### Added
- "기능명세는 도메인 전체, 화면명세는 그 화면이 쓰는 것만" 섹션 신설. **기능명세에 100개가 있어도 화면명세 `features[]`에는 실제 UI로 표현하는 것만 담는다**는 원칙 명문화. 내부 동작·URL 동작·파일 규약 등 UI 구분 없는 rule은 description 본문 마크다운 링크로 참조

## [1.2.0] - 2026-04-14

### Added
- "rule은 기능명세 밖으로 복제되지 않는다" 섹션 신설. 화면명세의 AC·비고, 와이어프레임의 description·note 각각에 대해 rule 복제 금지 원칙과 올바른 링크 참조 방법 명시
- 자주 하는 실수에 "rules가 화면명세 `## 비고`나 와이어프레임 `bp-description-note`에 복제" 항목 추가

## [1.1.0] - 2026-04-14

### Added
- "toc 변경 시 영향 추적 (필수 절차)" 섹션 추가. toc 항목을 삭제·이름 변경할 때 두 가지 grep을 강제:
  1. `{DOMAIN}__{TOC_ID}` — 구조적 참조(area features, wireframe data-feature)
  2. 기능 한글명·UI 요소 — 산문 참조(INDEX, ROUTING, screen.md 본문)
- 자주 하는 실수에 "toc 항목 삭제·이름 변경 시 featureId grep 미수행" 항목 추가
- 배경: lint(`/lint-docs`)가 구조적 참조는 잡지만 산문 잔재는 사람만 잡을 수 있다는 한계 명시

## [1.0.0] - 2026-04-14

도메인별 1파일 + frontmatter `toc` + `**rules**` 본문 구조의 첫 정식 릴리스.

### Added
- frontmatter 필수 필드: `domain`, `title`, `toc` (각 항목 `id` + `label`)
- title 접두사 규약: `기능_`
- 본문 구조: `# {DOMAIN} (한글명)` h1 + `## ID (한글명)` 헤딩 + `**rules**` bullet
- featureId 네이밍 — `{DOMAIN}__{ID}` 더블 언더스코어 계층 구분
- rules 첫 항목으로 도메인 구조 선언 ("X는 Y, Z를 가진다")
- 헤딩 depth 1~5 지원 (도메인/대기능/하위 기능/세부/최하위)
- references 예제: `PRODUCT.md`

### Changed
- `label` 필드 → `title` 필드로 통일 (카테고리 접두사 `기능_` 사용)
- toc의 `id`는 도메인 접두사 없는 짧은 형태(`INFO`)로 통일 (전체 featureId는 `{domain}__{id}`로 조합)
- elements를 화면명세(screen-spec)로 이관 — 기능명세는 비즈니스 규칙(rules)만 담당

### Removed
- 우측 기능 패널 데이터 소스 역할 (2026-04-13 panel-features 폐기, 플랫폼이 더 이상 MD를 직접 파싱하지 않음. 플러그인이 와이어프레임 HTML 생성 시점에 임베드)
- elements 본문 작성 (화면명세로 이동)
