# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

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

상위 설계 결정은 `docs/ARCHITECTURE-DECISIONS.md`를 참조한다.

## Policy Reference

스킬의 실제 운영 정책, 생성/업데이트/삭제/정합성 규칙, 언어 원칙은 `docs/SKILL-POLICY-SUMMARY.md`를 우선 참조한다.

## Wireframe Output Rules

출력 형식과 검증 규칙은 `docs/WIREFRAME-OUTPUT-SPEC.md`를 참조한다.
JSON 스키마는 `schema/flowframe-meta.schema.json`에 있다.

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
