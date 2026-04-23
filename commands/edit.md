---
description: Blueprint 플랫폼에서 전달된 편집 요청(메타데이터 + 사용자 지시)을 받아 명세·와이어프레임을 수정한다. 명세 변경 필요성을 판단해 /bp:plan 또는 /bp:wireframe 으로 라우팅한다.
argument-hint: <플랫폼 편집 요청 markdown 또는 자연어>
---

# /bp:edit

Blueprint 플랫폼(와이어 뷰어)에서 "우클릭 → 수정" 으로 전달된 편집 요청을 처리한다. 플랫폼이 `claude://code/new?q=...&folder=...` URL 로 현재 세션을 띄우면, 그 프롬프트 본문을 `$ARGUMENTS` 로 받아 적절한 스킬로 라우팅한다.

**역할**: `/bp:edit` 는 **라우터 command** 다. 자체 명세 작성·HTML 생성 워크플로를 새로 만들지 않는다. 플랫폼 편집 요청을 파싱하고, 대상 파일·앵커·변경 성격을 판단한 뒤, 기획자 확인을 거쳐 기존 `/bp:plan` 또는 `/bp:wireframe` 의 체이닝 흐름으로 진입한다. 플랫폼은 편집 메타데이터만 넘기고 "해석·분기 책임" 은 이 커맨드가 흡수한다.

## 사용법

```
/bp:edit <플랫폼이 전달한 편집 요청 본문>
/bp:edit 상품 상세의 찜 버튼 색을 파랑으로 바꿔줘   # 자연어 인자 — 사람이 직접 호출해도 됨
```

사용자가 다음 인자로 호출함: $ARGUMENTS

## 인자 파싱

플랫폼이 보내는 본문은 Claude Desktop `claude://` deep link 의 제약(줄바꿈 stripping · 마크다운 non-render)에 맞춰 **단일 라인 `::` 구분자 포맷**이다:

```
/bp:edit {repo} :: {파일경로} :: {기능명|page} :: {사용자 지시}
```

실제 예:

```
/bp:edit furia0928/test :: docs/screens/인증/login/screen.pc.html :: AUTH__LOGIN :: 전체적으로 와이어프레임 스킬로 점검, 모바일 버전도 같이 해줘
```

이 커맨드는 `$ARGUMENTS` 를 ` :: ` (공백-콜론콜론-공백) 으로 split 해서 다음을 추출한다:

| 조각 | 필드 | 의미 |
|---|---|---|
| 0 | **저장소** | `owner/name` 형식. 현재 작업 저장소 식별 용도 |
| 1 | **파일 경로** | `docs/screens/.../*.html` 형태 저장소 경로. `_mobile` 포함 여부로 **flavor** (pc/mobile) 를 자동 판단 |
| 2 | **기능명** | `data-feature` 값(`{DOMAIN}__{ID}` 형식) 또는 `page`(페이지 전체 앵커). 슬롯 구분(`data-feature-key`) 은 플랫폼이 보내지 않으므로, 같은 feature 가 페이지에 여러 번 있으면 사용자 지시에서 자연어로 식별 |
| 3+ | **사용자 지시** | 나머지 전부 (지시 안에 ` :: ` 가 등장하면 3 번째 이후 조각을 전부 다시 ` :: ` 로 join) |

파싱 실패 판별:
- split 결과 4 조각 미만 → 포맷 오류. "편집 요청 포맷이 맞지 않아요 — `/bp:edit {repo} :: {파일} :: {기능} :: {지시}` 로 다시 보내주세요" 출력 후 종료
- 파일 경로가 `.html` 로 끝나지 않음 → 동일 오류 처리

**버전**: 플랫폼은 항상 latest 를 전제로 편집 요청을 보내므로 파싱 대상이 아니다. 과거 버전을 고치고 싶으면 기획자가 git 으로 해당 태그를 checkout 후 자연어로 직접 `/bp:edit` 를 호출한다.

**자연어 인자로 직접 호출된 경우** (구분자 없음, 예: `/bp:edit 상품 상세의 찜 버튼 색 바꿔줘`): 인자를 통째로 "사용자 지시" 로 삼고, 파일·기능은 인터뷰로 수집.

## 파일 경로 → 명세 매핑

이 커맨드는 수정 대상이 되는 **화면명세 파일 (`.md`)** 과 **와이어프레임 파일 (`.html`)** 을 함께 파악해야 한다.

| html 파일명 | 대응 화면명세 | 비고 |
|---|---|---|
| `wireframe.html` / `wireframe_mobile.html` | 같은 폴더의 `screen.md` | 페이지 |
| `wireframe_sheet_{name}.html` / `wireframe_sheet_{name}_mobile.html` | 같은 폴더의 `sheet_{name}.md` | 시트 |
| `wireframe_dialog_{name}.html` / `wireframe_dialog_{name}_mobile.html` | 같은 폴더의 `dialog_{name}.md` | 다이얼로그 |

같은 폴더의 `area_*.md` 는 연관 영역 명세로 함께 읽어 컨텍스트 확보.

**매핑 실패 시**: "와이어프레임 파일명 규약에 맞지 않아 대응 명세를 찾을 수 없어요: {경로}" 출력 후 종료.

## 실행 흐름

### 1. 컨텍스트 수집

- 대응 화면명세(`.md`) 와 와이어프레임(`.html`) 을 Read
- `area_*.md` (있으면 전부) Read
- 앵커가 지정돼 있으면 `data-feature` / `data-feature-key` 속성으로 HTML 안 해당 블록 Grep → 주변 컨텍스트 파악
- `data-feature` 가 기능명세 ID(`{DOMAIN}__{ID}`) 형식이면 해당 `docs/features/{DOMAIN}.md` 에서 해당 섹션 Read. 구분자는 더블 언더스코어(`__`)로 계층, 단일 언더스코어(`_`)로 단어 — 대문자만 사용한다 (feature-spec 규약)

### 2. 변경 유형 판단

사용자 지시를 읽고 다음 3가지 중 하나로 분류한다 — **직접 판단 불확실하면 기획자에게 확인 질문**.

| Route | 기준 | 예시 |
|---|---|---|
| **A — 명세만** | 비즈니스 규칙·도메인 속성·상태·플로우 변경. 화면 요소 추가/삭제는 수반되지 않음 | "로그인 실패 3회 시 잠금" 규칙 추가, 최소 주문 금액 변경 |
| **B — 와이어만** | 명세 안에 이미 포함된 요소의 표시·배치·톤·카피 수정. 기능명세 범위 밖의 UI 디테일 | 버튼 색 변경, 여백 축소, 카피 문구 다듬기 |
| **C — 명세 + 와이어** | 새 요소/기능/상태 추가, 기존 요소 의미 재정의 | "찜 버튼 옆에 공유 버튼 추가", 필터 옵션 신설 |

판단 가이드:
- 지시에 **"추가"·"삭제"·"바꾸자"(구조적)·"조건"·"규칙"** 같은 단어 있고 기존 명세에 해당 개념이 없으면 → A 또는 C
- 지시가 **"색"·"여백"·"순서"·"카피"·"문구"·"아이콘"** 같은 표현 수정이면 → B
- 지시에 **새 화면·새 기능** 암시가 있으면 → C (plan 으로 시작)

### 3. 기획자 확인

선택한 방향과 근거를 기획자 언어로 설명하고 확인받는다. **기획자 facing 메시지에 "Route", "컨펌", "게이트", "Agent" 같은 내부 용어를 그대로 노출하지 않는다** (plan-harness "시스템 언어 금지" 원칙 준수).

예시 출력:

```
이 편집은 명세만 손보는 방향으로 처리하려고 해요.

손댈 파일:
- docs/screens/.../screen.md
- docs/features/PRODUCT.md

요청하신 내용은 "{사용자 지시 1줄 요약}" 으로 이해했어요.

이대로 진행할까요?
```

방향 표현은 세 가지 중 하나 — "명세만 손보는 방향" (Route A) / "와이어만 손보는 방향" (Route B) / "명세와 와이어를 모두 손보는 방향" (Route C). Route 라벨은 **내부 문서·prompt 에서만** 사용한다.

기획자가 아니라고 답하면 방향을 바꾸거나 지시 자체를 재협상한다.

### 4. 실행 — Route ↔ harness 모드 라우팅

`/bp:edit` 는 **라우터**다. 자체 수렴 루프를 정의하지 않고, 승인된 Route 를 기존 harness 의 해당 모드로 진입시킨다. 알고리즘 SSOT 는 각 harness 의 `references/convergence-loop.md` 에 있다.

| Route | 진입 모드 | 참조 |
|---|---|---|
| **A — 명세만** | plan-harness "편집 모드 호출" | [plan-harness convergence-loop.md § 편집 모드 호출](../skills/plan-harness/references/convergence-loop.md#편집-모드-호출-bpedit-진입점) |
| **B — 와이어만** | wireframe-harness "기존 HTML 수정 모드" | [wireframe-harness convergence-loop.md § 기존 HTML 수정 모드](../skills/wireframe-harness/references/convergence-loop.md#기존-html-수정-모드-bpedit-진입점) |
| **C — 명세 + 와이어** | A 수렴 완료 → 그 결과 명세를 입력으로 B 의 "기존 HTML 수정 모드" 체이닝 | 위 두 섹션 순차 참조 |

공통 규칙:
- 루프 한계(3회), 체이닝 모델, reviewer 자동 수정 가능/불가 분류는 각 harness 의 표준과 동일.
- Route B 의 "기존 HTML 수정 모드" 는 reviewer 가 **명세-HTML 드리프트** 유형 "자동 수정 불가" 를 반환하면 오케스트레이터가 Route C 로 승격해 plan-harness 로 회송한다 (상세 규칙은 wireframe-harness convergence-loop.md "Route B 자동 수정 불가 회송 규칙" 참조).
- Route A/C 에서 intake.md 가 이미 있으면 부분 수정, 없으면 수정 대상 국한 제한 범위로 신규 생성.

### 5. 최종 보고

| 보고 항목 | 형식 |
|---|---|
| 처리 방향 | "명세만 손봤어요" / "와이어만 손봤어요" / "명세와 와이어를 모두 손봤어요" (내부 Route 라벨은 노출하지 않음) |
| 수정된 파일 | 경로 + 파일별 diff 요약 (추가/삭제 라인 수) |
| 명세 변경 핵심 | 기획자 언어 bullet 3~5개 (명세를 손봤을 때만) |
| 와이어 변경 핵심 | 어떤 요소가 어떻게 달라졌는지 bullet (와이어를 손봤을 때만) |
| 후속 작업 | "확인 후 커밋·푸시 해주세요 — 플랫폼이 자동 반영됩니다" |

**커밋·푸시는 기획자 몫** — 커맨드는 수정만 하고 커밋/푸시하지 않는다.

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 파일 경로가 저장소 기준(`docs/...`) 이지만 현재 작업폴더에 없음 | "이 폴더에는 해당 파일이 없어요. 저장소를 clone 한 위치에서 실행해주세요" 출력 후 종료 |
| 앵커가 있는데 HTML 에서 찾을 수 없음 | 기획자에게 알리고 "어떤 요소를 말하는지 다시 알려주세요" 인터뷰로 전환 |
| 앵커 없음(anchorType 만) | 화면 전체를 컨텍스트로 삼아 처리. Route 판단 시 "요소 식별이 모호하다" 경고 표시 |
| 기존 harness(`claude/` worktree) 로 자동 띄워진 경우 | 최종 보고에 **"worktree 가 아닌 메인 브랜치에서 작업해주세요 — 커밋/푸시 시 혼선됩니다"** 경고 추가 |
| 기획자가 Route 판단 뒤 "다 취소" | 수정사항 없음 보고 후 종료. 파일은 절대 건드리지 않는다 |
| 여러 번 연속으로 `/bp:edit` 호출 | 각 호출은 독립. intake.md 상태는 plan-harness 의 기존 분기(신규/부분수정/재검토) 규칙을 그대로 따름 |

## 산출물

실행 Route 에 따라 변화:

- **Route A**: `docs/screens/.../intake.md` (부분 수정 기록), `docs/features/{DOMAIN}.md` 또는 `.../screen.md` / `sheet_*.md` / `dialog_*.md` 업데이트
- **Route B**: `docs/screens/.../wireframe(_mobile)?.html` 혹은 `wireframe_{sheet|dialog}_{name}(_mobile)?.html` 업데이트
- **Route C**: 위 두 세트 모두

와이어프레임 규약(`wireframe` 스킬)·명세 규약(`feature-spec` / `screen-spec` 스킬) 을 어겨선 안 된다. 모든 수정 후 `Agent(bp:reviewer)` 검증을 통과해야 최종 보고로 넘어간다.

## 참고

- `/bp:plan` 의 흐름: `plan-harness/SKILL.md`
- `/bp:wireframe` 의 흐름: `wireframe-harness/SKILL.md`
- intake.md 상태 분기: `intake/SKILL.md` (신규/부분수정/전체재검토 규칙)
- bp-* 컴포넌트 안 자기점검: `wireframe-harness/references/visual-review.md`
