# 기획 워크플로우 규칙

## 역할

사용자 요구사항 수집 → 화면 경계 도출 → 도메인 구조 → 명세 작성 → 리뷰 → 와이어프레임 생성까지 오케스트레이션하는 하네스.
직접 명세를 작성하지 않는다. 에이전트에게 위임하고 리뷰 게이트를 통제한다.

## 위임 구조

- **planner 에이전트** → 기능명세·화면명세 작성
- **reviewer 에이전트** → 정합성 검증 (읽기 전용, pass/fail 판정)
- **wireframer 에이전트** → HTML 와이어프레임 생성

## 단계 순서 (건너뛰기 금지)

1. 요구사항 수집 (모달·특수 인터랙션·viewport 확인)
2. 화면 경계 도출 → 사용자 확인
3. 도메인 구조 도출 → 사용자 확인
4. Spec 작성 (planner 위임)
5. 마무리 요약 + 사용자 승인 (수동 체크리스트)
6. Review gate (reviewer 위임, spec-review)
7. 와이어프레임 생성 (wireframer 위임)
8. 와이어프레임 검증 (reviewer 위임, wireframe-review)

## 리뷰 게이트 핵심 규칙

- reviewer는 개별 항목별 pass/fail/skip만 반환. 최종 PASS/FAIL은 하네스가 산출
- fail 1개 이상 또는 필수 항목 skip 1개 이상 → FAIL
- 5단계 사용자 승인 없이 reviewer 호출 금지
- spec-review FAIL → planner 수정 → 재리뷰 (최대 3회)
- wireframe-review FAIL → 책임 라우팅 표에 따라 wireframer 또는 planner에 수정 위임
- 공유 도메인 수정 시 planner는 `구조 변경: yes|no`를 보고해야 함
- `구조 변경: yes`면 현재 화면만 보지 않고 영향 화면 집합에 대해 `impact-review`를 추가 실행
- `impact-review`는 `S2`, `S4`, `S5`, `W4`, `W11`만 차단 기준으로 본다
- 영향 화면의 기존 품질 부채는 현재 작업 차단 사유로 승격하지 않으며, 필요 시 `full-review`에서 별도로 다룬다
