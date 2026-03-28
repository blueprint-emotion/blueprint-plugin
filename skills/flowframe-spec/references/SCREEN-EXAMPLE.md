# Example: Screen Spec — 에디터

```markdown
---
screenId: EDITOR
title: 에디터
purpose: 사용자가 콘텐츠를 편집하고 팀원과 협업하는 메인 작업 화면
viewport: pc
---

# 에디터

## 레이아웃

1. 상단 메뉴바 — 파일명, 저장 상태, 공유 버튼
2. 좌측 사이드바 — [@file-tree](../features/file-tree.md)
3. 메인 편집 영역 — [@editor-canvas](../features/editor-canvas.md)
4. 우측 패널
   - [@comments](../features/comments.md)
   - [@version-control](../features/version-control.md)
5. 하단 상태바 — 커서 위치, 줌 레벨, 협업자 아바타
```

## Key patterns

- Screen spec is **short** — just layout + feature references
- No feature details here (those live in docs/features/*.md)
- `[@featureName](path)` syntax links to feature specs
- Every screen must reference at least one feature
- One feature can appear in multiple screens
- **Fixed areas** (lines 1, 5): Areas without `[@feature]` links describe fixed UI chrome (menu bar, status bar). These render as plain HTML without `data-feature` and are not included in FlowFrame metadata.
- **Multi-feature regions** (line 4): Multiple `[@feature]` references in one region — each gets its own `data-feature` container, stacked sequentially.

## Single-feature screen example

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 서비스에 로그인하는 화면
viewport: [pc, mobile]
---

# 로그인

## 레이아웃 (PC)

1. 전체 화면 — [@auth](../features/auth.md)

## 레이아웃 (Mobile)

1. 전체 화면 — [@auth](../features/auth.md)
```

If the screen is effectively one feature, keep the screen spec this short instead of splitting it into micro-regions.

## Multi-viewport example

```markdown
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 서비스에 로그인하는 화면
viewport: [pc, mobile]
---

# 로그인

## 레이아웃 (PC)

1. 좌: 브랜딩 이미지 | 우: 인증 폼 — [@auth](../features/auth.md)

## 레이아웃 (Mobile)

1. 로고
2. 인증 폼 — [@auth](../features/auth.md)
3. 소셜 로그인 — [@auth](../features/auth.md)
```

Planners specify order + direction only. Visual details are the designer's domain.
Multi-viewport screen specs generate **separate HTML files** per viewport. Use a file naming rule that stays consistent within the project instead of assuming one fixed suffix pattern.
