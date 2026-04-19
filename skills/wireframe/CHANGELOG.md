# wireframe — Changelog

이 스킬의 변경 이력. SemVer(MAJOR.MINOR.PATCH)를 따른다.

- **MAJOR**: 와이어프레임 작성 규약·태그 인터페이스의 호환성 깨는 변경
- **MINOR**: 새 컴포넌트·새 패턴·새 옵션 추가 (호환성 유지)
- **PATCH**: 문서 명료화·예제 보강·오타 수정

## [4.1.2] - 2026-04-20

### Added

- `user-invocable: false` frontmatter — 슬래시 명령(`/bp:wireframe`) 노출 방지 (commands/wireframe.md와 충돌 회피). wireframer agent에서만 자동 트리거

## [4.1.1] - 2026-04-17

### Fixed
- fragment 내부 요소의 `data-element` 누락 이슈 — bp-fragment/bp-area 레퍼런스 예제에 `data-element`가 한 번도 등장하지 않아 에이전트가 fragment 내부 요소에서 자주 누락했다. 모든 예제에 `data-element`를 추가하고, fragment-only 요소(`빈 목록`·`에러` 등)도 `data-element`가 필수임을 명시
- `bp-descriptions.md` 문구 "보통 정상 프레임의 요소가 선택된다" 를 fragment-only 요소도 매칭 대상임을 드러내는 문장으로 교체. fragment의 `id`·`title`은 매칭에 쓰이지 않음을 명시
- SKILL.md에 정상 프레임 / fragment 두 케이스 예제를 같이 보여주는 블록 추가

## [4.1.0] - 2026-04-17

### Added
- `bp-page`에 optional `data-feature` 허용. 페이지 대표 도메인(e.g. `PROJECT__DETAIL`)을 부여하면 page 앵커 라벨에 해당 값이 표시된다. 미지정 시 `SCREEN` 폴백
- 페이지 핀 코멘트 식별자에 page의 `data-feature`가 포함되므로, 값을 변경하면 기존 page 핀은 앵커가 바뀐 것으로 간주된다 (`bp-section`의 `data-feature-key` 변경과 동일 규칙)

## [4.0.0] - 2026-04-17

### BREAKING
- feature 핀 앵커 규약 전면 교체. 메인 UI `<bp-section>`(조상에 `<bp-fragment>`가 없는 section)은 이제 `data-feature`만으로 식별하지 않고 **`data-feature` + `data-feature-key`** 조합을 사용한다. 기존 와이어프레임에서 메인 UI section에 `data-feature-key`가 없으면 호환되지 않는다.
- `<bp-fragment>` 내부 `<bp-section>`은 더 이상 feature 핀 앵커가 아니다. fragment 내부 section은 sidebar 도메인 매칭용으로만 취급하며 `data-feature-key`를 붙이지 않는다.
- 페이지 전체 코멘트는 `bp-page` 태그 자체를 page anchor로 사용한다. 기존의 feature_id NULL 기반 우회 해석에 의존하지 않는다.

### Added
- `SKILL.md`에 새 앵커 모델 문서화: `bp-page` = page anchor, `bp-fragment` = fragment anchor, 메인 UI `bp-section[data-feature][data-feature-key]` = feature anchor
- `data-feature-key` strict 규칙 추가: 메인 UI에서는 단일 section이어도 필수, kebab-case 사용, 페이지 전역 unique
- `references/components/bp-section.md` 속성 표에 `data-feature-key` 추가
- `references/example-product-detail.html`의 메인 프레임 section들에 `data-feature-key` 적용, 같은 `PRODUCT__INFO` feature를 `summary` / `detail` 슬롯으로 나눈 예시 추가

### Removed
- 메인 UI feature anchor를 `data-feature` 단일 값으로 식별하던 기존 규약. 하위 호환 없음

## [3.1.0] - 2026-04-15

### Added
- 우측 rail의 element 카드에 **위치 보기 버튼**(eye 아이콘) 추가. 클릭 시 메인 와이어프레임에서 매칭되는 첫 `[data-element="X"]` 노드로 부드럽게 스크롤(`scrollIntoView({behavior:"smooth", block:"center", inline:"center"})`) + 스크롤 정착 후 outline flash 1.5초. 가로 보드라 좌우 이동도 같이 처리됨
- `scrollend` 이벤트 우선 사용, 미지원 환경은 timeout fallback. CSS.escape로 따옴표/특수문자 포함 element name 안전 처리

## [3.0.0] - 2026-04-15

### BREAKING
- `bp-fragment` 본문이 이제 항상 `.bp-fragment-body` 박스(`rounded-lg border border-border bg-background p-4`)로 자동 래핑된다. 기존 와이어프레임에서 조각 안에 직접 border/radius/padding을 가진 wrapper div를 쓰던 경우 **이중 박스**가 되므로 내부 wrapper의 시각 스타일(`rounded`, `border`, `p-*`, `bg-*`)을 제거해야 한다. 레이아웃 스타일(`flex`, `gap-*`)만 남긴다.

### Changed
- `references/components/bp-fragment.md` — 빌드 결과 구조와 이중 박스 주의 명시
- SKILL.md 보드 패턴 설명에 본문 자동 래핑 한 줄 추가

## [2.0.0] - 2026-04-15

### BREAKING
- 상태 표현 방식 전면 교체: `data-show` / `data-hide` / `data-state-ref` 및 상태 변형 시스템 전체 제거. 기존 와이어프레임의 상태 토글 기반 구조는 **호환 불가** — 보드 패턴으로 수동 마이그레이션 필요
- `bp-description` 패밀리(`bp-description` / `bp-description-purpose` / `bp-description-rules` / `bp-description-element` / `bp-description-note`)와 `bp-screen-description` 제거. 기능 설명은 이제 `<script type="application/bp-description+json">` 으로 임베드
- 파일명 `mobile` 분기 규칙 제거. viewport는 `<bp-frame viewport="pc|mobile">` 속성으로 명시 (파일 분리 여부는 스킬 관심사가 아니라 화면명세/플랫폼 규약)
- `bp-area`의 `title` 속성 제거 — 외곽 카드 헤더 미렌더. 영역 구분은 각 `<bp-fragment>`의 `title`/`description`으로만 표현 (우측 rail의 section header가 이미 feature 단위 라벨을 제공하므로 카드 헤더가 중복)

### Added
- 보드 패턴 — `<bp-board>` 가로 보드에 `<bp-frame viewport="pc|mobile">` 정상 프레임 + `<bp-area>` 상태 조각 영역 + `<bp-fragment id title description>` 개별 조각. Figma 보드 메타포
- JSON description — `<script type="application/bp-description+json">` 안에 `{purpose, rules, sections: [{feature, label, elements, notes}]}` 스키마. `bp-descriptions` 런타임이 우측 sticky rail로 자동 렌더
- `references/components/` 신규 5개: `bp-board.md`, `bp-frame.md`, `bp-area.md`, `bp-fragment.md`, `bp-descriptions.md`
- SKILL.md 빠른 참조 표에 "보드/설명 (블루프린트 전용)" 섹션 추가
- 요소 흡수 원칙 문서화 — 한 영역의 상태 변형(빈·에러·로딩 등)은 그 section의 elements로 흡수하고 시각 조각만 `<bp-fragment>`로 분리 (같은 feature를 여러 section으로 쪼개지 않음)

### Changed
- HTML 템플릿: `<bp-board>` 래핑 필수, `<head>`에 JSON description script tag 포함, bp-components.js에서 `defer` 제거(DOMContentLoaded에서 자체 초기화)
- `references/example-product-detail.html` 보드 패턴으로 재작성 (1409줄 → ~300줄, JSON 4 sections + 1 frame + 2 area + 3 fragment)
- "자주 하는 실수" 항목 갱신 — data-show/hide/description-element 관련 3개 삭제, 보드 구조 위반/요소 흡수 위반/viewport 혼합 관련 4개 추가

### Removed
- 상태 변형 섹션 (토글 UI, 메인↔description 동기화, 상태 가시성 경계, `data-state-ref` 크로스 섹션 참조) 전체
- `bp-description-note` 작성 규칙 섹션 (notes는 이제 JSON `sections[].notes` 필드로 대체)
- `references/components/bp-description.md`

## [1.5.0] - 2026-04-15

### Added
- 크로스 섹션 상태 참조 `data-state-ref` 도입. `<bp-section data-state-ref="FEATURE__ID" data-show="...">` 로 DOM은 자연 시각 위치(탑바 등)에 두고 가시성만 다른 섹션의 상태를 따라가게 한다. `state-variants.ts`가 opt-in 레지스트리로 참조 섹션을 연결해 참조된 섹션의 `applyState` 호출 시 함께 토글
- "CSS 투영(`position: fixed`) escape hatch" 가이드를 `data-state-ref` 권장 패턴으로 교체. 좌표 하드코딩·리뷰어 혼란·탑바 레이아웃 의존 문제 제거
- 배경: `project/detail/wireframe.html`의 💬 코멘트 버튼을 뷰어 섹션 DOM에 두고 `position: fixed`로 탑바 좌표에 투영하던 방식이 좌표 하드코딩과 비직관적 DOM 위치를 낳았다. `data-state-ref`는 DOM은 시각 위치 그대로 두고 상태만 opt-in으로 원격 참조하는 방식으로 두 관심사를 분리한다

## [1.4.0] - 2026-04-14

### Added
- "상태 가시성 경계 — 상태가 정의된 섹션 안에 두기" 섹션 신설. `state-variants.ts`가 bp-section별 독립 상태 트리이므로, 특정 상태에 가시성이 종속된 UI는 그 상태를 정의한 bp-section DOM 안에 물리적으로 중첩되어야 한다는 규칙 명문화. 잘못/올바른 예제 포함
- "시각 위치가 다른 영역이어야 할 때 — CSS 투영 escape hatch" 하위 가이드 추가. DOM은 상태 소유 섹션에, 시각 좌표는 `position: fixed`로 다른 영역(탑바 등)에 투영하는 패턴. 예제 포함 + 주의사항(좌표 의존성, 화면명세 명시, 주석 가이드)
- 자주 하는 실수 표에 "상태가 현재 bp-section 밖에 정의됨" 항목 추가 — 탑바 버튼이 뷰어 섹션 상태를 참조하는 패턴처럼 크로스 섹션 상태 동기화가 안 되는 케이스. 시각 위치와 DOM 위치가 달라져도 상태 정확성 우선, 투영이 필요하면 CSS escape hatch 사용
- 배경: `project/detail/wireframe.html`의 💬 코멘트 버튼 작업 중 이 제약이 드러남. 실 플랫폼은 `{isHtml && <Button/>}` 런타임 조건부로 탑바에 렌더. 와이어프레임 스펙은 단일 상태 트리를 얻기 위해 DOM을 뷰어 섹션 안에 두고, 시각만 `position: fixed`로 탑바 좌표에 투영하는 방식으로 동시에 만족시킴

## [1.3.0] - 2026-04-14

### Changed
- `references/components.md` (단일 30k 토큰 파일) → `references/components/bp-{name}.md` 31개로 분할. shadcn과 동작/제약 차이가 있거나 composition이 복잡한 컴포넌트만 별도 파일을 가지며, shadcn과 동일한 단순 컴포넌트는 SKILL.md 빠른 참조 표만으로 충분 (24개)
- 토큰 절약: 단일 컴포넌트 작업 시 30k → ~0.5k 참조 (60배 감소), 다중 컴포넌트도 평균 12배 감소
- SKILL.md 빠른 참조 표의 31개 링크를 새 경로로 갱신, 분할 안 한 24개는 링크 제거 (표 한 줄 정보로 충분)

### Added
- `references/components/` 폴더 신설, 컴포넌트별 31개 파일. 표준 형식: 속성표 / Composition / shadcn과의 차이 / 미지원 / 함정 / 예제
- 각 분할 파일에 "함정" 섹션 — bp-checkbox host vs input class 적용, bp-input-group `align`이 CSS flex order로 DOM 순서 덮어씀, bp-sidebar `default-open` 명시 안 하면 열린 채로 시작, bp-table 소문자 colspan/rowspan, bp-tabs `defaultvalue` 소문자 등
- bp-icon `size="full"` 값 (가변 크기 컨테이너용) 빠른 참조 표에 명시
- bp-alert destructive variant 자동 아이콘이 `circle-x`임을 정확히 명시 (이전 표는 `triangle-alert`로 잘못됨)
- bp-avatar `rounded-*` 오버라이드 시 `after:rounded-*`도 같이 줘야 한다는 함정 표 한 줄 명시
- bp-sidebar `default-open="false"` 미명시 시 열린 채 시작한다는 함정을 빠른 참조 표 굵게 강조

### Removed
- `references/components.md` (분할로 대체)

## [1.2.0] - 2026-04-14

### Added
- "bp-description-note (주의사항) 작성 규칙" 섹션 신설. **화면명세의 `## 비고` 항목만 옮긴다**는 출처 표 명시 (기능명세 rule 금지, 작업 메모 금지)
- 자주 하는 실수 표에 "note에 기능명세 rule 복붙이나 작업 메모 작성" 항목 추가

## [1.1.0] - 2026-04-14

### Added
- "상태 변형 — 메인 UI ↔ description 동기화" 섹션 신설. `bp-description-element`도 메인과 동일한 `data-show`/`data-hide`를 가져야 한다는 규칙 명문화 (`state-variants.ts`가 동시 전환하므로 속성 누락 시 레일이 어긋남)
- **"모든 상태는 최소 1개의 description element를 갖는다"** 규칙 명시 — 기본·HTML·MD·로딩·에러·빈 등 토글에 등장하는 모든 상태. 어느 상태든 선택 시 우측 레일이 비면 UX가 깨진다
- 자주 하는 실수 표에 두 항목 추가:
  - description-element에 상태 속성 누락 (우측 레일이 현 상태와 어긋나 혼란)
  - 특정 상태(기본·로딩·에러·빈 등)에 해당 description element 누락 — 토글 선택 시 레일 공백 UX 문제. 기본 전용 element는 `data-hide="<모든 alt>"`, alt 전용은 `data-show="<그 alt>"`

## [1.0.2] - 2026-04-14

### Added
- 자주 하는 실수 표에 "bp-description 본문의 raw HTML 태그 미escape" 항목 추가. `<iframe>`, `</body>` 등은 백틱으로 감싸도 브라우저가 실제 태그로 해석해 텍스트가 사라진다. 반드시 HTML entity(`&lt;`, `&gt;`)로 escape

## [1.0.1] - 2026-04-14

### Added
- 자주 하는 실수 표에 "bp-page / 셸 CSS 임의 오버라이드 금지" 항목 추가 (`--page-max-width`, `--page-padding-x`, body padding, bp-page border/radius/min-height 등). 모든 와이어프레임이 동일한 셸·여백을 갖도록 보장. 레이아웃 조정은 `<bp-page-content>` 안쪽에서만.
- `references/example-product-detail.html`을 심링크에서 원본 파일로 전환 (스킬 폴더가 자기완결적이도록)

## [1.0.0] - 2026-04-14

플랫폼 우측 패널 폐기와 함께 와이어프레임 HTML 자체에 기능 설명을 임베드하는 새 아키텍처의 초안.

### Added
- bp-* Web Components 51종 + bp-icon 빠른 참조 테이블 (SKILL.md)
- 2단계 참조 구조: SKILL.md 빠른 테이블 + `references/components.md` 상세 예제
- `<bp-screen-description>` / `<bp-description>` / `<bp-description-element>` 임베드 컴포넌트
- 상태 변형 인라인 정의(`data-show` / `data-hide` + `/` 경로 계층)
- 토글 UI 자동 생성 규칙
- `<bp-section data-feature="...">` 기반 핀 코멘트 영역 마킹
- `references/example-product-detail.html` 종합 예제 심링크 (public/blueprint/v1/examples/product-detail-sample.html)

### Changed
- 와이어프레임 HTML 작성 시 React/JSX 사용 금지 명시 (Web Components only)
- 예시 화면명세 파일명 패턴을 새 컨벤션(area_image.md, area_option.md)으로 갱신

### Removed
- 우측 기능 패널(panel-features) 의존 (2026-04-13 폐기됨, 플랫폼이 더 이상 별도 패널 렌더 안 함)
