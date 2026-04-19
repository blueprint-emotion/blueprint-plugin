# bp-area

bp 전용 — shadcn 포팅 없음. `<bp-board>` 안의 **상태 조각 영역**. 한 기능 영역의 변형(빈·에러·로딩 등)을 모아 세로로 나열한다.

## 속성

| prop | 값 | 기본 | 설명 |
|---|---|---|---|
| `width` | 숫자(px) | `560` | 컬럼 폭 |

## Composition

```
bp-area
  bp-fragment id title description
    ...상태 UI...
  bp-fragment id title description
    ...다른 상태 UI...
```

## 자동 처리

`bp-area`는 connectedCallback 시점에 내부를 재구성한다:

1. 자식들을 **외곽 `<bp-card>`**로 감싼다 (헤더 없음, 미세 회색조 배경)
2. 내부 content는 `<bp-card-content class="flex flex-col gap-8">` — fragment 간 간격은 이 flex gap이 담당

따라서 작성자는 fragment들만 차례대로 나열하면 되고, 카드 래핑을 직접 쓰지 않는다. "무엇의 상태 조각인지"는 각 `<bp-fragment>`의 title/description으로 드러난다.

## 함정

- **`<bp-fragment>` 바깥의 평범한 DOM을 자식으로 두지 않는다** — 자동 래핑 로직이 fragment 기준으로 간격과 구분선을 계산하므로 `<div>` 같은 비-fragment 요소를 섞으면 시각이 깨진다.
- `width` 기본값 560px이 넉넉한 기본이지만, 모바일 조각(`viewport="mobile"`에 대응)을 담을 땐 400~450px 정도로 좁히면 보드가 컴팩트해진다.

## 예제

```html
<bp-area>
  <bp-fragment id="viewer-placeholder" title="플레이스홀더" description="와이어프레임 미선택 시">
    <bp-empty data-element="파일 선택 안내">
      <bp-empty-title>와이어프레임을 선택하세요</bp-empty-title>
    </bp-empty>
  </bp-fragment>

  <bp-fragment id="viewer-md" title="MD 뷰어" description="*.md 파일 선택 시">
    <article class="prose" data-element="MD 뷰어">
      <h1>로그인 화면</h1>
      <p>...</p>
    </article>
  </bp-fragment>

  <bp-fragment id="viewer-empty" title="빈 프로젝트" description="저장소에 와이어프레임 파일 없음">
    <bp-alert data-element="빈 프로젝트">
      <bp-alert-title>와이어프레임이 없습니다</bp-alert-title>
    </bp-alert>
  </bp-fragment>
</bp-area>
```

각 fragment의 루트 요소에 `data-element`가 붙은 점에 주목. JSON `elements[].name`과 1:1 매칭되어야 eye 버튼 locate가 동작한다. fragment의 `title`과 별개로 **반드시 따로 달아야 한다** — bridge는 오직 `data-element`로만 찾는다.