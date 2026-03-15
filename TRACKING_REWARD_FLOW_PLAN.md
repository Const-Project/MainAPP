# 2주 리포트 상태 저장 및 확인 모달 계획

## 목표

- 비둘기 클릭 기본 동선은 `알림 모달(방명록/기록)`로 유지한다.
- `2주 리포트 확인 모달`은 비둘기 클릭과 분리된 별도 흐름으로 처리한다.
- 앱은 백엔드의 `perfectDay` 조건을 그대로 따른다.
- 모달은 `최근 14일 perfect day 충족` 상태가 된 직후 한 번만 뜬다.
- 사용자가 이미 확인한 같은 주기의 모달은 다시 뜨지 않는다.

## 기준 해석

- `perfect day`:
  - 해당 날짜에 `물 주기`와 `햇빛 주기`를 모두 완료한 날
- `2주 리포트 대상 주기`:
  - 백엔드가 계산하는 최근 14일 윈도우 기준
- `모달 노출 시점`:
  - 앱 임의 계산이 아니라 백엔드가 `이번 주기 리포트를 지금 띄워도 되는지`를 판단한 뒤 내려준다.
  - 실질적으로는 `14번째 perfect day가 완성된 뒤`, 즉 당일 물/햇빛 둘 다 완료되어 조건을 만족한 직후가 된다.

## 권장 동작

1. 사용자가 당일 물 또는 햇빛 중 하나를 수행한다.
2. 백엔드는 daily activity를 갱신한다.
3. 백엔드는 해당 시점에 `최근 14일 perfectDayCount`, `이번 주기 식별자`, `이미 확인했는지`를 계산한다.
4. 조건을 만족하면 앱은 홈 진입 시점 또는 홈 복귀 시점에 `2주 리포트 확인 모달`을 자동 노출한다.
5. 사용자가 모달을 닫거나 CTA를 누르면 백엔드에 `이번 주기 확인 완료`를 저장한다.
6. 같은 주기 동안은 다시 노출하지 않는다.

## MainBE 단계별 계획

### 1단계: 주기 상태 응답 정의

- 새 응답 DTO 추가
  - 예시: `TrackingPromptStatusResponse`
- 포함 필드
  - `eligible`: 지금 모달 노출 대상인지
  - `perfectDayCount`: 최근 14일 perfect day 수
  - `windowStart`
  - `windowEnd`
  - `cycleKey`: 이번 2주 주기를 식별하는 값
  - `alreadyViewed`: 이번 주기를 이미 확인했는지
  - `message`: 기존 리포트 문구 재사용 가능

### 2단계: 확인 이력 저장 모델 추가

- 새 엔티티 추가 권장
  - 예시: `TrackingReportView`
- 필드 예시
  - `id`
  - `user`
  - `cycleKey`
  - `viewedAt`
- 제약 조건
  - `user + cycleKey` unique

### 3단계: 상태 조회 API 추가

- 예시
  - `GET /api/v1/tracking/report/status`
- 역할
  - 최근 14일 perfect day 계산
  - 현재 주기 식별
  - 이번 주기 확인 여부 확인
  - `eligible = perfectDayCount >= 14 && alreadyViewed == false`

### 4단계: 확인 완료 API 추가

- 예시
  - `POST /api/v1/tracking/report/confirm`
- 요청값
  - `cycleKey`
- 역할
  - 사용자가 이번 주기 리포트를 확인했다는 상태 저장

### 5단계: 기존 activity 기록 로직과 연결

- 현재 `GardenService`의 일일 활동 기록 로직은 유지
- 별도 복잡한 실시간 push 없이도 충분
- 핵심은 홈에서 상태 조회 시 `eligible`을 정확히 계산하는 것

### 6단계: 판단 기준 단일화

- 앱은 `praiseDayCount >= 14`만 보고 띄우지 않는다.
- 백엔드 `eligible`만 신뢰한다.
- 이렇게 해야 다음 문제를 막을 수 있다.
  - 같은 주기 재노출
  - 홈 재진입 때 중복 노출
  - 클라이언트와 서버 계산 불일치

## MainAPP 단계별 계획

### 1단계: 비둘기 동선 유지

- 현재 비둘기 클릭:
  - `알림 모달(방명록/기록)`
- 유지
- 2주 리포트 모달은 비둘기 클릭에서 열지 않는다.

### 2단계: 홈 진입 시 상태 조회

- 홈 API와 별도 query 또는 home-summary 확장 중 하나 선택
- 권장
  - 별도 query: `useTrackingPromptStatus`
- 조회 시점
  - 홈 첫 진입
  - 물/햇빛 액션 성공 후 invalidate
  - 홈 화면 복귀 시 refetch

### 3단계: 자동 노출 조건

- 앱 조건
  - `visibleCandidate = status.eligible === true`
- 자동 노출 위치
  - `HomeScreen`
- 추가 가드
  - 같은 앱 세션에서 이미 연 경우 local state로 중복 open 방지

### 4단계: 확인 모달 컴포넌트 연결

- 기존 `HomeTrackingModal` 재사용 또는 분리
- 권장
  - 현재 `HomeTrackingModal`을 `2주 리포트 확인 모달` 전용으로 유지
- 표시 내용
  - `perfectDayCount`
  - 백엔드 `message`
  - 확인 CTA

### 5단계: 확인 완료 처리

- 사용자가 모달 닫기 또는 CTA 누를 때
  - `POST /api/v1/tracking/report/confirm`
- 성공 후
  - status query invalidate
  - 모달 닫기

### 6단계: 물/햇빛 액션과의 연결

- 현재 `postGardenSunlight`, `postGardenMyWater` 성공 시 홈 query만 invalidate 중
- 이후 추가
  - `tracking-report-status` invalidate
- 이유
  - 2주째 되는 날 당일 두 액션을 모두 완료한 직후,
    홈에 돌아왔을 때 곧바로 모달 노출 가능해야 함

## 추천 API 계약

### 상태 조회 응답 예시

```json
{
  "isSuccess": true,
  "code": "COMMON200",
  "message": "성공입니다.",
  "result": {
    "eligible": true,
    "alreadyViewed": false,
    "perfectDayCount": 14,
    "cycleKey": "2026-03-13",
    "windowStart": "2026-02-28",
    "windowEnd": "2026-03-13",
    "message": "2주 동안 꾸준히 돌봐주셨어요."
  }
}
```

### 확인 완료 요청 예시

```json
{
  "cycleKey": "2026-03-13"
}
```

## UX 기준

- 비둘기:
  - 항상 알림 모달
- 2주 리포트:
  - 조건 충족 직후 홈에서 자동 팝업
- 이미 본 같은 주기 리포트:
  - 다시 자동 팝업 금지
- 다음 주기:
  - 새 `cycleKey`에서 다시 가능

## 구현 순서

1. MainBE
   - 상태 조회 DTO/API 추가
   - 확인 이력 저장 테이블/엔티티 추가
   - 확인 완료 API 추가
2. MainAPP
   - 상태 query 추가
   - 홈 자동 노출 로직 추가
   - 확인 완료 mutation 추가
   - 물/햇빛 성공 후 상태 query invalidate 추가
3. QA
   - 14일 미만: 모달 미노출
   - 14일 달성 직후: 1회 노출
   - 확인 후 홈 재진입: 재노출 없음
   - 다음 주기 달성: 다시 노출

## 메모

- 다음 커밋에서는 현재 워킹트리에 남아 있는 `src/assets/icons/sun.svg`, `src/assets/icons/water.svg`도 함께 정리해서 포함한다.
