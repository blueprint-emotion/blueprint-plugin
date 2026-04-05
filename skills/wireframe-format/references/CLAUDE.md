# Wireframe References

와이어프레임 생성 시 참조하는 완성 예제. 입력(기능명세 + 화면명세) → 출력(HTML) 전체 흐름을 보여준다.

wireframer는 화면명세(레이아웃 + Requirement + UserStory)를 주 입력 소스로 사용하여 UI 요소를 자율적으로 판단한다. 기능명세는 비즈니스 로직 참고용이다. 모든 feature는 `<bp-section>` 컨테이너를 사용한다.

## 예제 선택

| 예제 | 파일 | 사용 시점 |
|------|------|----------|
| 단일 feature | [SINGLE-FEATURE.md](SINGLE-FEATURE.md) | 로그인 같은 단일 폼 화면. 상태 탭(기본/에러) 패턴 포함 |
| 다중 feature | [MULTI-FEATURE.md](MULTI-FEATURE.md) | 사이드바+메인 같은 복합 레이아웃. 빈 상태 상태 탭, 고정 영역(헤더) 포함 |

## 상태 탭 레시피 요약

두 예제 모두 상태 탭을 사용한다. `<bp-state-tab>` 컴포넌트가 자동 처리하므로 마크업만 필요:

1. `<bp-state-tab>` 안에 `slot="상태명"` 자식 배치
2. 첫 번째 slot이 기본 표시 상태
3. 클릭으로 상태 전환

라디오 input, `:has()` 규칙, group 클래스, `.review-tabs` 오버레이 등 CSS-only 보일러플레이트 불필요.

## 레이아웃 선택 기준

| 화면 형태 | 사용 시점 | 예제 |
|----------|----------|------|
| 단일 포커스 | 하나의 주요 작업이 화면 지배 | SINGLE-FEATURE |
| 두 영역 | 보조 영역이 메인 영역을 제어 | MULTI-FEATURE |
| 다중 영역 | 여러 독립 책임 동시 표시 | (두 예제에서 확장) |

feature 관계를 명확하게 보여줄 수 있는 **가장 단순한 형태**를 선택한다.

## 컴포넌트 시스템 요약

모든 예제는 `bp-*` 웹 컴포넌트 라이브러리를 사용한다:

- `base.css` — 시맨틱 색상 토큰 (oklch 컬러 시스템)
- `bp-components.js` — 웹 컴포넌트 등록
- `<bp-page>` — 와이어프레임 셸 (메타바, 본문 프레임, aside 패널)
- `<bp-section>` — feature 컨테이너 (라벨 자동 표시)
- `<bp-state-tab>` — 상태 전환 탭
- `<bp-button>`, `<bp-input>`, `<bp-field>` 등 — UI 요소

raw HTML(`<input>`, `<button>`)과 raw 색상(`bg-zinc-*`) 대신 컴포넌트와 시맨틱 토큰을 사용한다.
