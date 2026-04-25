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

## Review Protocol

- plan.md 작성 시 다음 항목 필수 포함:
  1. 입력/출력 명세
  2. Sprint Contract — 통과 기준 (테스트 케이스, gas 한도, slither 통과)
  3. 누락된 엣지 케이스 후보 3개
  4. 더 단순한 대안 1개

- Generate 완료 후 별도 세션에서 호출됨. 검증 항목:
  1. plan.md Sprint Contract 만족 여부 (의미 수준)
  2. 자동 체크(test/lint/slither) 통과 여부
  3. plan.md에 없던 변경사항 식별
  
- issue 발견 시 PR 머지 차단, Claude Code 세션 재개 트리거.

# Re-review Protocol

review.md 작성 시 버전 표기 필수:
- 첫 검증: review.md (Pass 1)
- 재검증: review.md에 "## Re-review" 섹션 append (Pass 3)

재검증 항목:
1. 이전 issue가 RESOLVED 표기되어 있고 실제로 수정됐는지 확인
2. 수정 과정에서 새로 도입된 회귀 이슈 식별
3. plan.md Sprint Contract 만족 여부 재확인

재검증에서 issue 발견 시 "REGRESSION" 또는 "UNRESOLVED" 라벨 명시.