# bp-section

bp 전용 — shadcn 포팅 없음. 와이어프레임에서 기능(feature) 단위를 구분하는 구조 래퍼. `display: contents`라 시각·레이아웃에 영향 없음.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-section` | `data-feature` | `{DOMAIN}__{ID}` (필수) | featureId. 플랫폼이 기능 영역을 인식하는 기준. 화면명세의 `features[].id`와 일치해야 함 |
| `bp-section` | `data-feature-key` | kebab-case 문자열 (메인 UI에서 필수) | 페이지 내 슬롯 식별자. 같은 feature가 여러 번 등장할 때 위치를 구분하는 key. 페이지 전역 unique |
| `bp-section` | `data-label` | 문자열 (필수) | 표시명. JSON description의 `sections[].label`과 일치시킨다 |

## JSON description과의 매칭

메인 UI의 `<bp-section data-feature="X">`는 `<script type="application/bp-description+json">`의 `sections[].feature`와 값이 같아야 rail이 매칭된다. 메인 UI에서는 같은 `data-feature`가 여러 번 나와도 JSON section은 하나만 두고, HTML의 `data-feature-key`로 각 슬롯을 구분한다. 같은 섹션의 자식에 `data-element="Y"`를 붙이면 `elements[].name="Y"`와 양방향 하이라이트된다.

```html
<bp-section data-feature="PRODUCT__INFO" data-feature-key="summary" data-label="상품 정보">
  <h2 data-element="상품명">샘플 상품명</h2>
  <p data-element="판매가">36,000원</p>
</bp-section>
```

```json
{
  "feature": "PRODUCT__INFO",
  "label": "상품 정보",
  "elements": [
    { "name": "상품명", "description": "..." },
    { "name": "판매가", "description": "..." }
  ]
}
```

JSON 스키마 상세는 [`bp-descriptions.md`](./bp-descriptions.md) 참조.

## 상태 조각과의 관계

`bp-section`은 정상 프레임 내부, 그리고 `<bp-fragment>` 내부 모두에서 사용한다. 다만 역할이 다르다.

- 메인 UI `bp-section`: `data-feature` + `data-feature-key`를 가진 feature 핀 앵커
- `<bp-fragment>` 내부 `bp-section`: `data-feature`만 가진 sidebar 매칭용 section. 별도 feature 핀 앵커 아님

같은 영역의 상태 변형(빈·에러·로딩 등)도 같은 `data-feature`/`data-label`을 쓴다 — JSON에서는 하나의 section이지만 시각적으로는 여러 `<bp-fragment>`로 분리된다.

```html
<!-- 정상 -->
<bp-frame viewport="pc">
  <bp-page>
    <bp-page-content>
      <bp-section data-feature="PRODUCT__INFO" data-feature-key="summary" data-label="상품 정보">...</bp-section>
    </bp-page-content>
  </bp-page>
</bp-frame>

<!-- 상태 조각 -->
<bp-area>
  <bp-fragment id="info-sold-out" title="품절" description="재고 0">
    <bp-section data-feature="PRODUCT__INFO" data-label="상품 정보">
      <!-- 품절 variant UI -->
    </bp-section>
  </bp-fragment>
</bp-area>
```

## 함정

- `data-feature` 누락 시 플랫폼이 기능 영역을 인식하지 못해 하이라이트·코멘트 연동이 불가하다.
- 메인 UI `bp-section`에서 `data-feature-key`를 빼면 feature 핀 앵커 위치를 구분할 수 없다.
- `data-feature-key`는 페이지 전역에서 unique해야 한다. `summary`, `detail`, `list`, `empty-state`처럼 의미 있는 key를 쓴다.
- `<bp-fragment>` 내부 `bp-section`에는 `data-feature-key`를 붙이지 않는다.
- `data-feature` 값은 **JSON `sections[].feature`와 정확히 일치**해야 rail 매칭된다 (대소문자·underscore 수 포함).
- `display: contents` 특성상 `getBoundingClientRect()`가 0을 반환한다. 플랫폼 브릿지는 자식들의 rect union으로 영역을 계산한다.
- `bp-section`에 직접 배경색이나 패딩 등 시각 스타일을 주지 않는다. 의미론만 담당한다.
- 같은 `data-feature`를 여러 곳에 쓸 때 `data-label`도 동일하게 유지한다 (정상 프레임과 조각 간 불일치 방지).
