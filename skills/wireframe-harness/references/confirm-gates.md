# 확정 게이트 — wireframe

/bp:wireframe 의 확인 지점은 두 단계. 입력 검증 완료 후 (1) viewport · 메인 파일 목록 예고, (2) 상태 변형이 많은 시트·다이얼로그가 있을 때에 한해 별도 파일 분리 여부를 짧게 물음.

## 게이트 1 — viewport · 메인 파일 예고 (오케스트레이터가 소유)

입력 screen.md 검증 통과 직후:

```
좋아요, 그릴게요.
- {viewport 에 따른 메인 파일 목록}

1~2분 걸려요.
```

viewport 해석 (메인 파일):
- `[pc]` → `wireframe.html`
- `[mobile]` → `wireframe_mobile.html`
- `[pc, mobile]` → `wireframe.html` + `wireframe_mobile.html`

**기본 응답 정책**: 이 메시지는 **진행 예고**이지 "예/아니오 기다림"은 아니다. 게이트 2 에서 분리 판단이 필요한 overlay 가 발견되면 이어서 물음. 아니면 바로 wireframer 위임. 기획자가 즉시 "잠깐 모바일은 빼자" 라고 반대하면 오케스트레이터가 취소하고 인자 해석부터 다시.

## 게이트 2 — 상태 많은 overlay 분리 여부 (오케스트레이터가 소유)

**기본값: 모든 sheet/dialog/alert 는 메인 wireframe 안에 fragment 로 포함**. 그 외의 경우 (별도 파일 분리) 에만 기획자에게 짧게 물어본다.

### 발동 조건 — 오케스트레이터 판단

오케스트레이터가 `sheet_*.md` / `dialog_*.md` 파일들을 스캔해 다음 중 하나라도 해당되면 해당 overlay 만 기획자에게 질문 대상으로 올린다. 해당 없으면 이 게이트 스킵.

- 상태 변형이 **3개 이상** (예: 초기·전송중·완료·에러 — frontmatter `states` 배열 또는 본문 `## 상태` 섹션에서 추정)
- 입력 필드가 **5개 이상** (본문 `## elements` 또는 area features 에서 폼 필드 수)
- 기획자가 명세에 명시적으로 "별도 파일" 을 암시해둔 경우

위 조건 미해당이면 메인에 포함하고 **묻지 않는다**.

### 질문 문구 — 한 줄, 단순

**이름 노출 규칙**: 파일명(`sheet_qna_write`) 이 아니라 **한글 이름**으로 부른다. 각 overlay 의 frontmatter `title` 에서 카테고리 접두사(`시트_`, `다이얼로그_`, `알랏_`) 만 떼어 사용. 예: `title: 시트_Q&A 작성` → "Q&A 작성 시트" / `title: 다이얼로그_이미지 확대` → "이미지 확대 다이얼로그".

해당 overlay 가 1개면:

```
'Q&A 작성 시트' 는 상태가 좀 많은데, 별도 파일로 뺄까요?
(기본은 메인에 같이 둡니다. "그대로" 하시면 메인에 포함.)
```

2개 이상이면 묶어서:

```
이 두 개는 상태가 좀 많은데 별도 파일로 뺄까요? 아니면 그대로 둘까요?
- Q&A 작성 시트
- 이미지 확대 다이얼로그
(기본은 메인에 같이 둡니다.)
```

**기획자 응답 → 파일명 매핑**: 기획자가 "Q&A 작성 시트" 라고 답하면 오케스트레이터가 원래 파일명(`sheet_qna_write`) 으로 되돌려 `extract_overlays` 배열에 담는다. wireframer 는 파일명 기준으로 작업.

**금기**:
- 파일명(`sheet_qna_write`, `dialog_image_zoom`) 을 기획자 facing 메시지에 노출
- "입력 폼이 풍부하거나 상태 변형이 많은 시트면 추천" 같은 판단 기준 노출 (오케스트레이터 내부 판단용)
- "opt-in" 같은 기술 용어
- 3줄 초과

### 기획자 응답 처리

| 응답 | 처리 |
|---|---|
| "그대로" / "메인" / "아니" / 무응답 | 메인에만 포함 (기본값 진행) |
| 한글 이름 1개 이상 ("Q&A 작성 시트") / "뽑아" | 해당 overlay 의 원 파일명으로 변환해 `extract_overlays` 에 담음. 메인 fragment 는 **유지** |
| "다" / "전부" | 질문에 올린 모든 overlay 별도 파일 추가. 메인 fragment 는 **유지** |
| 알아들을 수 없는 이름 | 한 번 다시 물음 ("그 이름은 못 찾았어요. {한글 목록 재출력}") |

### 왜 이 구조인가

- 검토자가 메인 한 파일만 열어도 "어디서 어떤 오버레이가 뜨는지" 한눈에 봐야 한다 → 기본은 메인 포함
- 별도 파일은 비용 (생성·렌더·관리). 상태 매트릭스가 풍부할 때만 가치가 있음
- 오케스트레이터의 자동 판단만으론 틀릴 수 있으니 최종 결정은 기획자가 내림. 다만 기본은 "분리 안 함" 으로 기울여 기획자가 무응답이어도 안전하게 진행
- wireframer 는 게이트 통과 없이 **자의적으로 별도 파일을 만들지 않는다** (Task prompt `extract_overlays` 가 없으면 메인 only)

별도 파일 생성 시 viewport 분기:
- 각 overlay 파일의 `viewport` 배열을 **독립적으로** 따른다 (page 의 viewport 와 독립)
- `[pc]` → `wireframe_sheet_{name}.html` / `wireframe_dialog_{name}.html`
- `[mobile]` → `wireframe_sheet_{name}_mobile.html` / `wireframe_dialog_{name}_mobile.html`
- `[pc, mobile]` → pc 기본 파일 + `_mobile` 파일 둘 다

## 덮어쓰기 분기

같은 폴더에 이미 `wireframe*.html` 존재하면:

```
이 폴더에 이미 와이어프레임이 있네요. 덮어써서 다시 그릴까요?
(기존: wireframe.html, wireframe_mobile.html)
```

여기서는 명시적 긍정 응답을 기다린다 — "예", "덮어써", "그래" 등. "아니오" 면 종료하고 다음 단계 제안.

## 입력 결함 분기 (게이트 이전)

오케스트레이터가 인자 검증 중 다음 발견 시 wireframer 호출하지 않고 종료:

| 상황 | 메시지 |
|---|---|
| 파일 없음 | "파일을 찾을 수 없어요: {경로}" |
| `screenId` 없음 | "화면명세 파일이 아닌 것 같아요. screen.md, sheet_*.md, dialog_*.md 중 하나를 주세요." |
| `type: panel` (영역 파일) | "영역 파일은 와이어프레임 대상이 아니에요. 같은 폴더의 screen.md 를 주세요." |
| viewport 값이 [pc], [mobile], [pc, mobile] 외 | "viewport 는 pc / mobile 만 가능해요." |
| viewport 필드 자체 누락 | "screen.md 에 viewport 가 아직 안 잡혀 있어요. /bp:plan 으로 손보고 오세요." |

## Gate 3 (수동 결정) — /bp:plan 으로 돌려보냄

wireframe 수렴 루프에서 "자동 수정 불가" 위반이 나오면 보통 **명세 결함**이다 (영역 추가 필요, features 재배치 등). 이 경우 wireframer 는 수정하지 않고 기획자에게 안내:

```
screen.md 에 {자연어 설명된 결함} 이 있어서 지금 와이어를 제대로 못 그려요.

먼저 /bp:plan 으로 이 부분 정리하고, 다시 /bp:wireframe 해주세요.
```

wireframer 는 turn 종료. 미완성 HTML 은 파일 시스템에 남겨두지 않는 것이 원칙 (중간 산출은 삭제하거나 `.wip` 접미사).
