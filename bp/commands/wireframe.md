---
description: 화면명세(screen.md)를 받아 같은 폴더에 와이어프레임 HTML을 생성한다. viewport 배열에 따라 pc/mobile 파일을 각각 만든다.
argument-hint: <screen.md 경로>
---

# /bp:wireframe

화면명세 한 장을 받아 와이어프레임 HTML 을 그 폴더에 만든다. 영역(`area_*.md`), 시트(`sheet_*.md`), 다이얼로그(`dialog_*.md`) 는 같은 폴더에서 자동으로 읽는다.

## 사용법

```
/bp:wireframe docs/screens/상품/product-detail/screen.md
```

사용자가 다음 인자로 호출함: $ARGUMENTS

## 인자 검증

| 상황 | 처리 |
|---|---|
| 파일이 존재 + `type: page` / `sheet` / `dialog` + `viewport` + `features` 있음 | 통과 |
| 파일이 존재하지 않음 | "파일을 찾을 수 없어요: {경로}" 출력 후 종료 |
| frontmatter 에 `screenId` 없음 | "화면명세 파일이 아닙니다. screen.md, sheet_*.md, dialog_*.md 중 하나를 주세요" 출력 |
| `type: panel` (영역 파일) | "영역 파일은 와이어프레임 대상이 아닙니다. 같은 폴더의 screen.md 를 주세요" |
| viewport 배열에 unknown 값 | "지원 viewport 는 pc, mobile 뿐입니다" 출력 후 종료 |

## 실행

인자 검증이 끝나면 이 커맨드는 **`wireframe-harness` 스킬의 SKILL.md 를 SSOT 로 삼아** 다음 흐름을 수행한다:

1. viewport 예고 게이트 (만들 메인 파일 목록 안내)
2. 시트·다이얼로그 분리 게이트 (`sheet_*.md` / `dialog_*.md` 1개 이상이면 발동, 기본 메인 fragment 포함)
3. 덮어쓰기 분기 (기존 html 있을 때)
4. `bp:wireframer` 에 HTML 생성 위임 (`Agent(bp:wireframer, round=1)`) — 메인 파일 + opt-in 별도 파일
5. Producer-Reviewer 수렴 루프 (오케스트레이터 주도 체이닝, 매 라운드 `Agent(bp:reviewer)` + `Agent(bp:wireframer)` 새 spawn)
6. 최종 보고 (수렴 / 명세 결함 회송 / 루프 한계)

**세부 알고리즘·프롬프트 템플릿·UX 원칙은 `wireframe-harness` 스킬** — 여기선 요약만.

참조:
- 전체 흐름: `wireframe-harness/SKILL.md`
- 확인 게이트: `wireframe-harness/references/confirm-gates.md`
- 수렴 루프·Agent 호출 템플릿: `wireframe-harness/references/convergence-loop.md`
- 자기점검: `wireframe-harness/references/visual-review.md`

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 같은 폴더에 area_*.md 없음 (단순 화면) | screen.md 만 보고 인라인 elements 로 작성 (정상 흐름) |
| area_*.md features[] 가 비어 있음 | 명세 결함으로 판단 → `/bp:plan` 회송 안내 |
| 자동 수정 불가 위반 감지 | `/bp:plan` 회송 메시지 출력 후 종료 |
| 루프 한계(3회) 초과 | "같이 보기" 톤으로 현재 HTML 공유 |

## 산출물

### 메인 파일 (항상 생성)

페이지(`screen.md`) viewport 배열에 따라:
- `[pc]` → `wireframe.html` 1개
- `[mobile]` → `wireframe_mobile.html` 1개
- `[pc, mobile]` → `wireframe.html` + `wireframe_mobile.html` 2개

같은 폴더의 모든 `sheet_*.md` / `dialog_*.md` 는 **기본적으로 메인 와이어 안에 `<bp-fragment>` + `<bp-sheet open>` / `<bp-dialog open>` 정적 카드로 포함**한다.

### 별도 파일 (opt-in, 게이트 2 응답에 따라)

기획자가 게이트 2 에서 명시적으로 이름을 말한 경우만 추가 생성. 메인 와이어 안 fragment 는 그대로 유지 (트리거 컨텍스트 SSOT).

| overlay 파일 | viewport | 생성 파일 |
|---|---|---|
| `sheet_review.md` | `[pc]` | `wireframe_sheet_review.html` |
| `sheet_review.md` | `[mobile]` | `wireframe_sheet_review_mobile.html` |
| `sheet_review.md` | `[pc, mobile]` | `wireframe_sheet_review.html` + `wireframe_sheet_review_mobile.html` |
| `dialog_zoom.md` | `[pc, mobile]` | `wireframe_dialog_zoom.html` + `wireframe_dialog_zoom_mobile.html` |

**suffix 규약**: `wireframe_{type}_{name}.html` 이 pc 기본, `_mobile` 이 모바일 suffix. `{type}` 는 `sheet` / `dialog`. overlay 의 `viewport` 는 page 와 독립이라 page 는 `[pc]` 만 해도 overlay 가 `[pc, mobile]` 이면 overlay 는 두 개 나온다.

### 예고 게이트 메시지 예시

page `[pc, mobile]` + `sheet_review` + `dialog_zoom` 인 경우:

```
좋아요, 그릴게요.
- wireframe.html
- wireframe_mobile.html

이 화면에 시트·다이얼로그 2개 있어요. 기본은 메인 와이어 안에 fragment 로 모두 포함합니다:
- sheet_review
- dialog_zoom

별도 파일로도 뽑을 게 있을까요? (없으면 "없음" / 있으면 이름 알려주세요)
```
