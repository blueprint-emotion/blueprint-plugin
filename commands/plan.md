---
description: 자유형식 요구사항 md를 받아 화면 폴더에 intake.md를 만들고, 단계별 인터뷰로 슬롯을 채운 뒤 기능명세·화면명세를 생성한다. 와이어프레임은 만들지 않는다.
argument-hint: <요구사항.md 경로 또는 자연어>
---

# /bp:plan

기획자가 자유형식으로 적어둔 요구사항 md를 받아, 화면 한 장(또는 후보 여러 장)을 식별하고 명세 작성까지 끝낸다. **와이어프레임은 만들지 않는다** — 명세 검토 후 사용자가 명시적으로 `/bp:wireframe`을 호출해야 그려진다.

## 사용법

```
/bp:plan docs/requirements/product-detail.md     # 요구사항 파일 지정
/bp:plan                                         # 인자 없이 시작 → 인터뷰
/bp:plan 상품 상세 화면 만들어줘                    # 자연어 인자 → planner가 해석
```

## 동작

사용자가 다음 인자로 호출함: $ARGUMENTS

**중요**: 이 명령의 작업은 반드시 Task tool로 `subagent_type: "bp:planner"`를 호출하여 위임한다. **직접 요구사항을 파싱하거나 명세를 작성하지 말 것** — 모든 작업은 planner agent가 수행한다. 이 명령은 인자 검증 후 dispatch하는 얇은 wrapper일 뿐이다.

호출 전 다음을 점검:

1. **인자가 파일 경로인가** — 존재하는 md 파일이면 planner에 경로 그대로 전달
2. **인자가 자연어인가** — planner에게 "사용자가 다음 자연어 요청을 했어: ..." 형태로 전달, planner가 인터뷰로 시작
3. **인자가 비어 있는가** — planner를 인터뷰 모드로 시작 ("어떤 화면을 만들까요?")
4. **경로가 존재하지 않는가** — 사용자에게 알리고 종료 (planner 호출하지 않음)

planner를 호출할 때 다음을 명확히 전달:

- 입력 종류 (파일 / 자연어 / 빈 인자)
- 작업 범위: intake.md → 인터뷰 → 컨펌 → feature spec + screen spec까지. **와이어프레임은 만들지 말 것**
- 종료 후 reviewer 자동 호출
- 종료 시 사용자에게 "/bp:wireframe {screen.md 경로}" 다음 단계 안내

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 인자 파일이 존재하지 않음 | "파일을 찾을 수 없어요: {경로}" 출력 후 종료 |
| 인자가 디렉토리 | "파일 경로를 주세요. 디렉토리는 지원하지 않아요" 출력 후 종료 |
| 화면 폴더에 이미 intake.md 존재 | planner가 "신규/부분수정/전체재검토" 분기 인터뷰 |
| 요구사항 md에 여러 화면이 섞임 | planner가 화면 후보 리스트 컨펌 → 1순위 1개부터 권장 |
| 사용자가 인터뷰 도중 중단 | intake.md를 status: `interviewing` 그대로 두고 종료. 다음 호출 시 이어감 |

## 산출물

(planner agent가 생성)

- `docs/screens/{그룹}/{화면폴더}/intake.md`
- `docs/features/{DOMAIN}.md` (필요 시 신설·보강)
- `docs/screens/{그룹}/{화면폴더}/screen.md` + `area_*.md` + `sheet_*.md` + `dialog_*.md`

와이어프레임(`*.html`)은 만들지 않는다.
