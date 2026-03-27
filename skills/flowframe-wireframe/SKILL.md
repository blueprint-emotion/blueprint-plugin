---
name: flowframe-wireframe
description: Converts markdown screen specifications into FlowFrame-compatible HTML wireframes. Generates structured wireframes with feature metadata for upload to FlowFrame, enabling flow review and commenting. Use when the user mentions "wireframe", "와이어프레임", "화면 설계", "screen design", or asks to convert a screen spec to HTML.
license: MIT
metadata:
  author: flow-frame
  version: "1.0.0"
---

# FlowFrame Wireframe Generator

Generates single-file HTML wireframes from markdown screen specifications.
The output is directly uploadable to [FlowFrame](https://flowframe.co.kr) for flow review and team commenting.

## When to use

- User provides a markdown screen specification and wants an HTML wireframe
- User mentions "wireframe", "와이어프레임", "화면 설계", "screen design"
- User wants to visualize screen structure for FlowFrame upload

## Input / Output

- **Input**: Markdown screen specification (provided by the user)
- **Output**: Single `.html` file (< 2MB) uploadable to FlowFrame

## Generation Steps

### Step 1: Extract screen info

Read the markdown spec and identify:
- **Screen ID** (e.g., `LOGIN`, `DASHBOARD`, `CANVAS-001`)
- **Screen title** (e.g., "로그인", "대시보드")
- **Screen purpose** (one sentence describing what this screen does)

### Step 2: Build feature list

Identify every interactive element or meaningful content block. For each feature:
- Assign an ID following the pattern: `{SCREEN_ID}_FEATURE_{NAME}`
- Classify the type: `input`, `button`, `link`, `image`, `text`, `select`, `checkbox`, `radio`, `table`, `list`
- Write a label and description

### Step 3: Write the flowframe-meta JSON

Place a `<script type="application/json" id="flowframe-meta">` block in `<head>` with this structure:

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
      "description": "기능 설명"
    }
  ]
}
```

**Required fields**: `generator` (fixed value `"flowframe-wireframe-skill"`), `version`, `screenId`, `title`, `purpose`, `features` (array, 1+ items).

**Optional fields**: `author`, `viewport` (`"pc"` or `"mobile"`).

### Step 4: Build HTML with data-feature attributes

Every feature in the metadata **must** have a corresponding HTML element with `data-feature="{FEATURE_ID}"`. FlowFrame uses this for bidirectional hover highlighting between the feature list and the iframe preview.

### Step 5: Apply base CSS and JS

Include the shared base CSS and JS from CDN. Use base CSS classes for standard elements. Only add a `<style>` block for screen-specific styles not covered by base CSS.

## HTML Template

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

  <!-- Screen-specific styles (only if needed) -->
  <style>
    /* Use CSS variables for dark mode compatibility:
       var(--wf-text), var(--wf-bg), var(--wf-text-muted), etc. */
  </style>

  <!-- Base JS (required, defer) -->
  <script
    src="https://kxyhbeykjlphcifhbbkr.supabase.co/storage/v1/object/public/wireframe-assets/js/wireframe-base.js"
    defer></script>
</head>
<body>
  <div class="wf-page">
    <div class="wf-card">
      <div data-feature="SCREEN_ID_FEATURE_XXX">
        ...
      </div>
    </div>
  </div>
</body>
</html>
```

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

- The goal is **structure verification**, not pretty UI
- Use grayscale, neutral wireframe style
- Buttons, inputs, cards are simple box shapes
- Images and icons use `wf-placeholder` (gray boxes)
- Do not add colors, shadows, or decorative elements
- For custom styles, always use CSS variables (`var(--wf-text)`, `var(--wf-bg)`) for dark mode compatibility

## ID Rules

- `screenId`: Use the ID defined in the screen spec (e.g., `LOGIN`, `DASHBOARD`)
- `features[].id`: `{SCREEN_ID}_FEATURE_{FEATURE_NAME}` pattern
- Example: screenId `LOGIN` → `LOGIN_FEATURE_EMAIL`, `LOGIN_FEATURE_SUBMIT`

## FlowFrame Upload Validation

FlowFrame checks these conditions on upload. All must pass:

| # | Check | On Failure |
|---|-------|------------|
| 1 | File extension `.html` | Blocked |
| 2 | File size ≤ 2MB | Blocked |
| 3 | HTML parseable (DOMParser) | Blocked |
| 4 | `<script id="flowframe-meta">` exists | Blocked |
| 5 | JSON parseable | Blocked |
| 6 | `generator` === `"flowframe-wireframe-skill"` | Blocked |
| 7 | Required fields present: `screenId`, `title`, `purpose`, `features` | Blocked |
| 8 | `features` is array with 1+ items | Blocked |
| 9 | `screenId` matches screen slug | Warning only |

## Dark Mode

Base CSS supports `.dark` class-based dark mode. FlowFrame toggles `.dark` on the iframe's `<html>` automatically. No action needed from the skill. Just avoid hardcoded colors in custom `<style>` — use CSS variables instead.

## Quality Checklist

Before outputting the HTML file, verify:

- [ ] All required metadata fields present (`generator`, `version`, `screenId`, `title`, `purpose`, `features`)
- [ ] `generator` is exactly `"flowframe-wireframe-skill"`
- [ ] Every feature in metadata has a matching `data-feature` element in HTML
- [ ] Every `data-feature` in HTML has a matching entry in metadata features
- [ ] Base CSS and JS CDN links included
- [ ] File is self-contained single HTML, viewable in a browser
- [ ] No key features from the spec are missing
- [ ] Structure is understandable even without reading the original spec

## Example

See [references/EXAMPLE.md](references/EXAMPLE.md) for a complete working example (login screen).
