---
name: flowframe-wireframe
description: 마크다운 화면 명세와 기능 명세를 읽어 FlowFrame 호환 HTML 와이어프레임을 생성한다. docs/screens/*/index.md에서 레이아웃을, docs/features/**/index.md에서 UI 요소를 읽은 뒤, 각 screen 폴더 안에 와이어프레임 HTML 파일을 생성하거나 업데이트한다. "wireframe", "와이어프레임", "화면 설계", "화면 그려줘", "HTML로 변환", "와이어프레임 업데이트", "wireframe update", "기획서로 화면 만들어줘" 등의 표현이 나오면 이 스킬을 사용한다.
license: MIT
metadata:
  author: flowframehq
  version: "3.2.0"
---

# FlowFrame 와이어프레임 생성기

화면 명세와 기능 명세로부터 단일 파일 HTML 와이어프레임을 생성한다.
출력물은 FlowFrame에 바로 업로드하여 플로우 리뷰와 팀 코멘트에 사용할 수 있다.
와이어프레임은 기획자, 디자이너, 개발자가 구현 전에 검토하는 리뷰 산출물이다.

## 프로젝트 구조

이 스킬은 사용자 프로젝트에 아래 파일 구조를 기대한다:

```
project/
└── docs/
    ├── features/              ← 기능 명세 (폴더 기반, 재귀 구조)
    │   ├── auth/
    │   │   ├── index.md       ← 하위 feature + 자체 elements 모두 가능
    │   │   ├── login-form/
    │   │   │   └── index.md
    │   │   └── social-login/
    │   │       └── index.md
    │   └── comments/
    │       └── index.md
    ├── screens/               ← 화면 명세 (화면별 폴더)
    │   ├── LOGIN/
    │   │   ├── index.md
    │   │   └── wireframe.html
    │   └── EDITOR/
    │       ├── index.md
    │       ├── wireframe-pc.html
    │       └── wireframe-mobile.html
```

와이어프레임은 각 screen 폴더 안에 위치한다. `docs/features/`나 `docs/screens/`가 없으면 먼저 명세를 작성하라고 안내한다 (`flowframe-spec` 스킬 추천).

## 입력 파일

### 화면 명세 (docs/screens/*/index.md)

화면은 **폴더** 단위이며 `index.md`를 가진다. 레이아웃과 feature 참조를 정의한다. frontmatter:

```yaml
---
screenId: LOGIN
title: 로그인
purpose: 사용자가 서비스에 로그인하는 화면
viewport: pc
---
```

본문에는 `[@경로](../../features/경로/index.md)` 링크로 feature를 참조하는 레이아웃이 들어간다 (screen이 폴더 안이므로 `../../` 상대 경로). 예: `[@auth/login-form](../../features/auth/login-form/index.md)`.

### 기능 명세 (docs/features/**/index.md)

feature는 재귀적 폴더 구조를 사용한다. 각 feature는 `index.md`를 가진 **폴더**다.

모든 feature는 동일한 구조를 가진다:
- `elements`가 있으면 — 이 레벨에 와이어프레임 요소가 있다 → 렌더링 대상
- `features`(하위)가 있으면 — 자식 feature가 있다 → 재귀 탐색
- 둘 다 가질 수도 있고, 하나만 가질 수도 있다

이 스킬은 재귀적으로 모든 feature를 순회한다. `elements`가 있으면 해당 요소를 렌더링하고, `features`가 있으면 하위로 재귀 탐색한다. 하위 feature는 해당 feature 폴더 내 `index.md`를 가진 하위 디렉토리를 스캔하여 발견한다.

**featureId**는 경로 파생값이며 frontmatter에 쓰지 않는다:
- `docs/features/` 이후 경로를 취한다
- `/index.md`를 제거한다
- 각 폴더명의 kebab-case를 UPPER_SNAKE_CASE로 변환한다
- 깊이 구분자로 `__` (이중 밑줄)을 사용한다
- 예: `docs/features/auth/login-form/index.md` → `AUTH__LOGIN_FORM`

feature frontmatter:

```yaml
---
label: 댓글
type: section
usedIn:                              # 이 feature가 렌더링되는 screen 목록
  - docs/screens/EDITOR/index.md
  - docs/screens/DASHBOARD/index.md
---
```

`usedIn`은 이 feature가 직접 또는 상위를 통해 렌더링되는 모든 screen을 포함한다. 부분 업데이트 시 영향 화면을 찾는 데 사용한다.

**참조 에러**: 화면 명세가 참조하는 feature에 `elements`도 없고 하위 `features`도 없으면, 중단하고 사용자에게 명세를 보완하라고 안내한다.

`## 와이어프레임 요소` 섹션에 해당 feature 블록에 렌더링할 UI 요소가 나열된다:

```markdown
## 와이어프레임 요소

| 요소 | type | 설명 |
|------|------|------|
| 댓글 목록 | list | 작성자, 시간, 내용 표시 |
| 댓글 입력 | input | 텍스트 입력 영역 |
| 등록 버튼 | button | 댓글 등록 |
```

`## 와이어프레임 요소`를 주요 렌더링 소스로 읽는다.
리뷰어가 와이어프레임을 이해하는 데 필요하면 `## 상태`, `## 인터랙션`도 함께 참고한다:
- 메타데이터 `description` 보강
- 대표 상태, 비활성 액션, 확인 단계, 빈 상태, 로딩, 에러 표시 등 리뷰에 영향을 주는 케이스 노출

`## 비즈니스 로직`이나 `API`를 직접 UI로 변환하지 않는다. 화면/명세에서 명시적으로 표시를 요구하는 경우만 예외.
모든 화면은 최소 하나의 feature를 참조해야 한다.

### `## 와이어프레임 요소` 섹션이 없는 경우

참조된 feature md에 `## 와이어프레임 요소` 섹션이 없거나 유효한 행이 없을 때:

- 하위 `features`가 있으면 → 재귀 탐색을 계속한다. 상위 feature에 `elements`가 없어도 정상이다
- 하위 `features`도 없으면 → 중단하고 사용자에게 어떤 요소가 들어가야 하는지 질문한다. 다른 섹션에서 추측하면 명세와 맞지 않는 와이어프레임이 나온다
- 해당 feature에 화면 전체가 의존하고 하위에서도 렌더링할 것이 없으면, 부분 결과를 출력하지 말고 전체 생성을 중단한다

## 와이어프레임 생성

**한 화면씩 순차 처리한다.** 여러 화면이 대상이어도 한 화면의 와이어프레임을 완성한 뒤 다음 화면으로 넘어간다. 동시에 여러 화면을 병렬 진행하지 않는다. 대상 화면이 여러 개이면 목록을 보여주고 처리 순서를 확인한 뒤 첫 번째 화면부터 시작한다.

### 최초 생성 (2-pass, 점진적)

**⚠️ feature md를 한꺼번에 읽지 않는다.** Pass 1에서 HTML 골격을 먼저 완성하고, Pass 2에서 feature를 트리 순회하며 채운다. 메타데이터는 모든 feature 처리 후 한 번에 작성한다.

```
Pass 1 — 레이아웃 골격 (feature md를 읽지 않는다):
  1. 화면 md 읽기 → 레이아웃 영역과 feature 위치 파악
  2. 디자인 가이드 + 레이아웃 가이드 읽기 (병렬 가능)
  3. HTML 파일 작성:
     - 전체 <head> (Tailwind, 다크모드 설정, 빈 features 배열의 메타데이터)
     - body 레이아웃 구조 및 영역 컨테이너
     - 화면 명세에 명시된 고정 영역만 렌더링
     - feature 위치는 빈 플레이스홀더 컨테이너로 표시:
       <!-- Feature: FEATURE_ID (cart-items/index.md) -->
       <div data-feature-id="{FEATURE_ID}" data-feature-label="{label}" class="p-4">
         <span class="text-sm text-zinc-400">Loading feature...</span>
       </div>

Pass 2 — 트리 순회로 feature 채우기:
  화면 명세의 레이아웃 순서대로 최상위 feature를 순차 처리한다.
  각 feature에 대해 아래 트리 순회 프로토콜을 적용한다.
```

#### 트리 순회 프로토콜

feature 트리를 재귀적으로 탐색한다. 각 노드에서:

```
1. 분류 — feature index.md 읽기:
   - leaf (elements만 있음) → 2단계로
   - branch (하위 features만 있음) → 3단계로
   - hybrid (elements + 하위 features) → 2단계 후 3단계로
   - 둘 다 없음 → 중단, 사용자에게 명세 보완 안내

2. 렌더링 — leaf 또는 hybrid의 자체 elements 처리:
   a. UI 패턴 결정:
      `## 인터랙션`에 명시된 선택/전환 메커니즘(라디오, 탭, 토글 등)이
      이 feature의 제품 UI 패턴이다. HTML 작성 전에 결정한다.
      같은 역할의 내비게이션을 이중으로 렌더링하지 않는다.
      리뷰 탭(형제 상태 비교 도구)과 제품 UI 탭(사용자 내비게이션)을 혼동하지 않는다.
   b. `## 와이어프레임 요소`를 주요 UI 소스로 추출
   c. `## 상태`, `## 인터랙션`에서 리뷰어에게 보여야 할 케이스 파악
   d. 플레이스홀더를 렌더링된 UI 요소로 교체 (HTML Edit)
   e. 인라인 검증 (이 feature만):
      - 방금 쓴 data-feature-id가 HTML에 존재하는지 (grep 1회)
      - 방금 쓴 data-feature 값들이 해당 컨테이너 안에 있는지 (grep 1회)
      - 실패 시 즉시 수정

3. 재귀 — branch 또는 hybrid의 하위 features 처리:
   a. 하위 feature 폴더를 스캔하여 목록 확인
   b. 각 하위의 index.md를 읽어 leaf/branch/hybrid 분류:
      - 형제 중 leaf만 있는 그룹 → 병렬 읽기 가능
      - 형제 중 branch/hybrid가 있으면 → 해당 노드는 순차 진입 (각각이 다시 재귀)
      - 혼합된 경우: leaf 형제들을 먼저 병렬 처리, 이후 branch/hybrid를 순차 처리
   c. 모든 하위 처리 완료 후 상위로 복귀
```

**병렬 읽기 규칙**: leaf끼리만 병렬, branch/hybrid는 순차. 이 규칙은 깊이와 무관하게 모든 재귀 레벨에서 동일하게 적용한다. 이유: leaf는 읽고 즉시 렌더링하면 끝나지만, branch는 재귀 진입이 필요해 병렬 시 HTML 삽입 순서가 꼬인다.

**참고**: 최상위 feature 간에는 병렬 읽기를 하지 않는다. 레이아웃 순서대로 하나씩 처리해야 HTML 골격 위의 올바른 위치에 삽입된다.

#### 메타데이터 후행 일괄 작성

Pass 2에서는 DOM만 채운다. 메타데이터 `features` 배열은 **모든 feature 처리 완료 후** 한 번에 작성한다.

```
Pass 2 완료 후:
  1. 처리한 모든 feature의 메타데이터를 features 배열로 조립 (재귀 구조 유지)
  2. HTML <head>의 빈 features 배열을 완성된 배열로 교체 (Edit 1회)
  3. 최종 검증:
     - 메타데이터 featureId 중복 없음 확인 (grep 1회)
     - 메타데이터 features 개수와 DOM data-feature-id 개수 일치 확인 (grep 1회)
     - 불일치 시 수정
```

이렇게 하면 feature가 N개여도 메타데이터 Edit는 1회, 최종 검증은 grep 2회로 고정된다. feature별 인라인 검증이 DOM 정합성을 이미 보장하므로 전체 파일 재읽기가 불필요하다.

### 업데이트 (사용자 요청 시)

명세 변경 후 사용자가 업데이트를 요청하면, `flowframe-spec`의 `Wireframe Handoff` 계약을 참고한다.

액션 규칙:
- `partial-update`: 기존 레이아웃, 기존 feature 구조가 유지된 상태에서 요소 내용만 변경됨
- `screen-regenerate`: 화면 레이아웃 변경, feature 추가/제거, feature 계층 구조 변경
- `full-regenerate`: 여러 화면에 걸친 구조 리팩터링

#### 부분 업데이트

```
1. 변경된 feature md 파일 찾기
2. 변경된 feature의 `## 와이어프레임 요소` 읽기
3. 변경된 리뷰 케이스가 있을 때만 `## 상태`와 `## 인터랙션` 읽기
4. feature의 `usedIn` 필드로 영향받는 화면 찾기
5. 영향받는 와이어프레임을 보여주고 확인 요청
6. 사용자 확인 후, 해당 HTML 영역과 메타데이터만 업데이트
```

관련 없는 feature를 다시 읽으면 컨텍스트가 낭비되고 의도치 않은 편집이 생길 수 있다. 화면 명세 재읽기는 `screen-regenerate`나 `full-regenerate`에서만 수행한다.

#### 화면 재생성 / 전체 재생성

```
1. 핸드오프 요약이나 사용자 요청에서 대상 화면 범위 파악
2. 재생성 범위를 보여주고 확인 요청
3. 대상 화면마다 최초 생성 워크플로우 다시 실행
4. 해당 와이어프레임 HTML 파일 덮어쓰기
```

**새 요소 추가**: `partial-update` 중 `## 와이어프레임 요소` 테이블에 새 행이 추가됐으면, 새 UI를 렌더링하고 메타데이터의 해당 feature `elements` 배열에 엔트리를 추가한다. feature 자체가 추가되거나 삭제된 경우는 `partial-update`가 아니라 `screen-regenerate`다.

**중요**: 업데이트 전에 반드시 사용자 확인을 받는다. 사용자가 특정 와이어프레임을 제외할 수 있다.

### 다중 뷰포트 화면

화면 명세에 `viewport: [pc, mobile]`이 있으면 뷰포트별로 **별도 HTML 파일**을 생성한다:

- 단일 뷰포트: `docs/screens/{SCREEN_NAME}/wireframe.html`
- 다중 뷰포트: `docs/screens/{SCREEN_NAME}/wireframe-pc.html` (`## 레이아웃 (PC)`에서)
- 다중 뷰포트: `docs/screens/{SCREEN_NAME}/wireframe-mobile.html` (`## 레이아웃 (Mobile)`에서)

각 파일은 메타데이터 `viewport` 필드에 `"pc"` 또는 `"mobile"`을 설정한다.

### 전체 재생성

사용자가 "전부 다시 만들어줘"나 "regenerate all wireframes"라고 하면:

```
1. 모든 docs/screens/*/index.md 파일 나열
2. 목록을 보여주고 확인 요청
3. 각 화면마다 최초 생성(2-pass) 워크플로우 실행
4. 기존 와이어프레임 HTML 덮어쓰기
```

## 출력: HTML 구조

### FlowFrame 메타데이터

`<head>`에 배치한다 — FlowFrame이 업로드 시 검증하는 부분:

```json
{
  "generator": "flowframe-wireframe-skill",
  "version": "1.2",
  "screenId": "SCREEN_ID",
  "title": "화면 제목",
  "purpose": "이 화면의 목적 설명",
  "features": [
    {
      "featureId": "AUTH",
      "label": "인증",
      "spec": "../../features/auth/index.md",
      "features": [
        {
          "featureId": "AUTH__LOGIN_FORM",
          "label": "로그인 폼",
          "spec": "../../features/auth/login-form/index.md",
          "elements": [
            {
              "id": "FEATURE_AUTH__LOGIN_FORM_EMAIL",
              "type": "input",
              "label": "이메일",
              "description": "사용자가 로그인 시 사용할 이메일 주소를 입력하고 형식 오류를 확인하는 입력 필드"
            }
          ]
        }
      ]
    }
  ]
}
```

#### 최상위 필드

필수: `generator` (고정 `"flowframe-wireframe-skill"`), `version` (`"1.2"`), `screenId`, `title`, `purpose`, `features` (1개 이상).

선택: `author`, `viewport` (`"pc"` | `"mobile"`).

#### `features[]` 필드 (재귀)

| 필드 | 필수 | 설명 |
|------|------|------|
| `featureId` | Yes | 경로 파생 ID (kebab → UPPER_SNAKE, `__`로 깊이 구분) |
| `label` | Yes | feature 표시명 (한국어, frontmatter `label` 값) |
| `spec` | Yes | 와이어프레임에서 feature `index.md`까지의 상대 경로 |
| `elements` | 선택 | 추적 요소 배열 (1개 이상). `elements`와 `features` 중 최소 하나 필요 |
| `features` | 선택 | 하위 feature 배열 (재귀). `elements`와 `features` 중 최소 하나 필요 |

#### `elements[]` 필드

| 필드 | 필수 | 설명 |
|------|------|------|
| `id` | Yes | `FEATURE_{featureId}_{ELEMENT_ID}` |
| `type` | Yes | 요소 타입 (input, button, text, table, list 등) |
| `label` | Yes | 요소 표시명 (한국어) |
| `description` | Yes | 리뷰어를 위한 기능적 역할 설명 |

와이어프레임이 `docs/screens/{SCREEN}/` 안에 있으므로 `spec` 경로는 보통 `../../features/`로 시작한다.

와이어프레임은 리뷰 산출물이므로, 요소 `description`은 리뷰어가 명세를 열지 않고도 의도를 이해할 수 있어야 한다 — 요소가 보여주거나 받는 내용, 지원하는 액션, 이 화면에서의 비즈니스 맥락을 포함한다.

좋은 예: `"결제완료 상태 주문에서 배송준비나 취소로 전이할 수 있는 다음 상태 액션 버튼 그룹"`
나쁜 예: `"다음 상태 버튼들"`

description 작성 가이드:
- 라벨 이상의 정보를 담는다 — description만 읽어도 요소의 역할을 파악할 수 있어야 한다
- 구체적인 명사와 동작이 포함된 한 문장을 선호한다
- 비즈니스 의미나 조건이 해석에 영향을 주면 함께 언급한다

### 상태 표시 규칙

와이어프레임은 단순한 구조 스케치가 아니다. 기획자, 디자이너, 개발자를 위한 리뷰 산출물이다.
feature가 실질적으로 다른 상태를 가질 수 있으면, 리뷰어가 명세를 열기 전에 흐름 방향을 이해할 수 있도록 그 상태를 와이어프레임에서 노출해야 한다.

같은 feature의 2~4개 상호배타 형제 상태를 비교해야 할 때 기본적으로 **리뷰 탭 래퍼**를 사용한다.

리뷰 탭 규칙:
- feature를 `<div class="feature-review group/{feature-key} relative">` 같은 재사용 컨테이너로 감싼다. `{feature-key}`는 리뷰 탭 라디오 이름에 사용하는 고유 슬러그 (예: `group/login`, `group/order-list`). `group/feature` 같은 고정 리터럴은 절대 사용하지 않는다 — 중첩된 리뷰 탭이 한 번의 호버로 모두 드러난다
- 네이티브 라디오 입력과 `peer-checked`로 패널 전환 (패널은 input의 형제이므로 `peer` 작동)
- 라벨은 `.review-tabs` 안에 중첩되므로 `peer`가 도달하지 못한다 — 활성 라벨 스타일은 `<style>` 블록의 공유 `:has()` CSS 규칙으로 처리 (`references/REVIEW-TABS.md` 참조)
- 실제 제품 UI는 탭 패널 안에 배치
- 리뷰 탭은 제품 UI 흐름 밖에 absolute 오버레이로 배치, 보통 `absolute -top-3 right-4`
- 기본 상태에서 숨기고, feature hover/focus 시 드러나도록 하여 리뷰 도구로 인식되게 한다
- 작은 점선 pill/chip 컨트롤로 스타일링
- 한 번에 하나의 패널만 활성, 비활성 패널은 `hidden`
- `references/REVIEW-TABS.md`의 구체적인 HTML/Tailwind 레시피를 재사용한다

인라인 도움말이나 직접 오버레이 렌더링은 형제 모드 비교가 아닌 상태에서만 사용한다.

명시적 상태 렌더링이 적합한 경우:
- 빈 상태 / 로딩 / 에러
- 활성 vs 비활성 액션
- 승인 또는 확인 다이얼로그
- 권한 또는 역할 기반 가용성
- 다음 조작에 영향을 주는 성공/실패 피드백

모든 케이스를 빠짐없이 렌더링하면 복잡해진다. 리뷰어가 행동에 합의하는 데 필요한 대표 케이스만 보여준다.

판단 기준:
- 리뷰어가 같은 영역의 형제 상태를 비교해야 하면 → 탭
- 리뷰어가 경고나 다음 단계 제약을 알아차리면 되면 → 인라인 도움말이나 컴팩트 패널
- 상태가 메인 흐름을 가로막는 오버레이면 → 트리거 근처에 오버레이 자체를 렌더링

#### 조건부 표시 요소의 리뷰 탭 배치

feature에 조건부 표시 요소가 있을 때 (예: '직접 입력 선택 시 표시'), 해당 요소를 어느 리뷰 탭 패널에 넣을지:

- 트리거가 특정 리뷰 탭 상태에서만 존재하면 → 해당 패널에만 렌더링
- 트리거가 리뷰 탭 상태와 무관하면 (어느 패널에서든 발동 가능) → 모든 패널에 렌더링
- 판단 기준: 트리거 UI(드롭다운, 체크박스 등)가 해당 패널에 있는가?

예: 배송 메모 드롭다운이 "기본" 패널과 "새 배송지" 패널 양쪽에 있으면, "직접 입력" 필드도 양쪽에 넣는다.

### HTML 템플릿

`references/EXAMPLE.md`와 `references/WIREFRAME-GUIDE.md`에 정의된 head/body 골격을 사용한다.
구체적인 리뷰 탭 HTML/Tailwind 레시피는 `references/REVIEW-TABS.md`를 재사용한다.

필수 구조:
- `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- `<style type="text/tailwindcss">` 포함:
  - `@custom-variant dark (&:where(.dark, .dark *));`
  - 리뷰 탭 활성 라벨 `:has()` 규칙 (`references/REVIEW-TABS.md` 참조)
- `<script type="application/json" id="flowframe-meta">`
- `data-feature-id`와 `data-feature-label` 속성을 가진 feature 컨테이너
- feature 컨테이너 안에 `data-feature` 값이 매칭되는 추적 DOM 요소

### 2-tier DOM 추적

와이어프레임은 두 레벨의 DOM 추적을 사용한다 — **feature 컨테이너**는 코멘트용, **추적 요소**는 하이라이트용:

```html
<!-- feature 컨테이너: 코멘트 앵커 -->
<div data-feature-id="AUTH__LOGIN_FORM" data-feature-label="로그인 폼">
  <!-- 추적 요소: 호버 하이라이트 -->
  <div data-feature="FEATURE_AUTH__LOGIN_FORM_EMAIL">...</div>
  <div data-feature="FEATURE_AUTH__LOGIN_FORM_PASSWORD">...</div>
  <button data-feature="FEATURE_AUTH__LOGIN_FORM_SUBMIT">...</button>
</div>
```

| 속성 | 레벨 | 용도 | 파생 근거 |
|------|------|------|----------|
| `data-feature-id` | feature 래퍼 | 코멘트 앵커 (FlowFrame 클릭 대상) | `featureId` (경로 파생) |
| `data-feature-label` | feature 래퍼 | 코멘트 UI 표시명 | frontmatter `label` |
| `data-feature` | 개별 요소 | 호버 하이라이트 (양방향) | 메타데이터 `elements[].id` |

### data-feature-id 규칙 (feature 컨테이너)

- 모든 feature는 `data-feature-id="{featureId}"`와 `data-feature-label="{label}"`을 가진 래퍼를 받는다
- `data-feature-id` = 경로 파생 `featureId` (예: `MEMBER_PROFILE`, `AUTH__LOGIN_FORM`)
- `data-feature-label` = frontmatter `label` (한국어 표시명)
- 해당 feature의 `data-feature` 요소와 하위 feature 래퍼는 모두 이 래퍼 안에 위치한다
- **재귀 중첩**: 하위 feature가 있으면 상위 `data-feature-id` 래퍼 안에 하위 `data-feature-id` 래퍼가 들어간다
- feature에 `elements`와 하위 `features`가 동시에 있으면, `data-feature` 요소와 하위 래퍼가 같은 레벨에 공존한다
- 모달의 경우 `data-feature-id`는 트리거 버튼이 아니라 모달 카드(주요 콘텐츠)에 배치

### 재귀 DOM 중첩

메타데이터의 재귀 구조와 DOM 구조가 1:1로 대응한다:

```html
<!-- 독립 feature (elements만 있음) -->
<div data-feature-id="MEMBER_PROFILE" data-feature-label="회원 기본 정보">
  <div data-feature="FEATURE_MEMBER_PROFILE_NAME">홍길동</div>
  <div data-feature="FEATURE_MEMBER_PROFILE_EMAIL">hong@example.com</div>
</div>

<!-- 재귀 중첩: AUTH → AUTH__2FA → AUTH__2FA__TOTP -->
<div data-feature-id="AUTH" data-feature-label="인증">

  <div data-feature-id="AUTH__LOGIN_FORM" data-feature-label="로그인 폼">
    <input data-feature="FEATURE_AUTH__LOGIN_FORM_EMAIL" placeholder="이메일" />
    <button data-feature="FEATURE_AUTH__LOGIN_FORM_SUBMIT">로그인</button>
  </div>

  <div data-feature-id="AUTH__2FA" data-feature-label="2단계 인증">

    <div data-feature-id="AUTH__2FA__TOTP" data-feature-label="TOTP 인증">
      <input data-feature="FEATURE_AUTH__2FA__TOTP_CODE" placeholder="인증 코드 6자리" />
      <button data-feature="FEATURE_AUTH__2FA__TOTP_VERIFY">인증 확인</button>
    </div>

    <div data-feature-id="AUTH__2FA__RECOVERY" data-feature-label="복구 코드">
      <input data-feature="FEATURE_AUTH__2FA__RECOVERY_CODE" placeholder="복구 코드 입력" />
      <button data-feature="FEATURE_AUTH__2FA__RECOVERY_SUBMIT">복구 코드로 인증</button>
    </div>

  </div>

</div>
```

중첩 규칙:
- 하위 feature가 있는 feature는 `data-feature-id` 래퍼 안에 자식 래퍼가 들어간다
- 자체 `elements`가 있으면 `data-feature` 요소가 자식 래퍼와 같은 레벨에 배치된다
- `elements`만 있는 feature의 `data-feature-id` 안에는 다른 `data-feature-id`가 들어가지 않는다
- FlowFrame에서 상위 `data-feature-id` 클릭 시 하위 전체가 코멘트 범위가 된다

### data-feature 규칙 (추적 요소)

- `data-feature`는 호버 하이라이트를 위한 **가장 작은 의미 단위의 UI 요소**에 부여한다
- 메타데이터 `elements[].id` 각각에 대해 부모 `data-feature-id` 컨테이너 안에 하나 이상의 매칭 DOM 요소가 필요하다
- 여러 DOM 노드가 같은 `elements[].id`를 공유하면, 그 노드들은 같은 추적 요소의 상호배타 상태(리뷰 탭 패널)를 나타낸다 — 기본 상태에서 최소 하나는 보여야 한다
- 같은 feature가 화면의 여러 위치에 필요하면, feature를 분리하여 각 `data-feature-id` 영역이 하나의 레이아웃 위치에 매핑되도록 한다

#### data-feature 가시성 규칙

`data-feature` 요소에 `hidden`(`display: none`)을 사용하는 것은 **리뷰 탭 패널 내부에서만** 허용한다 — 패널 전환으로 드러나므로 FlowFrame 하이라이트가 작동한다.

제품 UI의 비활성/미선택 상태는 `hidden` 대신 시각적 약화로 표현한다:
- `opacity-50` + `border-dashed` 등으로 비활성 느낌
- DOM에는 존재하고 FlowFrame 호버 하이라이트가 항상 작동해야 함
- 비활성 상태에서 텍스트 크기를 줄이거나 색상을 약하게 하는 것은 허용

이유: `hidden` 요소는 FlowFrame이 호버 하이라이트 대상으로 감지하지 못한다. 리뷰 탭 패널은 한 번에 하나만 보이므로 비활성 패널의 `hidden`은 문제 없지만, 제품 UI 상태 표현에 `hidden`을 쓰면 해당 요소가 아예 사라진다.

### 고정 영역

- **고정 영역** (메뉴바, 상태바): 화면 명세에 명시된 경우에만 렌더링, `data-feature`나 메타데이터 없이 일반 HTML
- **한 영역에 여러 feature**: 레이아웃 래퍼는 일반으로 유지, `data-feature`는 개별 추적 요소에만 부여

## Tailwind과 레이아웃

Tailwind CSS v4 유틸리티를 `zinc` 팔레트로 사용한다. `references/WIREFRAME-GUIDE.md`와 `references/EXAMPLE.md`의 클래스 레시피를 재사용한다 — 화면별로 스타일을 즉흥으로 만들면 일관성이 깨진다. 복잡한 레이아웃은 flex/grid 유틸리티를 직접 사용하며, 공유 다크모드 + 리뷰 탭 블록 외에 `<style>` 인라인은 쓰지 않는다.

[references/WIREFRAME-GUIDE.md](references/WIREFRAME-GUIDE.md)가 레이아웃 선택, 간격, 밀도, 상태 표시의 주요 기준이다.

## 디자인 원칙

- 목표는 **구조 검증**이지 예쁜 UI가 아니다
- 그레이스케일, 중립적 와이어프레임 스타일 — `zinc` 팔레트만 사용
- 버튼, 입력, 카드는 단순한 박스 형태
- 이미지/아이콘은 플레이스홀더 박스 (`bg-zinc-200 dark:bg-zinc-700 rounded`)
- 카드의 `shadow-sm` 외에 색상, 그림자, 장식 요소 없음
- 모든 색상 클래스에 `dark:` 변형 포함 — FlowFrame은 다크모드로 렌더링

## ID 규칙

- `screenId`: 화면 명세 frontmatter에서
- `features[].featureId`: 경로 파생 (kebab → UPPER_SNAKE, `__`로 깊이 구분)
- `features[].elements[].id`: `FEATURE_{featureId}_{ELEMENT_ID}`
- feature 엔트리는 재귀적으로 중첩 가능; 한 feature 안에 여러 요소 가능

### `ELEMENT_ID` 도출

- 요소의 역할을 보존하는 가장 간결한 영어 명사나 동작어를 선택한다
- 여러 단어는 대문자 + 밑줄
- 원시 요소 타입 반복보다 의미 중심 이름을 우선한다
- 같은 feature 안에서 두 추적 요소가 충돌하면 역할이나 위치를 추가하여 구분한다

| 한국어 라벨 | 권장 `ELEMENT_ID` | 비고 |
|------------|-------------------|------|
| 이메일 | `EMAIL` | 도메인 의미 사용, input 타입이 아님 |
| 비밀번호 | `PASSWORD` | |
| 로그인 버튼 | `SUBMIT` | 일반적 `BUTTON`보다 동작 선호 |
| 등록 버튼 | `SUBMIT` | submit/create 동작일 때 |
| 저장 버튼 | `SAVE` | |
| 삭제 버튼 | `DELETE` | |
| 댓글 목록 | `LIST` | `COMMENTS`에서 `FEATURE_COMMENTS_LIST`가 됨 |
| 댓글 입력 | `INPUT` | 같은 feature 안에서 `LIST`와 짝으로 허용 |
| 서비스 로고 | `LOGO` | |
| 소셜 로그인 | `SOCIAL` | 소셜 로그인 블록 그룹 |

### feature 세분화 가이드

- 콘텐츠 밀도가 높은 화면에서는 굵은 단위의 feature를 선호한다
- 추적 요소는 상세하게, feature 명세는 비즈니스/콘텐츠 단위 세분화로 유지한다
- 장식 전용 UI는 추적하지 않는다

## FlowFrame 업로드 검증

| # | 검사 항목 | 실패 시 |
|---|----------|---------|
| 1 | 파일 확장자 `.html` | 차단 |
| 2 | 파일 크기 ≤ 2MB | 차단 |
| 3 | HTML 파싱 가능 (DOMParser) | 차단 |
| 4 | `<script id="flowframe-meta">` 존재 | 차단 |
| 5 | JSON 파싱 가능 | 차단 |
| 6 | `generator` === `"flowframe-wireframe-skill"` | 차단 |
| 7 | 필수 필드: `version`, `screenId`, `title`, `purpose`, `features` | 차단 |
| 8 | `features`가 1개 이상, 각 feature에 `elements` 또는 `features` 1개 이상 | 차단 |
| 9 | `screenId`가 화면 슬러그와 일치 | 경고만 |

## 품질 체크리스트

검증은 두 시점에 나눠 수행한다. 전체 파일 재읽기는 하지 않는다.

### 인라인 검증 (feature 렌더링 직후, 매 feature마다)

각 feature의 플레이스홀더를 교체한 직후 grep으로 확인한다:

- [ ] `data-feature-id="{featureId}"` 가 HTML에 존재
- [ ] 이 feature의 모든 `data-feature` 값이 해당 `data-feature-id` 컨테이너 안에 존재
- [ ] `data-feature` 요소에 리뷰 탭 패널 밖에서 `hidden`이 사용되지 않음
- [ ] `data-feature-label` 값이 frontmatter `label`과 일치
- [ ] 하위 feature가 있으면 `data-feature-id` 래퍼가 재귀적으로 중첩됨
- [ ] 조건부 표시 요소가 트리거 존재하는 모든 리뷰 탭 패널에 포함됨

실패 시 즉시 수정한다. 다음 feature로 넘어가지 않는다.

### 최종 검증 (메타데이터 일괄 작성 후, 화면당 1회)

메타데이터 `features` 배열을 작성한 뒤 grep으로 확인한다:

- [ ] 필수 메타데이터 필드 전부 존재 (`generator`, `version`, `screenId`, `title`, `purpose`, `features`)
- [ ] `generator`가 정확히 `"flowframe-wireframe-skill"`
- [ ] `features` 배열 내 `featureId` 중복 없음
- [ ] 메타데이터 `featureId` 개수와 DOM `data-feature-id` 개수 일치
- [ ] 모든 `features[]`에 유효한 `featureId`, `label`, `spec`, 그리고 `elements` 또는 `features` 중 최소 하나
- [ ] 요소 `description`이 리뷰어를 위한 기능적 역할 설명 (라벨 이상의 정보)
- [ ] Tailwind CDN `<script>` + `<style>`에 다크모드 설정과 `:has()` 리뷰 탭 규칙 포함
- [ ] 모든 색상 클래스에 `dark:` 변형 포함

이 두 단계로 feature가 N개여도 검증 비용이 분산되고, 전체 파일 재읽기가 불필요하다.

## 예제

[references/EXAMPLE.md](references/EXAMPLE.md) — 단일 feature 예제 (로그인 화면).
[references/PRODUCT-LIST-EXAMPLE.md](references/PRODUCT-LIST-EXAMPLE.md) — 다중 feature 예제 (사이드바 + 그리드, 두 feature).
[references/REVIEW-TABS.md](references/REVIEW-TABS.md) — 재사용 가능한 형제 상태 비교 패턴.
