# bp-frame

bp 전용 — shadcn 포팅 없음. `<bp-board>` 안의 **정상 상태 프레임**. 고정 폭(pc/모바일)을 갖는 페이지 전체 뷰.

## 속성

| prop | 값 | 기본 | 설명 |
|---|---|---|---|
| `viewport` | `pc` \| `mobile` | `pc` | 폭 분기. `pc` → 1200px, `mobile` → 375px |

## Composition

```
bp-frame viewport="pc|mobile"
  bp-page
    bp-page-header
    bp-page-content
      bp-section ...
    bp-page-footer
```

- `<bp-board>` 직계 자식으로 둔다
- 내부는 `<bp-page>` 1개가 원칙 (shell · header · content · footer 구조)

## 함정

- **한 파일에 `bp-frame`은 1개만** (정상 상태 전용). 여러 개 두면 "정상 상태가 여러 개"라는 모순이 생긴다.
- **한 파일에 viewport를 섞지 않는다**. 화면명세 `viewport`가 `[pc, mobile]`이면 파일을 각각 생성한다.
- `viewport="mobile"` 사용 시 내부 UI도 모바일 레이아웃(세로 스택·작은 폰트·모바일 헤더)에 맞춘다 — 속성만 바꾸면 되는 게 아니라 콘텐츠 디자인이 달라져야 한다.

## 예제

```html
<bp-board>
  <!-- PC 와이어프레임 -->
  <bp-frame viewport="pc">
    <bp-page>
      <bp-page-header>
        <div class="flex items-center justify-between w-full">
          <span class="font-semibold">Blueprint</span>
          <bp-avatar size="sm"><bp-avatar-fallback>JS</bp-avatar-fallback></bp-avatar>
        </div>
      </bp-page-header>
      <bp-page-content>
        <bp-section data-feature="PROJECT__INFO" data-label="프로젝트 그리드">
          <!-- 그리드 -->
        </bp-section>
      </bp-page-content>
    </bp-page>
  </bp-frame>
</bp-board>
```

```html
<!-- 모바일 파일 (별도 파일) -->
<bp-board>
  <bp-frame viewport="mobile">
    <bp-page>
      <bp-page-content>
        <!-- 모바일 레이아웃 -->
      </bp-page-content>
    </bp-page>
  </bp-frame>
</bp-board>
```