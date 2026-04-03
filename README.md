# Blueprint (bp)

IT 서비스 기획자를 위한 Claude Code 플러그인.
대화로 기능명세/화면명세를 작성하고, HTML 와이어프레임을 생성합니다.

## 설치

마켓플레이스 등록:

```
/plugin marketplace add blueprint-emotion/blueprint-plugin
```

플러그인 설치:

```
/plugin install bp
```

플러그인 리로드:

```
/reload-plugins
```

사용 시작:

```
/bp:plan
```

## 업데이트

```bash
claude plugin update bp
```

## 삭제

```bash
claude plugin uninstall bp
```

## 사용법

마켓플레이스 설치 시 모든 스킬에 `bp:` 접두어가 붙습니다.

### 기획 시작

```
/bp:plan
```

→ 요구사항 수집 → 화면 도출 → 명세 작성 → 리뷰 → 와이어프레임 생성까지 자동 오케스트레이션

### 예시

```
기획 시작해. 쇼핑몰 상품 목록이랑 상세 화면이 필요해
```

→ planner가 질문을 통해 요구사항 수집
→ intake 생성 → spec 작성 → reviewer 검증 → wireframe 생성

### 개별 작업

기획 외에 개별 작업도 가능합니다:

```
AUTH.md에 소셜 로그인 기능 추가해줘     → planner 에이전트
LOGIN 와이어프레임 업데이트해줘          → wireframer 에이전트
전체 리뷰해줘                           → reviewer 에이전트
```

## 포함된 스킬

| 스킬 | 호출 | 역할 |
|------|------|------|
| **plan** | `/bp:plan` | 기획 워크플로우 오케스트레이션 (하네스) |
| **spec** | `/bp:spec` | 명세 포맷 지식 (에이전트가 참조) |
| **wireframe** | `/bp:wireframe` | 와이어프레임 DOM 규칙 (에이전트가 참조) |

## 포함된 에이전트

| 에이전트 | 역할 |
|---------|------|
| **planner** | 사용자와 대화하며 기능명세/화면명세 작성 |
| **wireframer** | 명세를 읽어 HTML 와이어프레임 생성/업데이트 |
| **reviewer** | 명세/와이어프레임 정합성 검증 (읽기 전용, pass/fail) |

## 워크플로우

```
/bp:plan 실행 시:

1. 요구사항 수집 (모달, 인터랙션, viewport 확인)
2. 화면 경계 도출 → 사용자 확인
3. 도메인 구조 도출 → 사용자 확인
4. Spec 작성 (planner)
5. 마무리 요약 → 사용자 승인
6. Spec review (reviewer) — FAIL 시 planner 수정 → 재리뷰
7. 와이어프레임 생성 (wireframer)
8. 와이어프레임 검증 (reviewer) — FAIL 시 수정 → 재검증
```

## 산출물 구조

플러그인이 사용자 프로젝트의 `docs/` 폴더에 산출물을 생성합니다:

```
docs/
├── features/              ← 도메인 단위 기능 명세
│   ├── INDEX.md
│   ├── AUTH.md
│   └── PRODUCT.md
├── screens/               ← 화면 단위 폴더
│   ├── LOGIN/
│   │   ├── login_intake.md
│   │   ├── login_screen.md
│   │   └── login_wireframe.html
│   └── PRODUCT-LIST/
│       ├── product-list_intake.md
│       ├── product-list_screen.md
│       ├── product-list_wireframe-pc.html
│       └── product-list_wireframe-mobile.html
```

## 특징

- **대화형 기획** — 개발 경험 없이도 대화로 명세 작성
- **기능 재사용** — 하나의 기능명세를 여러 화면에서 참조
- **부분 업데이트** — 수정된 기능의 와이어프레임 영역만 교체
- **리뷰 게이트** — 명세/와이어프레임 자동 검증 후 다음 단계 진행
- **Blueprint 호환** — 업로드 시 호버 하이라이트, 기능별 코멘트 가능

## 외부 의존성

와이어프레임 HTML은 다음 외부 스크립트를 사용합니다 (네트워크 연결 필요):

- **Tailwind CSS** — `@tailwindcss/browser@4` CDN
- **bp-platform.js** — 플랫폼 스크립트 (호버 하이라이트, 상태 탭)

## 라이선스

MIT
