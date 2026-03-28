---
name: flowframe-spec
description: Helps planners write and manage feature specs (features/*.md) and screen specs (screens/*.md) for FlowFrame projects. Creates structured specifications with wireframe elements, states, interactions, business logic, and API definitions. Triggers on "기획서", "기능명세", "화면 명세", "기능 추가", "화면 추가", "기획 도와줘", "spec", "feature spec", "screen spec", "기능 정의", "새 화면", or any request to create, edit, or plan features and screens. Also use when the user describes a feature they want to build, asks about spec templates, or wants to add/remove features from screens.
license: MIT
metadata:
  author: flowframehq
  version: "1.0.0"
---

# FlowFrame Spec Writer

Helps planners create and manage structured specifications for FlowFrame projects.
Outputs are used by the `flowframe-wireframe` skill to generate HTML wireframes.

## When to use

- User wants to create a new feature spec or screen spec
- User wants to modify existing specs
- User mentions "기획서", "기능명세", "화면 명세", "기능 추가", "화면 추가"
- User asks to plan or design a screen or feature

## Project Structure

```
project/
├── features/              ← Feature specs (this skill creates/edits)
│   ├── auth.md
│   ├── comments.md
│   └── file-upload.md
└── screens/               ← Screen specs (this skill creates/edits)
    ├── LOGIN.md
    ├── DASHBOARD.md
    └── EDITOR.md
```

If these directories don't exist, create them.

---

## Feature Spec (features/*.md)

A feature is a **business function unit** — not a single UI element.

### Splitting criteria

| Criteria | Description | Example |
|----------|-------------|---------|
| **Independently describable** | Can be explained without other features | "댓글" is self-contained |
| **Reusable** | Used across multiple screens | "파일 업로드" appears in editor, settings, messages |
| **One task** | Assignable to one team/person as a dev task | "버전관리" is one sprint task |

### Good vs bad splitting

```
✅ Business function units
├── auth.md              ← Login + signup + social login + password reset
├── comments.md          ← Create + edit + delete + mention + reply
├── version-control.md   ← History + rollback + version compare
└── notifications.md     ← Realtime alerts + settings + read status

✗ Too granular (UI element level)
├── email-input.md
├── password-input.md
├── submit-button.md
```

### Template

```markdown
---
featureId: FEATURE_ID
label: 기능 이름
type: section
usedIn:
  - screens/SCREEN_A.md
  - screens/SCREEN_B.md
---

# 기능 이름

## 와이어프레임 요소

화면에 그릴 UI 요소 목록.

| 요소 | type | 설명 |
|------|------|------|
| 요소명 | input/button/link/image/text/select/checkbox/radio/table/list | 요소 설명 |

## 상태

| 상태 | 설명 |
|------|------|
| 기본 | 기본 상태 설명 |
| 빈 상태 | 데이터 없을 때 |
| 로딩 | 로딩 중 표시 |
| 에러 | 에러 발생 시 |

## 인터랙션

- 요소 클릭 → 동작 설명
- 요소 호버 → 동작 설명

## 비즈니스 로직

- 권한, 제한, 규칙 등

## API (개발자용)

| 메서드 | 엔드포인트 | 설명 |
|--------|-----------|------|
| GET | /api/... | 조회 |
| POST | /api/... | 생성 |
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `featureId` | Yes | Unique ID, uppercase + underscore (e.g., `COMMENTS`, `FILE_UPLOAD`) |
| `label` | Yes | Feature name in Korean |
| `type` | Yes | `section`, `modal`, `drawer`, `dialog`, etc. |
| `usedIn` | Yes | List of screen md paths that use this feature |

### Section rules

| Section | Purpose | Who reads |
|---------|---------|-----------|
| **와이어프레임 요소** | UI elements to render in wireframe | Wireframe skill (agent) |
| **상태** | State variations | Designer |
| **인터랙션** | User interactions and transitions | Designer + Developer |
| **비즈니스 로직** | Business rules, permissions, limits | Developer |
| **API** | Endpoint specs | Developer |

Sections can be added/removed per project needs (e.g., QA checklist, accessibility notes).

### Element types

Use these for the `type` column in 와이어프레임 요소:

`input`, `button`, `link`, `image`, `text`, `select`, `checkbox`, `radio`, `table`, `list`

---

## Screen Spec (screens/*.md)

A screen defines **layout and feature placement** only. No feature details.

### Template

```markdown
---
screenId: SCREEN_ID
title: 화면 제목
purpose: 이 화면의 목적을 한 문장으로
viewport: pc
---

# 화면 제목

## 레이아웃

1. 영역 이름 — [@featureName](../features/feature.md)
2. 영역 이름
   - [@featureA](../features/feature-a.md)
   - [@featureB](../features/feature-b.md)
3. 영역 이름 — 고정 요소 설명
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `screenId` | Yes | Unique ID, uppercase (e.g., `LOGIN`, `DASHBOARD`, `CANVAS_001`) |
| `title` | Yes | Screen title in Korean |
| `purpose` | Yes | One sentence describing the screen's purpose |
| `viewport` | No | `pc` or `mobile` |

### Feature reference syntax

Use markdown links with `@` prefix to reference features:

```markdown
[@auth](../features/auth.md)
```

This tells the wireframe skill which feature to render at that layout position.

---

## Workflows

### Creating a new feature

1. Ask the user what the feature does (purpose, key functions)
2. Create `features/{feature-name}.md` using the template
3. Fill in 와이어프레임 요소 with the user
4. Fill in 상태, 인터랙션, 비즈니스 로직 as the user provides details
5. Set `usedIn` to empty list initially — update when screens reference it

### Creating a new screen

1. Ask the user what the screen shows (purpose, which features)
2. Create `screens/{SCREEN_NAME}.md` using the template
3. Define layout with feature references
4. Update each referenced feature's `usedIn` to include this screen

### Modifying a feature

1. Read the existing feature md
2. Apply the user's changes
3. If 와이어프레임 요소 changed, remind the user:
   "와이어프레임 요소가 변경되었습니다. 와이어프레임도 업데이트하시겠습니까?"

### Adding a feature to a screen

1. Read the screen md
2. Add the feature reference in the appropriate layout position
3. Update the feature's `usedIn` to include this screen

---

## Guidelines

- Write specs in **Korean** (matching the planner's language)
- Keep screen specs short — layout + feature refs only
- Feature specs should be self-contained — readable without the screen context
- Always maintain `usedIn` consistency: if a screen references a feature, the feature's `usedIn` must include that screen
- When the user's description is vague, ask clarifying questions before writing
- Not all sections need to be filled from the start — 와이어프레임 요소 is the minimum. Other sections can be added incrementally

### File naming

- Feature files: **kebab-case** in English (e.g., `auth.md`, `file-upload.md`, `version-control.md`)
- Screen files: **UPPERCASE** screen ID (e.g., `LOGIN.md`, `DASHBOARD.md`, `EDITOR.md`)

### Clarifying questions guide

When the user's request is vague, ask these to fill gaps:

**For features:**
- 이 기능의 핵심 동작이 뭔가요? (주요 액션)
- 누가 이 기능을 사용하나요? (권한/역할)
- 어떤 화면에서 이 기능이 필요한가요? (usedIn)
- 에러나 빈 상태일 때 어떻게 보여야 하나요?

**For screens:**
- 이 화면의 목적이 뭔가요?
- 어떤 기능들이 들어가나요?
- PC용인가요 모바일용인가요?
- 화면의 대략적인 영역 구분이 있나요? (상단/좌측/메인 등)

## Example

See [references/FEATURE-EXAMPLE.md](references/FEATURE-EXAMPLE.md) for a complete feature spec example.
See [references/SCREEN-EXAMPLE.md](references/SCREEN-EXAMPLE.md) for a complete screen spec example.
