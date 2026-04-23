# α 재진입 — payload → 기획자 질문 변환

`## _pending_decisions` 섹션의 payload 를 **오케스트레이터(Claude Code 본인)** 가 기획자 언어로 번역해 질문으로 꺼내는 규약. 0.3.0 옵션 B 로 확정된 책임 분리에 따른 번역 SSOT.

## 책임 경계 (재확인)

- **planner subagent**: payload 6필드를 기록하고 turn 종료. 기획자-facing 자연어 질문은 **절대 최종 출력에 담지 않는다** (짧은 handoff note만 허용 — 예: "명세 대부분 작성했어요. 결정이 필요한 항목 있어서 오케스트레이터에게 넘깁니다")
- **오케스트레이터**: `## _pending_decisions` 을 Read → 이 문서 규약으로 질문 번역 → 기획자에게 자연스러운 연결 문장으로 질문 → 응답 수집 → `decision:` 필드 Edit → **다음 라운드의 새 `Agent(bp:planner)` spawn** ( `convergence-loop.md` "α 결정 반영" 템플릿 사용. 체이닝 모델이라 세션 재진입 대신 매번 새 Agent 호출. `/bp:plan` 세션이 이미 종료된 경우도 동일)

번역 권한이 오케스트레이터에만 있으므로 **대화 톤이 `planner-ux.md` 규칙에 따라 일관**된다.

## payload 필드별 해석 규칙

| 필드 | 오케스트레이터 사용법 |
|---|---|
| `summary` | 질문 제목 힌트. 기획자에게 직접 노출하지 않고 위치·의미 파악용으로만 |
| `planner_context` | "지금 어떤 상황에서 결정이 필요한가" 를 기획자에게 배경으로 1줄 요약 (예: "옵션 영역 정리하다가 하나만 짚어볼게요") |
| `user_facing_why` | 질문 본문의 베이스. 기획자에게 "왜 필요한가" 를 이 한 줄 톤으로 던짐. 필요 시 문장 다듬기 허용하되 의미 유지 |
| `source_slots` | 이전 인터뷰 슬롯을 되짚어 대화 연결에 사용. 예: "앞서 유저스토리·인터랙션 정리할 때 …" |
| `conversation_hint` | 기획자가 이전에 실제로 말한 문장을 자연스럽게 인용 — "조금 전에 '옵션 다 고르면 장바구니 가능' 이라고 하셨는데, 그것과 관련해서 …" |
| `recommendation` | 보통 선택지 2~3개를 제시하고, `recommended: true` 인 alternative 에 "제 추천은 이쪽" 같은 부드러운 뉘앙스 얹기. 강요하지 않음 |
| `alternatives[].label` | 선택지 이름 그대로 또는 1-2단어 짧게 |
| `alternatives[].trade_off` | 각 선택지 뒤에 " — {trade_off}" 로 부연. 전문 용어는 풀어 쓰기 |
| `priority` | 시스템 언어라 **기획자에게 절대 노출 X**. 오케스트레이터가 한 턴 묶음 크기 판단용으로만 사용 (아래 "한 턴 묶음 크기") |

### 금지어

다음 단어는 기획자에게 절대 노출하지 않는다 (시스템 언어):

- `_pending_decisions`, `payload`, `planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority`, `blocking`, `important`, `optional`, `alternatives`, `recommended`, `trade_off`, `awaiting_decision`, `SSOT`, `featureId`, `카테고리`

`planner-ux.md` 의 금지어/대체어 표를 동시에 준수한다.

## 한 턴 묶음 크기

인터뷰와 동일 원칙 (`interview-flow.md` 2-3개 묶음) 의 α 확장.

| priority | 한 턴 허용 건수 |
|---|---|
| `blocking` | 최대 2건 (이것만 끝나면 루프 재개 가능) |
| `important` | blocking 여유 있을 때 1건 같이 (합계 3건 이하) |
| `optional` | 같은 의사결정 묶음(`summary` 또는 `source_slots` 겹침)이면 blocking 에 묶어 같이, 아니면 다음 α 라운드로 미룸 |

**원칙**:
- 한 턴에 blocking 3건 이상 나오면 상위 우선순위 2건만 묻고 나머지는 "이건 다음에 같이 볼게요" 로 보류
- 같은 alternatives 구조를 공유하는 항목은 하나로 묶어 "이 두 가지 같이 정하면 편할 것 같은데요" 패턴으로 질문
- 2-3개 동시에 물을 때는 번호로 구분 ("하나 — …", "둘 — …")

## 질문 템플릿

### 단일 blocking 1건 (가장 흔함)

```
[planner_context 를 1줄 배경으로, 필요 시 conversation_hint 로 대화 연결]

[user_facing_why 를 자연스럽게 다듬어 본문으로]

- [alternatives[0].label] — [trade_off]
- [alternatives[1].label] — [trade_off]
  (또는 더 있으면 계속)

[recommended: true 가 있으면 부드러운 추천 한 줄]
```

실제 예시:

```
옵션 영역 정리하다가 하나만 짚어볼게요.
(조금 전 "같은 옵션은 합쳐진다" 언급하셨던 그 규칙이에요.)

이 규칙을 이 화면 전용으로 둘지, 상품 공통 규칙으로 둘지 정해야 같은 내용을 두 군데 쓰지 않고 마무리할 수 있어요.

- 영역 전용 — 이 화면 맥락은 선명한데, 다른 화면에서 같은 규칙 쓰면 또 써야 해요
- 상품 공통 규칙 — 중복은 줄지만 정말 상품 전체에 적용되는 규칙인지 확인이 필요해요

제 느낌엔 공통 규칙 쪽이 맞아 보이는데, 어느 쪽으로 할까요?
```

### blocking 2건 묶음

```
명세 거의 다 됐는데 두 가지만 확인할게요.

**하나** — [planner_context 짧게]
[user_facing_why]

- [alternatives ...]

**둘** — [두 번째 항목 같은 구조]

[각각 답 주시거나, 편하게 골라주세요]
```

### "나중에" 응답 처리

기획자가 "나중에 결정할게요" / "더 봐야겠어요" / "보류" 류로 답하면:

```
그럼 잠깐 두고 돌아갈게요.

지금까지 적어둔 명세는 그대로 남겨뒀어요.
다만 이 결정이 끝나야 최종 점검을 마치고 확정할 수 있어요.

나중에 `/bp:plan` 다시 불러주시면 이 지점에서 이어갈 수 있어요.
```

오케스트레이터 동작:
- `## _pending_decisions` 의 해당 id 들에 `decision: _deferred_` 로 Edit (원래 `_pending_` → `_deferred_`)
- intake.md `status: awaiting_decision` 유지
- 짧은 안내 메시지 + 종료
- planner 재호출 X

중요: **방치가 아니라 보류 상태임을 분명히 전달**한다. "지금까지 적어둔 명세는 그대로 남겨뒀어요" 는 빼지 말 것.

## 재진입 흐름 (응답 받았을 때)

1. 기획자 응답 수신
2. payload 각 항목의 `decision:` 필드에 기획자 선택을 자연어로 기록
   - 예: `decision: "공통 규칙 (PRODUCT.md 로 승격)"`
   - 기획자가 말한 표현 거의 그대로 — 해석 여지 남기지 않기
3. `status: awaiting_decision` 유지 (planner 가 재진입하면서 `ready` 로 바꿈)
4. **다음 라운드의 새 `Agent(bp:planner)` spawn** — [`convergence-loop.md`](convergence-loop.md) 의 "α 결정 반영" prompt 템플릿 사용. 체이닝 모델이라 세션 재진입 대신 매번 새 Agent 호출 (세션 종료 후 `/bp:plan` 재호출 시나리오도 동일 경로)
5. planner 결과 반환되면 이어서 다음 α 라운드 처리 또는 최종 보고 (A/B/C)

## 체크리스트 (오케스트레이터 자가점검)

질문 문장을 기획자에게 보내기 전에:

- [ ] 금지어 없음 (`_pending_decisions` 등 시스템 언어 노출 X)
- [ ] `conversation_hint` 가 있으면 최소 1번 활용 (대화 연결)
- [ ] 선택지에 `trade_off` 가 녹아 있음
- [ ] 추천안(`recommended: true`) 이 있으면 부드럽게 제시 (강요 X)
- [ ] "나중에" 옵션이 묵시적으로 허용됨 (기획자가 즉답 안 해도 OK 인 톤)
- [ ] 질문 건수가 turn 묶음 규칙 (blocking 2건 max) 준수
- [ ] `planner-ux.md` 금지어/대체어·톤 규칙 준수
