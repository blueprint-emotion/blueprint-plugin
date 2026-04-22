# 기획자 언어 — wireframe

/bp:wireframe 은 대화 최소화. 확인 한 번 + 결과 보고. 톤은 [plan-harness/references/planner-ux.md](../../plan-harness/references/planner-ux.md) 의 금지어·대체어 표를 공유한다.

## 핵심 차이 — plan 과 달리 빠르게

- 인터뷰 없음. 입력 = `screen.md` 한 장
- 확인 게이트 = viewport + 생성 파일 예고 1회
- 결과 보고 = 파일 경로 목록 + 다음 행동 (브라우저에서 열기)

## 표준 메시지 3개

### 1. 시작 확인

```
좋아요, 그릴게요.
- PC 버전 (wireframe.html)
- 모바일 버전 (wireframe_mobile.html)
- sheet_review, dialog_zoom 도 같이

1~2분 걸려요.
```

viewport 배열, 같은 폴더의 sheet/dialog 파일 자동 감지 후 목록으로 제시. 덮어쓰기 상황이면 추가 한 줄:

```
(기존 wireframe.html 이 있어요. 덮어쓸게요.)
```

### 2. 중간 상태 (루프 중)

드물게 노출. 필요시:

```
그림은 다 그렸고, 잠깐 점검하고 있어요.
```

### 3. 완료 보고

```
다 됐어요.

- docs/screens/상품/product-detail/wireframe.html
- docs/screens/상품/product-detail/wireframe_mobile.html
- docs/screens/상품/product-detail/wireframe_sheet_review.html
- docs/screens/상품/product-detail/wireframe_sheet_review_mobile.html
- docs/screens/상품/product-detail/wireframe_dialog_zoom.html

브라우저로 열어서 확인해 주세요.
```

경고 있으면 말미 한 줄 부기:
> "참고: 이미지 placeholder 몇 개는 gray box 로 표시했어요."

## 명세 결함 발견 시 — /bp:plan 으로 돌려보내기

wireframer 는 명세를 고치지 않는다. 검증 중 screen.md·area·feature 에 결함을 발견하면:

```
screen.md 에 이 부분이 아직 안 잡혀 있어요: {뭐}

먼저 /bp:plan 으로 손보고 다시 /bp:wireframe 해주세요.
```

예시 상황:
- area_*.md 의 features[] 가 비어 있음
- screen.md frontmatter 에 viewport 값이 없거나 이상함
- feature spec 이 없는 featureId 를 area 가 참조 중

## 금기

- "LOOP round N entering" 같은 시스템 로그
- reviewer 의 위반 리포트 원문 그대로 붙여넣기
- `<bp-section>`, `data-feature-key` 같은 마크업 용어는 기획자 메시지에 피함 (내부 처리로 숨김). 단, "영역 태그", "화면 구성" 같은 자연어로 언급은 허용
