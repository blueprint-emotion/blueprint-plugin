# 확정 게이트 — wireframe

/bp:wireframe 의 확인 지점은 하나. 입력 검증 완료 후 viewport · 생성 파일 목록을 한 번 예고한다.

## 단일 게이트 — viewport 예고 (오케스트레이터가 소유)

입력 screen.md 검증 통과 직후:

```
좋아요, 그릴게요.
- {viewport 에 따른 파일 목록}
- {sheet/dialog 파일 목록}

1~2분 걸려요.
```

viewport 해석:
- `[pc]` → `wireframe.html`
- `[mobile]` → `wireframe_mobile.html`
- `[pc, mobile]` → `wireframe.html` + `wireframe_mobile.html`

같은 폴더의 `sheet_*.md`, `dialog_*.md` 각각도 **자기 `viewport` 배열을 독립적으로 따라** 파일을 추가한다 (page 의 viewport 와 독립):
- `[pc]` → `wireframe_sheet_{name}.html` / `wireframe_dialog_{name}.html`
- `[mobile]` → `wireframe_sheet_{name}_mobile.html` / `wireframe_dialog_{name}_mobile.html`
- `[pc, mobile]` → pc 기본 파일 + `_mobile` 파일 둘 다

**기본 응답 정책**: 이 메시지는 **진행 예고**이지 "예/아니오 기다림"은 아니다. 바로 wireframer 위임. 기획자가 즉시 "잠깐 모바일은 빼자" 라고 반대하면 오케스트레이터가 취소하고 인자 해석부터 다시.

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
