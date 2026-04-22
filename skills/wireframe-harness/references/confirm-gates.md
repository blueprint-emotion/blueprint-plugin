# 확정 게이트 — wireframe

/bp:wireframe 의 확인 지점은 두 단계. 입력 검증 완료 후 (1) viewport · 메인 파일 목록 예고, (2) 시트·다이얼로그가 있으면 별도 파일 분리 여부 질의.

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

**기본 응답 정책**: 이 메시지는 **진행 예고**이지 "예/아니오 기다림"은 아니다. 시트·다이얼로그가 없으면 바로 wireframer 위임. 있으면 게이트 2 로 이어진다. 기획자가 즉시 "잠깐 모바일은 빼자" 라고 반대하면 오케스트레이터가 취소하고 인자 해석부터 다시.

## 게이트 2 — 시트·다이얼로그 분리 여부 (오케스트레이터가 소유)

같은 폴더에 `sheet_*.md` / `dialog_*.md` 가 1개 이상 있을 때만 발동. 없으면 스킵.

```
이 화면에 시트·다이얼로그 {N}개 있어요. 기본은 메인 와이어 안에 fragment 로 모두 포함합니다:
- sheet_qna_write
- dialog_zoom
- alert_already-in-cart

별도 파일로도 뽑을 게 있을까요? (입력 폼이 풍부하거나 상태 변형이 많은 시트면 추천)
- 없으면 "없음" / 있으면 이름 알려주세요
```

### 기본값 — 모두 메인 fragment 로 포함

별도 파일 (`wireframe_sheet_*.html` / `wireframe_dialog_*.html`) 은 **opt-in**. 기획자가 명시적으로 이름을 말하지 않으면 생성하지 않는다. 메인 와이어 안에서 `<bp-fragment>` 로 트리거 컨텍스트 + `<bp-sheet open>` / `<bp-dialog open>` / `<bp-alert-dialog open>` 정적 카드로 표현한다.

**왜 이게 기본인가**:
- 검토자가 메인 한 파일만 열어도 "어디서 어떤 오버레이가 뜨는지" 한눈에 본다
- 별도 파일은 추가 비용 (생성·렌더·관리). 정말 풍부한 상태 변형이 있을 때만 정당화됨
- 명세에 `sheet_*.md` 가 분리되어 있는 건 **명세 SSOT** 이유 (자체 screenId · 상태 · AC). 와이어 표현 단위는 다를 수 있다

### 기획자 응답 처리

| 응답 | 처리 |
|---|---|
| "없음" / "그대로" / 무응답 | 메인 파일들만 생성 (기본값 진행) |
| 이름 1개 이상 ("sheet_qna_write 만") | 그 이름들만 별도 파일 추가 생성. 메인 fragment 는 **유지** |
| "전부" / "모두 분리" | 모든 sheet/dialog 별도 파일 생성. 메인 fragment 는 **유지** |
| 알 수 없는 이름 | 한 번 다시 물음 ("그 이름은 못 찾았어요. {목록 재출력}") |

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
