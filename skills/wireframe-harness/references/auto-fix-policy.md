# 자동 수정 분류 기준 (wireframe 산출물)

reviewer 가 와이어프레임 HTML 위반을 분류할 때의 기준. wireframe 은 규약성 위반 비중이 높아 대부분 자동 수정 가능.

## 분류 원칙

plan 과 동일:
- **자동 수정 가능** = 결정적 + 단일 파일 + 기획 의사결정 불필요 + 부작용 없음
- **자동 수정 불가** = 위 중 하나라도 깨짐

## 와이어 특화 예시

### 자동 수정 가능

- **`data-feature-key` 누락 보완** (kebab-case 자동 부여 — featureId 기반)
- **`<bp-section>` 표준 속성** (`data-label`) 누락 추가
- **표준 리소스 누락** 추가 (Tailwind CDN, bp-components.js, base.css)
- **JSON description `sections[]` 엔트리 매칭** 교정 (HTML 과 단순 불일치)
- **JSON description `sections[].label` ↔ `data-label` 불일치** 정렬
- **viewport 메타 누락** 추가 (`<bp-frame viewport="pc">`)
- **한 파일에 두 viewport 섞임** — wireframe 스킬 규약대로 파일 분리
- **`<bp-fragment>` 안 `<bp-section>` 의 `data-feature-key` 존재** → 제거 (규약: 메인 UI 에만 부여)
- **`data-feature-key` 페이지 내 중복** → 숫자 suffix 부여
- **메인 UI `<bp-section>` 누락 `data-feature` 추가** — area features[] 참조로 명확할 때

### 자동 수정 불가 → /bp:plan 회송

- **새 area / feature 추가 필요** (와이어에 등장하는 요소가 명세에 없음)
- **area `features[]` 빈 배열** — 무엇을 그릴지 모름
- **viewport 재지정** (pc → pc+mobile 전환 등)
- **시트·다이얼로그 신설** 요구
- **screen.md `features[]` 도메인 누락** (와이어 메인 `data-feature` 와 불일치)
- **feature spec 존재 없는 featureId 참조**

## 경계 케이스

### "데이터 elements 가 area 정의보다 많음"

area_*.md elements 는 "A, B" 만 정의됐는데 HTML 에 A/B/C 가 있음.
- C 가 무엇인지 area 문맥으로 추론 가능 → "자동 수정 불가" (area 수정 결정). /bp:plan 회송
- C 가 placeholder 실수로 추가된 장식 → "자동 수정 가능" (HTML 에서 C 제거)

reviewer 판단이 애매하면 보수적으로 "자동 수정 불가".

### "placeholder 값이 기능명세 도메인 속성과 어긋남"

예: feature spec 에서 PRODUCT__INFO 속성이 "이름, 판매가, 정가" 인데 HTML placeholder 가 "상품명, 원가, 할인가".

- 속성 이름 매칭 수정 → "자동 수정 가능" (표현 정정)
- 속성 자체가 누락·추가된 경우 → "자동 수정 불가" (도메인 변경)

## reviewer 리포트 포맷

plan 과 동일:

```
- [규약] wireframe.html 메인 <bp-section data-feature="PRODUCT__OPTION"> 에 data-feature-key 없음
  - 위치: wireframe.html:42
  - 권장: data-feature-key="product-option" 추가
  - **자동 수정 가능** (이유: 규약 위반, kebab-case 변환 결정적)
```

또는:

```
- [교차] wireframe.html 에 <bp-section data-feature="REVIEW__SUMMARY"> 가 있으나 area_review.md features[] 에 없음
  - 위치: wireframe.html:88
  - 권장: area_review.md features[] 에 REVIEW__SUMMARY 추가 또는 wireframe 에서 제거
  - **자동 수정 불가** (이유: 어느 쪽이 맞는지 기획 의도 필요)
```

## wireframer 가 적용할 때

- reviewer "권장" 구문을 그대로 반영
- Edit 정밀: HTML 구조 깨지 않게
- 같은 패턴 여러 파일에 걸치면 각 파일 Edit 반복 (pc/mobile/sheet/dialog)
- JSON description 수정 시 valid JSON 유지

## Plan 과의 실무 차이

| | plan 산출물 | wireframe 산출물 |
|---|---|---|
| 자동 수정 가능 비중 | 보통 (반 정도) | **높음** (80%+) |
| 자동 수정 불가 대응 | α 프로토콜 (기획자 결정 수집) | **/bp:plan 회송** (wireframer 가 해결 안 함) |
| 교차 파일 위반 | feature↔screen 링크 깨짐 | 명세↔HTML 매칭 깨짐 |
| 전형적 수정 단위 | 한 섹션 몇 줄 | HTML 속성 / 태그 하나 |
