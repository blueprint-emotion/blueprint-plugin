# 자기점검 체크리스트 (wireframer)

wireframer 가 HTML 생성 직후, reviewer 호출 전에 스스로 1차 점검하는 목록. 기본적인 구조 오류를 여기서 걸러내면 reviewer 루프가 1회로 끝날 확률이 높다.

자기점검은 reviewer 호출을 대체하지 않는다 — 반드시 reviewer Task 도 호출한다 (불변 규칙).

## 체크리스트

### 파일 구조

- [ ] viewport 별 파일 분리됨 (`[pc, mobile]` 이면 pc/mobile 파일 2개)
- [ ] sheet_*.md 당 별도 wireframe_sheet_*.html 생성됨
- [ ] dialog_*.md 당 별도 wireframe_dialog_*.html 생성됨
- [ ] 한 파일에 한 viewport — 안에서 `<bp-frame viewport="X">` 의 X 가 일관됨

### HTML 골격

- [ ] Tailwind CDN 스크립트 포함
- [ ] `/blueprint/v1/bp-components.js` 스크립트 포함
- [ ] `/blueprint/v1/base.css` 링크 포함
- [ ] `<script type="application/bp-description+json">` 이 head 에 정확히 1개
- [ ] JSON description 이 valid JSON (파싱 가능)

### bp-* 태그 규약

- [ ] `<bp-board>` → `<bp-frame>` (정상 프레임) 순서
- [ ] 정상 프레임 안에 `<bp-area>` / `<bp-fragment>` 섞지 않음
- [ ] 메인 UI 의 `<bp-section>` 에 `data-feature` + `data-feature-key` 모두 있음
- [ ] `data-feature-key` 가 페이지 내 **unique**
- [ ] `<bp-fragment>` 안 `<bp-section>` 에는 `data-feature-key` 없음 (상태 조각)
- [ ] 각 `<bp-section>` 에 `data-label` 이 자연어로 있음

### JSON description ↔ HTML 매칭

- [ ] JSON `sections[].feature` 값 ↔ HTML `<bp-section data-feature>` 값 집합 일치
- [ ] JSON `sections[].label` ↔ HTML `data-label` 일치
- [ ] JSON `sections[].elements[].name` ↔ HTML `data-element` 매칭

### 명세 참조

- [ ] area_*.md features[] 의 featureId 가 모두 HTML 에 `<bp-section data-feature>` 로 등장
- [ ] HTML 의 메인 `data-feature` 값이 모두 area features[] 또는 screen features[] 에 존재
- [ ] placeholder 텍스트가 feature spec 의 도메인 속성과 일관 (상품명, 판매가 등)

### 레이아웃 & 상태

- [ ] 로딩·빈·에러 상태가 screen.md `## 상태` 에 있으면 `<bp-area>` 로 표현됨
- [ ] 예외 케이스가 screen.md `## 예외 케이스` 에 있으면 `<bp-fragment>` 로 표현됨 (해당 기능 섹션 내)

## 실패 대응

체크 항목이 대규모로 깨졌으면 HTML 을 부분 재작성. 몇 개만 깨졌으면 그대로 reviewer 호출 후 자동 수정 루프로 해결.

**절대 금지**: 체크 실패를 "self-review 로 모두 고쳤으니 reviewer 호출 생략" 하는 것. 불변 규칙 1번 위반. reviewer Task 는 반드시 호출.

## 왜 자기점검?

- reviewer 호출은 context firewalling 이지만 1회당 Task overhead 있음
- 자기점검으로 자잘한 오류(태그 짝, JSON 파싱 깨짐 등) 를 먼저 걸러내면 reviewer 가 받는 HTML 품질이 올라가고 루프가 1~2회로 줄어듦
- 실제로 돌아오는 자동 수정 항목이 적을수록 사용자 체감 속도가 빠름
