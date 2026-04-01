# Wireframe 생성 규칙

## DOM 구조

- feature 컨테이너는 **중첩**한다 (상위가 하위를 감쌈)
- 호버는 CSS만으로 가장 깊은 feature만 강조 — JS 불필요
- 메타데이터 JSON의 계층 구조와 DOM 중첩이 1:1 대응

## 속성 규칙

| 속성 | 대상 | 용도 |
|------|------|------|
| `data-feature` | feature 컨테이너 | featureId 값. 호버 강조 + 코멘트 앵커 |
| `data-label` | feature 컨테이너 | 한국어 표시명 (코멘트 UI용) |
| `data-el` | 개별 UI 요소 | ELEMENT_ID 짧은 키. 부모 `data-feature` 스코프 내 유니크. 플랫폼이 `closest('[data-feature]')` + `data-el`로 전체 ID 조합 |

```html
<!-- 중첩 DOM 예시 -->
<div data-feature="AUTH" data-label="인증">
  <div data-feature="AUTH__LOGIN" data-label="로그인">
    <div data-feature="AUTH__LOGIN__EMAIL" data-label="이메일 로그인">
      <input data-el="EMAIL" placeholder="이메일" />
      <button data-el="SUBMIT">로그인</button>

      <div data-feature="AUTH__LOGIN__EMAIL__MFA" data-label="2단계 인증">
        <input data-el="CODE" placeholder="인증 코드" />
        <button data-el="VERIFY">인증 확인</button>
      </div>
    </div>
  </div>
</div>
```

## 호버 CSS

```css
/* 가장 깊은 호버 feature만 강조 — 버블업 차단 */
[data-feature]:hover:not(:has([data-feature]:hover)) {
  outline: 2px solid rgba(59, 130, 246, 0.6);
  outline-offset: 2px;
}

/* 요소 하이라이트 */
[data-el]:hover {
  outline: 1px solid rgba(59, 130, 246, 0.8);
  background-color: rgba(59, 130, 246, 0.12);
}
```

이 두 규칙을 `<style type="text/tailwindcss">` 블록에 포함한다. JS 없음, CDN 불필요.

## 메타데이터 (`flowframe-meta`)

`<script type="application/json" id="flowframe-meta">`에 배치.

```json
{
  "generator": "flowframe-wireframe-skill",
  "version": "2.0",
  "screenId": "LOGIN-001",
  "title": "로그인",
  "viewport": "pc",
  "purpose": "화면 목적 설명",
  "features": [
    {
      "featureId": "AUTH",
      "label": "인증",
      "spec": "../features/AUTH.md",
      "features": [
        {
          "featureId": "AUTH__LOGIN",
          "label": "로그인",
          "spec": "../features/AUTH.md",
          "elements": [
            { "id": "EMAIL", "type": "input", "label": "이메일", "description": "역할 설명" }
          ],
          "features": [ ... ]
        }
      ]
    }
  ]
}
```

- `features[]`는 재귀 (하위 feature 중첩)
- 각 feature에 `elements` 또는 `features` 중 최소 하나
- `elements[].id`는 ELEMENT_ID (featureId 접두사 없이 짧은 키)
- `spec`은 와이어프레임에서 feature 파일까지 상대 경로

## 고정 영역

메뉴바, 상태바 등 화면 명세에 명시된 고정 영역은 `data-feature`/`data-el` 없이 일반 HTML로 렌더링.
