---
description: (프로토타입) 로컬 에이전트 listener에 long-poll로 연결해 platform에서 온 편집 요청을 수신한다. 한 건 수신 후 종료.
argument-hint: (인자 없음)
---

# /bp:agent-listen (prototype)

로컬에 띄운 agent listener(`http://127.0.0.1:7777`)의 `/next` 엔드포인트를 long-poll 로 호출해 platform 에서 온 편집 요청을 수신한다.

> ⚠️ 이 커맨드는 **기술 검증용 프로토타입**이다. 실제 리스너 루프·인터랙션은 추후 설계된다.

## 사전 조건

- `prototypes/agent-listener/listener.js` 가 기동 중이어야 한다:
  ```bash
  cd prototypes/agent-listener && node listener.js
  ```

## 실행 절차

1. **헬스체크** — `Bash` 로 `curl -sS -w '\n%{http_code}' http://127.0.0.1:7777/health` 를 호출. 2xx 아니면 "listener 가 응답하지 않아요" 안내하고 종료.

2. **long-poll** — `Bash` 로 다음을 실행한다:
   ```bash
   curl -sS -w '\nHTTP_STATUS=%{http_code}' --max-time 35 http://127.0.0.1:7777/next
   ```
   최대 30초 대기하며 listener 가 `/enqueue` 를 받는 순간 즉시 응답이 돌아온다.

3. **응답 처리**:
   - `HTTP_STATUS=200` + JSON 본문: 편집 요청 수신. 아래 형식으로 사용자에게 요약 출력:
     ```
     📩 편집 요청 수신

     앵커:  {payload.anchor}
     요청:  {payload.prompt}
     대상:  {payload.repo} · 버전 {payload.version} · {payload.flavor}
     수신:  {receivedAt}
     ```
   - `HTTP_STATUS=204`: "요청 없음 (30초 타임아웃)" 출력하고 종료.
   - 그 외 에러: 원문 그대로 출력 + "listener 재시작 권장" 안내.

4. 수신 이벤트가 있었으면 사용자에게 **"이 요청을 지금 처리할까요? (이 프로토타입은 실제 파일 수정은 하지 않는다)"** 를 묻고 종료.

## 산출물

없음. 이 커맨드는 이벤트 수신·표시까지만 한다. 실제 편집·커밋은 후속 커맨드(미정)에서 수행.
