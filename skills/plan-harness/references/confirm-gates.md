# 확정 게이트 운영

`/bp:plan` 이 기획자 응답을 반드시 받아야 하는 지점. 각 게이트의 주체와 톤을 정한다.

## 게이트 3종

| # | 게이트 | 언제 | 주체 |
|---|---|---|---|
| 1 | **intake 확정** | 9개 슬롯 의미 있게 채워진 뒤 | 오케스트레이터 |
| 2 | **작업 트리 예고** | 명세 작성 직전, 만들·수정할 파일 명시 | 오케스트레이터 |
| 3 | **수동결정 (수렴 루프 내)** | reviewer 가 "자동 수정 불가" 분류 | 오케스트레이터 주도 (planner 가 payload 기록 후 handoff) |

B1 책임 분배 (옵션 B): **게이트 1·2 는 오케스트레이터**, 게이트 3 도 **오케스트레이터가 기획자 대화를 소유**한다. planner subagent 는 `_pending_decisions` payload 기록 + 짧은 handoff note 까지만 담당하고, 기획자-facing 질문 번역은 오케스트레이터가 [α-pending-to-question.md](α-pending-to-question.md) 규약으로 수행한다. 모든 기획자 facing 메시지는 [planner-ux.md](planner-ux.md) 의 언어 원칙을 따른다.

## 통합 확인 패턴 (게이트 1 + 2 병합)

게이트 1 과 2 는 이어져 있어서 **한 턴에 같이 제시** 하는 것이 기획자 UX 상 낫다. 기술적으로 별개 확인이지만, 기획자 입장에선 "맞게 이해했는지 + 뭘 만들지" 가 한 맥락.

### 표준 메시지 템플릿

```
정리했어요.

• 상품 상세 화면, 구매자용 (PC / 모바일 둘 다)
• 필수: 상품 정보 + 옵션 선택 + 장바구니, 리뷰 요약 표시
• 이미지 클릭 → 확대, 리뷰 더보기 → 시트
• 비로그인 담기 → 로그인 유도
• (원본 요구사항: docs/requirements/product-detail.md)

이 내용으로 아래 파일들 만들 거예요:

기능명세
- PRODUCT.md 보강 (리뷰 요약 항목 추가)
- REVIEW.md 신설

화면 (docs/screens/상품/product-detail/)
- intake.md (이건 이미 있어요)
- screen.md + area_image.md + area_info.md + area_option.md
- sheet_review.md + dialog_zoom.md

이대로 만들어도 될까요? 빠진 거나 바꿀 거 있으면 알려주세요.
```

**구조**:
1. "정리했어요" — 개방 인사
2. intake 요약 (5~6줄 bullets, 슬롯 이름 숨김)
3. 출처 파일 경로 (원본 요구사항 있을 때만)
4. 만들·수정할 파일 목록 (카테고리 2~3개로 묶음)
5. "이대로 만들어도 될까요?" — 열려 있는 확인

**금기**:
- "게이트 1 통과하셨습니다" / "컨펌 요청" 같은 시스템 언어
- 9개 슬롯 이름 그대로 나열
- `status: ready` 노출

## 응답 처리

| 기획자 응답 | 처리 |
|---|---|
| "OK" / "진행" / "좋아" / "만들어" | → planner subagent 호출 (명세 작성 시작) |
| "X 부분 다시" / "리뷰는 빼자" | → intake.md 해당 부분 수정 + 같은 게이트 재표시 |
| "파일 하나 더 필요해 — Y" | → 작업 트리에 추가 + 같은 게이트 재표시 |
| "나중에 할래" / 무응답 | → `status: interviewing` 그대로 두고 종료. 다음 `/bp:plan` 호출 시 [resume.md](resume.md) 로 재개 |
| "전체 다시 보자" | → 해당 슬롯부터 인터뷰 재진입 (status → interviewing) |

## 오해 방지 — 명시적 긍정만 진행

**묵시적 동의 금지**. 기획자가 명시적 긍정 응답을 주지 않으면 다음 단계로 가지 않는다. 긍정 예시: "OK", "좋아요", "진행", "만들어줘", "괜찮아요", "그대로".

애매한 응답(", ", "...", "응?") 은 긍정 아님. 한 번 더 짧게 확인:
> "만들어도 될까요, 아니면 더 볼 거 있어요?"

## 반복 허용 — 수정 요청은 즉시 반영

기획자가 수정 요청하면 같은 게이트를 반복 표시한다. intake.md 를 그 자리에서 Edit 으로 고치고 다시 보여줌. "다음 라운드에 반영" 같은 지연 금지.

3번 이상 수정 반복되면 한 번쯤 "더 조정할 거 없어요?" 로 매듭 유도 (필수 아님).

## 게이트 없이 파일 쓰기 금지

**게이트 2 통과 전에는 기능명세·화면명세 파일을 어떤 경로로도 생성·수정하지 않는다.** intake.md 역기록만 허용.

이 규칙이 깨지면 기획자가 의도하지 않은 파일이 생김. 매우 강한 불변 규칙.

## 게이트 3 (수동결정) — 오케스트레이터 주도, α 프로토콜 (옵션 B)

게이트 3 은 planner subagent 가 수렴 루프 안에서 `_pending_decisions` payload 를 기록한 뒤, **오케스트레이터(Claude Code 본인)** 가 이어받아 기획자와 대화한다. 기술 흐름:

1. reviewer 리포트에 "자동 수정 불가" N건 존재
2. planner 가 [auto-fix-policy.md](auto-fix-policy.md) 로 분류 확인
3. planner 가 [`_pending_decisions` payload](../../intake/SKILL.md) 준비 (6필드: `planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority`, 객체화된 `alternatives`)
4. **α 프로토콜**: planner 가 `intake.md` 에 다음을 기록 후 턴 종료
   - frontmatter `status: awaiting_decision`
   - 본문 `## _pending_decisions` 섹션에 payload (YAML 형식)
   - 최종 메시지에는 **짧은 handoff note 만** (기획자-facing 질문 X — 번역은 오케스트레이터가 수행)
5. 오케스트레이터가 [`α-pending-to-question.md`](α-pending-to-question.md) 규약으로 payload 를 자연어 질문으로 번역 → 기획자 응답 수집
6. 오케스트레이터가 `intake.md` 의 `## _pending_decisions` 해당 항목 `decision:` 필드에 기획자 결정 기록
7. 오케스트레이터가 **다음 라운드의 새 `Agent(bp:planner)` spawn** — `convergence-loop.md` 의 "α 결정 반영" prompt 템플릿으로 "intake.md `## _pending_decisions` round N 의 decision 반영" 지시 (체이닝 모델: 세션 재진입 없이 매번 새 Agent 호출. `/bp:plan` 세션이 이미 종료된 경우도 동일 경로로 이어감)
8. planner 가 intake.md 재읽기 → 결정 반영 → 다음 라운드 Edit 실행

상세 알고리즘 및 intake.md 필드 포맷은 [convergence-loop.md](convergence-loop.md) 참조.

## 오케스트레이터의 게이트 3 번역 원칙

- 반드시 [α-pending-to-question.md](α-pending-to-question.md) 의 필드별 해석 규칙·금지어·한 턴 묶음 크기 (blocking 2건 max) 준수
- [planner-ux.md](planner-ux.md) 의 번역 가이드·금지어 동시 준수
- 기획자가 "나중에" 응답 시: 해당 id `decision: _deferred_` 로 Edit, `status: awaiting_decision` 유지, partial artifact persisted 안내 문구 후 종료. 오케스트레이터가 나중에 `/bp:plan` 재호출 시 이어감

## 오케스트레이터의 사용자 응답 대기 방식

게이트 1·2 에서 기획자 응답을 기다릴 때, 오케스트레이터는 **메시지를 출력하고 turn 을 종료**한다. 그 사이 background 작업·추가 Read 수행 금지. 다음 기획자 메시지가 들어오면 그때 재진입.
