# intake CHANGELOG

이 스킬의 변경 이력. SemVer를 따른다 (MAJOR.MINOR.PATCH).

- **MAJOR**: 호환성 깨는 변경 (슬롯 제거·이름 변경, 기존 intake.md 무효화)
- **MINOR**: 호환성 유지 추가 (새 슬롯·새 status 값·새 인터뷰 패턴)
- **PATCH**: 문서 명료화·예제 보강·오타 수정

## [0.3.0] - 2026-04-21

### Added

- `## _pending_decisions` payload 스키마 6필드 추가: `planner_context`, `user_facing_why`, `source_slots`, `conversation_hint`, `priority` (blocking/important/optional), 구조화된 `alternatives` (label/trade_off/recommended)
- 필드 설명 표 추가 — 각 필드 필수 여부, 주체(planner vs 오케스트레이터), 용도 정리
- "자주 하는 실수" 표에 2개 항목 추가 (planner 가 질문 직접 출력 / payload 필수 필드 누락)

### Changed

- **옵션 B 책임 분리 명시** — planner 는 payload 기록만, 기획자-facing 자연어 질문 생성은 오케스트레이터가 전담 (번역 SSOT = 오케스트레이터). `## _pending_decisions` 용도 섹션 재작성
- pre-B1 잔재 제거: 본문 도입부(L15)의 "planner agent가 정형화" → "오케스트레이터가 정형화", 슬롯 설명(L56)의 "planner agent가 빈 섹션을 보고 질문" → "오케스트레이터가 빈 섹션을 보고 질문"
- 프런트매터 description 에 "0.3.0 payload 기록 전용" 을 반영

### 호환성

- 기존 intake.md (0.2.0) 는 그대로 읽힘. 신규 6필드는 없어도 무방하나 planner 가 0.3.0 이상이면 항상 채워서 씀
- BREAKING 아님 — 필드 추가이며 기존 payload 도 그대로 해석

## [0.2.0] - 2026-04-21

### Added

- status 값 2개 추가:
  - `awaiting_decision` — planner 수렴 루프 중 수동 결정 대기. `## _pending_decisions` 섹션에 payload 있음
  - `needs_attention` — 루프 한계(3회) 초과 또는 연쇄 실패. 기획자 수동 확인 필요
- 본문 메타 섹션 `## _pending_decisions` 정의 — planner subagent ↔ 오케스트레이터 간 수동 결정 payload 통로. 슬롯이 아니며, 상세 포맷은 `plan-harness/references/convergence-loop.md` α-1 참조
- "자주 하는 실수" 표에 2개 항목 추가 (메타 섹션을 슬롯처럼 취급 / 기획자 facing 메시지에 시스템 언어 노출)

### Changed

- 인터뷰 주체를 planner agent → 오케스트레이터(Claude Code 본인) 로 변경 (B1 모델). planner subagent 는 명세 작성 + 수렴 루프만 담당
- SKILL.md의 "인터뷰 흐름" 섹션을 "오케스트레이터의 인터뷰 흐름" 으로 재작성. 상세 규약은 plan-harness 스킬로 위임
- `user-invocable: false` 유지

### 호환성

- 기존 intake.md (status: drafting/interviewing/ready/done) 는 그대로 유효
- 신규 status 값은 planner subagent 가 자동 기록. 기획자가 수동 설정할 일 없음
- BREAKING 아님 — 슬롯 구조·frontmatter 필수 필드는 변동 없음

## [0.1.1] - 2026-04-20

### Added

- `user-invocable: false` frontmatter — 슬래시 명령 노출 방지. 이 스킬은 planner agent만 호출

## [0.1.0] - 2026-04-20

### Added

- 초기 릴리스
- intake.md 슬롯 9개 정의:
  1. 무엇을·누가·왜
  2. 유저스토리 (Must/Should/Could)
  3. 보여야 할 정보
  4. 동작·인터랙션
  5. 상태 (로딩·빈·에러)
  6. 예외 케이스 (API 실패·권한 등)
  7. viewport
  8. 시트·다이얼로그
  9. 진입 경로 · 참고·메모
- frontmatter 필드: `status` (drafting/interviewing/ready/done), `source`, `target`
- planner agent의 인터뷰 흐름 정의 (요구사항 파싱 → 빈 슬롯 식별 → 단계별 인터뷰 → 컨펌 → dispatch)
- 재실행 정책 (신규/부분수정/전체재검토 분기)
- intake 슬롯 ↔ 산출물 매핑 테이블
