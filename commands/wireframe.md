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

1. viewport 예고 게이트 (만들 파일 목록 안내)
2. 덮어쓰기 분기 (기존 html 있을 때)
3. `bp:wireframer` 에 HTML 생성 위임 (Task)
4. Producer-Reviewer 수렴 루프 (오케스트레이터 주도)
5. 최종 보고 (수렴 / 명세 결함 회송 / 루프 한계)

**세부 알고리즘·프롬프트 템플릿·UX 원칙은 `wireframe-harness` 스킬** — 여기선 요약만.

참조:
- 전체 흐름: `wireframe-harness/SKILL.md`
- 확인 게이트: `wireframe-harness/references/confirm-gates.md`
- 수렴 루프: `wireframe-harness/references/convergence-loop.md`
- Task/SendMessage 템플릿: `wireframe-harness/references/task-tool-invocation.md`
- 자기점검: `wireframe-harness/references/visual-review.md`

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 같은 폴더에 area_*.md 없음 (단순 화면) | screen.md 만 보고 인라인 elements 로 작성 (정상 흐름) |
| area_*.md features[] 가 비어 있음 | 명세 결함으로 판단 → `/bp:plan` 회송 안내 |
| 자동 수정 불가 위반 감지 | `/bp:plan` 회송 메시지 출력 후 종료 |
| 루프 한계(3회) 초과 | "같이 보기" 톤으로 현재 HTML 공유 |

## 산출물

페이지(`screen.md`) viewport 배열에 따라:
- `[pc]` → `wireframe.html` 1개
- `[mobile]` → `wireframe_mobile.html` 1개
- `[pc, mobile]` → `wireframe.html` + `wireframe_mobile.html` 2개

시트·다이얼로그(`sheet_{name}.md`, `dialog_{name}.md`)도 **자기 frontmatter의 `viewport` 배열을 따라** 같은 규약으로 각각 파일 생성:

| overlay 파일 | viewport | 생성 파일 |
|---|---|---|
| `sheet_review.md` | `[pc]` | `wireframe_sheet_review.html` |
| `sheet_review.md` | `[mobile]` | `wireframe_sheet_review_mobile.html` |
| `sheet_review.md` | `[pc, mobile]` | `wireframe_sheet_review.html` + `wireframe_sheet_review_mobile.html` |
| `dialog_zoom.md` | `[pc, mobile]` | `wireframe_dialog_zoom.html` + `wireframe_dialog_zoom_mobile.html` |

**suffix 규약**: `wireframe_{type}_{name}.html` 이 pc 기본, `_mobile` 이 모바일 suffix. `{type}` 는 `sheet` / `dialog`. overlay 의 `viewport` 는 page 와 독립이라 page 는 `[pc]` 만 해도 overlay 가 `[pc, mobile]` 이면 overlay 는 두 개 나온다.

### 예고 게이트 파일 목록 예시

page `[pc, mobile]` + `sheet_review` `[pc, mobile]` + `dialog_zoom` `[pc]` 인 경우:

```
wireframe.html
wireframe_mobile.html
wireframe_sheet_review.html
wireframe_sheet_review_mobile.html
wireframe_dialog_zoom.html
```
