---
name: flowframe-wireframe
description: Converts markdown screen and feature specifications into FlowFrame-compatible HTML wireframes. Reads docs/screens/*.md for layout and docs/features/*.md for UI elements, then generates or updates docs/wireframes/*.html. Triggers on "wireframe", "와이어프레임", "화면 설계", "화면 그려줘", "HTML로 변환", "와이어프레임 업데이트", "wireframe update", "기획서로 화면 만들어줘", or any request to generate, regenerate, or update wireframes from specs. Also use when the user says something changed and wants wireframes refreshed, or asks to convert planning documents into visual screen layouts.
license: MIT
metadata:
  author: flowframehq
  version: "3.0.0"
---

# FlowFrame Wireframe Generator

Generates single-file HTML wireframes from screen and feature specs.
Output is directly uploadable to [FlowFrame](https://flowframe.co.kr) for flow review and team commenting.

## Project Structure

This skill expects the following file layout in the user's project:

```
project/
└── docs/
    ├── features/              ← Feature specs (business function units)
    │   ├── auth.md
    │   ├── comments.md
    │   └── file-upload.md
    ├── screens/               ← Screen specs (layout + feature references)
    │   ├── LOGIN.md
    │   ├── DASHBOARD.md
    │   └── EDITOR.md
    └── wireframes/            ← Generated wireframe HTML (one or more per screen)
        ├── LOGIN.html
        ├── DASHBOARD.html
        └── EDITOR.html
```

If the `docs/wireframes/` directory doesn't exist, create it. If `docs/features/` or `docs/screens/` don't exist, tell the user to create specs first (suggest the `flowframe-spec` skill).

## Input Files

### Screen spec (docs/screens/*.md)

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

### Feature spec (docs/features/*.md)

Defines a business or content unit. Frontmatter fields:

```yaml
---
featureId: COMMENTS
label: 댓글
type: section
usedIn:
  - docs/screens/EDITOR.md
  - docs/screens/DASHBOARD.md
---
```

The `## 와이어프레임 요소` section in the body lists the UI elements to render inside that feature block:

```markdown
## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 댓글 목록 | list | 작성자, 시간, 내용 표시 |
| 댓글 입력 | input | 텍스트 입력 영역 |
| 등록 버튼 | button | 댓글 등록 |
```

Other sections such as `## 상태`, `## 인터랙션`, `## 비즈니스 로직`, and `API` are for designer/developer reference only — do NOT read them for wireframe rendering.
Every screen must contain at least one referenced feature. Even simple screens like login or company introduction still use one coarse feature block.

### Missing `## 와이어프레임 요소` section

If a referenced feature md does not contain a `## 와이어프레임 요소` section, or the section exists but has no valid rows:

- Do **not** invent UI elements from other sections
- Stop generation or update for that feature
- Tell the user which feature spec is incomplete
- Ask the user to add or fix the `## 와이어프레임 요소` section before continuing
- If the screen depends entirely on that feature, stop the whole wireframe generation rather than outputting a partial result

## Wireframe Generation

### Initial generation (2-pass, incremental)

Generation MUST proceed incrementally — do NOT read all feature mds at once and write the full HTML in a single pass.

```
Pass 1 — Layout skeleton:
  1. Read screen md → identify layout regions and feature positions
  2. Read design guide + layout guide (parallel OK)
  3. Write HTML file with:
     - Full <head> (Tailwind, dark mode config, metadata with empty elements array)
     - Body layout structure with region containers
     - Fixed areas (header, footer, etc.) fully rendered
     - Feature positions marked with empty placeholder containers:
       <!-- Feature: FEATURE_ID (cart-items.md) -->
       <div data-feature="FEATURE_{ID}_PLACEHOLDER" class="p-4">
         <span class="text-sm text-zinc-400">Loading feature...</span>
       </div>

Pass 2 — Fill features one by one:
  For each referenced feature (in layout order):
    1. Read ONE feature md → extract only the `## 와이어프레임 요소` table
    2. If section is missing or empty → stop and ask the user (do NOT continue)
    3. Edit the HTML:
       - Replace the placeholder container with rendered UI elements
       - Add matching entries to the metadata elements array
    4. Move to the next feature
```

**Why incremental**: Reading all features at once risks missing elements when feature count grows. Processing one by one ensures each feature gets full attention, and incomplete specs are caught immediately before wasting work on later features.

### Update (user-triggered)

When the user says something like "댓글이랑 인증 수정했어, 와이어프레임 업데이트해줘":

```
1. Find the mentioned feature md files
2. Read ONLY the `## 와이어프레임 요소` section from each
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

**Adding new elements**: If a feature spec gained new rows in the `## 와이어프레임 요소` table, append the new rendered UI and
add matching entries to the metadata `elements` array. Inner tracked elements may share the same parent `featureId`
and `spec` while using distinct `id` values such as `FEATURE_AUTH_EMAIL`, `FEATURE_AUTH_SUBMIT`.

**Important**: Always confirm with the user before updating. The user may exclude specific wireframes.

### Multi-viewport screens

When a screen spec has `viewport: [pc, mobile]`, generate **separate HTML files** per viewport:

- Generate one PC wireframe HTML in `docs/wireframes/` from the `## 레이아웃 (PC)` section
- Generate one mobile wireframe HTML in `docs/wireframes/` from the `## 레이아웃 (Mobile)` section

Keep the file naming rule consistent within the project rather than assuming one fixed suffix convention.
Each file sets its own metadata `viewport` field to `"pc"` or `"mobile"`. Upload them to FlowFrame separately and switch between them with the viewport toggle.

### Full regeneration

When the user says "전부 다시 만들어줘" or "regenerate all wireframes":

```
1. List all screen mds in docs/screens/
2. Show the list and ask for confirmation
3. For each screen, run the initial generation (2-pass) workflow
4. Overwrite existing wireframe HTMLs
```

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
  "elements": [
    {
      "id": "FEATURE_AUTH_EMAIL",
      "featureId": "AUTH",
      "type": "input",
      "label": "이메일",
      "description": "사용자 이메일 주소를 입력하는 텍스트 필드",
      "spec": "../features/auth.md"
    }
  ]
}
```

Required: `generator` (fixed `"flowframe-wireframe-skill"`), `version`, `screenId`, `title`, `purpose`, `elements` (1+ items).

Optional: `author`, `viewport` (`"pc"` | `"mobile"`).

The `featureId` and `spec` fields link each tracked element back to its parent feature specification file.

### HTML Template

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{화면 제목}</title>

  <!-- Tailwind CSS v4 (browser JIT — stripped on upload, re-injected by viewer) -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <!-- FlowFrame dark mode config -->
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <!-- FlowFrame Metadata (required) -->
  <script type="application/json" id="flowframe-meta">
  { ... }
  </script>

</head>
<body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md flex flex-col gap-6 p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm">
      <div data-feature="FEATURE_AUTH_EMAIL">
        ...
      </div>
    </div>
  </div>
</body>
</html>
```

### data-feature Rules

- Every `elements[].id` in metadata **must** have a matching `data-feature` element
- FlowFrame uses this for bidirectional hover highlighting
- Elements without `data-feature` are excluded from highlighting
- The tracked unit is a **wireframe element**, while `featureId` preserves the parent feature relationship
- Multiple tracked elements may belong to the same feature spec

### Fixed areas (no feature reference)

Screen specs can have layout areas without feature references (e.g., "상단 메뉴바 — 파일명, 저장 상태, 공유 버튼").
These are fixed UI chrome, not tracked features:

- Render as regular HTML **without** `data-feature` attribute
- Do **not** include in the `elements` metadata array
- Use descriptive class names for readability

```html
<!-- Fixed area — no data-feature -->
<header class="h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
  <span>파일명.md</span>
  <span class="text-sm text-zinc-500 dark:text-zinc-400">저장됨</span>
  <button class="h-10 px-4 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md">공유</button>
</header>
```

### Multiple features in one layout region

When a screen spec lists multiple features under one region (e.g., "우측 패널 — [@comments], [@version-control]"),
each feature gets its own `data-feature` container, stacked sequentially:

```html
<aside class="w-70 border-l border-zinc-200 dark:border-zinc-700 flex flex-col overflow-y-auto bg-white dark:bg-zinc-800">
  <div data-feature="FEATURE_COMMENTS_LIST" class="p-4">
    <!-- comments wireframe elements -->
  </div>
  <div data-feature="FEATURE_VERSION_CONTROL_LIST" class="p-4 border-t border-zinc-200 dark:border-zinc-700">
    <!-- version-control wireframe elements -->
  </div>
</aside>
```

## Tailwind Class Patterns

Use Tailwind CSS v4 utility classes. Color palette: `zinc` exclusively for grayscale wireframe aesthetic.

| Element | Tailwind Classes |
|---------|-----------------|
| Page wrapper | `min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900` |
| Card | `w-full max-w-md flex flex-col gap-6 p-8 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm` |
| Wide container | `w-full max-w-5xl mx-auto p-6` |
| Form field | `flex flex-col gap-1.5` |
| Label | `text-sm font-medium text-zinc-600 dark:text-zinc-400` |
| Input | `h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent` |
| Primary button | `h-10 px-4 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md` |
| Secondary button | `h-10 px-4 text-sm font-semibold border border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 rounded-md` |
| Ghost button | `h-10 px-4 text-sm font-semibold text-zinc-500 dark:text-zinc-400` |
| Link | `text-sm text-zinc-500 dark:text-zinc-400 hover:underline` |
| Placeholder (image) | `bg-zinc-200 dark:bg-zinc-700 rounded` |
| Placeholder (circle) | `bg-zinc-200 dark:bg-zinc-700 rounded-full` |
| Heading (large) | `text-xl font-semibold` |
| Heading (medium) | `text-lg font-semibold` |
| Small text | `text-sm text-zinc-600 dark:text-zinc-400` |
| Divider with text | See example below |

### Divider pattern

```html
<div class="flex items-center gap-3">
  <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
  <span class="text-xs text-zinc-400">또는</span>
  <div class="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
</div>
```

## Complex Layouts

With Tailwind CSS v4, complex multi-region layouts (sidebar + main + panel) need no inline `<style>` block.
Use flex/grid utilities directly: `flex`, `flex-col`, `flex-1`, `w-60`, `h-screen`, `overflow-y-auto`, etc.

See [references/LAYOUT-GUIDE.md](references/LAYOUT-GUIDE.md) for a complete editor example with sidebar, panels, and fixed areas.
Use [references/WIREFRAME-DESIGN-GUIDE.md](references/WIREFRAME-DESIGN-GUIDE.md) as the primary authority for visual hierarchy, typography, spacing, density, and overall wireframe balance. If any example or pattern conflicts with the design guide, follow the design guide.

## Design Principles

- Goal is **structure verification**, not pretty UI
- Grayscale, neutral wireframe style — use `zinc` palette exclusively
- Buttons, inputs, cards are simple box shapes
- Images/icons use placeholder boxes (`bg-zinc-200 dark:bg-zinc-700 rounded`)
- No colors, shadows, or decorative elements beyond `shadow-sm` on cards
- All elements must include `dark:` variants for FlowFrame dark mode

## ID Rules

- `screenId`: From screen spec frontmatter (e.g., `LOGIN`, `DASHBOARD`)
- `elements[].id`: `FEATURE_{FEATURE_ID}_{ELEMENT_ID}` pattern — one tracked ID per hover/comment target
- `featureId` comes directly from the referenced feature spec frontmatter
- Use grouped IDs such as `FEATURE_AUTH_EMAIL`, `FEATURE_AUTH_SUBMIT`, `FEATURE_COMMENTS_LIST`
- Multiple tracked elements may share the same `featureId` and `spec`
- Keep the parent feature coarse-grained even when tracked elements are more detailed

### `ELEMENT_ID` derivation

- Choose the smallest English noun or action word that preserves the element's role.
- Use uppercase with underscores for multiple words.
- Prefer semantic names over repeating the raw element type.
- If two tracked elements in the same feature would collide, add role or position to disambiguate.

| Korean label | Recommended `ELEMENT_ID` | Notes |
|-------------|---------------------------|-------|
| 이메일 | `EMAIL` | Use domain meaning, not input type |
| 비밀번호 | `PASSWORD` | |
| 로그인 버튼 | `SUBMIT` | Prefer action over generic `BUTTON` |
| 등록 버튼 | `SUBMIT` | Use when the action is a submit/create action |
| 저장 버튼 | `SAVE` | |
| 삭제 버튼 | `DELETE` | |
| 댓글 목록 | `LIST` | In `COMMENTS`, becomes `FEATURE_COMMENTS_LIST` |
| 댓글 입력 | `INPUT` | Allowed when paired with `LIST` in the same feature |
| 서비스 로고 | `LOGO` | |
| 소셜 로그인 | `SOCIAL` | For a grouped social-login block |

### Feature granularity guidance

- Prefer coarse-grained features for content-heavy pages
- A company introduction page may use one parent feature like `COMPANY_OVERVIEW`, while tracked elements can be `FEATURE_COMPANY_OVERVIEW_HERO` or `FEATURE_COMPANY_OVERVIEW_CTA`
- Do not create separate feature specs for micro-parts such as `hero-title.md` or `address-box.md`
- Fixed decorative UI that is not a meaningful business/content unit should remain untracked

## FlowFrame Upload Validation

| # | Check | On Failure |
|---|-------|------------|
| 1 | File extension `.html` | Blocked |
| 2 | File size ≤ 2MB | Blocked |
| 3 | HTML parseable (DOMParser) | Blocked |
| 4 | `<script id="flowframe-meta">` exists | Blocked |
| 5 | JSON parseable | Blocked |
| 6 | `generator` === `"flowframe-wireframe-skill"` | Blocked |
| 7 | Required fields: `version`, `screenId`, `title`, `purpose`, `elements` | Blocked |
| 8 | `elements` is array with 1+ items | Blocked |
| 9 | `screenId` matches screen slug | Warning only |

## Quality Checklist

Before outputting HTML, verify:

- [ ] All required metadata fields present
- [ ] `generator` is exactly `"flowframe-wireframe-skill"`
- [ ] Every element in metadata has matching `data-feature` in HTML
- [ ] Every `data-feature` in HTML has matching metadata entry
- [ ] Every metadata element has a valid `featureId`
- [ ] Every metadata element has a valid `spec`
- [ ] Each `featureId` matches the referenced feature spec frontmatter
- [ ] Each `spec` points to an existing feature md file and the correct parent feature
- [ ] Tailwind CDN `<script>` tag included
- [ ] `<style type="text/tailwindcss">` dark mode config present
- [ ] `spec` field points to correct feature md path
- [ ] All color classes include `dark:` variants
- [ ] No key features from the spec are missing

## Examples

See [references/EXAMPLE.md](references/EXAMPLE.md) for a simple single-feature example (login screen).
See [references/PRODUCT-LIST-EXAMPLE.md](references/PRODUCT-LIST-EXAMPLE.md) for a multi-feature example (sidebar + grid layout, two features).
