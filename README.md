# FlowFrame Wireframe Plugin

기획자를 위한 Claude Code 플러그인 패키지입니다. 번들 skill과 agent를 통해 기능명세와 화면명세를 작성하고, FlowFrame에 업로드 가능한 HTML 와이어프레임을 생성합니다.

## 포함된 에이전트

| 에이전트 | 역할 |
|---------|------|
| **planner** | 사용자와 대화하며 기능명세·화면명세 작성 |
| **wireframer** | 명세를 읽어 HTML 와이어프레임 생성/업데이트 |
| **reviewer** | 명세·와이어프레임 정합성 검증 (읽기 전용, pass/fail) |

## 포함된 스킬

| 스킬 | 역할 |
|------|------|
| **planning-workflow** | intake → planner → reviewer gate → wireframer → reviewer gate 오케스트레이션 |
| **flowframe-spec** | 기능명세·화면명세 포맷 지식 (planner가 참조) |
| **flowframe-wireframe** | 와이어프레임 DOM 구조·디자인 원칙 (wireframer가 참조) |

## 배포 대상

Claude plugin marketplace

## 사용법

### 1. 요구사항 수집

```
댓글 기능 기획해줘. 작성, 수정, 삭제, 멘션 기능이 필요해
```

→ planner가 필요한 질문을 통해 요구사항을 수집

### 2. intake 생성

```
에디터 화면 만들어줘. 댓글이랑 버전관리 기능이 들어가
```

→ `docs/screens/EDITOR/editor_intake.md` 생성 또는 갱신

### 3. spec 작성

→ `docs/features/COMMENT.md`, `docs/screens/EDITOR/editor_screen.md` 생성 또는 갱신

### 4. spec review

→ reviewer가 화면명세/기능명세 정합성을 검사하고 pass/fail로 review gate를 통과시킨다

### 5. wireframe 생성

```
와이어프레임 만들어줘
```

→ `docs/screens/EDITOR/editor_wireframe.html` 생성 (FlowFrame 업로드 가능)

### 6. wireframe review

→ reviewer가 DOM/메타데이터/참조 정합성을 검사하고 pass/fail로 최종 review gate를 통과시킨다

review gate는 생성 직후 다음 단계로 넘기기 전에 문서와 산출물이 규칙을 만족하는지 막는 검수 단계다.

## 프로젝트 구조

```
docs/
├── features/              ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── INDEX.md
│   ├── AUTH.md
│   └── COMMENT.md
├── screens/               ← 화면 단위 폴더
│   ├── LOGIN/
│   │   ├── login_intake.md
│   │   ├── login_screen.md
│   │   └── login_wireframe.html
│   └── EDITOR/
│       ├── editor_intake.md
│       ├── editor_screen.md
│       ├── editor_wireframe-pc.html
│       └── editor_wireframe-mobile.html
```

## 특징

- **기능 재사용** — 하나의 기능명세를 여러 화면에서 참조
- **부분 업데이트** — 수정된 기능의 와이어프레임 영역만 교체 (전체 재생성 불필요)
- **협업 지원** — 와이어프레임은 구조만, 상세 명세는 기능 md에서 확인
- **FlowFrame 호환** — 업로드 시 양방향 호버 하이라이트, 기능별 코멘트 가능

## 외부 의존성

와이어프레임 HTML은 다음 외부 스크립트를 사용합니다 (네트워크 연결 필요):

- **Tailwind CSS** — `@tailwindcss/browser@4` CDN
- **ff-platform.js** — FlowFrame 플랫폼 스크립트 (호버 하이라이트, 상태 탭 자동 생성)

## 부분 업데이트 (partial-update)

와이어프레임의 특정 영역만 교체하려면 HTML 내의 슬롯 마커가 보존되어야 합니다:

- `<!-- @SLOT:{region} -->` ~ `<!-- @END:{region} -->` — `<body>` 내 영역 단위 교체 마커
- `<!-- @META -->` ~ `<!-- @END:META -->` — `<head>` 내에서 `<script id="flowframe-meta">`를 감싸는 메타데이터 교체 마커

수동으로 HTML을 편집할 때 이 마커를 삭제하거나 위치를 옮기면 부분 업데이트가 동작하지 않습니다. 특히 `@META` 마커는 반드시 `<head>` 안에서 메타데이터 `<script>` 태그를 감싸야 합니다.

## 실행 환경

기본 대상은 Claude Code 플러그인이며, skill 본문은 다른 에이전트 환경에서도 재사용 가능하게 유지합니다.


## 라이선스

MIT
