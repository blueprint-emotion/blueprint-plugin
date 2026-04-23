---
description: 자유형식 요구사항 md를 받아 화면 폴더에 intake.md를 만들고, 단계별 인터뷰로 슬롯을 채운 뒤 기능명세·화면명세를 생성한다. 와이어프레임은 만들지 않는다.
argument-hint: <요구사항.md 경로 또는 자연어>
---

# /bp:plan

기획자가 자유형식으로 적어둔 요구사항 md를 받아, 화면 한 장(또는 후보 여러 장)을 식별하고 명세 작성까지 끝낸다. **와이어프레임은 만들지 않는다** — 명세 검토 후 기획자가 명시적으로 `/bp:wireframe` 을 호출해야 그려진다.

## 사용법

```
/bp:plan docs/requirements/product-detail.md     # 요구사항 파일 지정
/bp:plan                                         # 인자 없이 시작 → 인터뷰
/bp:plan 상품 상세 화면 만들어줘                    # 자연어 인자 → 오케스트레이터가 해석
```

사용자가 다음 인자로 호출함: $ARGUMENTS

## 인자 검증

| 상황 | 처리 |
|---|---|
| 파일 경로 + 존재 | 해당 md 를 Read 로 읽고 진입 |
| 자연어 | 해당 내용을 초기 컨텍스트로 삼고 인터뷰 시작 |
| 비어 있음 | "어떤 화면을 만들까요?" 로 인터뷰 시작 |
| 파일이 존재하지 않음 | "파일을 찾을 수 없어요: {경로}" 출력 후 종료 |
| 디렉토리 | "파일 경로를 주세요. 디렉토리는 지원하지 않아요" 출력 후 종료 |

## 실행

인자 검증이 끝나면 이 커맨드는 **`plan-harness` 스킬의 SKILL.md 를 SSOT 로 삼아** 다음 흐름을 수행한다:

1. `intake` 스킬 로드 + 기존 intake.md 상태 분기
2. 요구사항 파싱 → intake.md 초안
3. 대화형 인터뷰 (빈 부분 단계별로)
4. 통합 확인 게이트 (intake + 산출물 목록)
5. `bp:planner` 에 명세 작성 위임 (`Agent(bp:planner, round=1)`)
6. Producer-Reviewer 수렴 루프 (오케스트레이터 주도 체이닝, 매 라운드 `Agent(bp:reviewer)` + `Agent(bp:planner)` 새 spawn)
7. α 프로토콜 (수동 결정 필요 시 — 기획자 질문 번역 + decision Edit + 다음 라운드 planner 재호출)
8. 최종 보고 + `/bp:wireframe` 안내

**세부 알고리즘·프롬프트 템플릿·기획자 UX 원칙은 `plan-harness` 스킬** — 여기선 요약만.

참조:
- 전체 흐름·원칙: `plan-harness/SKILL.md`
- 인터뷰 전략: `plan-harness/references/interview-flow.md`
- 기획자 언어 번역: `plan-harness/references/planner-ux.md`
- 확인 게이트: `plan-harness/references/confirm-gates.md`
- 수렴 루프·α 프로토콜·Agent 호출 템플릿: `plan-harness/references/convergence-loop.md`
- α 질문 번역: `plan-harness/references/α-pending-to-question.md`

## 엣지 케이스

| 상황 | 처리 |
|---|---|
| 요구사항 md 에 여러 화면이 섞임 | 화면 후보 리스트 확인 → 1순위 1개부터 권장 (single screen first) |
| 인터뷰 도중 기획자가 중단 | intake.md 상태 그대로 두고 종료. 기획자가 `/bp:plan` 을 다시 부르면 planner 가 intake.md `status` 를 읽어 이어감 (`plan-harness/SKILL.md` §기획자 경험 원칙 8 "중단되면 그냥 다시") |
| 기획자가 인터뷰 중 맥락을 크게 바꿈 | 기존 초안 건드리지 않고 "새 화면으로 만들까요?" 확인 |
| 수렴 루프 한계 초과 | 남은 위반 자연어 요약 + 기획자에게 같이 보자고 안내 (`plan-harness/SKILL.md` 보고 C) |

## 산출물

- `docs/screens/{그룹}/{화면폴더}/intake.md`
- `docs/features/{DOMAIN}.md` (필요 시 신설·보강)
- `docs/screens/{그룹}/{화면폴더}/screen.md` + `area_*.md` + `sheet_*.md` + `dialog_*.md`

와이어프레임(`*.html`) 은 만들지 않는다 — 다음 단계에서 `/bp:wireframe`.
