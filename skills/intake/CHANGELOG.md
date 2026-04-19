# intake CHANGELOG

이 스킬의 변경 이력. SemVer를 따른다 (MAJOR.MINOR.PATCH).

- **MAJOR**: 호환성 깨는 변경 (슬롯 제거·이름 변경, 기존 intake.md 무효화)
- **MINOR**: 호환성 유지 추가 (새 슬롯·새 status 값·새 인터뷰 패턴)
- **PATCH**: 문서 명료화·예제 보강·오타 수정

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
