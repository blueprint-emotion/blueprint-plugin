---
description: 화면명세(screen.md)를 받아 같은 폴더에 와이어프레임 HTML을 생성한다. viewport 배열에 따라 pc/mobile 파일을 각각 만든다.
argument-hint: <screen.md 경로>
---

# /bp:wireframe

화면명세 한 장을 받아 와이어프레임 HTML을 그 폴더에 만든다. 영역(`area_*.md`), 시트(`sheet_*.md`), 다이얼로그(`dialog_*.md`)는 같은 폴더에서 자동으로 읽는다.

## 사용법

```
/bp:wireframe docs/screens/상품/product-detail/screen.md
```

## 동작

사용자가 다음 인자로 호출함: $ARGUMENTS

**중요**: 이 명령의 작업은 반드시 Task tool로 `subagent_type: "bp:wireframer"`를 호출하여 위임한다. **직접 와이어프레임 HTML을 작성하지 말 것** — 모든 작업은 wireframer agent가 수행한다. 이 명령은 인자 검증 후 dispatch하는 얇은 wrapper일 뿐이다.

호출 전 다음을 점검:

1. **파일 존재 확인** — 경로가 실제 파일인가
2. **frontmatter 검증** — `screenId`, `type` (page/sheet/dialog), `viewport`, `features` 가 있는가
3. **type 확인** — `type: panel` (영역 파일)이면 와이어프레임 대상이 아님 → 사용자에게 "영역 파일이 아니라 페이지(screen.md)나 시트/다이얼로그를 주세요" 안내

검증 통과하면 wireframer를 호출하고 다음을 전달:

- 입력 파일 경로 (screen.md)
- 작업 범위: viewport 배열에 따라 파일 N개 생성, 시트·다이얼로그가 있으면 각각 별도 파일
- 종료 후 reviewer 자동 호출

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 파일이 존재하지 않음 | "파일을 찾을 수 없어요: {경로}" 출력 후 종료 |
| frontmatter에 `screenId` 없음 | "화면명세 파일이 아닙니다. screen.md, sheet_*.md, dialog_*.md 중 하나를 주세요" 출력 |
| `type: panel` (영역 파일) | "영역 파일은 와이어프레임 대상이 아닙니다. 같은 폴더의 screen.md를 주세요" |
| 같은 폴더에 area_*.md 없음 (단순 화면) | wireframer가 screen.md만 보고 인라인 elements로 작성 (정상 흐름) |
| 같은 폴더에 wireframe.html 이미 존재 | wireframer가 "기존 와이어프레임을 덮어쓸까요?" 컨펌 |
| viewport 배열에 unknown 값 | "지원 viewport는 pc, mobile뿐입니다" 출력 후 종료 |

## 산출물

(wireframer agent가 생성)

viewport 배열에 따라:
- `[pc]` → `wireframe.html` 1개
- `[mobile]` → `wireframe_mobile.html` 1개
- `[pc, mobile]` → `wireframe.html` + `wireframe_mobile.html` 2개

시트·다이얼로그가 있으면 각각 별도 와이어프레임 파일. 파일명은 wireframe 스킬 규약대로.
