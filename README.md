# FlowFrame Wireframe Skill

md 기획서를 [FlowFrame](https://flowframe.co.kr)에 업로드 가능한 HTML 와이어프레임으로 변환하는 AI 에이전트 스킬.

## 설치

```bash
npx skills add @flow-frame/wireframe
```

특정 에이전트에만 설치:

```bash
npx skills add @flow-frame/wireframe -a claude-code
npx skills add @flow-frame/wireframe -a cursor
```

글로벌 설치 (모든 프로젝트에서 사용):

```bash
npx skills add @flow-frame/wireframe -g
```

## 사용법

에이전트에게 md 기획서를 전달하면 FlowFrame 규격 HTML 와이어프레임을 생성합니다.

```
이 기획서를 와이어프레임으로 만들어줘
```

### 생성되는 산출물

- 단일 HTML 파일 (FlowFrame 업로드 가능)
- `flowframe-meta` 메타데이터 포함 (화면 ID, 기능 목록)
- `data-feature` 속성으로 기능 ↔ UI 요소 양방향 연결
- FlowFrame에서 호버 하이라이트, 코멘트 가능

## 지원 에이전트

Claude Code, Cursor, GitHub Copilot, Windsurf, OpenCode, Codex, Cline, Gemini CLI 외 40+ 에이전트 자동 지원.

## 예시

`samples/LOGIN.html` — 로그인 화면 와이어프레임 예시 (FlowFrame 업로드 검증 통과)

## 라이선스

MIT
