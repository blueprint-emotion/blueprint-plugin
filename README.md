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
| **planning-workflow** | intake → planner → reviewer → wireframer 오케스트레이션 |
| **flowframe-spec** | 기능명세·화면명세 포맷 지식 (planner가 참조) |
| **flowframe-wireframe** | 와이어프레임 DOM 구조·디자인 원칙 (wireframer가 참조) |

## 배포 대상

Claude plugin marketplace

## 사용법

### 1. 기능명세 작성

```
댓글 기능 기획해줘. 작성, 수정, 삭제, 멘션 기능이 필요해
```

→ `docs/features/COMMENT.md` 생성 (와이어프레임 요소, 상태, 인터랙션, 비즈니스 로직)

### 2. 화면명세 작성

```
에디터 화면 만들어줘. 댓글이랑 버전관리 기능이 들어가
```

→ `docs/screens/EDITOR/editor-screen.md` 생성 (레이아웃 + 기능 참조)

### 3. 와이어프레임 생성

```
와이어프레임 만들어줘
```

→ `docs/screens/EDITOR/editor-wireframe.html` 생성 (FlowFrame 업로드 가능)

### 4. 와이어프레임 업데이트

```
댓글이랑 인증 수정했어, 와이어프레임 업데이트해줘
```

→ 영향 받는 와이어프레임 목록 표시 → 사용자 컨펌 → 해당 HTML만 업데이트

## 프로젝트 구조

```
docs/
├── features/              ← 도메인 단위 기능 명세 (플랫 파일)
│   ├── INDEX.md
│   ├── AUTH.md
│   └── COMMENT.md
├── screens/               ← 화면 단위 폴더
│   ├── LOGIN/
│   │   ├── login-screen.md
│   │   └── login-wireframe.html
│   └── EDITOR/
│       ├── editor-screen.md
│       ├── editor-wireframe-pc.html
│       └── editor-wireframe-mobile.html
```

## 특징

- **기능 재사용** — 하나의 기능명세를 여러 화면에서 참조
- **부분 업데이트** — 수정된 기능의 와이어프레임 영역만 교체 (전체 재생성 불필요)
- **협업 지원** — 와이어프레임은 구조만, 상세 명세는 기능 md에서 확인
- **FlowFrame 호환** — 업로드 시 양방향 호버 하이라이트, 기능별 코멘트 가능

## 실행 환경

기본 대상은 Claude Code 플러그인이며, skill 본문은 다른 에이전트 환경에서도 재사용 가능하게 유지합니다.

## 라이선스

MIT
