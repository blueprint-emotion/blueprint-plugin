# Blueprint by 이모션 (`bp` plugin)

기획자가 Claude Code 안에서 **기능명세·화면명세·와이어프레임**을 생성하는 플러그인.

자유형식 요구사항 한 장을 던지면 → 단계별 인터뷰 → 명세 작성 → 와이어프레임 HTML까지. 산출물은 [Blueprint Platform](https://github.com/blueprint-emotion/blueprint-platform)에서 코멘트 협업으로 이어진다.

---

## 설치

### 1. 마켓플레이스 추가 (1회)

```
/plugin marketplace add blueprint-emotion/blueprint-plugin
```

### 2. 플러그인 설치

```
/plugin install bp@blueprint-emotion
```

설치되면 `/bp:` 로 시작하는 명령 두 개를 사용할 수 있다.

### 3. 업데이트

```
/plugin update bp
```

또는 IDE에서 `/reload-plugins`로 즉시 반영.

### 4. 설치 확인

```
/plugin list
```

`bp@blueprint-emotion` 이 활성 상태로 보이면 OK. 명령 자동완성에서 `/bp:` 를 입력하면 `plan`, `wireframe` 두 항목이 떠야 한다.

---

## 시작하기 — 5분 가이드

설치 직후 처음 한 화면을 만드는 시나리오. **로그인 화면**을 예로 끝까지 따라간다.

### 1단계 — 요구사항 메모 작성

본인 프로젝트 어디든 markdown 파일을 만든다. 형식·위치 자유:

```markdown
# 로그인 화면

신규/기존 사용자가 이메일·비밀번호로 로그인하는 화면.
GitHub 소셜 로그인 지원.

비밀번호 잊은 사용자는 "비밀번호 찾기" 링크 → 이메일 발송 흐름.
처음 오는 사용자는 "회원가입" 링크 → 가입 화면.

PC + 모바일 둘 다.
```

이 파일을 `docs/req/login.md`에 저장했다고 하자. (위치는 자유)

### 2단계 — `/bp:plan` 호출

```
/bp:plan docs/req/login.md
```

planner가 요구사항을 읽고 화면 후보를 식별한 뒤 인터뷰를 시작한다.

### 3단계 — 인터뷰 답변

planner가 빈 슬롯에 대해 단계별로 질문한다 (한 번에 모든 질문 X). 예:

```
> 보여야 할 정보는 이메일·비밀번호·소셜 버튼·링크 두 개로 이해했어요.
  몇 가지 더 확인할게요:
  1. 비밀번호 보기 토글 (눈 모양 아이콘) 필요한가요?
  2. 자동 로그인 체크박스 두나요?
  3. 로그인 실패 메시지는 어떻게 노출하나요? (인라인? 토스트?)

> 자동 로그인 체크박스는 둬요. 비밀번호 토글도. 실패는 인라인.

> 동작·인터랙션 슬롯 확인할게요:
  1. 이메일 입력 시 자동 포커스 → 비밀번호로 Tab?
  2. Enter 키로 바로 제출?

...
```

답변하면 planner가 `intake.md`에 역기록한다. 슬롯 9개 모두 채워지면 검토 요청:

```
intake.md 초안이 완성됐어요. 검토해 주세요:
docs/screens/auth/login/intake.md

이 내용으로 명세 작성에 들어가도 될까요?
```

### 4단계 — 명세 작성 컨펌

OK하면 작업 트리를 보여준다:

```
다음 산출물을 만들 예정입니다:

[docs/features/]
- AUTH.md (신설) — LOGIN, PASSWORD_RESET feature

[docs/screens/auth/login/]
- screen.md (페이지)

진행할까요?
```

OK → planner가 `feature-spec`·`screen-spec` 스킬로 명세 작성 → reviewer 자동 호출.

### 5단계 — 와이어프레임

명세 검토 후 마음에 들면:

```
/bp:wireframe docs/screens/auth/login/screen.md
```

wireframer가 viewport 배열에 따라:
- `wireframe.html` (PC)
- `wireframe_mobile.html` (모바일)

두 파일을 같은 폴더에 생성. reviewer 자동 호출로 명세와 일치하는지 검증.

### 완료 — git push

```
git add docs/
git commit -m "feat: 로그인 화면 명세·와이어"
git push
```

[Blueprint Platform](https://github.com/blueprint-emotion/blueprint-platform)에서 GitHub fetch → 렌더링·코멘트 협업 시작.

---

## 사용법

### 기본 워크플로

```
1. 자유형식 요구사항 작성 (어디든, 파일명 자유)
   ↓
2. /bp:plan {요구사항 경로}
   → 인터뷰 → intake.md → 기능명세·화면명세 작성
   ↓
3. (사용자가 명세 검토)
   ↓
4. /bp:wireframe {screen.md 경로}
   → 와이어프레임 HTML 생성
   ↓
5. git commit + push
   → 플랫폼에서 렌더링·코멘트
```

명세 작성과 와이어프레임 생성을 **분리**한 이유: 명세가 충분히 검토된 후에 와이어로 넘어가야 잘못된 그림이 그려지지 않는다.

### `/bp:plan` — 명세 작성

```
/bp:plan docs/requirements/product-detail.md     # 요구사항 파일 지정
/bp:plan                                         # 인자 없이 → 인터뷰로 시작
/bp:plan 상품 상세 화면 만들어줘                    # 자연어 인자도 OK
```

**입력**: 자유형식 markdown 한 장. 형식·위치·파일명 모두 자유.

**동작**:
1. 요구사항 파싱 → 화면 후보 식별
2. 화면 폴더에 `intake.md` 작업 노트 생성 (9개 슬롯)
3. 빈 슬롯에 대해 단계별 인터뷰 (한 번에 모든 질문 X)
4. 모든 슬롯 채워지면 사용자에게 검토 요청
5. 작업 트리 컨펌 → 기능명세·화면명세 작성
6. 검증 (reviewer 자동 호출)

**산출물** (한 화면 = 한 폴더):
- `docs/screens/{그룹}/{화면폴더}/intake.md` — 작업 노트
- `docs/screens/{그룹}/{화면폴더}/screen.md` — 페이지 명세
- `docs/screens/{그룹}/{화면폴더}/area_*.md` — 영역(필요 시)
- `docs/screens/{그룹}/{화면폴더}/sheet_*.md`, `dialog_*.md` — 오버레이
- `docs/features/{DOMAIN}.md` — 기능명세 신설·보강

**와이어프레임은 만들지 않는다** — 다음 단계.

### `/bp:wireframe` — 와이어프레임

```
/bp:wireframe docs/screens/상품/product-detail/screen.md
```

**입력**: `screen.md` (또는 `sheet_*.md`, `dialog_*.md`).

**동작**:
1. 같은 폴더의 `area_*.md` 자동 읽기
2. `features[].ref` 따라 기능명세 참조
3. viewport 배열에 따라 파일 N개 생성 (`pc` → `wireframe.html`, `mobile` → `wireframe_mobile.html`)
4. 시트·다이얼로그가 있으면 각각 별도 와이어 파일
5. 검증 (reviewer 자동 호출)

**산출물**:
- `docs/screens/{그룹}/{화면폴더}/*.html`

bp-* Web Components(shadcn/ui 포팅) + Tailwind 기반의 정적 HTML.

---

## 인터뷰 대화 예시

복잡한 화면(상품 상세)을 처음부터 끝까지 가는 흐름 예시:

```
사용자: /bp:plan docs/req/product-detail.md

planner: 요구사항 읽었어요. 화면 후보 1개를 식별했어요:
        - 상품 상세 → docs/screens/상품/product-detail/

        이 폴더에 만들까요? (다른 경로 원하면 알려주세요)

사용자: OK

planner: intake.md 초안을 만들었어요. 이제 빈 슬롯을 채울게요.

        [유저스토리 슬롯]
        요구사항에서 "구매자가 상품 보고 옵션 골라서 장바구니 담는다"는
        Must로 잡았어요. 추가로 다음을 확인할게요:
        1. 옵션 조합별 실시간 재고 확인 — 필요한가요?
        2. 다른 구매자 리뷰를 사진과 함께 — 우선순위는?

사용자: 재고는 Must, 리뷰 사진은 Could.

planner: ✓ 기록했어요.

        [상태 슬롯]
        화면이 보여줄 상태:
        1. 옵션 재고 0일 때 — 비활성화 + "품절" 뱃지로 가나요?
        2. 리뷰 0건 — "아직 리뷰가 없습니다" 안내?
        3. 이미지 로드 실패 — 어떻게?

사용자: 1, 2 OK. 이미지는 깨진 위치에만 플레이스홀더, 나머지는 정상.

planner: ✓

        [예외 케이스 슬롯]
        외부 시스템 실패 처리:
        1. 상품 조회 API 실패 — 재시도 버튼 노출?
        2. 비로그인 + 장바구니 담기 — 로그인 화면 리다이렉트?
        3. 삭제된 상품 접근 — 404로?

사용자: 다 OK. 비로그인은 현재 상품 ID 보존해서 돌아오게.

planner: ✓

        [시트·다이얼로그 슬롯]
        현재까지 식별된 오버레이:
        - sheet_review (리뷰 상세)
        - dialog_zoom (이미지 확대)

        더 있나요? Q&A 영역도 시트로 띄울까요?

사용자: Q&A는 인라인 탭. 추가 없음.

planner: ✓ intake.md 9개 슬롯 모두 채웠어요. 검토해 주세요:
        docs/screens/상품/product-detail/intake.md

        진행해도 될까요?

사용자: 좋아 진행해

planner: 다음 산출물을 만들 예정입니다:

        [docs/features/]
        - PRODUCT.md (보강) — REVIEW 도메인 신설은 별도 결정 필요
          → REVIEW 도메인 신설할까요? 별도 화면으로 나중에 다룰까요?

사용자: REVIEW도 도메인으로 신설해. 별도 화면은 나중에.

planner: ✓

        [docs/features/]
        - PRODUCT.md (보강)
        - REVIEW.md (신설)

        [docs/screens/상품/product-detail/]
        - screen.md (페이지)
        - area_image.md (이미지 갤러리)
        - area_info.md (상품 기본 정보)
        - area_option.md (옵션 선택)
        - area_review.md (리뷰 요약)
        - area_qna.md (Q&A 탭)
        - sheet_review.md (리뷰 상세)
        - dialog_zoom.md (이미지 확대)

        진행할까요?

사용자: OK

planner: ... (작업 진행) ...

        명세 작성 완료. reviewer가 검증을 시작합니다.

reviewer: ✓ 위반 사항 없음. 산출물 일관성 확인됨.

planner: 작성 완료. 이제 와이어프레임 그릴 수 있어요:
        /bp:wireframe docs/screens/상품/product-detail/screen.md
```

핵심 포인트:
- **단계별 인터뷰** — 한 번에 모든 슬롯을 묻지 않음. 사용자가 답하기 쉬운 단위로
- **컨펌 게이트 2회** — intake 완료 후 + 작업 트리 후
- **도메인 의사결정은 사용자에게** — "REVIEW 신설할까요?" 같은 판단은 사용자가
- **reviewer 자동 호출** — 사람이 챙기지 않아도 SSOT 일관성 검증

---

## 요구사항 md 작성 노하우

자유형식이지만 어떻게 적느냐에 따라 인터뷰 시간이 크게 달라진다.

### ✓ 좋은 예

```markdown
# 상품 상세 화면

구매자가 상품 정보 보고 옵션 골라서 장바구니 담는 화면.
일반 구매자 (비로그인 가능), 모바일·PC 둘 다.

## 보여야 할 것
- 이미지 여러 장 (스와이프 갤러리)
- 상품명, 판매가 (정가 취소선 + 판매가 강조)
- 옵션 (색상·사이즈, 재고 실시간)
- 리뷰 요약 (평점·개수, 더보기 시 시트)
- Q&A (인라인 탭)

## 동작
- 옵션 다 고르면 장바구니 버튼 활성화
- 이미지 클릭 → 확대 다이얼로그
- 모바일 옵션 영역은 sticky

## 메모
- 4월 회의: 가격 표시 합의됨
- REVIEW는 신규 도메인 (기존 PRODUCT.md엔 없음)
- 디자이너 스케치: figma.com/... (TBD)
```

**왜 좋은가:**
- 화면 한 장에 집중 (1 화면 = 1 요구사항)
- 누가/왜 짧게 명시
- 보여야 할 것 + 표현 패턴(취소선·강조) 함께
- 동작·인터랙션 분리
- 메모로 합의 사항·TBD 표시
- 신규 도메인 여부 미리 알림 → planner가 인터뷰 줄임

### ✗ 나쁜 예 1: 너무 짧음

```markdown
상품 상세 만들어줘
```

→ planner가 거의 모든 슬롯을 인터뷰. 시간 오래.

### ✗ 나쁜 예 2: 여러 화면 섞기

```markdown
# 커머스 사이트 전체

상품 목록, 상세, 장바구니, 결제, 마이페이지, 주문 내역...
각각 다음 기능들...
```

→ planner가 화면 후보 5~6개 식별 → 한 번에 인터뷰 못 함. 권장: 화면별 파일로 쪼개기.

### ✗ 나쁜 예 3: 구현 디테일 섞기

```markdown
# 상품 상세

- React useState로 옵션 상태 관리
- Tailwind grid-cols-2 레이아웃
- API: GET /api/products/{id}
- DB: products 테이블 join...
```

→ 기획서에는 비즈니스 언어만. 구현은 개발팀이 명세 보고 결정.

### ✗ 나쁜 예 4: UI 스타일 직접 지시

```markdown
- 가격은 빨간색 24px Bold
- 이미지는 height: 400px
- 버튼은 #FF5733 색
```

→ 와이어프레임이 결정함. 요구사항에는 "강조 표시"·"큰 이미지"·"메인 버튼" 정도의 의도만.

### 작성 패턴 요약

| 항목 | 적기 |
|---|---|
| 화면명 + 1줄 요약 (h1 + 첫 문단) | 필수 |
| 누가·왜 (사용자 + 화면 목적) | 권장 |
| 보여야 할 정보 (표현 패턴 포함) | 필수 |
| 동작·인터랙션 (클릭·스와이프·다이얼로그) | 권장 |
| viewport (`PC`, `모바일`, `둘 다`) | 권장 |
| 시트·다이얼로그 (있다면) | 있을 때 |
| 회의 메모·TBD·참고 링크 | 선택 |

| 항목 | 적지 말기 |
|---|---|
| 색상 코드, px 값, 폰트 | 와이어가 결정 |
| API 엔드포인트, DB 스키마 | 개발팀이 결정 |
| React/Vue 등 프레임워크 | 구현 영역 |
| 여러 화면을 한 파일에 | 화면별로 분리 |

---

## 산출물 구조

```
docs/
├── features/
│   ├── INDEX.md             ← 전체 도메인 맵
│   ├── PRODUCT.md           ← 도메인: 상품
│   ├── ORDER.md             ← 도메인: 주문
│   └── ...
└── screens/
    └── 상품/
        └── product-detail/
            ├── intake.md            ← 작업 노트 (재실행·인터뷰 추적)
            ├── screen.md            ← 페이지 명세
            ├── area_image.md        ← 영역: 이미지 갤러리
            ├── area_option.md       ← 영역: 옵션 선택
            ├── sheet_review.md      ← 시트: 리뷰 상세
            ├── dialog_zoom.md       ← 다이얼로그: 이미지 확대
            ├── wireframe.html       ← 와이어프레임 (PC)
            └── wireframe_mobile.html ← 와이어프레임 (모바일)
```

모두 git에 커밋. 플랫폼이 GitHub에서 fetch하여 렌더링한다.

### 권장 초기 디렉토리

처음 도입할 때 다음 구조로 시작:

```bash
mkdir -p docs/features docs/screens docs/req
```

- `docs/features/` — 도메인 명세 (planner가 신설·보강)
- `docs/screens/` — 화면 명세 + 와이어 (planner·wireframer가 생성)
- `docs/req/` — 자유형식 요구사항 (기획자가 직접 작성, 위치 자유지만 한 곳에 모으면 관리 편함)

---

## 재실행

같은 요구사항 md(또는 같은 화면 폴더)로 `/bp:plan`을 다시 호출하면 기존 `intake.md`를 발견하고 분기 인터뷰:

```
이 화면에 기존 intake.md가 있어요. 어떻게 처리할까요?
① 신규 화면 추가 (다른 폴더에 새로 만들기)
② 부분 수정 (변경된 슬롯만 식별 → 영향 받는 산출물만 재생성)
③ 전체 재검토 (모든 슬롯 다시 인터뷰)
```

부분 수정 시 변경된 내용이 닿는 산출물(feature/screen)을 자동 식별해 "이거 같이 처리할까요?" 컨펌.

---

## 트러블슈팅

### `/bp:plan`, `/bp:wireframe`이 자동완성에 안 보여요

```
/plugin list
```

`bp` 활성 확인. 안 보이면:

```
/plugin marketplace add blueprint-emotion/blueprint-plugin
/plugin install bp@blueprint-emotion
```

방금 업데이트했는데 변화가 없으면:

```
/reload-plugins
```

### 인터뷰가 너무 길어요

요구사항 md를 더 자세히 적으면 인터뷰가 짧아짐. "요구사항 md 작성 노하우"의 좋은 예 참고.

### 산출물이 잘못 만들어졌어요

`intake.md`에서 직접 슬롯을 수정하고 다시 `/bp:plan`을 같은 경로로 호출 → "부분 수정" 선택.

### 와이어프레임이 명세와 다르게 그려졌어요

`/bp:wireframe`이 끝나면 reviewer가 명세-와이어 교차 검증을 자동 실행. 위반 발견 시 리포트와 함께 "자동 수정할까요?" 컨펌. 자동 수정 불가 항목은 명세를 다시 손보고 와이어를 재생성.

### 와이어프레임 컴포넌트가 부족해요

bp-* 컴포넌트는 shadcn/ui 1:1 포팅 + 추가 (`bp-board`, `bp-frame`, `bp-page` 등 51종). 필요한 컴포넌트가 없으면 [이슈](https://github.com/blueprint-emotion/blueprint-plugin/issues)로 요청.

### 여러 화면을 한 번에 만들고 싶어요

권장은 **1 요구사항 = 1 화면**. 큰 PRD를 통째로 줘도 동작은 하지만 인터뷰가 산만해짐. 화면별 파일로 쪼개고 순차 호출:

```
/bp:plan docs/req/login.md
/bp:plan docs/req/signup.md
/bp:plan docs/req/forgot-password.md
```

### 명세를 수정한 뒤 와이어도 다시 그리려면

명세를 직접 손본 뒤:

```
/bp:wireframe docs/screens/.../screen.md
```

와이어프레임만 다시 생성됨 (intake·명세는 그대로 유지).

---

## 자주 묻는 질문

### Q. intake.md는 git에 커밋해야 하나요?

YES. 재실행 추적·인터뷰 답변 보존을 위해 커밋. 산출물의 "왜 이렇게 됐는지" 역추적이 가능해진다.

### Q. 요구사항 md를 어디에 두나요?

자유. `docs/req/`, `notes/`, 어디든 OK. command 인자로 경로만 정확히 주면 됨.

### Q. planner가 잘못된 방향으로 가요

인터뷰 도중 "그게 아니라 X로 가자"라고 말하면 planner가 방향 수정. 계속 어긋나면 중단하고 요구사항 md를 더 정확히 다시 적어 `/bp:plan`을 다시 호출 (`전체 재검토` 선택).

### Q. wireframe.html을 직접 수정해도 되나요?

OK. 단 명세와 어긋나면 reviewer가 다음 검증 시 잡아냄. 큰 변경은 명세부터 수정 후 와이어 재생성을 권장.

### Q. Blueprint Platform 없이 와이어프레임만 보고 싶어요

`docs/screens/.../wireframe.html` 을 브라우저로 열면 바로 보임. 단 코멘트·핀 협업은 플랫폼에서만 동작.

---

## 라이선스

MIT
