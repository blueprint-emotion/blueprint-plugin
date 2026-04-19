# bp-fragment

bp 전용 — shadcn 포팅 없음. `<bp-area>` 안의 **개별 상태 조각**. 제목·설명 헤더가 자동으로 붙는다.

## 속성

| prop | 값 | 필수 | 설명 |
|---|---|---|---|
| `id` | 문자열 | 권장 | 조각 식별자. `data-fragment-id`로 미러링되어 외부에서 참조 가능 |
| `title` | 문자열 | — | h3로 렌더되는 제목 |
| `description` | 문자열 | — | 제목 아래 보조 설명. 이 상태가 언제 노출되는지 한 줄 설명 |

## Composition

```
bp-fragment id title description
  <내용 — bp-section / bp-card / 자유 HTML>
```

- `<bp-area>` 직계 자식으로 둔다
- 자식은 한 기능 영역의 특정 상태 UI (예: 빈 목록 empty state, 에러 alert, 로딩 skeleton)

## 자동 처리

connectedCallback 시 아래와 같이 재구성된다:

```html
<bp-fragment class="flex flex-col gap-3">
  <div class="bp-fragment-header">    ← title/description 있을 때만
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
  <div class="bp-fragment-body rounded-lg border border-border bg-background p-4">
    <!-- 사용자가 넣은 자식들이 이 박스로 이동 -->
  </div>
</bp-fragment>
```

- **본문은 항상 `.bp-fragment-body` 박스로 래핑된다** (border + radius + padding). 각 조각을 시각적으로 독립된 패널로 보여주기 위함. title/description이 없어도 래핑됨.
- 헤더는 `title` 또는 `description`이 있을 때만 생성된다.
- **함정**: 본문 안에 또 `bp-card`나 border/padding이 있는 wrapper를 두면 이중 박스가 된다. 본문은 박스가 이미 있다는 전제로 내부 콘텐츠만 넣는다.

## 함정

- **`<bp-area>` 바깥에서 쓰지 않는다**. `bp-board` 직계나 `bp-frame` 안에 두면 카드 래핑·구분선 자동 삽입이 작동하지 않는다.
- `title`/`description`은 **이 조각이 무엇인지**를 설명하는 라벨이다. JSON `elements[]`의 `description`(요소 설명)과 성격이 다르다 — fragment의 description은 "언제 이 상태가 되는가", elements의 description은 "이 요소가 무엇을 하는가".
- **fragment 내부에 있는 요소가 JSON `elements[]`에 이름으로 올라와 있다면 래퍼에 `data-element="<이름>"`을 붙여야 한다.** 정상 프레임에 존재하지 않고 fragment에만 존재하는 요소(예: "빈 목록", "GitHub API 에러")도 위치 보기(eye) 대상이므로 매칭이 필요하다. fragment의 `title`이 비슷하다고 자동 매칭되지 않는다 — bridge는 오직 `data-element`로만 찾는다.
- `id`는 중복되지 않게 짧고 구체적으로 (예: `grid-empty`, `viewer-md`, `access-denied`). 외부 스크립트·플랫폼이 `data-fragment-id`로 핀을 달 수도 있다.

## 예제

```html
<bp-area>
  <bp-fragment id="access-denied" title="권한 없음" description="collaborator가 아닌 사용자 접근">
    <bp-alert variant="destructive" data-element="권한 없음 안내">
      <bp-alert-title>프로젝트에 접근할 수 없습니다</bp-alert-title>
      <bp-alert-description>저장소 collaborator로 등록된 계정으로 로그인하세요.</bp-alert-description>
    </bp-alert>
  </bp-fragment>

  <bp-fragment id="repo-deleted" title="저장소 삭제됨" description="GitHub에서 저장소 제거 또는 권한 박탈">
    <bp-empty data-element="저장소 없음 안내">
      <bp-empty-media><bp-icon name="alert-triangle" size="xl"></bp-icon></bp-empty-media>
      <bp-empty-title>저장소를 찾을 수 없습니다</bp-empty-title>
    </bp-empty>
  </bp-fragment>
</bp-area>
```

위 예제는 JSON `elements[]`에 `{ "name": "권한 없음 안내" }` / `{ "name": "저장소 없음 안내" }`가 정의돼 있다는 전제다. fragment 내부 요소도 eye 버튼 locate가 필요하므로 `data-element`가 필수다.
