# Changelog — wireframe-harness skill

## 2.0.0 — 2026-04-21

### BREAKING — Producer-Reviewer 수렴 루프를 오케스트레이터 주도로 이관

plan-harness 3.0.0 과 동일한 근본 원인 (Anthropic 공식 제약 — subagent 는 Task 없음). wireframer subagent 도 `bp:reviewer` 를 Task 로 spawn 할 수 없음. 루프 주체를 **wireframer → 오케스트레이터** 로 이관.

### Changed — 핵심 구조 변경

- **수렴 루프 주체**: wireframer subagent → **오케스트레이터**
- **Task(bp:reviewer) 호출**: wireframer 가 직접 → 오케스트레이터 전담
- **wireframer 재진입 방식**: 새 Task 로 re-spawn → 기존 세션에 SendMessage 로 재진입 (Agent Teams 활성 필요)
- **위반 리포트 전달 경로**: reviewer → wireframer (직접) → reviewer → **오케스트레이터** → SendMessage(wireframer)
- **명세 결함 회송 경로**: wireframer 가 기획자에게 메시지 → wireframer 가 회송 메시지를 오케스트레이터로 반송 → 오케스트레이터가 기획자에게 전달

wireframer 의 역할은 (1) 최초 HTML 생성 + 자기점검 (2) SendMessage 로 들어온 위반 반영 또는 명세 결함 회송 메시지 작성 — 두 가지만.

### Changed — 파일별 수정

- `SKILL.md` — 책임 분배 다이어그램 재작성, "Producer-Reviewer 수렴 루프 = 오케스트레이터 주도" 명시, 공식 제약 섹션 신설, 불변 규칙 1·2 재작성, 호출자 컨텍스트 선언 업데이트
- `references/task-tool-invocation.md` — **전면 재작성**. wireframer→reviewer Task 템플릿 삭제. 오케스트레이터→wireframer Task, 오케스트레이터→reviewer Task, 오케스트레이터→wireframer SendMessage (위반 반영 요청) 로 재구성. 공식 제약 섹션 신설, plan-harness 와의 구조 일치 명시
- `references/convergence-loop.md` — **전면 재작성**. 알고리즘을 오케스트레이터 실행으로 변경 (Task → reviewer → SendMessage → wireframer → ... 반복). plan-harness 와 구조 공유, wireframe 특화 차이만 별도 명시
- `agents/wireframer.md` — §7-0 (ToolSearch + Task 로드 절차) 삭제. §7 "reviewer 호출 및 수렴 루프" 를 "자기점검 + 반송" 으로 교체. §8 "SendMessage 재진입 처리" 신설. 행동 규칙에 "Task tool 사용 금지", "reviewer 직접 호출 금지" 명시
- `agents/reviewer.md` — plan-harness 와 동반 업데이트 (호출자 컨텍스트 정책 갱신)
- `commands/wireframe.md` — §4 (최초 wireframer Task) + §5 (오케스트레이터 주도 수렴 루프) 분리. §5 에 Task+SendMessage 알고리즘 의사코드 + 템플릿 참조 추가. §6 최종 보고 재작성

### Requires (동반 변경)

- `plan-harness` 3.0.0 으로 동반 MAJOR bump
- `blueprint-plugin` 2.0.0 으로 MAJOR bump
- `bp:wireframer`, `bp:reviewer` agent 본문 업데이트

### 마이그레이션 가이드

1. 사용자 프로젝트의 custom wireframer prompt 가 있으면: Task(bp:reviewer) 호출 삭제. "반송" 으로 변경
2. `/bp:wireframe` 자동화 스크립트: 단일 Task(bp:wireframer) 호출로 끝나지 않음을 인지. 오케스트레이터 루프 여러 턴에 걸쳐 진행

## 1.0.1 — 2026-04-21

### Changed

- `references/confirm-gates.md` viewport 예고 섹션의 overlay 파일 생성 규약을 pc 단일 파일 요약에서 **overlay viewport 독립 규약** 으로 보강 — `[pc]`/`[mobile]`/`[pc, mobile]` 각 케이스별 생성 파일 명시 (`wireframe_sheet_{name}.html`, `wireframe_sheet_{name}_mobile.html` 등). commands/wireframe.md:87 및 wireframe/SKILL.md:51 과 SSOT 일치화 (이전에는 요약이 느슨해서 overlay 가 항상 pc 1개로 해석될 여지가 있었음)

## 1.0.0 — 2026-04-21

### Added (신규 스킬)
- `/bp:wireframe` 전용 오케스트레이션 스킬 신설. 이전 `harness` 스킬에서 wireframe 관련 부분을 분리·재설계
- **오케스트레이터 = 확인 + 위임, wireframer = 렌더 + 수렴** 책임 분배
- **기획자 UX 원칙**: 빠른 확인 → 렌더 → 결과. 인터뷰 없음
- **명세 경계 원칙**: 명세(screen/area/feature) 문제 발견 시 /bp:plan 으로 돌려보냄 (wireframe-harness 는 와이어프레임만 손댐)
- 6개 references:
  - `wireframer-ux.md` — 기획자 언어 (결과 중심 톤)
  - `confirm-gates.md` — viewport + 파일 목록 확인, 덮어쓰기 분기
  - `convergence-loop.md` — 수렴 루프 (자동수정 비중 높음)
  - `auto-fix-policy.md` — HTML/bp-* 위반 분류
  - `visual-review.md` — wireframer 의 1차 자기점검 체크리스트
  - `task-tool-invocation.md` — Task 호출 절차

### Context (구 `harness` 스킬로부터의 이관)
- 구 `harness/SKILL.md` 의 Producer-Reviewer 패턴을 wireframe 맥락으로 특화
- 구 `harness/convergence-loop.md` 의 `ask_user` 추상화는 wireframe 에서는 거의 발동하지 않음 (수동 결정 드묾). 발동 시 /bp:plan 으로 돌려보내는 것이 원칙
- 구 `harness/auto-fix-policy.md` 의 wireframe 관련 예시를 이 스킬 안으로 이관 + 확장

### Requires (동반 변경)
- `bp:wireframer` agent: skills: [wireframe-harness, wireframe, screen-spec]
- `bp:reviewer` agent: skills: [plan-harness, wireframe-harness, ...] 듀얼 로드
- `commands/wireframe.md` 경미 업데이트 (harness 포인팅만 변경)
