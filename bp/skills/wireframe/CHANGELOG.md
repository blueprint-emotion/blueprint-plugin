# wireframe — Changelog

이 스킬의 변경 이력. SemVer(MAJOR.MINOR.PATCH)를 따른다.

- **MAJOR**: 와이어프레임 작성 규약·태그 인터페이스의 호환성 깨는 변경
- **MINOR**: 새 컴포넌트·새 패턴·새 옵션 추가 (호환성 유지)
- **PATCH**: 문서 명료화·예제 보강·오타 수정

## [4.7.2] - 2026-04-23

### Changed — `bp-input-group` composition 규약 명시화

실제 로그인 화면 와이어프레임에서 와이어프레이머가 password 토글을 두 지점에서 틀림:
1. `<bp-input-group-input>` 안에 `<bp-input>`을 또 중첩 (바깥 래퍼·안쪽 input 이중 스타일로 박스 어긋남)
2. `<bp-input-group-button>`을 `<bp-input-group-addon>` 없이 `<bp-input-group>` 최상위 자식으로 배치 (정렬 슬롯을 못 잡아 input 밖 하단 블록으로 떨어짐)

**원인**: composition 트리 그림이 "시사" 수준에 머물러 LLM에게 **강제 규칙**으로 안 읽힘. 표의 "내부 네이티브 input에 프록시" 힌트도 `<bp-input>` 중첩 습관을 끊기엔 약함. `size="icon"` (bp-button 토큰) 을 `size="icon-xs"` (bp-input-group-button 토큰) 로 드리프트하는 것도 비슷한 구조적 혼동.

**반영 위치**:
- `references/components/bp-input-group.md` — 속성표의 `bp-input-group-input`/`-textarea` 행에 "**자체가 input/textarea 다. 중첩 금지**" 명시, `bp-input-group-addon` 행에 "모든 text·button·아이콘은 반드시 이 안에" 명시, `bp-input-group-button` `size` 행에 "`size="icon"`은 무효 (bp-button 토큰)" 명시. Composition 트리에 "강제 규칙" 블록 추가. 함정 섹션 맨 앞에 "`-input`이 이름에 있으니 wrapper겠지 오해 금지" / "버튼/아이콘을 addon 밖에 두지 말 것" / "`size="icon"`은 bp-button 토큰" 3가지 한 줄 경고 추가. 트리의 `bp-input-group-addon (1개 이상)` 오기를 `0개 이상`으로 정정. **Password + 가시성 토글 예제 신설** — input 자체 + addon 안 button + icon-size 토큰 3규칙을 동시에 강제하는 테스트 케이스
- `references/common-mistakes.md` — "Input group" 섹션 신설(HTML·CSS 위), 3가지 실수 (input 중첩 / addon 건너뛰기 / size="icon") 각각 행으로 정리

**근거**: 하나의 실제 화면에서 3규칙이 동시에 깨졌고, 토큰 집합이 비슷한 다른 bp-* 컴포넌트로 드리프트 재발 가능성이 높다. "트리 그림 + 시사" → "명시적 금지문 + 테스트 케이스 예제" 로 전환.

호환성: 기존 와이어프레임에 영향 없음(추가 가이드만). 기존 파일 중 위 3실수가 있는 경우는 다음 `/bp:wireframe` 실행 시 리뷰어가 감지 후 갱신.

## [4.7.1] - 2026-04-23

### Changed — overlay 분리 판단 주체·기준 명시

`references/overlay-patterns.md` "메인 wireframe vs 별도 파일" 섹션에 판단 주체 (오케스트레이터 자동 스캔 → 기획자 결정 → wireframer 집행) 와 wireframer 의 "자의적 분리 금지" 원칙을 명시. 기준 상세는 wireframe-harness 3.1.0 `confirm-gates.md` 게이트 2 에 SSOT.

wireframe skill 자체의 표현 규약·bp-* 컴포넌트 사용법 변경 없음. overlay-patterns.md 의 서술만 책임 경계·트리거 조건 기준으로 정렬.

## [4.7.0] - 2026-04-23

### Added — 오버레이 `data-element` 판정 기준 (오버레이 전체 vs 내부 위젯)

screen.pc.html (`/Users/jay/WebstormProjects/test/docs/screens/인증/login/`) 검토 중 `<bp-dialog-description data-element="발송 완료 안내">` 같이 **오버레이 전체 상태를 가리키는 JSON 이름을 안쪽 텍스트 노드에 건 패턴** 이 반복 발견. eye 버튼 locate 시 안내 문구 한 줄만 하이라이트되고 다이얼로그 카드 전체가 안 잡힘.

**추가된 규칙**:
- **판정 기준 2 갈래** — JSON `name` 이 "오버레이 전체 상태(안내·오류·에러·확인·결과)" 를 가리키면 바깥 `<bp-dialog open>` / `<bp-alert-dialog open>` wrapper 에, "내부 특정 위젯(버튼·인풋·체크박스 등)" 을 가리키면 그 위젯 노드에. 안내·오류·에러·확인 같은 접미사가 이름에 들어가면 거의 항상 wrapper 쪽
- **컴포넌트 종류 접미사 drift 특별 경고** — JSON `"이메일 형식 오류"` ↔ HTML `data-element="이메일 형식 오류 알랏"` 처럼 wrapper 가 `<bp-alert-dialog>` 라는 사실이 눈에 보여 자동으로 "알랏"/"다이얼로그"/"시트" 접미사를 붙이는 실수가 반복 발생. 접미사는 JSON·HTML 양쪽에 동일하게 유지하거나 둘 다 생략
- **작성 절차 명문화** — `data-element` 값은 손으로 다시 쓰지 말고 JSON `elements[].name` 에서 **복사·붙여넣기**. HTML 을 먼저 쓰고 JSON 을 끼워맞추면 drift 가 누적

**반영 위치**:
- `references/overlay-patterns.md` — "판정 기준" 표 신설, 원인 4가지 재편(오버레이 전체 → 내부 텍스트 / 내부 위젯 → wrapper / textContent 의존 / 이름 불일치+접미사 drift), 종합 예제 추가
- `SKILL.md` — "## 기능 영역" 안에 판정 기준 표 + 접미사 drift 경고 + 작성 절차 명시 (6 줄 → 30 줄, 레퍼런스 진입 대신 반드시 알아야 할 핵심은 본문에)
- `references/common-mistakes.md` — 오버레이 섹션에 "JSON 오버레이 전체 이름을 안쪽 텍스트 노드에 걸기" 행 추가

**근거**: 실제 로그인 화면 와이어프레임의 3건(이메일 형식 오류·인증 실패 에러·네트워크 오류) 에서 모두 같은 drift 발생. 단순 "이름 불일치" 로 묶어두면 LLM 이 패턴을 일반화하지 못해 계속 반복. "wrapper 에 걸어야 할지 / 위젯에 걸어야 할지" 의 판정 기준을 명시적 heuristic(한국어 접미사 키워드) 로 제시해야 재발 방지.

호환성: 기존 와이어프레임에 영향 없음(추가 가이드만). 기존 파일 중 오버레이 전체 이름을 내부 텍스트에 건 경우는 다음 `/bp:wireframe` 실행 시 리뷰어가 감지 후 갱신.

## [4.6.1] - 2026-04-23

### Changed — SKILL.md 슬림화, 횡단 주제 레퍼런스로 분리

SKILL.md 가 840 줄까지 늘어나 가이드라인(~500 줄)을 크게 초과. 중복·분리 가능한 블록을 `references/` 로 빼내 **623 줄 → 핵심 워크플로 중심**으로 정리.

**신규 references**:
- `references/overlay-patterns.md` (127 줄) — 오버레이 정적 표현 원칙 + 스택 상황(얹힌 것만 단독) + 다이얼로그 변형(온전한 오버레이) + data-element 매칭 실패 4가지 원인 + 메인 wireframe vs 별도 파일 분리 규칙. SKILL.md 의 오버레이 섹션은 3줄 + 링크로 축약
- `references/html-closing-tags.md` (25 줄) — 커스텀 엘리먼트 self-closing 파싱 시나리오와 void 요소 전체 목록. SKILL.md 에는 한 줄 경고 + ❌/✅ 미니 예제만 남김
- `references/common-mistakes.md` (50 줄) — 20+ 행짜리 "자주 하는 실수" 표를 5개 카테고리(구조·앵커 / 보드·조각 / 오버레이 / HTML·CSS / JSON) 로 분류. SKILL.md 에는 핵심 3가지 + 링크만

**SKILL.md 내부 중복 제거**:
- "기능 설명 JSON" 섹션 (60+ 줄) → 스키마·요소 흡수·rules/notes 출처 전부 `bp-descriptions.md` SSOT 이므로 15 줄짜리 요약 + 링크로 대체
- "기능 영역 bp-section" 속성 표 → `bp-section.md` 에 있어 제거, 예제 + 핵심 경고만 유지
- 헤더 `## 참조 전략` 에 횡단 주제 레퍼런스 3개 목록 추가 (토큰 절약 경로 확장)

**근거**: 토큰·출력 한계 측면에서 skill 본문 길이가 길수록 오탈·누락 위험이 커진다. "shadcn 1:1 포팅" 원칙상 대부분 컴포넌트는 ref 파일만 읽으면 되고, SKILL.md 는 (a) 입력→출력 워크플로, (b) 규약이 shadcn 와 갈리는 지점(보드·핀 앵커·JSON 매칭), (c) 횡단 주제 레퍼런스 진입점 역할에 집중해야 함.

호환성: 내용은 그대로 유지됨(위치만 이동). 4.6.0 에서 추가한 오버레이 3규칙은 모두 overlay-patterns.md 에 보존. 기존 와이어프레임에 영향 없음.

## [4.6.0] - 2026-04-23

### Added — 오버레이 조각 표현 규칙 & data-element 매칭 가이드

오버레이(`bp-dialog` / `bp-sheet` / `bp-alert-dialog`) 를 fragment 로 그릴 때 반복적으로 발생하던 세 가지 패턴을 명시적 규칙으로 추가.

- **스택 상황** — 베이스 다이얼로그 위에 알랏이 얹히는 UX 를 조각에 그릴 때는 **알랏만 단독으로** 그린다. 베이스 오버레이는 같은 `bp-area` 의 이웃 fragment 로 컨텍스트가 확보되므로 스택을 복제해 그리지 않는다
- **다이얼로그·시트 변형** — 초기·입력 중·전송 중·에러 등 상태 변형을 fragment 로 분리할 때, 각 변형은 **헤더·본문·푸터가 모두 있는 온전한 오버레이 형태** 로 그린다. 버튼/인풋 등 변한 부분만 떼어 그리지 않는다 (같은 오버레이의 상태 매트릭스 의도를 시각적으로 드러냄)
- **다이얼로그·시트·알랏 안의 `data-element` 매칭** — rail 눈 버튼 locate 가 안 먹는 네 가지 흔한 원인 정리: (1) 겉 래퍼에만 붙이고 내부 요소 누락, (2) `bp-dialog-title` textContent 가 자동 매칭된다는 오해, (3) 이름 문자열 불일치(공백·중점·괄호), (4) 다이얼로그 자체를 element 로 쓸 때 컨테이너에 속성 누락. 작성 절차는 "JSON elements 확정 → name 복붙 → HTML 노드에 data-element 부착" 을 권장

`자주 하는 실수` 표에 세 행 추가해 발견성 확보.

**근거**: 최근 로그인 화면(`/Users/jay/WebstormProjects/test/docs/screens/인증/login/screen.pc.html`) 의 `find-password-error` 조각에서 알랏을 단독 렌더하는 것이 올바른 패턴이었는데 스킬에 명시된 규약이 없어 재현 가능성이 낮았음. 기획자 피드백: "스택은 얹힌 것만, 변형은 온전한 통째로, 눈 버튼 매칭은 data-element 를 정확한 이름으로".

호환성: 기존 와이어프레임에 영향 없음(추가 가이드만). 기존 파일 중 스택을 같이 그리거나 변형을 부분만 그린 조각은 다음 `/bp:wireframe` 실행 시 갱신됨.

## [4.5.0] - 2026-04-22

### Added — 커스텀 엘리먼트 닫는 태그 규칙

- `shadcn → bp-* 변환` 표에 self-closing 행 추가 (`<Component />` → `<bp-component></bp-component>`)
- **⚠️ 커스텀 엘리먼트 닫는 태그 — HTML 규칙** 섹션 신설. void 요소(`img`/`input`/`br`/`hr`/`meta`/`link`/`area`/`base`/`col`/`embed`/`source`/`track`/`wbr`)만 self-closing 허용. `bp-*` 포함 모든 커스텀 엘리먼트는 명시적 `</tag>` 필수
- `자주 하는 실수` 표에 "커스텀 엘리먼트 self-closing" 항목 추가

**근거**: HTML 파서는 커스텀 엘리먼트의 `/>` 를 무시하고 여는 태그로만 해석 → 뒤 형제 요소들이 자식으로 삼켜져 레이아웃이 파괴됨. IDE 의 "일부 브라우저에서 빈 태그가 작동하지 않습니다" 경고가 정확히 이 현상.

호환성: 기존 와이어프레임 중 void 요소만 self-closing 한 것은 영향 없음. 커스텀 엘리먼트 self-closing 이 있던 경우는 reviewer(wireframe-harness 3.0.0) 의 `[HTML-CLOSING]` 카테고리로 자동 감지 + 자동 수정 가능 분류라 다음 `/bp:wireframe` 실행 시 반영됨.

## [4.4.0] - 2026-04-22

### Added — 생성 전략: 기능별 단계 진행 (필수)

와이어프레임은 한 번의 Write 로 통째 만들지 않고, **항상 기능 그룹 단위 스테이지** 로 점진 생성한다 (Read → Edit → Read → Edit ...). 화면 크기와 무관하게 적용.

**기본 N 단계 (상품 상세 표준)**: ① 레이아웃+디폴트 → ② 이미지(GALLERY) → ③ 옵션·구매(OPTION) → ④ 리뷰(REVIEW) → ⑤ 문의(QNA)

- 스테이지 1: HTML 템플릿 + JSON sections 골격 (elements 빈 배열) + 모든 feature 의 정상 시각 메인 패널
- 스테이지 2~N: 각 feature 그룹의 (a) JSON elements 6 체크리스트 채우기, (b) `<bp-area data-feature="...">` 안에 fragment 추가, (c) 메인 시각 보강
- 시트/다이얼로그 fragment 는 그 feature 그룹 스테이지에서 같이 추가 (bp-area 가 기능 단위)
- 리뷰어는 모든 스테이지 종료 후 한 번 호출 (오케스트레이터)

`wireframe/SKILL.md` 에 "생성 전략 — 기능별 단계 진행 (필수)" 섹션 신설. `agents/wireframer.md` §5 에 단계별 산출물 규약 명시.

### Changed — description 자세함 책임 뒤집음 (4.3.0 → 반대 방향)

이전(4.3.0): "bp-fragment description 자세히 쓰기" 6 체크리스트 — 조각 헤더에 트리거·사전조건·시각·액션·닫힘·사이드이펙트 다 담음.

이후(4.4.0): description 이 들어가는 두 자리의 책임을 분리:
- **JSON `sections[].elements[].description`** (우측 디스크립션 페널 = rail) → **자세히**. 6 체크리스트 SSOT
- **`<bp-fragment description="...">`** (와이어 위 h3+p 헤더) → **짧게 한 줄, 상태 식별만**

같은 상세를 두 곳에 쓰면 SSOT 가 깨지고, fragment 헤더가 본문 시각을 가려 와이어 가독성이 떨어진다.

### Changed — SKILL.md

- §"bp-fragment description 자세히 쓰기" → §"description 의 두 자리 — 자세히는 rail, 짧게는 fragment" 로 재작성
- 두 자리 비교 표 + 왜 이렇게 나뉘는지 + JSON elements 6 체크리스트 + 좋은/나쁜 예시 (rail 자세함 / fragment 짧음)

### Changed — example 파일

- `references/example-product-detail.html` (PC):
  - 9 개 fragment description 을 모두 한 줄로 줄임 (이전 multi-line 상세 표현 제거)
  - 그 상세 내용을 JSON `PRODUCT__GALLERY` / `PRODUCT__OPTION` / `PRODUCT__REVIEW` / `PRODUCT__QNA` elements 로 이동 (매칭 element 의 description 보강)
- `references/example-product-detail-mobile.html`:
  - fragment description 은 이미 짧으므로 변경 없음
  - JSON elements 를 PC 와 동일한 6 체크리스트 수준으로 보강 (sheet/dialog 동작·취소·사이드이펙트 등)

## [4.3.2] - 2026-04-22

### Added (자주 하는 실수)

- **와이어프레임에 `sticky` CSS 직접 적용 금지**: 와이어는 정적 표현. 스크롤 동작은 element description 에 산문으로 적는다 ("스크롤 시 화면 상단에 sticky 로 고정"). `bp-page-footer` / `bp-page-header` 의 자체 sticky 는 예외
- **시각 보조 영역도 `<bp-section>` 으로 감싼다**: 섹션 내비·필터 바 같은 UI 도 raw `<div>` 가 아니라 `<bp-section data-feature data-feature-key data-label>` 으로. 핀 앵커·하이라이트 연동을 위해. `PRODUCT__SECTION_NAV` "섹션 탭" 예시 등록

### Changed (예제 정리)

- `references/example-product-detail.html` (PC) + `references/example-product-detail-mobile.html`:
  - 상세/리뷰/문의 탭 라벨 바를 `<bp-section data-feature="PRODUCT__SECTION_NAV">` 로 감쌈 (이전: raw `<div>`)
  - 모바일의 sticky CSS 제거. JSON description 에 "스크롤 시 화면 상단에 sticky" 동작 명시
  - JSON description 에 `PRODUCT__SECTION_NAV` 섹션 추가 (탭 라벨 바, 탭 클릭 elements)

## [4.3.1] - 2026-04-22

### Changed

- 오버레이 섹션 (`bp-dialog`, `bp-sheet`, `bp-alert-dialog`) 에 **메인 wireframe vs 별도 파일** 결정 기준 추가:
  - 기본은 메인 와이어 안 `<bp-fragment>` 에 `<bp-dialog open>` 으로 포함
  - 별도 파일 (`wireframe_sheet_{name}.html` 등) 은 풍부한 상태 변형이 있을 때만 opt-in
  - 두 표현이 공존 가능 (트리거 컨텍스트는 메인이 SSOT)
- `wireframe-harness/confirm-gates.md` 게이트 2 와의 SSOT 일치화 (와이어 분리 결정은 게이트 2 가 owner)

## [4.3.0] - 2026-04-22

### Added

- `bp-area viewport="mobile"` 속성: 모바일 와이어프레임에서 영역 폭이 자동으로 370px (PC 기본 560px) 으로 좁아진다. 명시적 `width="..."` 가 있으면 그 값이 우선
- `bp-section` 헤더 주석 업데이트 — `display: contents` → `display: block` 전환에 맞춘 트레이드오프(자식 sticky containing block 변경, grid/flex 자식 직접 item 패턴 깨짐) 명시
- `bp-page-content` 모바일 패딩 16px (PC 24px) — `bp-frame[viewport="mobile"]` 스코프에서 `--page-padding-x` 자동 좁힘
- SKILL.md 신규 섹션:
  - **bp-area 묶음 = 기능(featureId) 단위** — 시트/다이얼로그 종류로 묶지 말 것 (예시 + 금지 패턴)
  - **bp-area viewport 속성** — pc(560)/mobile(370) 폭 표
  - **bp-fragment description 자세히 쓰기** — 6 체크리스트(트리거·사전조건·시각차이·액션·닫힘·사이드이펙트) + 좋은/나쁜 예
- `references/example-product-detail-mobile.html` 신규 — PC 예제의 모바일 1열 레이아웃 + 하단 sticky CTA + bottom 시트 + viewport="mobile" 영역들

### Changed

- `bp-section` `display: contents` → `display: block` (BREAKING 주의: 부모 grid/flex 의 자식들을 bp-section 자식이 직접 item 으로 받던 패턴은 wrapper div 한 개로 묶는 패턴으로 바꿔야 함)
- `bp-sheet` overlay 가 항상 보이도록 방향별 고정 strip(w-24 / h-24)으로 전환 (`flex-1` 만 쓰면 content 가 부모보다 클 때 collapse)
- `bp-sheet` `sm:max-w-sm` → `max-w-sm` — 뷰어 viewport(모바일/PC) 와 무관하게 일관된 폭
- `references/example-product-detail.html` PC 예제 정리:
  - bp-area 묶음을 기능별로 재정렬 (qna-write-sheet 를 PRODUCT__QNA 영역으로 이동, "구매" → "옵션·구매" 통합)
  - 모든 fragment description 을 6 체크리스트 기준으로 확장
  - PRODUCT__QNA `data-label` 을 "Q&A" → "문의" 로 통일 (JSON `label` 과 일치)

## [4.2.1] - 2026-04-22

### Added

- `references/example-product-detail.html` 에 4종 오버레이 fragment 예제 보강:
  - `gallery-context-menu` — `bp-context-menu` (메인 이미지 우클릭 메뉴; 컨텍스트 메뉴는 fixed 좌표라 정적 미리보기는 mock 카드로 항목 구성을 노출)
  - `info-shipping-sheet` — `bp-sheet` (배송/교환 정책 시트, side="right")
  - `option-size-guide-dialog` — `bp-dialog` (사이즈 가이드, 자동 X 버튼 + table 본문)
  - `purchase-already-in-cart-alert` — `bp-alert-dialog` (장바구니 중복 확인, X 없는 cancel/action 강제)
- 각 오버레이 element 가 해당 feature `sections[].elements` 에 흡수됨 (오버레이를 별도 feature 로 분리하지 않는 SSOT 원칙 시연)

### Fixed

- 기존 `purchase-sold-out` fragment 의 `</bp-alert-title>ㅇ` 잔여 한글 오타 제거

### Removed

- `PRODUCT__INFO` 의 `data-feature-key="detail"` 두 번째 섹션 (자기참조 메타 카드 — "같은 feature 를 두 번 쓸 때 summary/detail key 로 슬롯 구분" 규약을 와이어프레임 본문에 자기설명으로 박아둔 노이즈). example 파일은 실제 화면을 흉내내는 본보기여야 하므로 제거. `data-feature-key` 슬롯 분리 규약은 SKILL.md 본문에서만 설명

## [4.2.0] - 2026-04-21

### Changed

- **오버레이 컴포넌트 정적 렌더링 전환**: `bp-dialog`, `bp-sheet`, `bp-alert-dialog` 가 `position: fixed` → `position: relative` 로 변경됨. 이제 부모 `bp-fragment` body 흐름 안에서 `mx-auto` 로 가로 중앙 정렬된 정적 카드로 렌더됨. 한 페이지에 여러 오버레이가 `open` 이어도 viewport 중앙에 겹치지 않음 (기존 이슈: 3개 이상 `<bp-dialog open>` 시 모두 viewport 중앙 stack). overlay backdrop (`bg-black/10 backdrop-blur`) 은 wireframe 컨텍스트에서 시각 효과 없이 marker 역할만.
- 오버레이 섹션에 "1 fragment = 1 오버레이 상태" 원칙 + backdrop 흉내용 wrapper div 금지 명시
- "자주 하는 실수" 표에 두 항목 추가: (a) 오버레이를 `absolute inset-0 bg-black/20` wrapper 로 감싸는 구 패턴, (b) 한 fragment 안에 `<bp-dialog open>` 중첩 사용
- "실전 팁" #1 의 "오버레이 정적 표현" 에 "wrapper div 만들지 말 것" 단서 추가

### Migration

기존 와이어프레임에서 `<bp-dialog open>` / `<bp-sheet open>` / `<bp-alert-dialog open>` 주변에 수동 wrapper (`<div class="relative min-h-... rounded border" style="background: var(--muted);">` + `<div class="absolute inset-0 flex items-center justify-center bg-black/20 p-6">`) 를 둬서 모달 위치를 시뮬레이션했다면 → wrapper 모두 제거하고 fragment body 에 `<bp-dialog open>` 직접 배치. 같은 fragment 에 두 상태 카드(초기·전송중 등) 를 grid-cols 로 나란히 놓았다면 → 두 fragment 로 분리.

## [4.1.3] - 2026-04-21

### Changed

- **Overlay viewport 분기 규약 명시화**: `viewport 분기` 섹션에 `sheet_*.md`, `dialog_*.md` 도 각자의 `viewport` 를 독립적으로 따라 pc/mobile 파일을 분리 생성한다는 한 줄 추가. suffix 규약 (`wireframe_sheet_{name}_mobile.html`) 언급. 기존 동작의 문서화 (PATCH)

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
