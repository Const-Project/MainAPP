# MainBE 2주 리포트 구현 TODO

## 목적

- 홈에서 자동 노출되는 `2주 리포트 확인 모달`의 판단 기준을 MainBE에서 단일화한다.
- MainAPP은 `eligible`만 신뢰하고, 주기 계산과 확인 여부 저장은 모두 MainBE가 담당한다.

## 완료 기준

- `GET /api/v1/tracking/report/status` 응답으로 홈 자동 노출 여부를 정확히 판단할 수 있어야 한다.
- `POST /api/v1/tracking/report/confirm` 호출 후 같은 `cycleKey`는 다시 노출되지 않아야 한다.
- 최근 14일 perfect day 계산 기준이 앱과 분리되고, 서버 기준으로만 동작해야 한다.

---

## 1단계. 응답/요청 DTO 정의

### 해야 할 일

- 상태 조회 응답 DTO 추가
- 확인 완료 요청 DTO 추가

### 권장 DTO

#### 상태 조회 응답

```json
{
  "eligible": true,
  "alreadyViewed": false,
  "perfectDayCount": 14,
  "cycleKey": "2026-03-13",
  "windowStart": "2026-02-28",
  "windowEnd": "2026-03-13",
  "message": "2주 동안 꾸준히 돌봐주셨어요."
}
```

#### 확인 완료 요청

```json
{
  "cycleKey": "2026-03-13"
}
```

### 체크 포인트

- `eligible`는 앱 표시용 최종 boolean 이어야 한다.
- `cycleKey`는 같은 주기를 식별할 수 있는 고정 값이어야 한다.
- `message`는 기존 리포트 문구 재사용 가능하도록 열어둔다.

---

## 2단계. 확인 이력 저장 모델 추가

### 해야 할 일

- `TrackingReportView` 같은 확인 이력 엔티티/테이블 추가

### 권장 필드

- `id`
- `user`
- `cycleKey`
- `viewedAt`

### 제약 조건

- `user + cycleKey` unique

### 체크 포인트

- 같은 사용자가 같은 주기를 중복 confirm 해도 데이터가 꼬이지 않아야 한다.
- 이후 운영 중 확인 이력 조회가 가능하도록 최소 필드는 남긴다.

---

## 3단계. perfect day 계산 로직 분리

### 해야 할 일

- 최근 14일 기준 perfect day 계산 메서드 추가
- 현재 주기의 `windowStart`, `windowEnd`, `cycleKey` 계산 로직 추가

### perfect day 기준

- 해당 날짜에 `물 주기`와 `햇빛 주기`를 모두 완료한 날

### 체크 포인트

- 앱에서 계산하지 않고 서버에서만 계산해야 한다.
- 최근 14일 윈도우 기준이 고정되어야 한다.
- `cycleKey`는 이 14일 윈도우를 안정적으로 식별할 수 있어야 한다.

---

## 4단계. 상태 조회 API 추가

### 엔드포인트

- `GET /api/v1/tracking/report/status`

### 해야 할 일

- 최근 14일 perfect day 수 계산
- 현재 주기 식별
- 해당 주기 confirm 여부 조회
- `eligible` 계산

### 권장 계산식

```text
eligible = perfectDayCount >= 14 && alreadyViewed == false
```

### 체크 포인트

- MainAPP은 이 값만 보고 모달을 띄우므로, 여기서 최종 판단이 끝나야 한다.
- 홈 재진입 시에도 결과가 일관되어야 한다.

---

## 5단계. 확인 완료 API 추가

### 엔드포인트

- `POST /api/v1/tracking/report/confirm`

### 해야 할 일

- 요청으로 받은 `cycleKey` 검증
- 현재 사용자 기준 확인 이력 저장
- 이미 존재하면 중복 저장 없이 성공 처리하거나 안전하게 예외 처리

### 체크 포인트

- 앱에서 닫기/CTA 둘 다 이 API를 호출하므로 idempotent 하게 만드는 편이 안전하다.
- 다른 주기의 `cycleKey`를 잘못 넣었을 때 처리 정책을 정해야 한다.

---

## 6단계. 기존 activity 기록 로직과 연결 확인

### 해야 할 일

- 현재 물/햇빛 기록 로직은 유지
- 상태 조회 시점에만 perfect day 조건이 반영되도록 연결 확인

### 체크 포인트

- 실시간 push 없이도 홈에서 상태 조회만 하면 즉시 반영되어야 한다.
- 14번째 perfect day가 완성된 당일, 다음 상태 조회에서 `eligible=true`가 나와야 한다.

---

## 7단계. 서비스 계층 구조 정리

### 권장 분리

- `TrackingReportService`
- `TrackingReportQueryService` 또는 기존 서비스 내부 메서드 분리

### 포함되면 좋은 메서드

- `getTrackingPromptStatus(userId)`
- `confirmTrackingPrompt(userId, cycleKey)`
- `calculatePerfectDayCount(userId, windowStart, windowEnd)`
- `resolveCycleKey(windowStart, windowEnd)`

### 체크 포인트

- 컨트롤러에서 계산 로직이 직접 섞이지 않게 한다.
- 테스트 가능한 단위로 메서드를 나눈다.

---

## 8단계. 예외 처리 정책 정리

### 확인할 항목

- 잘못된 `cycleKey` 요청
- 인증되지 않은 사용자 요청
- 중복 confirm 요청
- activity 데이터가 일부 비정상인 사용자

### 권장 방향

- 중복 confirm 은 성공 처리
- 잘못된 요청만 명확히 4xx 처리

---

## 9단계. 테스트 코드 작성

### 최소 테스트 케이스

- 14일 미만이면 `eligible=false`
- 14일 달성 직후 `eligible=true`
- 같은 `cycleKey` confirm 후 `eligible=false`
- 다음 주기 달성 시 새 `cycleKey`로 다시 `eligible=true`
- 중복 confirm 요청 시 안전하게 처리

### 추가 테스트 케이스

- 최근 14일 경계 날짜 포함 여부
- 당일 물만 완료 / 햇빛만 완료인 경우 perfect day 제외

---

## 10단계. MainAPP 연동 확인 포인트

### MainBE 완료 후 확인할 것

- 홈 진입 시 `status` 응답 정상
- 물/햇빛 완료 후 홈 복귀 시 `eligible` 갱신 정상
- 모달 확인 후 같은 주기 재노출 없음
- 다음 주기에서 다시 노출됨

---

## 구현 순서 요약

1. DTO 추가
2. 확인 이력 엔티티/테이블 추가
3. perfect day 및 cycleKey 계산 로직 구현
4. `GET /tracking/report/status` 추가
5. `POST /tracking/report/confirm` 추가
6. 서비스 분리 및 예외 처리 정리
7. 테스트 코드 작성
8. MainAPP 연동 QA

---

## 메모

- MainAPP 쪽은 이미 `status` 조회와 `confirm` 호출 기준으로 연결되어 있다.
- MainBE는 반드시 앱 계산이 아닌 서버 계산 기준으로 `eligible`을 내려줘야 한다.
