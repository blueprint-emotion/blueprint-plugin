# 와이어프레임 — 자주 하는 실수

SKILL.md 의 빠른 체크리스트. 리뷰 전·생성 후 훑어보기용. 자세한 배경은 SKILL.md 본문 해당 섹션 또는 관련 references 참조.

## 구조·앵커

| 실수 | 왜 문제인가 |
|------|------------|
| React/JSX 사용 | 순수 HTML + Custom Elements 만 동작. iframe sandbox 환경 |
| `<script>` 로직 추가 | 와이어프레임은 정적 표현. 인터랙션은 상태 조각으로 대체 |
| `asChild`, `render` 등 React 전용 기능 사용 | bp-* 는 Web Components 이므로 미지원 |
| `data-feature` 누락 | 플랫폼이 기능 영역을 인식할 수 없다. 하이라이트·코멘트 연동 불가 |
| 메인 UI `<bp-section>` 에 `data-feature-key` 누락 | feature 핀 앵커가 슬롯을 식별할 수 없어 코멘트 위치가 깨진다. 단일 section 이어도 strict 필수 |
| `<bp-fragment>` 내부 `<bp-section>` 에 `data-feature-key` 추가 | fragment 는 이미 `id` 로 앵커가 정해져 있다. key 를 붙이면 앵커 모델이 이중화되고 규약 위반 |
| 같은 페이지에서 `data-feature-key` 를 재사용 | 동일 `data-feature` 든 다른 `data-feature` 든 위치 식별이 충돌. 페이지 전역 unique key 를 쓴다 |
| 메인 UI 의 시각 영역(섹션 내비·필터 바 등) 을 `<bp-section>` 없이 raw `<div>` 로 배치 | 핀 앵커가 잡히지 않아 코멘트·하이라이트 연동 불가. 사용자가 인식할 수 있는 단위면 별도 feature 로 잡아 `<bp-section data-feature data-feature-key data-label>` 으로 감싼다 |

## 보드·조각 배치

| 실수 | 왜 문제인가 |
|------|------------|
| 정상 프레임에 `<bp-area>` 나 `<bp-fragment>` 섞기 | 보드 구조 위반. 정상은 `<bp-frame>` 안 `<bp-page>`, 상태 조각은 `<bp-area>` 안 `<bp-fragment>` 로 명확히 분리 |
| 한 파일에 `<bp-frame viewport="pc">` 와 `<bp-frame viewport="mobile">` 둘 다 배치 | 한 파일 = 한 viewport. viewport 가 둘 다면 파일 두 개를 만든다 |
| 한 영역의 상태 변형을 각각 별도 `<bp-section>`·`feature`·`section` 으로 분리 | 같은 feature 가 여러 번 등장해 rail 이 중복되고 `data-feature` 매칭이 깨진다. **같은 영역의 변형은 하나의 section.elements 로 흡수**하고, 시각 조각만 `<bp-area>` 의 `<bp-fragment>` 로 분리 |
| `bp-area` 를 "시트 모음" / "알랏 모음" 식 컴포넌트 타입으로 묶음 | `bp-area` 는 feature(`data-feature`) 단위로 묶는 축이다. 다른 feature 의 시트·다이얼로그를 한 area 에 섞으면 rail·핀·검토자 시선이 다 어긋난다 |

## 오버레이

| 실수 | 왜 문제인가 |
|------|------------|
| `<bp-dialog open>` / `<bp-sheet open>` / `<bp-alert-dialog open>` 을 `<div class="absolute inset-0 bg-black/20">` 같은 wrapper 로 감쌈 | 오버레이는 부모 흐름 안 정적 카드로 렌더 (viewport-fixed 아님). backdrop 흉내용 wrapper 는 이중 박스만 만들고 `bp-fragment` body 의 기본 보더·패딩과 시각 충돌 |
| 한 `<bp-fragment>` 안에 `<bp-dialog open>` 을 여러 개 중첩 | 1 fragment = 1 오버레이 상태 원칙. 상태별(초기·전송중·에러) 은 별도 fragment 로 분리 |
| 베이스 다이얼로그 위에 알랏이 얹히는 상황을 조각에 **둘 다** 그림 | 알랏만 단독으로 그린다 (베이스는 같은 `bp-area` 이웃 fragment 로 컨텍스트 확보). 자세한 규칙은 [`overlay-patterns.md`](./overlay-patterns.md#스택-상황--베이스-오버레이-위에-알랏이-뜨는-경우-️) 참조 |
| 다이얼로그·시트의 상태 변형 조각에서 버튼이나 에러 메시지만 떼어 그림 | 변형은 **온전한 오버레이 형태** 로 그린다 (헤더·본문·푸터 모두). 변한 지점(disabled, spinner, error text) 만 안에서 바꾼다. [`overlay-patterns.md`](./overlay-patterns.md#다이얼로그시트-변형--항상-온전한-오버레이로-️) 참조 |
| 오버레이 내부 요소에 `data-element` 누락 — rail 눈 버튼 locate 가 안 먹음 | `data-element` 는 JSON `elements[].name` 과 **정확히 같은 문자열** 로 해당 HTML 노드에 직접 붙여야 한다. `bp-dialog-title` textContent 나 fragment `title` 로는 매칭되지 않는다 |
| 오버레이 전체 상태를 가리키는 JSON 이름(예: "발송 완료 안내", "네트워크 오류") 을 **안쪽 텍스트 노드**(`<bp-dialog-description>`·`<bp-alert-dialog-title>`) 에 걸기 | eye 버튼이 텍스트 한 줄만 하이라이트하고 다이얼로그 카드 전체가 안 잡힌다. JSON 이름에 "… 안내"/"… 오류"/"… 에러"/"… 확인" 이 들어가면 거의 항상 **바깥 `<bp-dialog open>`·`<bp-alert-dialog open>` wrapper 쪽** 에 붙여야 맞다. 판정 기준과 종합 예제는 [`overlay-patterns.md`](./overlay-patterns.md) 참조 |
| `data-element` 에 컴포넌트 종류 접미사(" 알랏"/" 다이얼로그"/" 시트") 를 **HTML 에만** 추가 | 반복적으로 가장 많이 나오는 drift. JSON `"이메일 형식 오류"` ↔ HTML `"이메일 형식 오류 알랏"` 같은 패턴. wrapper 가 `<bp-alert-dialog>` 라는 사실이 눈에 보여 자동으로 접미사를 붙이게 되는데, JSON 과 바이트 단위로 동일해야 매칭된다. 접미사는 JSON·HTML 양쪽에 **동일하게** 유지하거나 둘 다 생략 |

## Input group

| 실수 | 왜 문제인가 |
|------|------------|
| `<bp-input-group-input>` 안에 `<bp-input>`·`<input>` 중첩 | 이름에 `-input`이 들어있지만 **자체가 input**. 내부 네이티브 input에 속성을 프록시하는 구조라 중첩하면 바깥 래퍼와 안쪽 input이 둘 다 스타일을 가져 박스가 어긋난다. `<bp-input-group-input type="password" placeholder="...">` 처럼 속성을 직접 건다. textarea도 동일 (`bp-input-group-textarea` 자체가 textarea) |
| `<bp-input-group-button>`·`<bp-icon>`·텍스트를 `<bp-input-group-addon>` 없이 `<bp-input-group>`의 최상위 자식으로 배치 | addon이 `align`으로 input 옆 정렬 슬롯을 만드는 축이다. 건너뛰면 input 옆에 붙지 않고 아래 블록으로 떨어진다. 모든 부착 요소는 **반드시 addon 안**. [`bp-input-group.md`](./components/bp-input-group.md) 참조 |
| `<bp-input-group-button size="icon">` | `icon`은 `bp-button`의 size 토큰이고, `bp-input-group-button`은 `icon-xs`/`icon-sm`을 쓴다. 토큰 집합이 달라 `size="icon"`은 무효. 아이콘 전용 버튼은 `size="icon-xs"` |

## HTML·CSS

| 실수 | 왜 문제인가 |
|------|------------|
| `<bp-input ... />` 같은 커스텀 엘리먼트 self-closing | HTML 은 void 요소(img/input/br 등) 만 self-closing 허용. 커스텀 엘리먼트는 `/>` 를 무시하고 **뒤 형제를 자식으로 삼켜** 레이아웃이 파괴된다. 반드시 `<bp-input></bp-input>` 명시 닫기. [`html-closing-tags.md`](./html-closing-tags.md) 참조 |
| `bp-page` / 셸 CSS 임의 오버라이드 (`--page-max-width`, `--page-padding-x`, `body:has(bp-page)` padding, bp-page border/radius/min-height 등) | 모든 와이어프레임은 동일한 셸·여백을 가져야 한다. 자체 판단으로 오버라이드하면 같은 스킬이 다른 결과를 낸다. 레이아웃은 `<bp-page-content>` 안쪽에서만 조정 |
| 와이어프레임에 `sticky top-0` / `sticky bottom-0` 같은 스크롤 동작 CSS 직접 적용 | 와이어는 정적 표현물. 스크롤 컨테이너가 보장 안 돼 시각적으로도 어색하고 의도 추정도 어렵다. **동적 동작은 element 의 description 에 산문으로** ("스크롤 시 상단 sticky 고정"). `bp-page-footer`·`bp-page-header` 의 자체 sticky 는 예외 |

## JSON description (rail)

| 실수 | 왜 문제인가 |
|------|------------|
| JSON 문자열 본문에 raw HTML 태그(`<iframe>`, `</body>` 등) 그대로 작성 | rail 이 textContent 로 렌더하므로 태그 그대로 보이긴 하지만 의도 전달이 지저분. 설명은 산문 문장, 기호가 필요하면 백틱 |
| `notes` 에 기능명세 rule 복붙이나 작업 메모(TODO) 작성 | SSOT 위반 — rule 은 기능명세에만, notes 는 화면명세 `## 비고` 항목만. 작업 메모는 기획서로 올려 합의 후 |
