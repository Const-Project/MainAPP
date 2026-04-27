# Auth Integration Checklist

이 문서는 `MainFE`, `MainAPP`, `MainBE`가 각각 독립 클라이언트/백엔드로 동작하면서, 공통으로 Supabase OAuth 소셜 로그인을 지원하도록 작업을 쪼갠 체크리스트다.

## 1. 현재 상태 요약

### MainBE
- 공통 인증 백엔드 역할
- `POST /api/v1/auth/supabase` 구현됨
- Supabase access token 검증 후 자체 JWT 발급 구현됨
- refresh API 구현됨

### MainAPP
- 모바일 앱 클라이언트 역할
- Supabase OAuth 로그인 구현 흔적 있음
- 홈, 로그, 피드 등 일부 실제 화면과 API 연동 있음
- 일부 화면은 플레이스홀더
- 서비스 JWT 저장 및 API 인증 부착은 미완성

### MainFE
- 웹 클라이언트 역할
- 현재 기준 Supabase OAuth 로그인 구현 미확인
- 웹용 callback 처리, 서비스 JWT 저장, 보호 라우트 작업 필요

## 2. 목표 상태

- `MainAPP`: 모바일 클라이언트로서 주요 기능 완성 + Supabase OAuth 로그인 완성
- `MainFE`: 웹 클라이언트로서 주요 기능 완성 + Supabase OAuth 로그인 완성
- `MainBE`: 웹/앱 공통 인증 백엔드로 유지
- 공통 인증 흐름:
  1. 클라이언트가 Supabase OAuth 시작
  2. 클라이언트가 Supabase access token 획득
  3. 클라이언트가 `MainBE /api/v1/auth/supabase` 호출
  4. `MainBE`가 자체 access/refresh token 발급
  5. 클라이언트가 서비스 토큰 저장 후 이후 API 호출에 사용

## 3. 공통 선행 작업

### A. 인증 계약 고정
- [ ] `POST /api/v1/auth/supabase` 요청 바디 최종 확정
- [ ] 응답 필드 최종 확정
  - [ ] `accessToken`
  - [ ] `refreshToken`
  - [ ] `userId`
  - [ ] `nickname`
  - [ ] `isNewUser`
- [ ] `POST /api/v1/auth/refresh` 호출 규칙 확정
- [ ] 401, 403, refresh 실패 시 공통 동작 정의
- [ ] 신규 유저와 기존 유저 분기 기준 문서화
- [ ] 로그아웃 정책 정의
  - [ ] 로컬 토큰 삭제
  - [ ] Supabase 세션 정리 여부
  - [ ] 백엔드 refresh token revoke 여부

### B. Supabase 콘솔 설정
- [ ] Google provider 설정 확인
- [ ] Kakao provider 설정 확인
- [ ] 웹 redirect URL 등록
- [ ] 앱 deep link redirect URL 등록
- [ ] 개발/운영 redirect URL 분리
- [ ] 동일 Supabase 프로젝트를 `MainFE`, `MainAPP`, `MainBE`가 쓰는지 확인

### C. 환경변수 정리
- [ ] `MainFE` env 키 이름 정리
- [ ] `MainAPP` env 키 이름 정리
- [ ] `MainBE` env 키 이름 정리
- [ ] 임시 fallback 값 제거
- [ ] 개발/운영 env 분리

## 4. MainBE 작업 체크리스트

### BE-1. 인증 스펙 안정화
- [ ] `AuthController` 응답 구조 재검토
- [ ] Swagger 또는 문서에 소셜 로그인 플로우 명시
- [ ] `SupabaseLoginRequest` 유효성 검증 재확인
- [ ] `AnonymousRegistrationResponse` 명명 검토
  - [ ] 소셜 로그인 응답용 이름이 맞는지 확인
  - [ ] 필요 시 별도 DTO로 분리

### BE-2. 토큰 정책 확정
- [ ] access token 만료 시간 확인
- [ ] refresh token 만료 시간 확인
- [ ] refresh token 재발급 정책 확인
- [ ] 디바이스별 refresh token 저장 정책 확인
- [ ] 다중 로그인 허용 범위 확인

### BE-3. 소셜 로그인 유저 처리 검증
- [ ] 신규 유저 생성 규칙 확인
- [ ] 기존 유저 매핑 규칙 확인
- [ ] provider/sub 기반 유저 매핑 테스트
- [ ] 닉네임 생성 규칙 검증
- [ ] 프로필 이미지 동기화 규칙 검증
- [ ] 이메일 없는 provider 케이스 처리 확인

### BE-4. 인증 보조 API 보완
- [ ] 로그아웃 API 필요 여부 결정
- [ ] 전체 로그아웃 API 필요 여부 결정
- [ ] 현재 사용자 정보 조회 API 필요 여부 결정
- [ ] 앱/웹 초기 진입용 `me` API 필요 여부 결정

### BE-5. 운영 안정성
- [ ] 인증 관련 예외 메시지 정리
- [ ] 토큰/개인정보 로그 노출 여부 점검
- [ ] CORS 설정 검토
- [ ] `Authorization` 헤더 노출/허용 점검
- [ ] 인증 실패 모니터링 포인트 정리

### BE-6. 테스트
- [ ] Google 기존 회원 로그인 테스트
- [ ] Google 신규 회원 로그인 테스트
- [ ] Kakao 기존 회원 로그인 테스트
- [ ] Kakao 신규 회원 로그인 테스트
- [ ] 잘못된 Supabase token 테스트
- [ ] refresh token 재발급 테스트
- [ ] deviceId mismatch 테스트

## 5. MainAPP 작업 체크리스트

### APP-1. 로그인 완료 처리
- [ ] OAuth 성공 후 백엔드 응답을 토큰 스토어에 저장
- [ ] 저장 대상 필드 확정
  - [ ] `accessToken`
  - [ ] `refreshToken`
  - [ ] `userId`
  - [ ] 필요 시 `nickname`
- [ ] `isNewUser`에 따른 분기 처리 추가

### APP-2. 인증 상태 기반 진입 제어
- [ ] 앱 시작 시 hydration 완료 전 로딩 처리
- [ ] 저장된 토큰 존재 시 자동 로그인 분기
- [ ] 미로그인 시 온보딩/로그인 진입
- [ ] 로그인 완료 시 `Main` 진입
- [ ] 로그아웃 시 인증 화면으로 복귀

### APP-3. API 인터셉터 완성
- [ ] `axios instance`에 access token 부착 활성화
- [ ] 401 감지 시 refresh 시도 로직 추가
- [ ] refresh 성공 시 원 요청 재시도
- [ ] refresh 실패 시 토큰 삭제
- [ ] 중복 refresh 요청 방지 처리

### APP-4. 로그아웃 처리
- [ ] 로컬 토큰 삭제 구현
- [ ] Supabase local session 정리 구현
- [ ] 설정 화면 또는 옵션 화면에 로그아웃 연결

### APP-5. 인증 이후 기능 연결
- [ ] 홈 API가 서비스 JWT로 정상 동작하는지 확인
- [ ] 로그 API가 서비스 JWT로 정상 동작하는지 확인
- [ ] 피드 API가 서비스 JWT로 정상 동작하는지 확인
- [ ] 댓글 API가 서비스 JWT로 정상 동작하는지 확인
- [ ] 상세 화면 API가 서비스 JWT로 정상 동작하는지 확인

### APP-6. 플레이스홀더 제거 우선순위 정리
- [ ] 프로필 화면 구현
- [ ] 팔로우 화면 구현
- [ ] 로그 상세 화면 구현
- [ ] 배송 화면 구현
- [ ] 정원 잠금 해제 화면 구현
- [ ] 식물 등록 플로우 구현
- [ ] 데일리 미션 화면 구현

### APP-7. UX 보완
- [ ] 로그인 중 로딩 표시 개선
- [ ] 로그인 실패 메시지 처리
- [ ] OAuth 취소 시 UX 처리
- [ ] 신규 유저 온보딩 후속 플로우 설계

### APP-8. 테스트
- [ ] 앱 cold start 자동 로그인 테스트
- [ ] 앱 재실행 후 세션 유지 테스트
- [ ] access token 만료 후 refresh 테스트
- [ ] refresh 만료 후 로그아웃 테스트
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트
- [ ] 비회원 등록 플로우 테스트

## 6. MainFE 작업 체크리스트

### FE-1. 인증 구조 설계
- [ ] 웹에서 사용할 상태관리 방식 결정
  - [ ] Context
  - [ ] Zustand
  - [ ] React Query + store 혼합
- [ ] 토큰 저장 위치 결정
  - [ ] 메모리
  - [ ] localStorage
  - [ ] secure cookie 사용 여부 검토
- [ ] 보호 라우트 방식 결정

### FE-2. Supabase 웹 클라이언트 추가
- [ ] Supabase client 파일 생성
- [ ] env 연결
- [ ] provider 목록 정의
- [ ] auth 유틸 분리

### FE-3. 웹 OAuth 시작 구현
- [ ] 로그인 화면 또는 진입 버튼 배치
- [ ] Google 로그인 버튼 구현
- [ ] Kakao 로그인 버튼 구현
- [ ] `supabase.auth.signInWithOAuth()` 연결
- [ ] 웹 redirect URL 적용

### FE-4. callback 처리 구현
- [ ] 웹 callback 라우트 생성
- [ ] callback 페이지 로딩 상태 추가
- [ ] Supabase에서 access token 또는 code 처리
- [ ] 토큰 추출 실패 처리
- [ ] 중복 호출 방지 처리

### FE-5. 백엔드 토큰 교환 구현
- [ ] `MainBE /api/v1/auth/supabase` 호출 API 추가
- [ ] 백엔드 응답을 웹 스토어에 저장
- [ ] `isNewUser` 분기 처리
- [ ] 로그인 성공 후 리다이렉트 처리

### FE-6. 웹 API 인증 연결
- [ ] axios/fetch 인터셉터에 service access token 부착
- [ ] 401 시 refresh 호출 구현
- [ ] refresh 성공 시 재시도
- [ ] refresh 실패 시 로그인 화면 복귀

### FE-7. 라우팅 및 화면 보호
- [ ] 로그인 필요 페이지 목록 정리
- [ ] 보호 라우트 적용
- [ ] 로그인 페이지 접근 제한 처리
- [ ] 새로고침 시 로그인 상태 복원
- [ ] 원래 가려던 페이지로 복귀 처리

### FE-8. 로그아웃 처리
- [ ] 서비스 토큰 삭제
- [ ] Supabase 세션 정리
- [ ] 로그아웃 버튼 연결
- [ ] 로그아웃 후 public route 이동

### FE-9. 기능 통합
- [ ] 인증 필요한 기존 API 호출부 점검
- [ ] 유저 상태 의존 화면 점검
- [ ] 피드/로그/댓글/프로필 기능을 인증 구조와 연결
- [ ] 신규 유저 후속 플로우 연결

### FE-10. 테스트
- [ ] 브라우저 새로고침 후 세션 유지 테스트
- [ ] Google 로그인 테스트
- [ ] Kakao 로그인 테스트
- [ ] OAuth 취소 테스트
- [ ] access token 만료 후 refresh 테스트
- [ ] refresh 만료 후 로그아웃 테스트
- [ ] 보호 라우트 접근 테스트

## 7. 권장 구현 순서

### Phase 1. 공통 계약 정리
- [ ] BE 응답/refresh/logout 정책 확정
- [ ] Supabase redirect/env 설정 확정

### Phase 2. MainAPP 인증 완성
- [ ] 로그인 성공 후 서비스 JWT 저장
- [ ] 인터셉터/refresh/로그아웃 완성
- [ ] 인증 상태 기반 진입 제어 완성

### Phase 3. MainFE 인증 신규 구축
- [ ] Supabase 웹 로그인 구현
- [ ] callback 구현
- [ ] 백엔드 토큰 교환 구현
- [ ] 보호 라우트/refresh 완성

### Phase 4. 기능 마무리
- [ ] MainAPP 플레이스홀더 제거
- [ ] MainFE 인증 연동 누락 화면 보완
- [ ] 웹/앱 통합 QA 수행

## 8. 이슈 단위 추천 분해

### Epic A. 공통 인증 규격
- [ ] A-1. 인증 API 응답 스펙 확정
- [ ] A-2. refresh 정책 확정
- [ ] A-3. logout 정책 확정
- [ ] A-4. Supabase provider/redirect 설정 완료

### Epic B. MainBE 인증 안정화
- [ ] B-1. DTO/명명 정리
- [ ] B-2. 인증 예외/로그 정리
- [ ] B-3. 로그아웃 및 `me` API 필요 여부 정리
- [ ] B-4. 소셜 로그인 테스트 케이스 작성

### Epic C. MainAPP 인증 완성
- [ ] C-1. 로그인 후 서비스 토큰 저장
- [ ] C-2. Authorization 인터셉터 활성화
- [ ] C-3. refresh 재시도 구현
- [ ] C-4. 앱 시작 시 인증 상태 복원
- [ ] C-5. 로그아웃 구현

### Epic D. MainAPP 기능 완성
- [ ] D-1. 프로필/팔로우 화면 구현
- [ ] D-2. 로그 상세/배송 화면 구현
- [ ] D-3. 식물 등록 플로우 구현
- [ ] D-4. 데일리 미션 화면 구현

### Epic E. MainFE 인증 구축
- [ ] E-1. Supabase 웹 클라이언트 추가
- [ ] E-2. 로그인 버튼/UI 추가
- [ ] E-3. callback 페이지 구현
- [ ] E-4. 백엔드 토큰 교환 및 저장
- [ ] E-5. 보호 라우트/refresh 구현
- [ ] E-6. 로그아웃 구현

### Epic F. MainFE 기능 통합
- [ ] F-1. 기존 페이지 인증 연결
- [ ] F-2. 신규 유저 분기 연결
- [ ] F-3. 새로고침/복귀 UX 정리
- [ ] F-4. 브라우저 QA

## 9. 완료 기준

### MainAPP 완료 기준
- [ ] Google/Kakao 로그인 가능
- [ ] 로그인 후 서비스 API 정상 호출
- [ ] 앱 재실행 후 세션 복원
- [ ] 만료 후 refresh 동작
- [ ] 로그아웃 가능
- [ ] 주요 플레이스홀더 제거

### MainFE 완료 기준
- [ ] Google/Kakao 로그인 가능
- [ ] callback 처리 안정화
- [ ] 로그인 후 서비스 API 정상 호출
- [ ] 새로고침 후 세션 복원
- [ ] 보호 라우트 동작
- [ ] 로그아웃 가능

### MainBE 완료 기준
- [ ] 웹/앱 모두 같은 인증 API로 로그인 가능
- [ ] 신규/기존 유저 처리 안정화
- [ ] refresh 정책 검증 완료
- [ ] 인증 예외와 보안 로그 정리 완료
