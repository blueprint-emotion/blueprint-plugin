---
name: wireframe
version: 4.2.1
user-invocable: false
description: >
  와이어프레임 HTML을 생성한다. bp-* Web Components(shadcn/ui 포팅 51종 + bp-icon)를 사용.
  와이어프레임 HTML 파일을 생성하거나 수정할 때, bp-* 컴포넌트를 사용할 때 반드시 이 스킬을 사용한다.
  "와이어프레임", "wireframe", "bp-", "화면 그려", "페이지 그려" 키워드에 트리거.
  화면명세/기능명세 작성은 각각 screen-spec, feature-spec 스킬을 사용한다.
---

# 와이어프레임 HTML 작성 가이드

와이어프레임은 **순수 HTML 파일**이다. React/Vue 없이 동작한다.
- `<iframe sandbox="allow-scripts" srcdoc="...">`로 격리 렌더링
- UI: `bp-*` Web Components = **shadcn/ui 1:1 포팅**
- 레이아웃: Tailwind CSS 유틸리티
- 아이콘: `<bp-icon name="...">` (Lucide 60+개 내장)

한 화면 = 한 파일. 파일 하나 안에 **정상 상태 프레임 1개 + 상태 조각 영역(0~N개)**를 `<bp-board>` 가로 보드에 나열한다 (Figma 보드 메타포). 기능 설명은 `<script type="application/bp-description+json">`에 임베드하면 우측 sticky rail로 자동 렌더된다.

> **컴포넌트 상세 레퍼런스**: `references/components/bp-{name}.md` — 분할된 컴포넌트별 파일 (속성표 / Composition / shadcn과의 차이 / 미지원 / 함정 / 예제). 빠른 참조표에 링크가 걸린 컴포넌트만 별도 파일이 있다.
> **완성 예제 와이어프레임**: `references/example-product-detail.html` — 보드 패턴이 적용된 종합 참고용 샘플

### 참조 전략 (토큰 절약)

이 스킬은 **2단계 참조**로 설계되어 있다.

1. **이 파일의 빠른 참조 테이블**만으로 대부분의 와이어프레임을 작성할 수 있다. bp-* 는 shadcn/ui 1:1 포팅이므로 shadcn 지식을 그대로 적용한다.
2. shadcn과 차이가 있거나 composition이 복잡한 컴포넌트만 **링크를 따라가 `references/components/bp-X.md`** 한 파일을 읽는다. 링크가 없는 컴포넌트는 표만으로 충분하다 (shadcn과 동일).

**`bp-components.js`를 fetch/read하지 말 것** — 6,600+ 줄 빌드 산출물이라 토큰만 낭비된다. 컴포넌트 사용법은 이 스킬에 전부 있다.

---

## 입력: 화면명세

와이어프레임은 **화면명세(`*screen*.md`)**를 입력으로 받는다.

### viewport 분기

화면명세 frontmatter의 `viewport` 배열에 따라 **각각 파일을 생성**한다.

```yaml
# screen.md frontmatter
viewport: [pc, mobile]
```

→ 두 개의 와이어프레임 파일을 만들고, 각각 `<bp-frame viewport="pc">` / `<bp-frame viewport="mobile">`을 쓴다. 한 파일에 두 viewport를 섞지 않는다 (파일 분리가 원칙).

**오버레이(`sheet_*.md`, `dialog_*.md`) 도 동일 규약**: 각 overlay 파일의 `viewport` 배열을 독립적으로 따라 pc/mobile 별 파일을 만든다. suffix 규약은 `wireframe_sheet_{name}.html` (pc) + `wireframe_sheet_{name}_mobile.html` (mobile). page 의 viewport 와 overlay 의 viewport 는 독립이다.

파일명 규칙은 이 스킬의 관심사가 아니다 — 플랫폼·화면명세 측에서 정한다. 와이어프레임 스킬은 입력받은 viewport에 맞춰 프레임을 그린다.

### 복잡한 화면 (루트 + 영역 파일)

루트 화면명세에서 레이아웃을 파악하고, 각 영역 파일에서 features와 elements를 가져온다.

```
screen.md 화면 구성:
  - 좌측: [이미지 갤러리](./area_image.md)
  - 우측 상단: [상품 기본 정보](./area_info.md)
  - 우측 하단: [옵션 선택](./area_option.md)

area_image.md:
  features:
    - id: PRODUCT__IMAGE       ← data-feature 값
      ref: ../../features/PRODUCT.md#IMAGE  ← rules 읽기 경로

area_option.md:
  features:
    - id: PRODUCT__OPTION      ← bp-section 1
      ref: ../../features/PRODUCT.md#OPTION
    - id: PRODUCT__PRICE       ← bp-section 2
      ref: ../../features/PRODUCT.md#PRICE

       ↓

wireframe.html:
  <bp-section data-feature="PRODUCT__IMAGE" data-feature-key="gallery" data-label="이미지 갤러리">…</bp-section>
  <bp-section data-feature="PRODUCT__OPTION" data-feature-key="option" data-label="옵션 선택">…</bp-section>
  <bp-section data-feature="PRODUCT__PRICE" data-feature-key="price" data-label="가격">…</bp-section>
```

### 단순한 화면 (파일 1개)

인라인 영역에서 기능명세 링크로부터 featureId를 추출한다.

```
login_screen.md 화면 구성:
  ### [로그인 폼](../../features/AUTH.md#LOGIN)
  elements: 이메일, 비밀번호, ...

       ↓

wireframe.html:
  <bp-section data-feature="AUTH__LOGIN" data-feature-key="login-form" data-label="로그인 폼">…</bp-section>
```

- `data-feature`의 값은 `features[].id` — `{DOMAIN}__{toc.id}` 형식
- 메인 UI의 각 `features[].id`마다 별도 `<bp-section>`을 생성하고 `data-feature-key`를 반드시 붙인다
- 영역 파일의 elements에서 각 영역에 어떤 요소를 배치할지 확인한다
- **구체적 placeholder**: `features[].ref` 링크를 따라가 기능명세의 rules를 읽고, 도메인 속성(상품명, 판매가 등)을 placeholder로 채운다

---

## 핀 앵커 규약

핀 코멘트 앵커 타입은 **태그 자체로 판정**한다. 별도 `data-anchor` 속성은 두지 않는다.

> **용어** — "메인 UI `bp-section`"이란 조상 체인에 `<bp-fragment>`가 없는 `<bp-section>`을 말한다. 정상 프레임(`<bp-frame>` 안 `<bp-page>`) 내부의 모든 `<bp-section>`이 이에 해당한다. 반대로 `<bp-fragment>` 안에 중첩된 `<bp-section>`은 메인 UI가 아니다.

| 엘리먼트 | 필수 속성 | 선택 속성 | 핀 앵커? | 설명 |
|---|---|---|:---:|---|
| `bp-page` | 없음 | `data-feature` (페이지 대표 도메인) | Y | 페이지 전체 코멘트 앵커. `data-feature` 없으면 라벨은 `SCREEN`, 있으면 그 값 |
| `bp-area` | 없음 | — | N | 상태 조각 묶음용 래퍼 |
| `bp-fragment` | `id` | — | Y | fragment 단위 코멘트 앵커 |
| 메인 UI `bp-section` | `data-feature` + `data-feature-key` | — | Y | feature 단위 코멘트 앵커 |
| `bp-fragment` 내부 `bp-section` | `data-feature` | — | N | 사이드바 feature 매칭용. 핀 앵커 아님 |

### 앵커 타입 도해

```text
bp-page                         → page anchor
  ... bp-section[data-feature][data-feature-key]
                               → feature anchor
bp-area                        → wrapper only
  bp-fragment#fragment-id      → fragment anchor
    bp-section[data-feature]   → sidebar match only (not anchor)
```

### `data-feature` / `data-feature-key` 역할 분리

- `data-feature`는 **기능명세 도메인 역참조** 축이다. 기능 설명 JSON의 `sections[].feature`, 화면명세 `features[].id`, fragment 내부의 같은 도메인 매칭에 공통으로 쓴다.
- `data-feature-key`는 **페이지 내 슬롯 식별자** 축이다. 같은 `data-feature`가 페이지에 여러 번 등장해도 각 위치를 구분하기 위해 쓴다.
- 페이지 전체 코멘트는 `bp-page` 자체가 앵커이므로 기존 `feature_id = NULL` 같은 우회 규칙을 두지 않는다.

### strict 규칙

- 메인 UI의 `<bp-section>`에는 **항상** `data-feature-key`를 붙인다. 같은 `data-feature`가 한 번만 나와도 생략하지 않는다.
- 그 `data-feature-key`는 **페이지 전역에서 유일**해야 한다. 같은 `data-feature`를 두 번 쓰면 `summary`, `detail`처럼 의미 있는 서로 다른 key를 쓴다.
- `data-feature-key`는 kebab-case 슬러그만 사용한다. 예: `summary`, `detail`, `list`, `empty-state`, `header`.
- `<bp-fragment>` 내부의 `<bp-section>`에는 `data-feature`만 둔다. `data-feature-key`를 붙이지 않는다.
- 같은 feature가 메인 UI와 상태 조각에 함께 등장할 수는 있지만, **핀 앵커는 `bp-page | bp-fragment | 메인 UI bp-section`만** 생성된다.

---

## shadcn → bp-* 변환

| React (shadcn) | HTML (bp-*) |
|----------------|-------------|
| `<Button>` | `<bp-button>` (PascalCase → bp-kebab-case) |
| `className="..."` | `class="..."` |
| `onCheckedChange={fn}` | 표준 DOM `change` 이벤트 |
| `disabled={true}` | `disabled` (속성 존재 = true, 생략 = false) |
| `asChild`, `render`, `forwardRef` | 미지원 |
| `defaultValue` / `value` 구분 | `value` 하나로 통일 |

---

## HTML 템플릿

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>화면명</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://blueprint-platform-pink.vercel.app/blueprint/v1/tailwind-config.js"></script>
    <script src="https://blueprint-platform-pink.vercel.app/blueprint/v1/bp-components.js" defer></script>
    <link rel="stylesheet" href="https://blueprint-platform-pink.vercel.app/blueprint/v1/base.css" />

    <script type="application/bp-description+json">
    {
      "purpose": "이 화면의 목적 한 줄",
      "rules": ["화면 간 비즈니스 규칙 1", "규칙 2"],
      "sections": [
        {
          "feature": "DOMAIN__ID",
          "label": "기능명",
          "elements": [
            { "name": "요소명", "description": "설명" }
          ],
          "notes": ["확인 필요 사항"]
        }
      ]
    }
    </script>
  </head>
  <body>
    <bp-board>
      <bp-frame viewport="pc">
        <bp-page>
          <bp-page-header>…</bp-page-header>
          <bp-page-content>
            <bp-section data-feature="DOMAIN__ID" data-feature-key="slot-name" data-label="기능명">
              <!-- UI -->
            </bp-section>
          </bp-page-content>
        </bp-page>
      </bp-frame>

      <bp-area>
        <bp-fragment id="fragment-id" title="상태명" description="이 상태가 언제 노출되는지">
          <bp-section data-feature="DOMAIN__ID" data-label="기능명">
            <!-- 이 상태의 UI -->
          </bp-section>
        </bp-fragment>
      </bp-area>
    </bp-board>
  </body>
</html>
```

리소스 순서: Tailwind CDN → tailwind-config → bp-components → base.css (defer 불필요 — bp-components가 DOMContentLoaded에서 초기화)

---

## 보드 구조

```
<bp-board>                              ← 가로 Figma 보드 (한 파일에 1개)
  <bp-frame viewport="pc|mobile">       ← 정상 상태 프레임 (필수 1개)
    <bp-page>…정상 UI…</bp-page>
  </bp-frame>

  <bp-area>                             ← 상태 조각 영역 (0~N개)
    <bp-fragment id title description>  ← 개별 상태 조각 (1~N개)
      <bp-section …>…이 상태의 UI…</bp-section>
    </bp-fragment>
    <bp-fragment …>…</bp-fragment>      ← 같은 영역의 다른 상태
  </bp-area>

  <bp-area>…</bp-area>                   ← 다른 영역의 상태 조각
</bp-board>
```

- **정상 상태는 `<bp-frame>`** — pc/모바일 폭(1200/375px)으로 고정된 페이지 전체
- **예외·빈·에러·로딩 등 상태 조각은 `<bp-area>`** — 그 영역만 잘라낸 카드로 가로 나열
- `bp-area`가 자식 `bp-fragment`들을 자동으로 외곽 `bp-card`로 감싸고, 조각 사이에 `bp-separator`를 삽입한다
- `bp-fragment`는 `title`/`description`이 h3+p 헤더로 자동 prepend되고, **본문은 항상 `.bp-fragment-body` 박스(border+radius+padding)로 래핑**된다 — 조각 안에 다시 카드/보더 wrapper를 두지 말 것 (이중 박스)

### 상태 조각 배치 판단

| 상황 | 배치 |
|------|------|
| 주 상태(성공·정상 데이터) | `<bp-frame>` 안 `<bp-page>` |
| 같은 영역의 변형 (빈 목록·로딩·에러·권한 없음 등) | 해당 영역을 가리키는 `<bp-area>` 안에 `<bp-fragment>` 여러 개 |
| 서로 다른 영역의 상태를 모으고 싶을 때 | `<bp-area>`를 여러 개 둔다. 영역 구분은 각 fragment의 title/description으로 드러난다 |
| 버튼 hover·disabled 같은 컴포넌트 변형 | 정상 프레임에 흡수 (조각으로 분리하지 않는다) |

---

## 기능 설명 JSON

우측 rail은 **head 안의 `<script type="application/bp-description+json">`** 단 하나를 파싱해 자동 렌더한다. HTML 안에 `bp-description-*` 태그를 직접 쓰지 않는다.

### 스키마

```json
{
  "purpose": "화면의 목적 한 줄",
  "rules": ["화면 간 규칙 1", "규칙 2"],
  "sections": [
    {
      "feature": "DOMAIN__ID",
      "label": "기능명",
      "elements": [
        { "name": "요소명", "description": "이 요소가 하는 일" }
      ],
      "notes": ["확인 필요·TBD 항목"]
    }
  ]
}
```

| 필드 | 필수 | 설명 |
|------|:---:|------|
| `purpose` | - | 화면 레벨 목적. 짧게 한 줄. 생략 가능 |
| `rules` | - | 화면 간 비즈니스 규칙 배열. 기능명세 복붙 금지 — **화면 단위 규칙**만 |
| `sections` | Y | 기능 영역별 설명 배열. 최소 1개 |
| `sections[].feature` | Y | featureId (`DOMAIN__ID`). 메인 UI의 `bp-section data-feature`와 매칭 |
| `sections[].label` | Y | 표시명 — 메인 UI의 `data-label`과 일치시킨다 |
| `sections[].elements[]` | Y | 영역 내 각 UI 요소. `{name, description}` |
| `sections[].notes` | - | 화면명세 `## 비고` 항목만 옮김 (작업 메모·기능명세 rule 금지) |

`sections[].feature`는 도메인 축만 표현한다. 같은 `data-feature`를 가진 메인 UI `bp-section`이 여러 개여도 JSON section은 하나로 유지하고, 페이지 내 위치 구분은 HTML의 `data-feature-key`가 담당한다.

### 요소 흡수 원칙 (sections[].elements)

**한 영역의 다양한 상태 표현(빈·에러·로딩·권한 없음 등)은 모두 그 섹션의 element로 흡수**한다. 각 상태를 별도 section으로 분리하지 않는다.

```json
{
  "feature": "PROJECT__INFO",
  "label": "프로젝트 카드 그리드",
  "elements": [
    { "name": "프로젝트 카드", "description": "즐겨찾기 + 이름 + 저장소" },
    { "name": "빈 목록", "description": "프로젝트 0개일 때 예제 안내 + 새 프로젝트 버튼" },
    { "name": "저장소 에러", "description": "GitHub 권한 박탈·삭제 시 안내 카드" },
    { "name": "GitHub API 에러", "description": "저장소 정보 fetch 실패 시 다시 시도" }
  ],
  "notes": ["저장소 에러 카드 처리 정책 — 자동 숨김 vs 수동 정리 검토"]
}
```

→ 위 JSON 1 section에 대해 `<bp-area>` 안의 `<bp-fragment>`는 "빈 목록"·"GitHub API 에러" 등의 시각 조각으로 존재 (그림). JSON의 elements는 설명(글). 같은 feature를 **그림은 조각, 글은 element**로 동시에 기술한다.

### 작성 규칙

- JSON 본문에 HTML을 쓰지 않는다 (`<`, `>`는 JSON 문자열 안에서 그대로 사용 가능하지만, 태그 의도로 쓰지 말 것)
- `rules`·`notes`는 화면명세의 해당 섹션 항목만 옮긴다. 기능명세 rule 복붙·작업 메모 금지 (SSOT 위반)
- `sections[]` 순서는 시각적 우선순위에 맞춘다 (상단 → 하단, 좌 → 우)

---

## viewport

`<bp-frame viewport="pc|mobile">`의 값에 따라 폭이 고정된다.

| 값 | 폭 |
|----|----|
| `pc` (기본) | 1200px |
| `mobile` | 375px |

한 파일에 두 viewport를 섞지 않는다. 화면명세의 `viewport` 배열에 둘 다 있으면 파일을 **각각** 생성한다.

---

## 페이지 구조 — [`bp-page`](references/components/bp-page.md)

```
<bp-page>                              ← 최상위 셸 (중앙 정렬, min-height: 100vh)
  <bp-page-header>…</bp-page-header>   ← 고정 상단 (자유 슬롯)
  <bp-page-content>…</bp-page-content> ← 본문 (flex: 1)
  <bp-page-footer>…</bp-page-footer>   ← 고정 하단 (자유 슬롯)
</bp-page>
```

기본 max-width: 1200px (`--page-max-width`), 좌우 패딩: 1.5rem (`--page-padding-x`)

`<bp-frame>` 안에 `<bp-page>` 하나를 둔다. `<bp-fragment>` 안에서도 필요하면 `<bp-section>`만 두고 `<bp-page>`는 생략해도 된다 (조각은 영역만 잘라낸 것).

### 헤더·푸터 기본값

`<bp-page-header>`와 `<bp-page-footer>`는 둘 다 muted 톤의 단순 슬롯이다. **화면명세에 헤더/푸터에 대한 별도 명시가 없으면** 단순 placeholder로 둔다.

```html
<bp-page-header>header</bp-page-header>
...
<bp-page-footer>footer</bp-page-footer>
```

화면명세에 헤더/푸터의 구체 요소(로고·네비·검색·푸터 카피 등)가 명시된 경우에만 자유 슬롯으로 채운다. 임의로 그럴듯한 헤더를 그려넣지 않는다 (와이어프레임은 화면명세의 파생물).

---

## 기능 영역 — [`bp-section`](references/components/bp-section.md)

모든 기능 블록을 `<bp-section>`으로 감싼다.

```html
<bp-section data-feature="PRODUCT__INFO" data-feature-key="summary" data-label="상품 정보">
  <!-- UI -->
</bp-section>
```

| 속성 | 필수 | 설명 |
|------|:---:|------|
| `data-feature` | Y | featureId (`{DOMAIN}__{ID}`). JSON `sections[].feature`와 매칭 |
| `data-feature-key` | 메인 UI에서 Y | 페이지 내 슬롯 식별자. kebab-case. 핀 코멘트의 feature 앵커 위치를 구분 |
| `data-label` | Y | 표시명. JSON `sections[].label`과 일치 |

`data-element="X"` 속성은 JSON `elements[].name`과 매칭되어 우측 rail과 양방향 하이라이트되고, eye 버튼 locate의 타겟이 된다.

```html
<!-- 정상 프레임 — 일반 요소 -->
<bp-card>
  <bp-card-title data-element="프로젝트명">commerce-app</bp-card-title>
  <bp-card-description data-element="GitHub 저장소">acme-corp/commerce-app</bp-card-description>
</bp-card>

<!-- fragment — 정상 프레임에 없고 fragment에만 존재하는 요소도 data-element 필수 -->
<bp-fragment id="grid-empty" title="빈 목록" description="프로젝트 0개">
  <bp-empty data-element="빈 목록">
    <bp-empty-title>아직 프로젝트가 없습니다</bp-empty-title>
  </bp-empty>
</bp-fragment>
```

**핵심**: `elements[].name`은 HTML의 `data-element`와만 매칭된다. fragment의 `id`·`title`이 비슷해도 매칭되지 않으니, fragment-only 요소의 래퍼에도 반드시 `data-element`를 직접 붙인다.

### 페이지/fragment 배치 규칙

- 메인 UI의 `<bp-section>`은 `data-feature` + `data-feature-key`를 함께 가진다. 이 조합이 feature 핀 앵커가 된다.
- `<bp-fragment>` 내부의 `<bp-section>`은 `data-feature`만 가진다. rail 설명과 도메인 매칭용이며 별도 feature 핀 앵커를 만들지 않는다.
- 같은 `data-feature`를 메인 UI에서 여러 번 쓰는 것은 허용한다. 대신 `data-feature-key`를 서로 다르게 두고, JSON section은 하나로 유지한다.

---

## 파일 규칙

화면 폴더(`docs/screens/` 하위) 안의 `.html` 파일은 전부 와이어프레임으로 렌더링된다. 파일명은 플랫폼·화면명세 측 규약을 따른다.

한 파일 = 한 화면 = 한 viewport.

---

## 레이아웃

| 대상 | 방식 |
|------|------|
| 컴포넌트 내부 | 자동 (base.css) |
| 섹션 간 레이아웃 | Tailwind: `flex`, `grid`, `gap-*`, `p-*` |
| 인라인 조정 | `style="..."` |

---

## 디자인 토큰

| 변수 | 용도 |
|------|------|
| `--background` / `--foreground` | 페이지 배경·텍스트 |
| `--primary` / `--primary-foreground` | 주요 강조 (버튼) |
| `--muted` / `--muted-foreground` | 비활성·보조 텍스트 |
| `--destructive` / `--destructive-foreground` | 경고·삭제 |
| `--border` | 테두리 |
| `--radius` | 기본 border-radius (0.625rem) |

---

## 컴포넌트 빠른 참조

> 예제가 필요하면 태그명 링크를 따라가 **해당 섹션만** 읽는다. 전체 파일을 읽지 않는다.

### 보드/설명 (블루프린트 전용)
| bp 태그 | 역할 |
|---------|------|
| [`bp-board`](references/components/bp-board.md) | 가로 보드 (한 파일에 1개) |
| [`bp-frame`](references/components/bp-frame.md) | 정상 프레임 (`viewport` pc/mobile) |
| [`bp-area`](references/components/bp-area.md) | 상태 조각 영역 (`width`) |
| [`bp-fragment`](references/components/bp-fragment.md) | 개별 상태 조각 (`id`, `title`, `description`) |
| [JSON description](references/components/bp-descriptions.md) | `<script type="application/bp-description+json">` 스키마 |

### 아이콘 — [`bp-icon`](references/components/bp-icon.md)
`<bp-icon name="..." size="xs|sm|md|lg|xl|full">` — Lucide 이름 그대로 사용. 내장 아이콘 목록(60+개)과 사용 예제는 [레퍼런스](references/components/bp-icon.md) 참조.

### 폼 입력
| bp 태그 | 주요 prop |
|---------|-----------|
| `bp-button` | `variant`, `size` (default/xs/sm/lg/icon) |
| `bp-input` | 모든 `<input>` 속성 |
| [`bp-textarea`](references/components/bp-textarea.md) | `value`, `rows` (자식 텍스트 미지원) |
| `bp-label` | `for` |
| [`bp-field` 패밀리](references/components/bp-field.md) | field, field-group, field-set, field-legend, field-description, field-error |
| [`bp-checkbox`](references/components/bp-checkbox.md) | `checked` (`"indeterminate"` 지원) |
| [`bp-radio-group` + `bp-radio-item`](references/components/bp-radio-group.md) | group: `value`, `orientation` / item: `value` |
| `bp-switch` | `size` (default/sm) |
| [`bp-slider`](references/components/bp-slider.md) | `value`, `min`, `max`, `step` (단일 값) |
| `bp-native-select` | `size`. 자식: `<option>` |
| [`bp-select` 패밀리](references/components/bp-select.md) | trigger/value/content/item/group/label |
| [`bp-input-group` 패밀리](references/components/bp-input-group.md) | input/textarea/addon(align)/button/text |
| [`bp-input-otp` 패밀리](references/components/bp-input-otp.md) | `maxlength`, group/slot/separator |
| [`bp-combobox`](references/components/bp-combobox.md) | `value`, `placeholder` |

### 데이터 표시
| bp 태그 | 주요 prop |
|---------|-----------|
| [`bp-card` 패밀리](references/components/bp-card.md) | header/title/description/action/content/footer |
| `bp-badge` | `variant` (6종) |
| `bp-avatar` 패밀리 | `size` (sm/default/lg) — `rounded-*` 오버라이드 시 `after:rounded-*`도 같이 |
| `bp-separator` | `orientation` |
| [`bp-table` 패밀리](references/components/bp-table.md) | header/body/footer/row/head/cell/caption (소문자 colspan/rowspan) |
| [`bp-image`](references/components/bp-image.md) | `src`, `alt`, `aspect-ratio`, `fit`, `rounded`, `caption` |
| [`bp-calendar`](references/components/bp-calendar.md) | `mode`, `month`, `selected` |
| [`bp-chart-container`](references/components/bp-chart-container.md) | `type`, `data` (JSON) |

### 피드백
| bp 태그 | 주요 prop |
|---------|-----------|
| [`bp-alert` 패밀리](references/components/bp-alert.md) | `variant`. 아이콘 자동: default→`info`, destructive→`circle-x`. 생략 가능 |
| [`bp-sonner` + `bp-toast`](references/components/bp-sonner.md) | toast: `type` (6종). `toast()` 함수 미지원 |
| `bp-skeleton` | `class="h-* w-*"` |
| `bp-spinner` | `data-icon` |
| `bp-progress` | `value` (0-100) |
| [`bp-empty` 패밀리](references/components/bp-empty.md) | media/title/description/content |

### 오버레이 (`open` boolean으로 정적 표현)

오버레이 컴포넌트 (`bp-dialog`, `bp-sheet`, `bp-alert-dialog`) 는 **와이어프레임 전용 정적 카드**로 렌더된다. viewport 중앙에 고정되는 진짜 모달이 아니라, 부모 `bp-fragment` body 흐름 안에서 `mx-auto` 로 가로 중앙 정렬된 카드처럼 그려진다. 따라서:

- `<bp-fragment>` body 에 `<bp-dialog open>` 을 **직접** 배치한다. backdrop 흉내 용 `<div class="absolute inset-0 bg-black/20">` 같은 wrapper 로 감싸지 말 것 — 구 패턴 (컴포넌트가 `position: fixed` 였을 때 필요하던 우회) 이고 이제는 이중 박스만 만든다
- 한 페이지에 여러 오버레이를 동시에 `open` 해도 서로 겹치지 않고 각자 자기 fragment 안에 독립적으로 렌더된다
- 원칙: **1 fragment = 1 오버레이 상태**. 초기·전송중·에러 등 상태를 보이려면 fragment 를 분리한다 (같은 fragment 안에 같은 오버레이 2개 넣으면 grid-col 로 나란히는 보이지만 의미상 혼란)

| bp 태그 | 주요 prop |
|---------|-----------|
| `bp-dialog` 패밀리 | content: `show-close-button` |
| [`bp-alert-dialog` 패밀리](references/components/bp-alert-dialog.md) | content: `size`. action/cancel: `variant`. 닫기 X 없음 |
| [`bp-sheet` 패밀리](references/components/bp-sheet.md) | content: `side` (와이어프레임에서는 side 에 따라 `ml-auto` / `mr-auto` 등 부모폭 안 정렬로 표현됨) |
| [`bp-drawer` 패밀리](references/components/bp-drawer.md) | `direction` (vaul 드래그 미지원) |
| `bp-popover` 패밀리 | content: `side`, `align` |
| `bp-hover-card` 패밀리 | content: `side`, `align` |
| `bp-dropdown-menu` 패밀리 | content: `align`, `side` |
| `bp-context-menu` 패밀리 | 우클릭. dropdown-menu 동일 구조 |
| `bp-tooltip` 패밀리 | content: `side` |
| `bp-command` 패밀리 | input/list/empty/group/item |

### 내비게이션
| bp 태그 | 주요 prop |
|---------|-----------|
| [`bp-tabs` 패밀리](references/components/bp-tabs.md) | `defaultvalue` (소문자). list: `variant` |
| `bp-breadcrumb` 패밀리 | link: `href` |
| `bp-pagination` 패밀리 | link: `href`, `active` |
| [`bp-navigation-menu` 패밀리](references/components/bp-navigation-menu.md) | hover only (open prop 없음) |
| `bp-menubar` 패밀리 | click 메뉴 |
| [`bp-sidebar` 패밀리](references/components/bp-sidebar.md) | `collapsible`, `variant`, `side`. **`default-open="false"` 명시 안 하면 열린 채로 시작** |

### 레이아웃/유틸리티
| bp 태그 | 주요 prop |
|---------|-----------|
| [`bp-accordion` 패밀리](references/components/bp-accordion.md) | `type`, `collapsible`, `defaultvalue` (콤마 구분) |
| `bp-collapsible` 패밀리 | `open`, `disabled` |
| `bp-toggle` | `variant`, `size`, `pressed` |
| [`bp-toggle-group`](references/components/bp-toggle-group.md) | `type`, `variant`, `orientation` (spacing 미지원) |
| [`bp-carousel` 패밀리](references/components/bp-carousel.md) | `orientation`. item: `basis` (Embla/드래그 미지원) |
| [`bp-scroll-area`](references/components/bp-scroll-area.md) | scroll-bar: `orientation` |
| `bp-aspect-ratio` | `ratio` |
| `bp-kbd` | 키보드 단축키 표시 |

---

## 실전 팁

1. **오버레이 정적 표현**: `open` 속성만 추가하면 열린 상태 고정. trigger 불필요. 컴포넌트가 부모 흐름 안에 정적 카드로 렌더되므로 backdrop·중앙정렬 흉내용 wrapper div 는 **만들지 말 것** (이중 박스)
2. **bp-image 플레이스홀더**: `src` 생략 → 자동 플레이스홀더
3. **폼은 bp-field로 감싸기**: label + input은 항상 `<bp-field>` 안에
4. **Tailwind는 레이아웃만**: 컴포넌트 스타일링은 `bp-*`가 담당
5. **상태 조각은 필요한 것만**: 빈 목록·로딩·에러·권한 없음 중 실제 화면명세에 등장하는 것만 `<bp-fragment>`로
6. **메인 UI section은 항상 key 부여**: 조상에 `bp-fragment`가 없는 section은 단일 feature라도 `data-feature-key`를 생략하지 않는다

---

## 자주 하는 실수

| 실수 | 왜 문제인가 |
|------|------------|
| React/JSX 사용 | 순수 HTML + Custom Elements만 동작한다. iframe sandbox 환경 |
| `<script>` 로직 추가 | 와이어프레임은 정적 표현이다. 인터랙션은 상태 조각으로 대체 |
| `data-feature` 누락 | 플랫폼이 기능 영역을 인식할 수 없다. 하이라이트·코멘트 연동 불가 |
| 메인 UI `<bp-section>`에 `data-feature-key` 누락 | feature 핀 앵커가 슬롯을 식별할 수 없어 코멘트 위치가 깨진다. 단일 section이어도 strict하게 필수 |
| `<bp-fragment>` 내부 `<bp-section>`에 `data-feature-key` 추가 | fragment는 이미 `id`로 앵커가 정해져 있다. key를 붙이면 앵커 모델이 이중화되고 규약 위반 |
| 같은 페이지에서 `data-feature-key`를 재사용 | 동일 `data-feature`든 다른 `data-feature`든 위치 식별이 충돌한다. 페이지 전역 unique key를 써야 한다 |
| `asChild`, `render` 등 React 전용 기능 사용 | bp-* 컴포넌트는 Web Components이므로 미지원 |
| `bp-page` / 셸 CSS 임의 오버라이드 (`--page-max-width`, `--page-padding-x`, `body:has(bp-page)` padding, bp-page border/radius/min-height 등) | 모든 와이어프레임은 동일한 셸·여백을 가져야 한다. IDE/풀폭 같은 자체 판단으로 오버라이드하면 같은 스킬이 다른 결과를 낸다. 레이아웃은 `<bp-page-content>` 안쪽에서만 조정 |
| JSON description의 문자열 본문에 raw HTML 태그(`<iframe>`, `</body>` 등) 그대로 작성 | rail이 textContent로 렌더하므로 태그 그대로 보이긴 하지만 의도 전달이 지저분. 설명은 산문 문장으로 쓰고, 기호가 필요하면 ``` `` ``` 등 텍스트 기호를 쓴다 |
| `notes`에 기능명세 rule 복붙이나 작업 메모(TODO·mental note) 작성 | SSOT 위반 — rule은 기능명세에만 두고 notes는 화면명세의 `## 비고` 항목만 옮긴다. 작업 메모는 기획서에 올려 합의된 비고가 된 후에 렌더 |
| 한 영역의 상태 변형을 각각 별도 `<bp-section>`·`feature`·`section`으로 분리 | 같은 feature가 여러 번 등장해 rail이 중복되고 `data-feature` 매칭이 깨진다. **같은 영역의 변형은 하나의 section.elements로 흡수**하고, 시각 조각만 `<bp-area>`의 `<bp-fragment>`로 분리 |
| 정상 프레임에 `<bp-area>`나 `<bp-fragment>` 섞기 | 보드 구조 위반. 정상은 `<bp-frame>` 안 `<bp-page>`, 상태 조각은 `<bp-area>` 안 `<bp-fragment>`로 명확히 분리 |
| 한 파일에 `<bp-frame viewport="pc">`와 `<bp-frame viewport="mobile">` 둘 다 배치 | 한 파일 = 한 viewport. 화면명세 viewport가 둘 다면 파일 두 개를 만든다 |
| `<bp-dialog open>` / `<bp-sheet open>` / `<bp-alert-dialog open>` 을 `<div class="absolute inset-0 ... bg-black/20">` 같은 wrapper 로 감쌈 | 오버레이 컴포넌트는 부모 흐름 안에 정적 카드로 렌더된다 (viewport-fixed 아님). backdrop 흉내용 wrapper 는 이중 박스만 만들고, `bp-fragment` body 의 기본 보더·패딩과 시각 충돌을 일으킨다. fragment body 에 **직접** 배치할 것 |
| 한 `<bp-fragment>` 안에 `<bp-dialog open>` 을 여러 개 중첩 | 1 fragment = 1 오버레이 상태 원칙. 상태별(초기·전송중·에러) 이나 분기별 다이얼로그는 각자 별도 fragment (`edit-request-dialog`, `edit-request-dialog-submitting` 식) 로 분리 |
