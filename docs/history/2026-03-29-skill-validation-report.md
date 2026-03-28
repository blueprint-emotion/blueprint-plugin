# Skill Validation Report

Date: 2026-03-29
Scope: `skills/flowframe-spec`, `skills/flowframe-wireframe`
Rubric: `skill-creator` (`/Users/jay/.codex/skills/.system/skill-creator/SKILL.md`)

## Method

1. Reviewed both `SKILL.md` files against the `skill-creator` guidance.
2. Reviewed bundled `references/` files for progressive disclosure quality.
3. Attempted to run `quick_validate.py` from `skill-creator`.
4. Performed manual validation for checks blocked by local environment.

## What Passed

- Skill folder names and `name` frontmatter values match.
- Both skill names use valid lowercase hyphen-case.
- Both descriptions are concrete and include trigger context.
- Both `SKILL.md` files are under the 500-line guidance.
- Reference files are linked directly from `SKILL.md` at one level depth.
- `flowframe-wireframe/references/LAYOUT-GUIDE.md` includes a TOC for a long reference file.

## Findings

### 1. `flowframe-spec` description overstates scope and conflicts with the body

Severity: High

The description says the skill creates specs with "API definitions", but the body later says API, database schema, and endpoint design are outside the planner's scope. The description is the primary trigger surface, so this mismatch can cause incorrect invocation and broader-than-intended outputs.

Evidence:
- [skills/flowframe-spec/SKILL.md](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-spec/SKILL.md#L3)
- [skills/flowframe-spec/SKILL.md](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-spec/SKILL.md#L159)

Recommendation:
- Narrow the description to match the actual scope of the body, or expand the body if API-level spec authoring is intentionally part of the skill.

### 2. Long reference file without a table of contents

Severity: Medium

`skill-creator` recommends adding a TOC to reference files longer than 100 lines. `flowframe-wireframe/references/EXAMPLE.md` is 218 lines and starts directly with the example, which makes selective loading and scanning harder.

Evidence:
- [skills/flowframe-wireframe/references/EXAMPLE.md](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-wireframe/references/EXAMPLE.md)

Recommendation:
- Add a short TOC near the top so the agent can jump directly to feature spec, screen spec, generated HTML, and key patterns.

### 3. Missing `agents/openai.yaml` in both skills

Severity: Medium

`skill-creator` marks `agents/openai.yaml` as recommended and explicitly says it should be validated against `SKILL.md` on updates. Neither skill currently includes it, so UI-facing metadata and deterministic interface generation are absent.

Evidence:
- [skills/flowframe-spec](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-spec)
- [skills/flowframe-wireframe](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-wireframe)

Recommendation:
- Add `agents/openai.yaml` for both skills and generate it from the current `SKILL.md` content.

### 4. Redundant trigger guidance is duplicated in the body

Severity: Low

The trigger logic already lives in frontmatter `description`, but both skills repeat a separate `## When to use` section with overlapping trigger statements. `skill-creator` explicitly says the "when to use" information belongs in the description because the body is loaded only after triggering. This duplication is not fatal, but it costs context budget.

Evidence:
- [skills/flowframe-spec/SKILL.md](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-spec/SKILL.md#L15)
- [skills/flowframe-wireframe/SKILL.md](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-wireframe/SKILL.md#L15)

Recommendation:
- Keep trigger semantics in `description` and replace body duplication with operational instructions only.

### 5. Extraneous Finder metadata files are committed inside `skills/`

Severity: Low

`.DS_Store` files are present under the skill tree. These files are not part of the skill and conflict with the "only essential files" principle.

Evidence:
- [skills/.DS_Store](/Users/jay/WebstormProjects/wireframe-skill/skills/.DS_Store)
- [skills/flowframe-wireframe/.DS_Store](/Users/jay/WebstormProjects/wireframe-skill/skills/flowframe-wireframe/.DS_Store)

Recommendation:
- Remove them from version control and ignore them.

## Validation Script Status

Attempted commands:

```bash
python3 /Users/jay/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/flowframe-spec
python3 /Users/jay/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/flowframe-wireframe
```

Result:

- Both runs failed before validation because local Python is missing `PyYAML`:
  `ModuleNotFoundError: No module named 'yaml'`

This means the official quick validation did not complete in this environment. The findings above come from manual review plus file-structure checks.

## Overall Verdict

- `flowframe-spec`: Usable, but has one material scope-definition issue in the description and a few quality gaps.
- `flowframe-wireframe`: Structurally solid, with mostly packaging and context-efficiency issues rather than core workflow problems.
