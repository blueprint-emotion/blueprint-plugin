# 오버레이 표현 패턴

`bp-dialog` / `bp-sheet` / `bp-alert-dialog` 를 와이어프레임 조각으로 그릴 때 반복적으로 어긋나는 지점들을 모은 가이드. 개별 컴포넌트 속성·composition 은 [`bp-alert-dialog.md`](./components/bp-alert-dialog.md) / [`bp-sheet.md`](./components/bp-sheet.md) 참조.

## 기본 동작

오버레이 컴포넌트는 **와이어프레임 전용 정적 카드**로 렌더된다. viewport 중앙에 고정되는 진짜 모달이 아니라, 부모 `bp-fragment` body 흐름 안에서 `mx-auto` 로 가로 중앙 정렬된 카드처럼 그려진다.

- `<bp-fragment>` body 에 `<bp-dialog open>` 을 **직접** 배치. backdrop 흉내 용 `<div class="absolute inset-0 bg-black/20">` 같은 wrapper 로 감싸지 말 것 — 구 패턴(컴포넌트가 `position: fixed` 였을 때 필요하던 우회)이고 이제는 이중 박스만 만든다
- 한 페이지에 여러 오버레이를 동시에 `open` 해도 서로 겹치지 않고 각자 자기 fragment 안에 독립적으로 렌더된다
- 원칙: **1 fragment = 1 오버레이 상태**. 초기·전송중·에러 등 상태를 보이려면 fragment 를 분리한다 (같은 fragment 안에 같은 오버레이 2개 넣으면 grid-col 로 나란히는 보이지만 의미상 혼란)

## 스택 상황 — 베이스 오버레이 위에 알랏이 뜨는 경우 ⚠️

실제 UX 에서 다이얼로그·시트 위에 알랏 다이얼로그(확인·경고)가 얹히는 흐름은 흔하지만, **와이어 조각에는 얹힌 것(= 알랏)만 단독으로** 그린다. 베이스 오버레이는 같은 `bp-area` 안 다른 fragment 에 이미 있으므로 컨텍스트는 그쪽에서 확보된다.

```html
<!-- ❌ 베이스 다이얼로그 + 위에 얹힌 알랏 을 한 fragment 에 동시에 -->
<bp-fragment id="find-password-error" title="...">
  <bp-dialog open>…비밀번호 찾기 폼…</bp-dialog>
  <bp-alert-dialog open>…네트워크 오류…</bp-alert-dialog>
</bp-fragment>

<!-- ✅ 알랏만 단독. 컨텍스트는 fragment description + 이웃 fragment 로 -->
<bp-fragment id="find-password-error"
  title="비밀번호 찾기 — 서버 오류"
  description="발송 중 네트워크·서버 오류 발생 시 알랏 다이얼로그로 표시">
  <bp-alert-dialog open>…네트워크 오류…</bp-alert-dialog>
</bp-fragment>
```

**왜**:
- 와이어 조각은 정적 캡처다. 스택을 그대로 그리면 베이스가 시각적으로 반복되어 조각마다 같은 다이얼로그가 중복 렌더되고, 정작 보여줄 알랏이 상대적으로 작아 보인다
- 검토자 시선은 "이 상태의 핵심 변화" = 알랏 쪽에 집중돼야 한다
- 같은 feature 의 `bp-area` 안에 베이스(정상 다이얼로그·발송 중·발송 완료) 와 에러 알랏이 나란히 있으므로, 트리거 컨텍스트는 가로 나열만으로도 읽힌다
- 스택 관계(어떤 다이얼로그 위에 이 알랏이 뜨는지, 닫기 시 어디로 복귀하는지) 는 JSON `elements[].description` 에 산문으로 명시한다

## 다이얼로그·시트 변형 — 항상 온전한 오버레이로 ⚠️

같은 다이얼로그·시트의 상태 변형(초기·입력 중·유효성 오류·전송 중·전송 완료 등)을 fragment 로 분리해 보일 때, **각 변형은 헤더·본문·푸터가 모두 있는 온전한 오버레이 형태로** 그린다. 변경된 부분(버튼 상태·인풋 값·에러 메시지 등)만 떼어 그리지 않는다.

```html
<!-- ❌ 전송 중 변형인데 버튼만 잘라서 -->
<bp-fragment id="find-password-sending" title="비밀번호 찾기 — 발송 처리 중">
  <bp-button disabled>전송 중...</bp-button>
</bp-fragment>

<!-- ✅ 온전한 다이얼로그 전체. 변한 지점(input disabled, 버튼 spinner) 만 스샷 안에 반영 -->
<bp-fragment id="find-password-sending" title="비밀번호 찾기 — 발송 처리 중">
  <bp-dialog open>
    <bp-dialog-portal><bp-dialog-overlay>
      <bp-dialog-content>
        <bp-dialog-header>
          <bp-dialog-title>비밀번호 찾기</bp-dialog-title>
          <bp-dialog-description>등록된 이메일로 재설정 링크를 보냅니다</bp-dialog-description>
        </bp-dialog-header>
        <bp-field>
          <bp-label for="reset-email-sending">이메일</bp-label>
          <bp-input id="reset-email-sending" value="user@example.com" disabled></bp-input>
        </bp-field>
        <bp-dialog-footer>
          <bp-button class="w-full" disabled>
            <bp-spinner data-icon></bp-spinner>전송 중...
          </bp-button>
        </bp-dialog-footer>
      </bp-dialog-content>
    </bp-dialog-overlay></bp-dialog-portal>
  </bp-dialog>
</bp-fragment>
```

**왜**:
- 변형은 "이 오버레이가 이런 상태일 때 어떻게 보이는가" 를 그리는 것이다. 컨테이너를 생략하면 검토자가 어디에 놓이는지 매번 추정해야 한다
- `bp-area` 는 각 fragment 를 독립 카드로 감싸 가로 나열하므로, 같은 다이얼로그의 변형이 반복돼도 **시각적 반복이 곧 "이 다이얼로그의 상태 매트릭스" 라는 의미**가 된다 — 스택 케이스의 중복 렌더링과 달리 의도된 반복이다
- 스택 상황(알랏 얹힘) 과 구분하는 기준: 알랏은 **별개 오버레이 컴포넌트**가 올라타는 것이므로 베이스를 숨기고 알랏만. 변형은 **같은 오버레이의 상태 변화**이므로 그 오버레이 자체를 계속 그린다

## 오버레이 내부 data-element 매칭 — 자주 깨지는 지점 ⚠️

rail 의 눈(eye) 버튼 locate 는 JSON `elements[].name` 과 정확히 같은 `data-element` 가 붙은 노드를 찾아 스크롤·하이라이트한다 (매칭 로직 상세: [`bp-descriptions.md`](./components/bp-descriptions.md#위치-보기-eye-버튼)). 오버레이 안 요소에서 매칭이 안 되는 경우가 많은데, **"JSON 이 가리키는 게 오버레이 전체인지, 내부 특정 위젯인지"** 를 먼저 판정해야 어디에 `data-element` 를 붙일지 결정된다.

### 판정 기준 — 오버레이 전체 vs 내부 위젯

| JSON `name` 이 가리키는 것 | `data-element` 를 붙일 곳 | 예시 |
|---|---|---|
| **오버레이 전체의 상태/안내/에러/결과** | 바깥 `<bp-dialog open>` / `<bp-alert-dialog open>` / `<bp-sheet open>` wrapper | "발송 완료 안내", "네트워크·서버 오류 알랏", "인증 실패 에러", "로그아웃 확인" |
| **오버레이 안의 특정 위젯** (클릭·입력·표시) | 그 위젯 노드 | "재설정 메일 보내기 버튼", "이메일 입력 필드", "닫기 버튼" |

**절대 안 되는 패턴**: JSON 은 오버레이 전체 상태(`"발송 완료 안내"`) 를 가리키는데 `data-element` 를 **안쪽 텍스트 노드**(`<bp-dialog-description>` / `<bp-alert-dialog-title>`) 에만 붙이는 것. 눈 버튼을 누르면 한 줄 텍스트만 하이라이트되고 다이얼로그 카드 전체 컨텍스트가 안 잡힌다.

```html
<!-- ❌ JSON "발송 완료 안내" 는 "이 다이얼로그가 발송 완료 상태" 라는 뜻인데 안내 텍스트만 걸려 있음 -->
<bp-dialog open>
  <bp-dialog-content>
    <bp-dialog-header>
      <bp-dialog-title>이메일을 확인해 주세요</bp-dialog-title>
      <bp-dialog-description data-element="발송 완료 안내">입력하신 이메일로 재설정 링크를 보냈어요.</bp-dialog-description>
    </bp-dialog-header>
    <bp-dialog-footer><bp-button>닫기</bp-button></bp-dialog-footer>
  </bp-dialog-content>
</bp-dialog>

<!-- ✅ 바깥 wrapper 에. eye 버튼 → 다이얼로그 카드 전체로 스크롤·하이라이트 -->
<bp-dialog open data-element="발송 완료 안내">
  <bp-dialog-content>…동일 내용…</bp-dialog-content>
</bp-dialog>
```

### 자주 깨지는 원인 4가지

1. **JSON 이 오버레이 전체를 가리키는데 내부 텍스트 노드에만 `data-element` 를 붙임**
   - 증상: eye 버튼 → 안내 문구 한 줄만 하이라이트되고 카드 전체가 안 잡힘
   - ✅ 바깥 overlay wrapper 에 붙인다 (위 판정 기준 표 참조)
   - ⚠️ 이 실수가 가장 흔함. JSON 이름에 "… 안내", "… 오류", "… 에러", "… 결과", "… 확인" 이 포함되면 거의 항상 wrapper 쪽이 맞다

2. **반대 방향 — JSON 이 내부 위젯을 가리키는데 바깥 wrapper 에만 붙임**
   - JSON 에 "전송 버튼", "이메일 인풋" 같은 위젯 단위 element 가 있는데 HTML 은 `<bp-dialog data-element="비밀번호 찾기 다이얼로그">` 하나뿐 → 내부 위젯은 locate 불가
   - ✅ 각 위젯 노드(버튼·인풋 등) 에 **개별** `data-element` 를 붙인다
   - **오버레이 전체 element 와 내부 위젯 element 가 JSON 에 함께 있으면 둘 다 붙인다** — 바깥에 하나, 안에 여러 개. 매칭은 각자 자기 이름으로만 찾으므로 충돌 없음

3. **`bp-dialog-title` / `bp-alert-dialog-description` 같은 의미 태그의 textContent 를 element 로 간주**
   - 매칭은 오직 `data-element` 속성으로만 일어난다. 타이틀 텍스트가 "비밀번호 찾기" 라고 해서 자동으로 element 가 되지 않는다
   - ✅ JSON 에 넣을 이름과 동일한 문자열을 해당 노드에 `data-element="..."` 속성으로 명시. 단, 위 판정 기준을 먼저 확인해 **JSON 이 오버레이 전체를 가리킨다면 타이틀이 아니라 wrapper 에** 붙인다

4. **이름 문자열 불일치 — 공백·중점·괄호·줄바꿈 차이, 그리고 컴포넌트 종류 접미사**
   - JSON: `"네트워크·서버 오류 알랏"` vs HTML: `"네트워크/서버 오류 알랏"` → unmatched
   - JSON: `"전송 중 버튼"` vs HTML: `"전송중 버튼"` → unmatched (공백 하나)
   - ✅ 복붙 기준으로 **완전히 동일하게** 유지. 한국어 구분자(`·`, `/`, `-`) 와 공백 주의

   **⚠️ 가장 자주 반복되는 변종 — 컴포넌트 종류 접미사 추가**

   HTML 을 쓸 때 wrapper 가 `<bp-alert-dialog>` / `<bp-dialog>` / `<bp-sheet>` 라는 사실이 눈에 보이니까, `data-element` 에 자연스럽게 "알랏" / "다이얼로그" / "시트" 같은 **컴포넌트 종류 접미사** 가 붙어버린다. JSON 에는 의미 기반 이름만 있는데 HTML 에서 혼자 접미사가 붙어 매칭이 깨진다.

   | JSON `elements[].name` | 자주 나오는 틀린 HTML | 왜 틀렸나 |
   |---|---|---|
   | `이메일 형식 오류` | `data-element="이메일 형식 오류 알랏"` | " 알랏" 접미사가 JSON 에 없음 |
   | `인증 실패 에러` | `data-element="인증 실패 알랏"` | "에러" → "알랏" 로 단어가 바뀜 |
   | `네트워크·서버 오류` | `data-element="네트워크·서버 오류 알랏"` | " 알랏" 접미사가 JSON 에 없음 |
   | `재설정 메일 보내기 버튼` | `data-element="보내기 버튼"` | 앞 수식어 생략 |

   **규칙**: 컴포넌트 종류를 이름에 포함하고 싶으면 **JSON 기준으로** 정한다 — JSON 에 "… 알랏" 이면 HTML 도 "… 알랏", JSON 에 "…" 만 있으면 HTML 도 "…" 만. 한쪽에만 접미사가 붙는 상황 금지.

   **왜 자주 반복되는가**: JSON 은 화면명세 시점에 의미 기반으로 네이밍되고, HTML 은 코드 시점에 **엘리먼트 종류** 가 보이므로 이름에 자동으로 밀려 들어간다. 두 작성 시점이 다르기 때문에 자연스럽게 발생하는 drift.

### 종합 예제

JSON 이 오버레이 전체(오류 알랏) + 내부 위젯(닫기·다시 시도) 세 가지 element 로 분해되어 있는 경우:

```jsonc
"elements": [
  { "name": "네트워크·서버 오류 알랏", "description": "발송 중 네트워크 오류 시 노출되는 알랏 전체 상태" },
  { "name": "닫기 버튼", "description": "알랏을 닫고 입력 폼으로 복귀" },
  { "name": "다시 시도 버튼", "description": "마지막 요청을 재전송" }
]
```

```html
<!-- ✅ 바깥 wrapper 에 오버레이 전체 element, 안쪽 위젯에 각 버튼 element -->
<bp-alert-dialog open data-element="네트워크·서버 오류 알랏">
  <bp-alert-dialog-portal><bp-alert-dialog-overlay>
    <bp-alert-dialog-content size="sm">
      <bp-alert-dialog-header>
        <bp-alert-dialog-title>일시적인 오류가 발생했어요</bp-alert-dialog-title>
        <bp-alert-dialog-description>네트워크 또는 서버 오류로 메일을 보내지 못했어요…</bp-alert-dialog-description>
      </bp-alert-dialog-header>
      <bp-alert-dialog-footer>
        <bp-alert-dialog-cancel data-element="닫기 버튼">닫기</bp-alert-dialog-cancel>
        <bp-alert-dialog-action data-element="다시 시도 버튼">다시 시도</bp-alert-dialog-action>
      </bp-alert-dialog-footer>
    </bp-alert-dialog-content>
  </bp-alert-dialog-overlay></bp-alert-dialog-portal>
</bp-alert-dialog>
```

주의: title·description 에는 `data-element` 안 붙인다 — JSON 에 별도 element 로 등재돼 있지 않으니까. 붙이면 "의도에 없던 매칭" 이 생긴다.

**작성 절차 (권장)**: JSON `elements[]` 배열을 먼저 확정 → 각 `name` 을 복사해 HTML 의 해당 노드에 `data-element` 로 붙여넣기. 반대 방향(HTML 먼저 쓰고 JSON 을 끼워맞춤)으로 하면 불일치가 누적된다.

## 메인 wireframe vs 별도 파일 — 기본은 "메인 fragment 포함"

명세에서 `sheet_*.md` / `dialog_*.md` 로 분리되어 있어도 **와이어는 기본 메인 wireframe 안에 fragment 로 모두 포함**한다. 별도 파일 (`wireframe_sheet_{name}.html` / `wireframe_dialog_{name}.html`) 은 **opt-in** — 기획자가 게이트 2 에서 명시적으로 이름을 말한 경우에만 추가 생성한다 ([wireframe-harness/confirm-gates.md](../../wireframe-harness/references/confirm-gates.md#게이트-2--시트다이얼로그-분리-여부-오케스트레이터가-소유) 참조).

| 표현 | 언제 |
|------|------|
| 메인 와이어 안 `<bp-fragment>` + `<bp-dialog open>` (기본) | 트리거 컨텍스트 + "어디서 어떤 오버레이가 뜨는지" 를 검토자가 한눈에 봐야 할 때 (= 거의 항상) |
| 별도 `wireframe_sheet_{name}.html` 파일 (opt-in) | 그 시트 자체의 풍부한 상태 변형(초기·입력중·전송중·에러·결과) 을 보여줘야 할 때 |

두 표현은 공존할 수 있다 — 별도 파일을 만들어도 메인 와이어 안 fragment 는 그대로 유지한다 (트리거 컨텍스트는 메인이 SSOT).
