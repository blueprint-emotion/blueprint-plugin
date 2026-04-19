# bp-textarea

멀티라인 텍스트 입력 컴포넌트.

## 속성

| 컴포넌트 | prop | 값 | 설명 |
|---|---|---|---|
| `bp-textarea` | `value` | string | 초기 텍스트 값 |
| `bp-textarea` | `placeholder` | string | 미입력 시 표시 텍스트 |
| `bp-textarea` | `rows` | number | 고정 줄 수. 지정하면 자동 확장 비활성화 |
| `bp-textarea` | `cols` | number | 고정 열 수 |
| `bp-textarea` | `disabled` | boolean | 비활성화 |
| `bp-textarea` | `required` | boolean | 폼 필수 입력 |
| `bp-textarea` | `readonly` | boolean | 읽기 전용 |
| `bp-textarea` | `name` | string | 폼 name |
| `bp-textarea` | `minlength` | number | 최소 글자 수 |
| `bp-textarea` | `maxlength` | number | 최대 글자 수 |
| `bp-textarea` | `aria-invalid` | boolean | 오류 상태 시각화 |

## shadcn과의 차이

- **초기값은 `value` 속성만 인식한다.** 네이티브 `<textarea>` 처럼 자식 텍스트(`<bp-textarea>내용</bp-textarea>`)로 초기값을 주는 방법은 동작하지 않는다. 반드시 `value` 속성을 사용해야 한다.
- **`rows` 미지정 시 자동 확장**: shadcn `Textarea`는 고정 `min-h`를 가지지만, `bp-textarea`는 `rows` 없으면 `field-sizing-content`로 내용에 맞게 높이가 자동 조정된다. 고정 높이가 필요하면 `rows`를 지정한다.
- **별도 `variant`/`size` 없음**: shadcn `Textarea`와 동일하게 variant/size prop은 존재하지 않는다.

## 미지원

- 자식 텍스트로 초기값 지정 (자식 텍스트는 무시됨)
- `variant`, `size` prop (shadcn Textarea에도 없음)
- `onInput`, `onChange` 콜백 → 표준 DOM `input` / `change` 이벤트

## 예제

```html
<!-- placeholder만 있는 기본 textarea -->
<bp-textarea placeholder="메모를 입력하세요"></bp-textarea>

<!-- 초기값은 반드시 value 속성으로 -->
<bp-textarea value="안녕하세요, 여기에 내용을 입력하세요."></bp-textarea>

<!-- rows로 고정 높이 -->
<bp-textarea placeholder="설명을 입력하세요" rows="4"></bp-textarea>
```
