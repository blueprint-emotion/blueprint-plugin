# HTML 커스텀 엘리먼트 닫는 태그 규칙

HTML 파서는 커스텀 엘리먼트(`bp-*` 포함)의 self-closing(`/>`)을 **무시**한다. `<bp-input ... />`는 브라우저에서 `<bp-input ...>`로 파싱되고, 뒤에 오는 형제 요소들을 **자신의 자식으로 삼킨다** — 레이아웃이 조용히 파괴된다.

```html
<!-- ❌ 브라우저는 이걸 -->
<bp-input id="password" />
<bp-input-group-button>눈 토글</bp-input-group-button>

<!-- ❌ 이렇게 해석한다 (눈 토글이 input 자식으로 삼켜짐) -->
<bp-input id="password">
  <bp-input-group-button>눈 토글</bp-input-group-button>
</bp-input>

<!-- ✅ 반드시 명시적 닫는 태그 -->
<bp-input id="password"></bp-input>
<bp-input-group-button>눈 토글</bp-input-group-button>
```

## 규칙

- **void 요소만** self-closing 허용: `img`, `input`, `br`, `hr`, `meta`, `link`, `area`, `base`, `col`, `embed`, `source`, `track`, `wbr`
- **그 외 모든 태그** (`bp-*` 포함 모든 커스텀 엘리먼트, `div`, `span`, `button` 등): **명시적 `</tag>` 필수**
- 내용 없는 빈 컴포넌트도 `<bp-button></bp-button>` — `<bp-button />` 금지
- IDE가 "일부 브라우저에서 빈 태그가 작동하지 않습니다" 경고를 띄우면 반드시 수정
