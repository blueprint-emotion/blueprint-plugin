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
- No feature details here (those live in features/*.md)
- `[@featureName](path)` syntax links to feature specs
- One feature can appear in multiple screens
