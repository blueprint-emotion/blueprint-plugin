---
name: wireframe
version: 4.7.0
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
> **횡단 주제 레퍼런스**: `references/overlay-patterns.md` (오버레이 조각 패턴) · `references/html-closing-tags.md` (커스텀 엘리먼트 닫기) · `references/common-mistakes.md` (자주 하는 실수 체크리스트)
> **완성 예제 와이어프레임**: `references/example-product-detail.html` — 보드 패턴이 적용된 종합 참고용 샘플

### 참조 전략 (토큰 절약)

이 스킬은 **2단계 참조**로 설계되어 있다.

1. **이 파일의 빠른 참조 테이블**만으로 대부분의 와이어프레임을 작성할 수 있다. bp-* 는 shadcn/ui 1:1 포팅이므로 shadcn 지식을 그대로 적용한다.
2. shadcn과 차이가 있거나 composition이 복잡한 컴포넌트만 **링크를 따라가 `references/components/bp-X.md`** 한 파일을 읽는다. 링크가 없는 컴포넌트는 표만으로 충분하다 (shadcn과 동일).
3. 오버레이 조각을 그리기 전·커스텀 엘리먼트 닫기 경고를 볼 때·생성 후 리뷰 때는 해당 횡단 주제 레퍼런스 한 파일만 읽는다.

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
| `<Component />` self-closing | **HTML은 커스텀 엘리먼트 self-closing 미지원.** `<bp-component></bp-component>` 명시 닫기 사용. void 요소(`img`, `input`, `br`, `hr`, `meta`, `link`)만 `/>` 허용 |

### ⚠️ 커스텀 엘리먼트 닫는 태그 — HTML 규칙

HTML 은 커스텀 엘리먼트(`bp-*` 포함)의 self-closing(`/>`)을 **무시**한다 → 뒤 형제 요소들이 자식으로 삼켜져 레이아웃 파괴. void 요소(`img`/`input`/`br`/`hr`/`meta`/`link` 등)만 `/>` 허용하고, **`bp-*` 포함 그 외 모든 태그는 명시적 `</tag>` 필수**. 파싱 시나리오·예제·전체 void 목록은 [`references/html-closing-tags.md`](references/html-closing-tags.md) 참조.

```html
<!-- ❌ -->  <bp-input id="password" />
<!-- ✅ -->  <bp-input id="password"></bp-input>
```

IDE 의 "일부 브라우저에서 빈 태그가 작동하지 않습니다" 경고 = 정확히 이 케이스.

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

## 생성 전략 — 기능별 단계 진행 (필수)

와이어프레임은 한 번의 Write 로 통째 만들지 않는다. 화면 크기와 무관하게 **항상 기능 그룹 단위로 점진 생성** 한다 (Read → Edit → Read → Edit ...).

```
스테이지 1 — 레이아웃 + 디폴트 화면
  ├─ HTML 템플릿 (head + Tailwind CDN + bp-components + base.css)
  ├─ JSON description 골격 (sections 배열에 모든 feature 의 {feature, label, elements: []})
  └─ <bp-board> > <bp-frame> > <bp-page> > 모든 feature 의 정상 시각 <bp-section>

스테이지 2 — 기능 그룹 1 (예: 이미지)
  ├─ JSON description 의 PRODUCT__GALLERY elements 6 체크리스트로 채움
  └─ <bp-area data-feature="PRODUCT__GALLERY"> > 그 feature 의 fragment 들 (gallery-empty, ...)

스테이지 3 — 기능 그룹 2 (예: 옵션·구매)
  ├─ JSON elements 채움 + 시트/다이얼로그 fragment 도 같은 area 에
  └─ <bp-area data-feature="PRODUCT__OPTION"> > option-sheet, purchase-sold-out, ...

... 스테이지 N 까지 같은 패턴
```

**상품 상세 (표준 5 단계)**: ① 레이아웃+디폴트 → ② 이미지(GALLERY) → ③ 옵션·구매(OPTION) → ④ 리뷰(REVIEW) → ⑤ 문의(QNA)

**왜**:
- 한 응답 안에 메인 + 모든 fragment + 모든 elements 디테일을 다 담으면 출력 한계·디테일 누락이 잦다
- 기능 단위로 묶으면 한 스테이지가 자기완결적 (정상 + 변형 + rail 6 체크리스트가 같이 옴) → SSOT·매칭 검증 쉬움
- 시트/다이얼로그 fragment 는 그 feature 의 변형이므로 (`bp-area` 가 기능 단위), 같은 스테이지에서 추가하면 자연스럽게 묶임

**규약**:
- 스테이지 1 끝 시점: 메인 시각 + JSON sections 골격 (elements 빈 배열) 모두 존재
- 스테이지 2~N 각각: 그 그룹의 (a) JSON elements 가 6 체크리스트로 채워지고, (b) 해당 feature 의 fragment 들이 `<bp-area>` 안에 모두 있고, (c) 메인 시각 보강 필요하면 같이
- 스테이지 사이에 직전 파일을 Read 하고 Edit 으로 추가 (Write 로 통째 재작성 X — 직전 결과 유실)
- 단일 feature 만 있는 화면도 동일하게 ① 레이아웃+디폴트 → ② 그 feature 그룹 의 두 스테이지로 진행 (스킵 X)

리뷰어 호출은 모든 스테이지 종료 후 한 번 (오케스트레이터 주도). 스테이지별 자체 검증은 wireframer 내부 자기점검만.

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

### bp-area 묶음 = 기능(featureId) 단위 ⚠️

**조각은 컴포넌트 종류(시트/다이얼로그/알랏)로 묶지 않는다. 항상 `data-feature` 단위로 묶는다.**

```
✅ <bp-area>                                    ← PRODUCT__OPTION 의 모든 변형
     <bp-fragment id="option-sheet">…</bp-fragment>           (sheet)
     <bp-fragment id="purchase-sold-out">…</bp-fragment>      (alert UI)
     <bp-fragment id="purchase-option-error">…</bp-fragment>  (form error)
     <bp-fragment id="size-guide-dialog">…</bp-fragment>      (dialog)
     <bp-fragment id="already-in-cart">…</bp-fragment>        (alert-dialog)
   </bp-area>

❌ <bp-area>                                    ← "시트 모음" — 절대 금지
     <bp-fragment id="option-sheet">…</bp-fragment>     (PRODUCT__OPTION)
     <bp-fragment id="qna-write-sheet">…</bp-fragment>  (PRODUCT__QNA)  ← 다른 feature 가 섞임
   </bp-area>
```

**왜**: 우측 rail · 코멘트 핀 앵커 · 검토자 시선이 모두 feature 축으로 정렬되기 때문이다. 컴포넌트 종류로 묶으면 "옵션 시트" 와 "문의 시트" 가 한 카드 안에 섞여 무관한 변형을 함께 보게 된다.

### bp-area viewport 속성

`<bp-area viewport="mobile">` 로 모바일 와이어프레임에서는 영역 폭이 370px 로 좁아진다 (default 560px = pc). 모바일 와이어 파일 안의 모든 `<bp-area>` 에 명시할 것.

| viewport | 폭 |
|---|---|
| `pc` (기본) | 560px |
| `mobile` | 370px |

명시적 `width="..."` 속성이 있으면 그 값이 우선한다.

### 상태 조각 배치 판단

| 상황 | 배치 |
|------|------|
| 주 상태(성공·정상 데이터) | `<bp-frame>` 안 `<bp-page>` |
| 같은 영역의 변형 (빈 목록·로딩·에러·권한 없음 등) | **같은 featureId 의 `<bp-area>`** 안에 `<bp-fragment>` 여러 개 |
| 다른 영역의 상태 | **feature 별로 별도 `<bp-area>`** (시트/다이얼로그 종류로 묶지 말 것) |
| 버튼 hover·disabled 같은 컴포넌트 변형 | 정상 프레임에 흡수 (조각으로 분리하지 않는다) |

### description 의 두 자리 — 자세히는 rail, 짧게는 fragment ⚠️

description 은 두 곳에 들어가는데 **자세함의 책임이 정반대**다.

| 위치 | 어디에 보이는가 | 길이 | 무엇을 담나 |
|------|----------------|:---:|------|
| **JSON `sections[].elements[].description`** (디스크립션 페널) | 우측 sticky rail | **자세히** | 트리거·사전조건·시각차이·액션·닫힘·사이드이펙트 |
| **`<bp-fragment description="...">`** (조각 헤더) | 와이어 본문 위 h3+p | **짧게 (한 줄)** | 이 조각이 "무엇" 인지 — 상태 식별만 |

**왜 이렇게 나뉘는가**:
- rail 은 검토자가 와이어를 보지 않고도 동작을 이해해야 하는 SSOT 다 — element 단위로 모든 상세 동작이 들어간다
- fragment description 은 와이어 옆에 같이 보이므로 "이 그림이 어떤 상태인지" 만 한 줄로 식별 → 본문 시각이 나머지를 설명한다
- 같은 상세를 두 곳에 쓰면 SSOT 가 깨지고 fragment 헤더가 시각을 가려 와이어 가독성이 떨어진다

#### JSON elements description 6 체크리스트

각 element description 은 다음을 모두 포함:

1. **트리거 / 진입 조건** — 어떤 사용자 행동·상태에서 이 element 가 활성화 / 노출되는가
2. **사전 조건** — 비로그인·권한 없음·재고 0 같은 컨텍스트
3. **시각 차이** — 정상과 무엇이 다른가 (대체된 영역, 추가/제거된 요소)
4. **사용자가 할 수 있는 액션** — CTA, 닫기 방법, 다음 화면
5. **닫힘·복귀 조건** — Esc / 외부 클릭 / 명시적 버튼 / 자동 사라짐
6. **데이터 사이드이펙트** — 제출 시 무엇이 변하는가, 취소 시 입력은 폐기되는가

```jsonc
// ❌ 너무 짧음 — 동작 전반이 빠짐
{ "name": "장바구니 중복 확인 알랏", "description": "장바구니에 같은 옵션 있을 때" }

// ✅ 충분 — rail 한 줄로 동작 전체를 이해
{
  "name": "장바구니 중복 확인 알랏",
  "description": "이미 장바구니에 같은 옵션의 상품이 담겨 있는 상태에서 '장바구니' 버튼 클릭 시 노출. '추가 담기' 시 기존 라인의 수량이 +1, '취소' 시 변동 없이 닫힘. 명시적 선택을 강제하기 위해 X 버튼이 없고 외부 클릭/Esc 로도 닫히지 않는다."
}
```

#### bp-fragment description 은 짧게

조각 헤더는 **한 줄·30자 내외** 로 상태만 식별한다.

```html
<!-- ❌ 와이어 위에 본문보다 긴 설명 박힘 -->
<bp-fragment id="purchase-already-in-cart-alert"
  title="장바구니 중복 확인 알랏"
  description="이미 장바구니에 같은 옵션의 상품이 담겨 있는 상태에서 '장바구니' 버튼 클릭 시 노출.
              '추가 담기' 시 기존 라인의 수량이 +1, '취소' 시 변동 없이 닫힘.
              명시적 선택을 강제하기 위해 X 버튼이 없고 외부 클릭/Esc 로도 닫히지 않는다."
>

<!-- ✅ 한 줄 식별. 상세는 JSON elements 의 같은 이름 element 에 들어가 있다 -->
<bp-fragment id="purchase-already-in-cart-alert"
  title="장바구니 중복 확인 알랏"
  description="이미 같은 옵션이 장바구니에 있을 때 '장바구니' 클릭"
>
```

조각 description 이 두세 줄을 넘어가면 그 내용은 JSON elements 로 옮긴다. fragment 안의 시각(`data-element` 가 붙은 노드) 이 어떤 동작을 하는지는 rail 을 통해 알 수 있어야 한다.

---

## 기능 설명 JSON

우측 rail 은 `<head>` 안 **`<script type="application/bp-description+json">`** 하나를 파싱해 자동 렌더한다 (한 파일에 1개). HTML 안에 `bp-description-*` 태그를 직접 쓰지 않는다. 스키마·매칭 규칙·eye 버튼 동작·요소 흡수 원칙·rules/notes 출처 규칙은 모두 [`references/components/bp-descriptions.md`](references/components/bp-descriptions.md) SSOT.

**핵심 매칭 축** (이것만 틀리면 rail 전체가 어긋남):
- JSON `sections[].feature` ↔ HTML `<bp-section data-feature>` (도메인)
- JSON `sections[].label` ↔ HTML `<bp-section data-label>` (표시명)
- JSON `elements[].name` ↔ HTML `data-element` (요소 단위 — 오직 `data-element` 속성으로만 매칭. 타이틀 textContent·fragment id·title 로는 매칭 안 됨)

**요소 흡수**: 한 영역의 상태 변형(빈·에러·로딩 등) 은 모두 그 section 의 `elements` 로 흡수한다. 같은 feature 를 여러 section 으로 쪼개지 않는다 (rail 중복). 시각은 `<bp-fragment>` 여러 개로 분리하되 JSON section 은 하나.

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

모든 기능 블록을 `<bp-section data-feature data-feature-key data-label>` 으로 감싼다. 속성 상세는 레퍼런스.

```html
<bp-section data-feature="PRODUCT__INFO" data-feature-key="summary" data-label="상품 정보">
  <bp-card-title data-element="상품명">샘플 상품</bp-card-title>
  <p data-element="판매가">36,000원</p>
</bp-section>

<!-- fragment-only 요소도 data-element 필수. fragment id·title 로는 매칭 안 됨 -->
<bp-fragment id="grid-empty" title="빈 목록">
  <bp-empty data-element="빈 목록">…</bp-empty>
</bp-fragment>
```

### ⚠️ 오버레이 안 `data-element` — 판정 기준 2 개 + 작성 절차

오버레이(`bp-dialog` / `bp-sheet` / `bp-alert-dialog`) 안에서 `data-element` 를 어디에 붙일지 결정하는 건 **"JSON 이름이 오버레이 전체 상태를 가리키나, 안쪽 특정 위젯을 가리키나"** 에 달렸다.

| JSON `elements[].name` 이 가리키는 것 | `data-element` 를 붙일 곳 | 예시 이름 |
|---|---|---|
| 오버레이 **전체의 상태·안내·에러·결과** | 바깥 `<bp-dialog open>` / `<bp-alert-dialog open>` wrapper | "발송 완료 안내", "네트워크·서버 오류", "인증 실패 에러", "로그아웃 확인" |
| 오버레이 **안의 특정 위젯**(클릭·입력) | 그 위젯 노드 | "재설정 메일 보내기 버튼", "이메일 입력 필드", "닫기 버튼" |

```html
<!-- ❌ JSON "발송 완료 안내" 는 다이얼로그 전체 상태인데 안내 텍스트에만 걸림 → eye 버튼이 한 줄만 잡음 -->
<bp-dialog open>
  <bp-dialog-description data-element="발송 완료 안내">…</bp-dialog-description>
</bp-dialog>

<!-- ✅ 바깥 wrapper 에 → 다이얼로그 카드 전체가 하이라이트 -->
<bp-dialog open data-element="발송 완료 안내">…</bp-dialog>
```

JSON 이름에 "… 안내" / "… 오류" / "… 에러" / "… 확인" / "… 결과" 가 들어 있으면 거의 항상 wrapper 쪽이 정답.

**작성 절차 (반드시)**: `data-element` 값은 손으로 다시 쓰지 말고 JSON `elements[].name` 에서 **복사해 붙여넣는다**. HTML 을 먼저 쓰고 JSON 을 끼워맞추면 drift 가 누적된다. 특히 wrapper 가 `<bp-alert-dialog>` 라고 `data-element="X 알랏"` 으로 접미사를 자동으로 붙이는 실수가 반복되는데, 종류 접미사(`알랏`·`다이얼로그`·`시트`) 는 **JSON·HTML 양쪽에 동일하게** 유지하거나 양쪽 다 생략한다.

```jsonc
// ❌ 한쪽만 접미사 — 매칭 실패
{ "name": "이메일 형식 오류" }        // JSON
<bp-alert-dialog open data-element="이메일 형식 오류 알랏">…</bp-alert-dialog>

// ✅ 둘 다 동일. 접미사 유무는 자유, "한 쪽만" 은 금지
{ "name": "이메일 형식 오류" }
<bp-alert-dialog open data-element="이메일 형식 오류">…</bp-alert-dialog>
```

나머지 케이스(반대 방향·textContent 의존·종합 예제) 는 [`references/overlay-patterns.md`](references/overlay-patterns.md) 참조.

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

오버레이(`bp-dialog` / `bp-sheet` / `bp-alert-dialog`) 는 부모 `bp-fragment` body 흐름 안에 정적 카드로 렌더된다 (viewport-fixed 모달 아님). `<bp-fragment>` body 에 `<bp-dialog open>` 을 **직접** 배치 — backdrop 흉내용 wrapper div 금지. **1 fragment = 1 오버레이 상태**.

조각으로 그릴 때 자주 어긋나는 세 가지 — **(a) 스택 상황 (다이얼로그 위에 알랏) 은 얹힌 것만 단독, (b) 변형은 온전한 오버레이 전체, (c) data-element 매칭 실패 4가지 원인** — 은 [`references/overlay-patterns.md`](references/overlay-patterns.md) 에 상세. 조각 작성 전 한 번 훑어볼 것.

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

체크리스트는 [`references/common-mistakes.md`](references/common-mistakes.md) 로 분리했다 (구조·앵커 / 보드·조각 / 오버레이 / HTML·CSS / JSON). 생성 전·리뷰 시 한 번 훑어본다. 핵심 3가지만 짚고 넘어가자면:

- `data-feature` + `data-feature-key` (메인 UI 필수) + `data-label` 을 빠뜨리지 않는다 (핀 앵커·rail 매칭 축)
- `<bp-fragment>` 안에 `<bp-dialog open>` 을 **직접** 배치 (backdrop wrapper 금지), 1 fragment = 1 오버레이 상태
- 커스텀 엘리먼트는 `<bp-component></bp-component>` 명시 닫기 — self-closing `/>` 금지
