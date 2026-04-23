# bp-board

bp 전용 — shadcn 포팅 없음. 와이어프레임의 **가로 Figma 보드** 컨테이너. 한 파일에 1개만 둔다.

## 속성

| prop | 값 | 설명 |
|---|---|---|
| — | — | 속성 없음 |

호스트 element에 `class="..."`를 직접 넘기면 기본 유틸(`flex items-start gap-8 p-8 w-max`)에 머지된다.

## Composition

```
bp-board                 ← 가로 보드 (body 직계 자식)
  bp-frame               ← 정상 상태 프레임 (필수 1개)
  bp-area ...            ← 상태 조각 영역 (0~N개)
```

- `body` 직계 자식으로 둔다
- `width: max-content` — 자식들의 합산 폭만큼 넓어지고 body가 가로 스크롤
- `items-start` — 높이가 다른 frame/area가 상단 정렬

## 함정

- **한 파일에 `bp-board`는 1개만**. 복수 배치하면 우측 rail이 어떤 보드와 매칭될지 모호해진다.
- `bp-board` 밖에 `bp-frame`/`bp-area`를 두지 않는다 — 보드 컨텍스트 없이 놓이면 가로 레이아웃이 깨진다.
- `bp-frame`과 `bp-area`를 섞어서 배치할 때, **정상 프레임이 가장 왼쪽**에 오도록 한다 (읽는 순서).

## 예제

```html
<body>
  <bp-board>
    <bp-frame viewport="pc">
      <bp-page>
        <bp-page-content>
          <bp-section data-feature="PROJECT__INFO" data-label="프로젝트 카드 그리드">
            <!-- 정상 UI -->
          </bp-section>
        </bp-page-content>
      </bp-page>
    </bp-frame>

    <bp-area>
      <bp-fragment id="grid-empty" title="빈 목록" description="프로젝트 0개">
        <!-- 빈 상태 UI -->
      </bp-fragment>
      <bp-fragment id="grid-api-error" title="GitHub API 에러" description="저장소 fetch 실패">
        <!-- 에러 상태 UI -->
      </bp-fragment>
    </bp-area>
  </bp-board>
</body>
```