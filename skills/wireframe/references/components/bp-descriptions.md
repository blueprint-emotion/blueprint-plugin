# JSON description (`<script type="application/bp-description+json">`)

bp 전용 — 와이어프레임의 **기능 설명을 JSON으로 임베드**하면 `bp-descriptions` 런타임이 우측 sticky rail로 자동 렌더한다.

HTML에 `bp-description-*` 같은 설명용 태그를 직접 쓰지 않는다. 오직 `<head>` 안의 JSON script 하나다.

## 배치

```html
<head>
  ...
  <script type="application/bp-description+json">
  {
    "purpose": "...",
    "rules": [...],
    "sections": [...]
  }
  </script>
</head>
```

- `<head>` 안, bp-components.js 로드 순서와 무관하게 배치
- 한 파일에 **1개만** (두 개 이상이면 첫 번째만 읽힌다)

## 스키마

```ts
{
  purpose?: string;                 // 화면 목적 한 줄
  rules?: string[];                 // 화면 간 비즈니스 규칙
  sections: Section[];              // 필수. 최소 1개
}

type Section = {
  feature: string;                  // featureId (DOMAIN__ID). <bp-section data-feature>와 매칭
  label: string;                    // 표시명. <bp-section data-label>과 일치
  elements: Element[];              // 영역 내 각 UI 요소
  notes?: string[];                 // 확인 필요·TBD (화면명세 ## 비고 항목만)
};

type Element = {
  name: string;                     // 요소 식별자. 메인 UI의 data-element와 매칭되어 양방향 하이라이트
  description: string;              // 요소가 하는 일
};
```

## 매칭 규칙

| JSON 필드 | 메인 UI 속성 | 역할 |
|---|---|---|
| `sections[].feature` | `<bp-section data-feature>` | 섹션 매칭 |
| `sections[].label` | `<bp-section data-label>` | 표시명 (일치시킬 것) |
| `elements[].name` | `data-element` | 요소 매칭 |

## 위치 보기 (eye 버튼)

각 element 카드 우측에 `eye` 아이콘 버튼이 자동 생성된다. 클릭 시:

1. `[data-element="<name>"]` 첫 매치 노드를 찾는다 (보드의 가장 왼쪽인 정상 프레임이 우선 탐색되므로 보통 거기서 찾힌다. 정상 프레임에 없고 fragment에만 존재하는 요소라면 해당 fragment 내부 노드가 선택된다)
2. `scrollIntoView({behavior:"smooth", block:"center", inline:"center"})` — 가로 보드라 좌우 이동도 같이
3. 스크롤 정착 후 1.5초 동안 outline flash

매칭이 안 되면 콘솔 경고만 나오고 무시된다. **JSON `elements[].name`마다 반드시 `data-element="<JSON name>"`이 HTML에 존재해야 한다** — 정상 프레임에 그려지는 요소는 정상 프레임의 노드에, fragment에만 그려지는 상태 요소(`빈 목록`·`에러`·`로딩` 등)는 해당 `<bp-fragment>` 내부 루트 노드에 붙인다. fragment의 `id`·`title`은 매칭에 쓰이지 않는다. 빠지면 eye 버튼이 무용지물이 된다.

## 작성 원칙

### 요소 흡수

**한 영역의 상태 변형(빈·에러·로딩·권한 없음 등)은 모두 그 section의 elements로 흡수**한다. 각 상태를 별도 section으로 쪼개지 않는다. 같은 feature가 여러 section으로 반복되면 rail이 중복된다.

```json
// ✅ 올바름 — 하나의 section에 상태 변형을 elements로 흡수
{
  "feature": "PROJECT__INFO",
  "label": "프로젝트 카드 그리드",
  "elements": [
    { "name": "프로젝트 카드", "description": "즐겨찾기 + 이름 + 저장소" },
    { "name": "빈 목록", "description": "프로젝트 0개일 때 예제 안내" },
    { "name": "저장소 에러", "description": "GitHub 권한 박탈·삭제 시 안내" }
  ]
}
```

```json
// ❌ 잘못 — 같은 feature를 여러 section으로 분리
[
  { "feature": "PROJECT__INFO", "label": "프로젝트 그리드", "elements": [...] },
  { "feature": "PROJECT__INFO", "label": "빈 목록", "elements": [...] },
  { "feature": "PROJECT__INFO", "label": "에러", "elements": [...] }
]
```

시각 조각은 `<bp-area>` 안의 `<bp-fragment>`로 분리되지만 **JSON은 흡수된 하나의 section**이다 — 그림과 설명이 다른 차원에서 조직된다.

### rules / notes 출처

| 출처 | 반영 위치 |
|------|----------|
| 화면명세 `## 비고` | `sections[].notes` 또는 화면 전역은 `rules`에 이어서 |
| 기능명세 `rules` | **복붙 금지** — element description에 "[기능명세](../...#ID) 참조" 링크로 |
| 작업 메모·TODO | 와이어프레임 금지 — 기획서로 올려 합의 후 반영 |

## 함정

- JSON 문자열 안에 **HTML 태그를 쓰지 않는다** — `<iframe>`, `</body>` 같은 기호가 필요하면 산문으로 표현하거나 백틱(``)으로 감싼다. rail은 textContent로 렌더하므로 태그가 그대로 보이진 않지만 지저분하다.
- `purpose`·`rules`는 생략 가능. 꼭 필요한 정보만 — 과하게 채우면 rail이 길어져서 sticky 스크롤 안에 안 들어간다.
- 주석(`//`)은 JSON 스펙 위반. 진짜 JSON으로 작성한다 (JSON5 아님).

## 예제

```html
<head>
  <script type="application/bp-description+json">
  {
    "purpose": "사용자가 참여 중인 프로젝트를 한눈에 보고 진입하거나 새로 생성한다.",
    "rules": [
      "GitHub collaborator인 저장소와 매칭되는 프로젝트만 노출",
      "정렬: 즐겨찾기 우선 → 생성일 내림차순"
    ],
    "sections": [
      {
        "feature": "PROJECT__CREATE",
        "label": "새 프로젝트 생성",
        "elements": [
          { "name": "새 프로젝트 버튼", "description": "클릭 시 [프로젝트 생성 다이얼로그](./dialog_create.md)로 이동" }
        ]
      },
      {
        "feature": "PROJECT__INFO",
        "label": "프로젝트 카드 그리드",
        "elements": [
          { "name": "즐겨찾기 토글", "description": "별 아이콘 토글. 사용자별 독립" },
          { "name": "프로젝트명", "description": "기본값은 저장소명, 사용자 변경 가능. 최대 50자" },
          { "name": "빈 목록", "description": "프로젝트 0개일 때 예제 안내 + 새 프로젝트 버튼" },
          { "name": "저장소 에러", "description": "GitHub 저장소 삭제·권한 박탈 시 카드 내부 안내" }
        ],
        "notes": [
          "저장소 에러 카드 처리 정책 — 자동 숨김 vs 수동 정리 검토"
        ]
      }
    ]
  }
  </script>
</head>
```