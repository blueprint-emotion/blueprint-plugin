# bp-alert-dialog

사용자에게 명시적 확인/취소를 요구하는 모달 다이얼로그. shadcn `AlertDialog` 1:1 포팅. **닫기(X) 버튼 없음** — cancel/action으로만 닫힘.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-alert-dialog` | `open` | boolean | 다이얼로그 표시/숨김. 와이어프레임 정적 표현에 사용 |
| `bp-alert-dialog-content` | `size` | `default`(기본) \| `sm` | 패널 너비 |
| `bp-alert-dialog-action` | `variant` | `default`(기본) \| `destructive` \| `outline` \| `secondary` \| `ghost` \| `link` | 확인 버튼 스타일 |
| `bp-alert-dialog-action` | `size` | `default`(기본) \| `xs` \| `sm` \| `lg` | 확인 버튼 크기 |
| `bp-alert-dialog-cancel` | `variant` | `outline`(기본) \| 위와 동일 | 취소 버튼 스타일 |
| `bp-alert-dialog-cancel` | `size` | `default`(기본) \| 위와 동일 | 취소 버튼 크기 |

## Composition

```
bp-alert-dialog
├── bp-alert-dialog-trigger        (선택 — 트리거 버튼)
└── bp-alert-dialog-portal         (pass-through)
    └── bp-alert-dialog-overlay    (반투명 백드롭)
        └── bp-alert-dialog-content
            ├── bp-alert-dialog-header
            │   ├── bp-alert-dialog-title
            │   └── bp-alert-dialog-description  (선택)
            └── bp-alert-dialog-footer
                ├── bp-alert-dialog-cancel
                └── bp-alert-dialog-action
```

## shadcn과의 차이

- `className` → `class`
- `ref` / `forwardRef` / `asChild` 미지원
- `onOpenChange` 콜백 미지원 → 표준 DOM 이벤트
- 백드롭 클릭으로 닫기 없음 (alert-dialog는 명시적 선택 필요. bp-dialog와 다름)
- `AlertDialogMedia` 미지원 (정적 와이어프레임 범위 밖)
- Portal은 DOM 이동 없음 (pass-through 래퍼)
- 애니메이션 (data-open/data-closed) 미지원

## 함정

- **닫기(X) 버튼 없음**: `bp-dialog`는 기본적으로 X 버튼이 표시되지만, `bp-alert-dialog`는 X 버튼이 없다. cancel/action 버튼으로만 닫힌다. 와이어프레임에서 "닫기 방법이 없다"처럼 보일 수 있으므로 반드시 footer에 cancel을 포함한다.
- 와이어프레임에서 열린 상태를 표현할 때는 `<bp-alert-dialog open>`처럼 trigger 없이 `open` 속성만 사용한다.

## 예제

```html
<!-- 트리거 버튼으로 열기 -->
<bp-alert-dialog>
  <bp-alert-dialog-trigger>
    <bp-button variant="destructive">삭제</bp-button>
  </bp-alert-dialog-trigger>
  <bp-alert-dialog-portal>
    <bp-alert-dialog-overlay>
      <bp-alert-dialog-content>
        <bp-alert-dialog-header>
          <bp-alert-dialog-title>정말 삭제하시겠습니까?</bp-alert-dialog-title>
          <bp-alert-dialog-description>이 작업은 되돌릴 수 없습니다.</bp-alert-dialog-description>
        </bp-alert-dialog-header>
        <bp-alert-dialog-footer>
          <bp-alert-dialog-cancel>취소</bp-alert-dialog-cancel>
          <bp-alert-dialog-action variant="destructive">삭제</bp-alert-dialog-action>
        </bp-alert-dialog-footer>
      </bp-alert-dialog-content>
    </bp-alert-dialog-overlay>
  </bp-alert-dialog-portal>
</bp-alert-dialog>

<!-- 정적 표현 (열린 상태 고정, sm 크기) -->
<bp-alert-dialog open>
  <bp-alert-dialog-portal>
    <bp-alert-dialog-overlay>
      <bp-alert-dialog-content size="sm">
        <bp-alert-dialog-header>
          <bp-alert-dialog-title>로그아웃</bp-alert-dialog-title>
          <bp-alert-dialog-description>정말 로그아웃하시겠습니까?</bp-alert-dialog-description>
        </bp-alert-dialog-header>
        <bp-alert-dialog-footer>
          <bp-alert-dialog-cancel>취소</bp-alert-dialog-cancel>
          <bp-alert-dialog-action>확인</bp-alert-dialog-action>
        </bp-alert-dialog-footer>
      </bp-alert-dialog-content>
    </bp-alert-dialog-overlay>
  </bp-alert-dialog-portal>
</bp-alert-dialog>
```
