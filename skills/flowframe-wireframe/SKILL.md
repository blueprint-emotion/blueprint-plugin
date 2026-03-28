---
name: flowframe-wireframe
description: Converts markdown screen and feature specifications into FlowFrame-compatible HTML wireframes. Reads screens/*.md for layout and features/*.md for UI elements, then generates or updates wireframes/*.html. Use when the user mentions "wireframe", "와이어프레임", "화면 설계", "wireframe update", "와이어프레임 업데이트", or asks to generate/update wireframes from specs.
license: MIT
metadata:
  author: flowframehq
  version: "2.0.0"
---

# FlowFrame Wireframe Generator

Generates single-file HTML wireframes from screen and feature specs.
Output is directly uploadable to [FlowFrame](https://flowframe.co.kr) for flow review and team commenting.

## When to use

- User asks to generate a wireframe from screen/feature specs
- User asks to update wireframes after modifying specs
- User mentions "wireframe", "와이어프레임", "화면 설계", "와이어프레임 업데이트"

## Project Structure

This skill expects the following file layout in the user's project:

```
project/
├── features/              ← Feature specs (business function units)
│   ├── auth.md
│   ├── comments.md
│   └── file-upload.md
├── screens/               ← Screen specs (layout + feature references)
│   ├── LOGIN.md
│   ├── DASHBOARD.md
│   └── EDITOR.md
└── wireframes/            ← Generated wireframe HTML (one per screen)
    ├── LOGIN.html
    ├── DASHBOARD.html
    └── EDITOR.html
```

## Input Files

### Screen spec (screens/*.md)

Defines layout and references features. Frontmatter fields:

```yaml
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 서비스에 로그인하는 화면
viewport: pc
---
```

The body contains layout with feature references using `[@featureName](../features/feature.md)` links.

### Feature spec (features/*.md)

Defines a business function unit. Frontmatter fields:

```yaml
---
featureId: COMMENTS
label: 댓글
type: section
usedIn:
  - screens/EDITOR.md
  - screens/DASHBOARD.md
---
```

The **와이어프레임 요소** section in the body lists UI elements to render:

```markdown
## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 댓글 목록 | list | 작성자, 시간, 내용 표시 |
| 댓글 입력 | input | 텍스트 입력 영역 |
| 등록 버튼 | button | 댓글 등록 |
```

Other sections (상태, 인터랙션, 비즈니스 로직, API) are for designer/developer reference only — do NOT read them for wireframe rendering.

## Wireframe Generation

### Initial generation (2-pass)

```
Pass 1: Read screen md → determine layout and feature positions
Pass 2: Read each feature md's "와이어프레임 요소" section one by one
  → Render each feature's UI elements in the designated layout position
```

### Update (user-triggered)

When the user says something like "댓글이랑 인증 수정했어, 와이어프레임 업데이트해줘":

```
1. Find the mentioned feature md files
2. Read ONLY the "와이어프레임 요소" section from each
3. Check the usedIn field in frontmatter for affected screens
4. Show the user which wireframes will be affected and ask for confirmation:

   "다음 와이어프레임이 영향 받습니다:
    - EDITOR.html (댓글, 인증)
    - LOGIN.html (인증)
    - DASHBOARD.html (댓글)
    진행할까요?"

5. After user confirms, update ONLY the matching data-feature sections in each HTML
   (Do NOT re-read screen md or other feature mds)
```

**Important**: Always confirm with the user before updating. The user may exclude specific wireframes.

## Output: HTML Structure

### FlowFrame Metadata

Place in `<head>` — this is what FlowFrame validates on upload:

```json
{
  "generator": "flowframe-wireframe-skill",
  "version": "1.0",
  "screenId": "SCREEN_ID",
  "title": "화면 제목",
  "purpose": "이 화면의 목적 설명",
  "features": [
    {
      "id": "SCREEN_ID_FEATURE_XXX",
      "type": "button",
      "label": "기능명",
      "description": "기능 설명",
      "spec": "../features/feature-name.md"
    }
  ]
}
```

Required: `generator` (fixed `"flowframe-wireframe-skill"`), `version`, `screenId`, `title`, `purpose`, `features` (1+ items).

Optional: `author`, `viewport` (`"pc"` | `"mobile"`).

The `spec` field links each feature to its full specification file.

### HTML Template

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{화면 제목}</title>

  <!-- Base CSS (required) -->
  <link rel="stylesheet"
    href="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/css/wireframe-base.css" />

  <!-- FlowFrame Metadata (required) -->
  <script type="application/json" id="flowframe-meta">
  { ... }
  </script>

  <!-- Screen-specific styles (only if needed, use CSS variables) -->
  <style></style>

  <!-- Base JS (required, defer) -->
  <script
    src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/js/wireframe-base.js"
    defer></script>
</head>
<body>
  <div class="wf-page">
    <div class="wf-card">
      <!-- Each feature gets a data-feature wrapper -->
      <div data-feature="SCREEN_ID_FEATURE_XXX">
        ...
      </div>
    </div>
  </div>
</body>
</html>
```

### data-feature Rules

- Every `features[].id` in metadata **must** have a matching `data-feature` element
- FlowFrame uses this for bidirectional hover highlighting
- Elements without `data-feature` are excluded from highlighting

## Base CSS Classes

| Class | Purpose |
|-------|---------|
| `wf-page` | Page container (center-aligned) |
| `wf-card` | Card/panel container |
| `wf-field` | Form field wrapper |
| `wf-label` | Field label |
| `wf-input` | Text input |
| `wf-btn` | Button base |
| `wf-btn-primary` | Primary action button |
| `wf-btn-secondary` | Secondary button |
| `wf-link` | Text link |
| `wf-divider` | Divider (supports text content) |
| `wf-placeholder` | Image/icon placeholder (gray box) |

## Design Principles

- Goal is **structure verification**, not pretty UI
- Grayscale, neutral wireframe style
- Buttons, inputs, cards are simple box shapes
- Images/icons use `wf-placeholder` (gray boxes)
- No colors, shadows, or decorative elements
- Custom styles must use CSS variables for dark mode: `var(--wf-text)`, `var(--wf-bg)`, `var(--wf-text-muted)`

## ID Rules

- `screenId`: From screen spec frontmatter (e.g., `LOGIN`, `DASHBOARD`)
- `features[].id`: `{SCREEN_ID}_FEATURE_{NAME}` pattern
- Example: screenId `LOGIN` → `LOGIN_FEATURE_AUTH`, `LOGIN_FEATURE_SOCIAL`

## FlowFrame Upload Validation

| # | Check | On Failure |
|---|-------|------------|
| 1 | File extension `.html` | Blocked |
| 2 | File size ≤ 2MB | Blocked |
| 3 | HTML parseable (DOMParser) | Blocked |
| 4 | `<script id="flowframe-meta">` exists | Blocked |
| 5 | JSON parseable | Blocked |
| 6 | `generator` === `"flowframe-wireframe-skill"` | Blocked |
| 7 | Required fields: `screenId`, `title`, `purpose`, `features` | Blocked |
| 8 | `features` is array with 1+ items | Blocked |
| 9 | `screenId` matches screen slug | Warning only |

## Quality Checklist

Before outputting HTML, verify:

- [ ] All required metadata fields present
- [ ] `generator` is exactly `"flowframe-wireframe-skill"`
- [ ] Every feature in metadata has matching `data-feature` in HTML
- [ ] Every `data-feature` in HTML has matching metadata entry
- [ ] Base CSS and JS CDN links included
- [ ] File is self-contained, viewable in browser
- [ ] `spec` field points to correct feature md path
- [ ] No key features from the spec are missing

## Example

See [references/EXAMPLE.md](references/EXAMPLE.md) for a complete working example (login screen).
