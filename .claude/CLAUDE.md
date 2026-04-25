# Architecture
Web2, java spring backend - JDK 17, expo,react native frontend,r2 storage,supabase
# Conventions

# Commands

# prohibited pattern

## 금지 - basic
- critical한 파일 임의 수정 금지

## 금지 — Backend  
- req.body 직접 DB, userId from body
- any 타입, 에러 raw throw

## 금지 — Frontend
- useEffect 안 fetch, 인라인 스타일

# Testing & Verify

# Past Failures -> Rules
- 실패/의도와 다른 에러 발생 시 여기에 한줄씩 추가

# Workflow Rules

- 새 모듈/기능 작업 시작 전, 첫 코드 작성 직전에 advisor 호출.
  형식: "Approach check: [모듈명], [핵심 판단 지점 2-3개]"
  → Skill("advisor") 로드 후 Agent(model: "opus")로 위임. 응답은 100단어 이내, 단계 나열로만.

- "작업 완료" 선언 직전 advisor 재호출.
  형식: "Completion check: [변경된 파일], [회귀 우려 지점]"
  → Skill("advisor") 로드 후 Agent(model: "opus")로 위임. 응답은 100단어 이내.

- Plan 문서(plan.md) 없이 Generate 단계 진입 금지.
  plan.md는 Codex가 작성, Claude Code가 비판적 리뷰 후 v2 확정한 것만 유효.

# Cross-Review Loop
- 작업 완료 advisor 호출 후, Codex 세션에 review.md 작성 요청.
- review.md에 issue 1건 이상이면 Claude Code 세션 재개하여 수정.
- 수정 완료 후 같은 review.md에 "RESOLVED: [항목]" 추가하고 Codex 재검증 요청.
- review.md v2도 issue 0건이어야 PR 가능.
- 3회 사이클 후에도 미해결 시 사용자 에스컬레이션. 자동 진행 금지.

# Cross-Review Loop (필수)

작업 완료 선언 직전 advisor 호출 후, 다음 2-pass 교차 검증을 거쳐야 PR 가능:

## Pass 1 — Codex 검증
- Claude Code 세션 종료
- 별도 Codex 세션에서 review.md 작성
- review.md는 다음 3가지를 명시:
  1. plan.md Sprint Contract 미충족 항목 (있으면 모두 나열)
  2. 자동 체크(test/lint/slither/build) 실패 항목
  3. plan.md에 없던 변경사항 (scope creep 식별)
- review.md에 issue 0건이면 Pass 1 완료, 1건 이상이면 Claude Code 세션 재개

## Pass 2 — Claude Code 수정 + 자체 재검증
- Codex review.md 읽고 수정 작업 수행
- 수정 후 자체 테스트/lint 재실행
- 수정 완료 시 review.md에 "RESOLVED: [항목]" 한 줄씩 추가
- 모든 issue가 RESOLVED 되면 작업 완료 advisor 재호출

## Pass 3 — Codex 재검증
- 별도 Codex 세션에서 review.md v2 작성
- v2에서도 issue 발견되면 Pass 2로 복귀
- v2 issue 0건이면 PR 생성 가능

## 최대 반복 횟수
- Pass 1 → Pass 2 → Pass 3 사이클은 최대 3회.
- 3회 후에도 issue 잔존 시 사용자에게 에스컬레이션. 자동 머지 절대 금지.