# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowFrame Wireframe Skill — skills.sh 플랫폼용 AI 에이전트 스킬 패키지. 기획자가 기능명세/화면명세를 작성하고, FlowFrame에 업로드 가능한 HTML 와이어프레임을 생성한다.

설치: `npx skills add flowframehq/wireframe-skill`

## Architecture

3-layer 구조로 기능 재사용과 부분 업데이트를 지원:

```
docs/features/*.md   → 비즈니스 기능 단위 명세 (재사용 가능, 여러 화면에서 참조)
docs/screens/*.md    → 화면 레이아웃 + 기능 참조만 ([@feature](../features/feature.md) 링크)
docs/wireframes/*.html → 생성된 HTML 와이어프레임 (FlowFrame 업로드용)
```

두 개의 독립 스킬로 구성:
- **flowframe-spec** (`skills/flowframe-spec/SKILL.md`) — 기능명세·화면명세 작성 도우미
- **flowframe-wireframe** (`skills/flowframe-wireframe/SKILL.md`) — 명세 → HTML 와이어프레임 생성

## Key Design Decisions

- **Feature = 비즈니스 기능 단위** (UI 요소가 아님). 한 명의 개발자가 독립적으로 구현 가능한 단위로 분리
- **Screen = 레이아웃 + 기능 배치만**. 기능 상세는 feature md에서 관리
- **2-pass 생성**: screen md → 레이아웃 파악, 그 다음 각 feature md의 "와이어프레임 요소" 섹션을 순차 읽기
- **명시적 트리거 + 확인**: 자동 동기화 없음. 사용자가 "업데이트해줘" → 에이전트가 영향 범위 표시 → 사용자 컨펌 → 해당 부분만 업데이트
- **PC/Mobile 분리**: 뷰포트별 별도 HTML 파일 생성

상세: `docs/ARCHITECTURE-DECISIONS.md`

## Wireframe Output Rules

- **단일 HTML 파일**, Tailwind CSS v4 (브라우저 JIT), 커스텀 CSS/인라인 스타일 금지
- **FlowFrame 메타데이터**: `<script id="flowframe-meta" type="application/json">` 블록 필수
- **Feature ID 패턴**: `FEATURE_{ELEMENT_NAME_IN_ENGLISH}` (한글→영문 변환, 화면 독립적 — 여러 화면에서 동일 ID로 참조)
- **data-feature 속성**: 모든 feature 요소에 필수, 메타데이터 features 배열과 1:1 매칭
- **고정 영역** (헤더, 푸터 등): `data-feature` 없음
- **색상**: 그레이스케일 (zinc 팔레트), 다크모드 `dark:` 변형 필수
- **파일 제한**: ≤2MB, UTF-8

검증 규칙: `docs/WIREFRAME-OUTPUT-SPEC.md`
JSON 스키마: `schema/flowframe-meta.schema.json`

## Skills.sh Platform Conventions

- SKILL.md 이름은 소문자+하이픈, 부모 디렉토리명과 일치
- SKILL.md 본문 500줄 이하, 참조 자료는 `references/` 하위에만 (1단계 깊이)
- description: 3인칭, what + when 포함
- 배포: 빌드 스텝 없이 퍼블릭 레포 그대로

상세: `docs/SKILLS-SPEC-REFERENCE.md`

## Reference Files

| 용도 | 경로 |
|------|------|
| 와이어프레임 전체 예제 | `skills/flowframe-wireframe/references/EXAMPLE.md` |
| 복잡 레이아웃 패턴 | `skills/flowframe-wireframe/references/LAYOUT-GUIDE.md` |
| 기능명세 예제 | `skills/flowframe-spec/references/FEATURE-EXAMPLE.md` |
| 화면명세 예제 | `skills/flowframe-spec/references/SCREEN-EXAMPLE.md` |

