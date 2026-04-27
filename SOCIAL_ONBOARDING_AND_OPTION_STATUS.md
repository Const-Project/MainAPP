# Social Onboarding And Option Menu Status

## 1. 소셜 신규 가입을 임시 상태 기반으로 바꾸는 백엔드 계획

### 목표

- 소셜 인증 직후에는 계정을 최소 정보로만 생성하거나 온보딩 미완료 상태로 둔다.
- 유저 닉네임이 확정되기 전에는 서비스 내 노출 이름을 정식 값으로 사용하지 않는다.
- 닉네임 저장이 끝난 뒤에만 식물 등록과 서비스 온보딩을 이어간다.

### 현재 상태

- MainAPP는 소셜 신규 유저를 `SocialNickname` 화면으로 보낸다.
- 하지만 MainBE는 `/api/v1/auth/supabase` 처리 시점에 이미 사용자를 저장한다.
- 이때 `AuthService.buildUniqueNickname()`으로 임시 닉네임을 즉시 생성한다.
- 그래서 프론트가 닉네임을 받기 전에 임시 닉네임이 방명록, 프로필 등에 남을 수 있다.

### MainBE에서 바꿔야 할 점

#### 1. AuthService 신규 소셜 가입 처리

- 파일: `domain/member/auth/service/AuthService.java`
- 현재:
  - 신규 소셜 유저면 즉시 `User` 저장
  - `buildUniqueNickname()`으로 임시 닉네임 생성
- 변경:
  - 닉네임 미확정 상태를 표현하는 필드를 두고 저장
  - 또는 별도 임시 유저 상태를 둔다
  - 응답에 `requiresNicknameSetup` 같은 명시적 값을 내려준다

#### 2. User 엔티티 온보딩 상태 필드

- 파일: `domain/member/user/domain/User.java`
- 후보 필드:
  - `nicknameConfirmed`
  - `onboardingCompleted`
- 목적:
  - 닉네임 확정 전/후를 서버가 명확히 구분

#### 3. 닉네임 확정 API 의미 강화

- 현재 엔드포인트: `PATCH /api/v1/users/me/nickname`
- 이 API를 최초 닉네임 확정에도 사용하거나,
- 별도 `POST /api/v1/users/me/onboarding/nickname` 같은 전용 엔드포인트를 둘 수 있다

#### 4. 서비스 접근 가드

- 닉네임 미확정 유저는 일부 기능 진입 전 프론트가 닉네임 화면으로 유도
- 백엔드도 필요하면 온보딩 미완료 상태에서 특정 쓰기 기능을 제한

### MainAPP에서 맞춰야 할 점

- 소셜 로그인 성공 후 `newUser` 또는 `requiresNicknameSetup`이면 닉네임 화면으로 이동
- 닉네임 저장 성공 후에만 `RegistrationAvatar`로 진행
- 로그인 직후 프로필/방명록/알림 캐시를 갱신해서 임시 닉네임이 남지 않게 한다

### 권장 순서

1. MainBE에 온보딩 상태 필드 추가
2. `/api/v1/auth/supabase` 응답에 `requiresNicknameSetup` 추가
3. 닉네임 확정 API 의미 정리
4. MainAPP 분기값을 `newUser` 중심에서 `requiresNicknameSetup` 중심으로 전환

## 2. 설정 화면 메뉴 현황 점검

대상 메뉴:
- 유저 닉네임 변경
- 아바타 닉네임 변경
- 이용 약관
- 서비스 안내

### 유저 닉네임 변경

- Option 메뉴 행 존재: 있음
- 전용 설정 화면: 없음
- 관련 프론트 화면: `SocialNicknameScreen`은 존재하지만 온보딩용이고 설정 메뉴와는 미연결
- 백엔드 API: 있음
  - `PATCH /api/v1/users/me/nickname`
- 현재 API 연결: 설정 메뉴에는 안 되어 있음

### 아바타 닉네임 변경

- Option 메뉴 행 존재: 있음
- 전용 설정 화면: 없음
- 백엔드 API: 있음
  - `PATCH /api/v1/users/me/{avatarId}`
  - body의 `newAvatarName`으로 변경 가능
- 현재 API 연결: 설정 메뉴에는 안 되어 있음

### 이용 약관

- Option 메뉴 행 존재: 있음
- 전용 프론트 화면: 없음
- 백엔드 API: 있음
  - `GET /api/v1/policy`
- 현재 API 연결: 안 되어 있음

### 서비스 안내

- Option 메뉴 행 존재: 있음
- 전용 프론트 화면: 없음
- 백엔드 API: 확인되지 않음
- 현재 API 연결: 안 되어 있음

## 결론

- 설정 메뉴 4개 중 실제로 메뉴와 연결된 것은 없다.
- 백엔드 API가 확인된 것은
  - 유저 닉네임 변경
  - 아바타 닉네임 변경
  - 이용 약관 조회
- 서비스 안내는 현재 코드 기준으로 전용 화면도 없고 백엔드 API도 보이지 않는다.
