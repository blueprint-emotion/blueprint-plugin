# Skill Policy Summary

이 문서는 `skills/flowframe-spec` 과 `skills/flowframe-wireframe` 에 흩어져 있는 핵심 정책을 한 곳에 모아 정리한 정책 문서다.
목적은 스킬 사용 중 판단 기준을 흔들리지 않게 유지하는 것이다.

---

## 1. 프로젝트 구조 정책

- 사용자 프로젝트의 기준 구조는 `docs/features/`, `docs/screens/`, `docs/wireframes/` 이다.
- `feature` 는 비즈니스 기능 또는 의미 있는 콘텐츠 단위 문서다.
- `screen` 은 레이아웃과 feature 배치만 정의하는 문서다.
- `wireframe` 은 FlowFrame 업로드용 단일 HTML 산출물이다.

---

## 2. Feature 정책

- feature 는 UI 요소 단위가 아니라 비즈니스 기능 단위로 나눈다.
- feature 는 독립 설명 가능해야 한다.
- feature 는 여러 화면에서 재사용 가능해야 한다.
- feature 는 한 명 또는 한 팀이 맡을 수 있는 개발 단위여야 한다.
- 로그인 화면처럼 단순한 화면도 screen 과 feature 를 분리한다.
- 로고, 구분선, 배경 이미지처럼 장식 전용 요소는 feature 로 만들지 않는다.
- feature 파일은 영어 kebab-case 파일명으로 작성한다.
- `featureId` 는 영어 대문자와 언더스코어를 사용한다.
- `usedIn` 은 이 feature 를 참조하는 `docs/screens/*.md` 목록과 항상 일치해야 한다.

---

## 3. Screen 정책

- screen 은 레이아웃과 feature 참조만 담는다.
- screen 안에 feature 상세 명세를 중복 작성하지 않는다.
- 모든 screen 은 최소 1개 이상의 feature 를 참조해야 한다.
- 화면이 사실상 하나의 feature 라면 screen 문서는 짧게 유지한다.
- screen 파일명은 `LOGIN.md`, `PRODUCT_LIST.md` 같은 대문자 기반 이름을 사용한다.
- `screenId` 는 프로젝트에서 일관된 대문자 규칙을 유지한다.
- `viewport` 는 필수로 지정한다.
- 사용자가 선택할 수 있는 viewport 옵션은 `PC / 모바일 / 둘 다` 이다.
- `둘 다` 인 경우 한 screen 문서 안에서 `## 레이아웃 (PC)` 와 `## 레이아웃 (Mobile)` 로 분기한다.
- 기획자는 정보 배치 순서와 방향만 정의한다.
- 간격, 비율, 시각적 디테일은 screen 정책이 아니라 디자인 영역이다.

---

## 4. Wireframe 생성 정책

- wireframe 생성은 `docs/screens/*.md` 와 `docs/features/*.md` 를 기반으로 한다.
- output 은 `docs/wireframes/*.html` 아래에 만든다.
- HTML 은 단일 파일이어야 한다.
- 스타일링은 Tailwind CSS v4 유틸리티 클래스로만 처리한다.
- 커스텀 CSS 나 인라인 스타일에 의존하지 않는다.
- 컬러 팔레트는 `zinc` 중심의 그레이스케일을 사용한다.
- 모든 색상 관련 클래스에 `dark:` 변형을 포함한다.
- PC 와 mobile 은 별도 HTML 파일로 생성한다.
- viewport 별 파일명은 프로젝트 안에서 일관되게 정하되, 특정 suffix 규칙을 고정 정책으로 강제하지 않는다.

---

## 5. Metadata 정책

- 모든 wireframe HTML 은 `<script id="flowframe-meta" type="application/json">` 블록을 포함해야 한다.
- 필수 메타데이터 필드는 `generator`, `version`, `screenId`, `title`, `purpose`, `elements` 이다.
- `generator` 값은 반드시 `"flowframe-wireframe-skill"` 이어야 한다.
- `viewport` 와 `author` 는 선택 필드다.
- `elements` 는 1개 이상이어야 한다.
- 각 tracked element 는 `id`, `featureId`, `type`, `label`, `description`, `spec` 를 가진다.

---

## 6. 추적 ID 정책

- `data-feature` 와 metadata `elements[].id` 는 1:1로 맞아야 한다.
- ID 형식은 `FEATURE_{FEATURE_ID}_{ELEMENT_ID}` 를 사용한다.
- 같은 화면 안에서 각 `elements[].id` 는 유일해야 한다.
- 하나의 feature 안에 여러 tracked element 가 있을 수 있다.
- 이 경우 `featureId` 와 `spec` 은 같고, `ELEMENT_ID` 만 달라진다.
- `ELEMENT_ID` 는 의미 중심의 영어 대문자 식별자를 사용한다.
- `BUTTON`, `TEXT`, `INPUT` 같은 일반 타입명 남용보다 역할 중심 이름을 우선한다.

---

## 7. `data-feature` 정책

- 추적 대상 UI 요소에는 반드시 `data-feature` 를 부여한다.
- 메타데이터에 등록된 모든 요소는 HTML 안에서 대응하는 `data-feature` 를 가져야 한다.
- 반대로 HTML 의 tracked element 는 메타데이터에도 반드시 있어야 한다.
- 고정 UI chrome 은 `data-feature` 를 부여하지 않는다.
- feature 없는 고정 영역은 metadata `elements` 에 넣지 않는다.

---

## 8. 고정 영역 정책

- 상단 메뉴바, 하단 상태바, 헤더, 푸터처럼 feature 참조가 없는 영역은 고정 영역으로 본다.
- 고정 영역은 일반 HTML 로 렌더링한다.
- 고정 영역에는 `data-feature` 를 달지 않는다.
- 고정 영역은 FlowFrame 하이라이트 대상이 아니다.

---

## 9. 생성 방식 정책

- 최초 생성은 2-pass 방식으로 진행한다.
- Pass 1 에서는 screen 을 읽고 레이아웃 골격과 고정 영역을 만든다.
- Pass 2 에서는 feature 를 하나씩 읽어 해당 위치를 채운다.
- 모든 feature 를 한 번에 읽고 한 번에 생성하는 방식은 피한다.
- feature 는 레이아웃 순서대로 하나씩 처리한다.
- 한 feature 의 `## 와이어프레임 요소` 가 비어 있거나 없으면, 그 feature 생성은 중단하고 사용자에게 알려야 한다.

---

## 10. 업데이트 정책

- wireframe 업데이트는 자동 동기화가 아니라 사용자 명시 요청으로만 수행한다.
- 사용자가 수정한 feature 를 말하면, 에이전트는 해당 feature 의 `usedIn` 을 보고 영향 범위를 계산한다.
- 에이전트는 어떤 wireframe 이 영향받는지 먼저 사용자에게 보여줘야 한다.
- 사용자 확인 없이 바로 업데이트하지 않는다.
- 사용자는 일부 화면만 제외할 수 있다.
- 업데이트 시에는 해당 feature 의 `## 와이어프레임 요소` 만 읽는다.
- 관련 없는 다른 feature 나 screen 을 다시 읽지 않는 것을 원칙으로 한다.
- 새 요소가 추가된 경우에는 해당 feature 영역과 metadata `elements` 를 함께 갱신한다.

---

## 11. 삭제 정책

- feature 를 screen 에서 제거하면 `usedIn` 도 함께 정리해야 한다.
- feature 전체 삭제 시, 먼저 참조 중인 screen 목록을 확인해야 한다.
- 참조가 남아 있으면 사용자에게 경고하고 screen 쪽 참조 제거를 먼저 반영해야 한다.
- screen 삭제 시, 그 screen 이 참조하던 feature 들의 `usedIn` 에서 해당 screen 을 제거해야 한다.
- screen 삭제 후에는 `docs/wireframes/` 아래의 대응 HTML 삭제 여부도 사용자에게 확인해야 한다.

---

## 12. 정합성 정책

- screen 의 feature 참조와 실제 feature 파일 존재 여부는 항상 맞아야 한다.
- feature 의 `usedIn` 과 실제 screen 참조 관계는 항상 맞아야 한다.
- wireframe 의 `data-feature` 와 metadata `elements` 는 항상 맞아야 한다.
- metadata 의 `featureId` 와 `spec` 은 실제 feature 문서와 연결되어야 한다.

---

## 13. 디자인 정책

- 와이어프레임의 목적은 예쁜 UI 가 아니라 구조 검토다.
- 메인 콘텐츠가 시각적 중심이 되어야 한다.
- 색보다 타이포와 간격으로 위계를 만든다.
- 장식 요소, 강한 그림자, 과한 배경 효과는 피한다.
- 버튼, 입력 필드, 카드, 패널은 단순한 박스 형태를 유지한다.
- 콘텐츠 밀도는 유지하되 불필요한 큰 빈 공간은 피한다.

---

## 14. 언어 정책

- 사용자에게 보여주는 선택지, 안내문, 확인문은 한국어를 우선한다.
- 예: `PC / 모바일 / 둘 다`, `다음 와이어프레임이 영향 받습니다.`
- 스킬 내부 설명 문장은 한 언어 톤을 유지해야 한다.
- 영어 설명 문장에서 한국어 섹션명을 쓸 때는 일반 명사처럼 섞지 말고, 리터럴 라벨로 다룬다.
- 예: `the \`## 와이어프레임 요소\` section`

---

## 15. 판단 원칙

- 확정되지 않은 파일명 규칙은 고정 정책처럼 쓰지 않는다.
- 사용자-facing 규칙과 agent-facing 설명 문장을 구분한다.
- 새 규칙을 만들기보다 기존 `docs/` 와 `skills/` 의 공통 정책을 우선 정렬한다.
- 모호할 때는 자동화보다 사용자 확인을 우선한다.
