# Layout Guide: Complex Multi-Region Wireframes

With Tailwind CSS v4, complex layouts need no inline `<style>` blocks.
Use flex/grid utilities directly in HTML markup.

## Table of Contents

- [Layout Patterns](#layout-patterns)
- [Complete Example: EDITOR Screen](#complete-example-editor-screen)
- [Key Patterns](#key-patterns)

## Layout Patterns

Common patterns for multi-region wireframes:

| Pattern | Tailwind Classes |
|---------|-----------------|
| Full-height shell | `flex flex-col h-screen` |
| Horizontal regions | `flex flex-1 overflow-hidden` |
| Sidebar (left) | `w-60 border-r border-zinc-200 dark:border-zinc-700 p-4 overflow-y-auto bg-white dark:bg-zinc-800` |
| Main content | `flex-1 p-6 overflow-y-auto` |
| Right panel | `w-70 border-l border-zinc-200 dark:border-zinc-700 flex flex-col overflow-y-auto bg-white dark:bg-zinc-800` |
| Top bar (fixed) | `h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800` |
| Status bar (fixed) | `h-7 px-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800` |

## Complete Example: EDITOR Screen

This example demonstrates a dashboard-style editor with five regions:

1. **Top menu bar** — fixed area (no `data-feature`, not in metadata)
2. **Left sidebar** — file tree feature
3. **Main content** — editor canvas feature
4. **Right panel** — two features stacked (comments + version history)
5. **Bottom status bar** — fixed area (no `data-feature`, not in metadata)

### Feature Specs Used

- `docs/features/file-tree.md` → 파일 탐색기 (featureId: FILE_TREE)
- `docs/features/editor.md` → 에디터 캔버스 (featureId: EDITOR_CANVAS)
- `docs/features/comments.md` → 댓글 (featureId: COMMENTS)
- `docs/features/version-control.md` → 버전 관리 (featureId: VERSION_CONTROL)

### Screen Spec (`docs/screens/EDITOR.md`)

Use project-root paths in examples. If a screen supports multiple viewports, keep them in one screen spec and split the layout sections by viewport.

```markdown
---
screenId: EDITOR
title: 에디터
purpose: 문서를 편집하고 팀원과 댓글로 소통하는 주요 작업 화면
viewport: [pc, mobile]
---

# 에디터

## 레이아웃 (PC)

1. 상단 메뉴바 — 파일명, 저장 상태, 공유 버튼
2. 좌측 사이드바 — [@file-tree](../features/file-tree.md)
3. 중앙 편집 영역 — [@editor](../features/editor.md)
4. 우측 패널 — [@comments](../features/comments.md), [@version-control](../features/version-control.md)
5. 하단 상태바 — 커서 위치, 단어 수, 언어 모드

## 레이아웃 (Mobile)

1. 상단 앱 바 — 문서 제목, 저장 상태
2. 본문 편집 영역 — [@editor](../features/editor.md)
3. 하단 탭 또는 접이식 패널 — [@comments](../features/comments.md), [@version-control](../features/version-control.md)
```

### Generated Wireframe (`docs/wireframes/EDITOR.html`, PC example)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>에디터</title>
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>

  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <script type="application/json" id="flowframe-meta">
  {
    "generator": "flowframe-wireframe-skill",
    "version": "1.0",
    "screenId": "EDITOR",
    "title": "에디터",
    "viewport": "pc",
    "purpose": "문서를 편집하고 팀원과 댓글로 소통하는 주요 작업 화면",
    "elements": [
      {
        "id": "FEATURE_FILE_TREE_LIST",
        "featureId": "FILE_TREE",
        "type": "list",
        "label": "파일 트리 목록",
        "description": "프로젝트 파일과 폴더를 탐색하는 목록",
        "spec": "../features/file-tree.md"
      },
      {
        "id": "FEATURE_EDITOR_CANVAS_BODY",
        "featureId": "EDITOR_CANVAS",
        "type": "text",
        "label": "문서 편집 본문",
        "description": "문서 내용을 읽고 편집하는 주요 영역",
        "spec": "../features/editor.md"
      },
      {
        "id": "FEATURE_COMMENTS_LIST",
        "featureId": "COMMENTS",
        "type": "list",
        "label": "댓글 목록",
        "description": "팀원 댓글과 상태를 확인하는 목록",
        "spec": "../features/comments.md"
      },
      {
        "id": "FEATURE_COMMENTS_INPUT",
        "featureId": "COMMENTS",
        "type": "input",
        "label": "댓글 입력",
        "description": "새 댓글을 작성하고 등록하는 입력 영역",
        "spec": "../features/comments.md"
      },
      {
        "id": "FEATURE_VERSION_CONTROL_LIST",
        "featureId": "VERSION_CONTROL",
        "type": "list",
        "label": "버전 히스토리 목록",
        "description": "문서 버전 변경 이력을 확인하는 목록",
        "spec": "../features/version-control.md"
      }
    ]
  }
  </script>
</head>
<body class="bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200">
  <div class="flex flex-col h-screen">

    <!-- Fixed: Top menu bar (no data-feature) -->
    <header class="h-12 px-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded"></div>
        <span class="font-semibold">문서제목.md</span>
        <span class="text-xs text-zinc-500 dark:text-zinc-400">저장됨</span>
      </div>
      <div class="flex items-center gap-2">
        <button class="h-8 px-3 text-sm text-zinc-500 dark:text-zinc-400">공유</button>
        <div class="w-7 h-7 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">

      <!-- Left sidebar: File tree -->
      <nav class="w-60 border-r border-zinc-200 dark:border-zinc-700 p-4 overflow-y-auto bg-white dark:bg-zinc-800"
           data-feature="FEATURE_FILE_TREE_LIST">
        <div class="flex items-center justify-between mb-4">
          <span class="text-sm font-semibold">탐색기</span>
          <button class="text-xs text-zinc-500 dark:text-zinc-400">+</button>
        </div>
        <div class="flex flex-col gap-0.5">
          <div class="text-xs text-zinc-500 dark:text-zinc-400 uppercase">src</div>
          <div class="pl-6 py-1 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">index.ts</div>
          <div class="pl-6 py-1 text-sm rounded bg-zinc-100 dark:bg-zinc-700 font-semibold">app.ts</div>
          <div class="pl-6 py-1 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">utils.ts</div>
          <div class="text-xs text-zinc-500 dark:text-zinc-400 uppercase mt-2">docs</div>
          <div class="pl-6 py-1 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">README.md</div>
          <div class="pl-6 py-1 text-sm rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 cursor-pointer">CHANGELOG.md</div>
        </div>
      </nav>

      <!-- Main: Editor canvas -->
      <main class="flex-1 p-6 overflow-y-auto" data-feature="FEATURE_EDITOR_CANVAS_BODY">
        <h1 class="text-xl font-semibold mb-4">문서 제목</h1>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-[90%]"></div>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-full"></div>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-3/4"></div>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-6 w-[85%]"></div>
        <h2 class="text-lg font-semibold mb-2">섹션 제목</h2>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-[95%]"></div>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-2 w-full"></div>
        <div class="h-3 bg-zinc-200 dark:bg-zinc-700 rounded mb-6 w-3/5"></div>
        <div class="w-full h-40 bg-zinc-200 dark:bg-zinc-700 rounded-md"></div>
      </main>

      <!-- Right panel: Comments + Version history (two features stacked) -->
      <aside class="w-70 border-l border-zinc-200 dark:border-zinc-700 flex flex-col overflow-y-auto bg-white dark:bg-zinc-800">
        <div class="p-4">
          <div class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">댓글</div>
          <div class="py-2 border-b border-zinc-200 dark:border-zinc-700" data-feature="FEATURE_COMMENTS_LIST">
            <div class="flex justify-between">
              <span class="text-xs font-semibold">김디자이너</span>
              <span class="text-xs text-zinc-500 dark:text-zinc-400">2시간 전</span>
            </div>
            <div class="text-sm mt-1">이 섹션 레이아웃 확인 부탁드립니다.</div>
          </div>
          <div class="py-2 border-b border-zinc-200 dark:border-zinc-700">
            <div class="flex justify-between">
              <span class="text-xs font-semibold">박개발자</span>
              <span class="text-xs text-zinc-500 dark:text-zinc-400">30분 전</span>
            </div>
            <div class="text-sm mt-1">수정 완료했습니다. 리뷰해 주세요.</div>
          </div>
          <div class="flex gap-2 mt-2" data-feature="FEATURE_COMMENTS_INPUT">
            <input class="h-10 px-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-transparent flex-1" type="text" placeholder="댓글 입력..." readonly />
            <button class="h-10 px-4 text-sm font-semibold bg-zinc-800 text-white dark:bg-zinc-200 dark:text-zinc-900 rounded-md">등록</button>
          </div>
        </div>

        <div class="p-4 border-t border-zinc-200 dark:border-zinc-700" data-feature="FEATURE_VERSION_CONTROL_LIST">
          <div class="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase mb-2">버전 관리</div>
          <div class="py-2 border-b border-zinc-200 dark:border-zinc-700">
            <div class="text-sm font-semibold">v1.3 — 최신</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">박개발자 · 30분 전</div>
          </div>
          <div class="py-2 border-b border-zinc-200 dark:border-zinc-700">
            <div class="text-sm font-semibold">v1.2</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">김디자이너 · 3시간 전</div>
          </div>
          <div class="py-2 border-b border-zinc-200 dark:border-zinc-700">
            <div class="text-sm font-semibold">v1.1</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">박개발자 · 어제</div>
          </div>
          <div class="py-2">
            <div class="text-sm font-semibold">v1.0 — 초기 버전</div>
            <div class="text-xs text-zinc-500 dark:text-zinc-400">박개발자 · 3일 전</div>
          </div>
        </div>
      </aside>

    </div>

    <!-- Fixed: Bottom status bar (no data-feature) -->
    <footer class="h-7 px-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-700 text-xs text-zinc-500 dark:text-zinc-400 bg-white dark:bg-zinc-800">
      <div class="flex gap-4">
        <span>Ln 42, Col 18</span>
        <span>1,247 단어</span>
      </div>
      <div class="flex gap-4">
        <span>Markdown</span>
        <span>UTF-8</span>
      </div>
    </footer>

  </div>
</body>
</html>
```

## Key Patterns

1. **Multi-region shell**: `flex flex-col h-screen` for vertical stacking, `flex flex-1 overflow-hidden` for horizontal regions
2. **Fixed areas**: Top bar and status bar have no `data-feature` and are excluded from metadata
3. **Feature vs element**: `featureId` is the parent spec unit, while `elements[]` and `data-feature` track hover/comment targets inside that feature
4. **Multiple features in one region**: Right panel has comments and version-control features stacked in the same region
5. **Multiple elements in one feature**: Comments feature exposes separate list and input targets while still pointing to the same `featureId` and `spec`
6. **Dark mode**: Use `dark:` prefix on every color class — no CSS variables needed
7. **No inline `<style>` for layout**: All sizing, spacing, and positioning handled by Tailwind utilities directly in markup
8. **Only tracked elements in metadata**: Fixed chrome does not appear in the `elements` array
