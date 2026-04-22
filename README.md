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

요구사항을 읽고 인터뷰가 시작된다.

### 3단계 — 인터뷰 답변

빈 부분을 몇 가지씩 나눠서 물어본다. 예:

```
> 보여야 할 정보는 이메일·비밀번호·소셜 버튼·링크 두 개로 이해했어요.
  몇 가지만 확인할게요:
  1. 비밀번호 보기 토글 (눈 모양 아이콘) 필요한가요?
  2. 자동 로그인 체크박스 두나요?
  3. 로그인 실패 메시지는 어떻게 노출하나요? (인라인? 토스트?)

> 자동 로그인은 둬요. 비밀번호 토글도. 실패는 인라인.

> 화면 동작 쪽 몇 개 더:
  1. 이메일 입력 후 Enter 로 바로 제출할까요?
  2. 로그인 실패해도 입력값은 남아 있게요?

...
```

답하면 받아적는다. 확인할 게 다 끝나면:

```
정리했어요.

• 이메일·비밀번호 로그인, GitHub 소셜 지원 (PC / 모바일)
• 비밀번호 잊음 → 이메일 발송, 신규 → 가입 화면
• 실패 메시지 인라인, Enter 제출, 자동 로그인 유지

이 내용으로 아래 파일을 만들 거예요:

기능명세
- AUTH.md (신설)

화면
- docs/screens/auth/login/screen.md

이대로 만들어도 될까요?
```

### 4단계 — 명세 생성

"OK" 하면 명세를 만들고 검증까지 돌린다. 1~2분 정도.

### 5단계 — 와이어프레임

명세 검토 후 마음에 들면:

```
/bp:wireframe docs/screens/auth/login/screen.md
```

viewport에 따라 `wireframe.html` (PC) / `wireframe_mobile.html` (모바일) 이 같은 폴더에 생성된다. 명세와 와이어가 어긋나지 않는지 검증까지 자동으로 돌아간다.

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

**흐름**:
1. 요구사항 읽기 → 화면 식별
2. 빠진 부분 단계별로 인터뷰
3. 정리 요약 + 만들 파일 목록 확인
4. 기능명세·화면명세 작성 + 자동 검증

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

**흐름**:
1. 같은 폴더의 영역·시트·다이얼로그 명세 자동으로 같이 읽음
2. 화면명세에서 참조하는 기능명세까지 연결
3. viewport 에 따라 HTML 파일 생성 (`pc` → `wireframe.html`, `mobile` → `wireframe_mobile.html`)
4. 시트·다이얼로그가 있으면 각각 별도 와이어 파일
5. 명세-와이어 일치 여부 자동 검증

**산출물**:
- `docs/screens/{그룹}/{화면폴더}/*.html`

bp-* Web Components(shadcn/ui 포팅) + Tailwind 기반의 정적 HTML.

---

## 인터뷰 대화 예시

상품 상세 화면을 처음부터 끝까지 가는 흐름:

```
> /bp:plan docs/req/product-detail.md

요구사항 읽었어요. "상품 상세 화면" 한 장으로 이해했고,
docs/screens/상품/product-detail/ 폴더에 만들 생각이에요. 괜찮아요?

> OK

몇 가지만 확인할게요.
1. 옵션 조합별 실시간 재고 — 보여줘야 하나요?
2. 리뷰에 사진도 같이 보여줘요?
3. 재고 0인 옵션은 어떻게 표시할까요? (비활성? 품절 뱃지?)

> 재고는 꼭. 리뷰 사진은 있으면 좋고. 재고 0은 품절 뱃지.

좋아요. 예외 상황 쪽으로:
1. 상품 조회 API 실패 — 재시도 버튼 노출?
2. 비로그인이 장바구니 누르면 — 로그인 화면으로 이동?
3. 삭제된 상품 접근 — 404로?

> 다 OK. 비로그인은 현재 상품 ID 보존해서 돌아오게.

오버레이는 리뷰 더보기 시트, 이미지 확대 다이얼로그 정도로 생각하는데,
Q&A 도 별도 시트로 띄울까요?

> Q&A 는 인라인 탭이요. 추가 없음.

정리했어요.

• 상품 상세 화면, 구매자용 (PC / 모바일)
• 필수: 상품 정보 + 옵션 선택 + 장바구니, 리뷰 요약 표시
• 이미지 클릭 → 확대, 리뷰 더보기 → 시트, Q&A 는 인라인 탭
• 비로그인 담기 → 로그인 유도 (상품 ID 보존)

이 내용으로 아래 파일들 만들 거예요:

기능명세
- PRODUCT.md (보강)
- REVIEW.md (신설) ← 리뷰가 커질 것 같아 별도 도메인으로 뺐어요

화면 (docs/screens/상품/product-detail/)
- screen.md, area_image.md, area_info.md, area_option.md
- area_review.md, area_qna.md
- sheet_review.md, dialog_zoom.md

이대로 만들어도 될까요?

> 좋아 진행해

[1~2분 후]

명세 작성·검증 완료했어요. 위반 사항 없습니다.
이제 와이어프레임 그릴 수 있어요:
/bp:wireframe docs/screens/상품/product-detail/screen.md
```

눈에 띄는 패턴:
- **한 번에 다 묻지 않음** — 주제별로 2~3개씩
- **정리 + 확인을 한 턴에** — 내용 요약과 만들 파일 목록을 같이 제시
- **판단이 필요한 건 물어봄** — 리뷰를 별도 도메인으로 뺄지 같은 선택
- **검증까지 자동** — 명세들 사이 일관성은 사람이 챙기지 않아도 됨

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
- 신규 도메인 여부 미리 알림 → 인터뷰가 짧아짐

### ✗ 나쁜 예 1: 너무 짧음

```markdown
상품 상세 만들어줘
```

→ 거의 모든 걸 인터뷰로 물어봐야 해서 시간이 오래 걸림.

### ✗ 나쁜 예 2: 여러 화면 섞기

```markdown
# 커머스 사이트 전체

상품 목록, 상세, 장바구니, 결제, 마이페이지, 주문 내역...
각각 다음 기능들...
```

→ 화면 후보가 5~6개로 잡혀서 한 번에 인터뷰 못 함. 권장: 화면별 파일로 쪼개기.

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

- `docs/features/` — 도메인 명세 (`/bp:plan` 이 신설·보강)
- `docs/screens/` — 화면 명세 + 와이어 (`/bp:plan` + `/bp:wireframe` 산출물)
- `docs/req/` — 자유형식 요구사항 (기획자가 직접 작성, 위치 자유지만 한 곳에 모으면 관리 편함)

---

## 재실행

같은 요구사항 md(또는 같은 화면 폴더)로 `/bp:plan`을 다시 호출하면 기존 `intake.md`를 발견하고 분기 인터뷰:

```
이 화면에 기존 intake.md가 있어요. 어떻게 처리할까요?
① 신규 화면 추가 (다른 폴더에 새로 만들기)
② 부분 수정 (바뀐 부분만 짚고 영향 받는 산출물만 재생성)
③ 전체 재검토 (처음부터 다시 인터뷰)
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

`intake.md`에서 해당 부분을 직접 수정하고 같은 경로로 `/bp:plan`을 다시 호출 → "부분 수정" 선택.

### 와이어프레임이 명세와 다르게 그려졌어요

`/bp:wireframe` 이 끝나면 명세-와이어 교차 검증이 자동으로 돌아간다. 어긋난 게 있으면 수정 여부를 물어본다. 자동으로 못 고치는 건 명세를 손보고 와이어를 재생성.

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

### Q. 대화가 잘못된 방향으로 가요

인터뷰 도중 "그게 아니라 X로 가자"라고 말하면 방향을 잡아준다. 계속 어긋나면 중단하고 요구사항 md를 더 정확히 다시 적어 `/bp:plan`을 다시 호출 (`전체 재검토` 선택).

### Q. wireframe.html을 직접 수정해도 되나요?

OK. 단 명세와 어긋나면 다음 검증 때 잡힌다. 큰 변경은 명세부터 수정 후 와이어 재생성을 권장.

### Q. Blueprint Platform 없이 와이어프레임만 보고 싶어요

`docs/screens/.../wireframe.html` 을 브라우저로 열면 바로 보임. 단 코멘트·핀 협업은 플랫폼에서만 동작.

---

## 라이선스

MIT
