# MainAPP Migration TODO

기준 문서:
- `C:/MainFE/AUTH_INTEGRATION_CHECKLIST.md`
- `C:/MainFE/MAINAPP_MIGRATION_MATRIX.md`

문서 목적:
- `MainFE` 종료를 전제로 `MainAPP` 단독 운영에 필요한 기능 이식 범위를 앱 레포 내부 기준으로 고정한다.
- `MainAPP`와 `MainBE`의 현재 구현 상태를 MainFE 종료 이후 운영 기준(source of truth)으로 삼는다.
- 현재 `MainAPP`의 구현 상태를 `완료`, `부분구현`, `미구현`으로 나눠 기록한다.
- 남은 TODO와 정책 미확정 항목을 운영 보완 관점에서 정리한다.

제외 범위:
- 웹 라우팅, 웹 레이아웃, 웹 CSS, 브라우저 전용 UX는 이식 대상으로 보지 않는다.
- 이번 문서는 기능 구현이 아니라 인벤토리와 작업 기준 문서화만 다룬다.

## 1. 현재 MainAPP 상태 요약

### 전체 상태
- 인증 기반은 완료 상태다.
- 앱 시작 시 저장된 토큰 기준으로 `Main` 또는 `Onboarding`으로 초기 진입이 분기된다.
- 서비스 API 인증 헤더 자동 부착과 refresh 재시도 기반이 있다.
- 실제 사용자 기능 중 현재 의미 있게 연결된 영역은 `홈`, `피드`, `피드 상세`, `댓글 작성`, `로그 캘린더`, `월별 일기 목록`, `로그 상세`, `프로필`, `팔로우 목록`, `배송 신청`, `정원 해금`, `등록 플로우`, `데일리 미션(일기/퀴즈/오늘의 질문)`이다.
- `설정`은 로그아웃과 계정 상태 확인이 가능한 최소 운영 수준으로 정리되었다.

### 네비게이션 기준 상태
- 메인 탭: `Home`, `Log`, `Feed`, `Option`
- 인증 스택: `Onboarding`, `Register`
- 상세 스택 중 실제 연결됨: `FeedDiary`, `FeedAvatar`, `LogDetail`, `Profile`, `Follow`, `Delivery`, `DeliveryComplete`, `UnlockGarden`, `RegistrationAvatar`, `RegistrationCreationDetail`, `RegistrationSelectionDetail`, `RegistrationPlantNickname`, `DailyMissionWriteDiary`, `DailyMissionQuizMultipleChoice`, `DailyMissionQuizOx`, `DailyMissionChecking`
- 상세 스택 중 플레이스홀더: 없음

### 구현 분류 요약
- 완료
  - 인증 기반
  - 온보딩/스플래시
  - OAuth 로그인
  - 피드 목록 API 연동
  - 피드 상세 조회 API 연동
  - 댓글 작성 API 연동
  - 로그 캘린더 API 연동
  - 월별 일기 목록 API 연동
  - 오늘의 질문 미션
- 부분구현
  - 비회원 등록
  - 홈 메인 마감
  - 로그 화면 일부
  - 피드 상세 UX
  - 프로필
  - 팔로우
  - 배송
  - 등록 플로우
  - 데일리 미션 일기 작성
  - 설정/운영 안내

## 2. 구현된 기능 목록

### 완료

| 기능명 | 현재 MainAPP 상태 | 근거 파일 |
|---|---|---|
| 인증 기반 | OAuth 이후 서비스 JWT 저장, 앱 재실행 후 세션 복원, Authorization 자동 부착, refresh 1회 재시도, 로그아웃 기반까지 구현됨 | `src/hooks/auth/useSupabaseOAuth.ts`, `src/hooks/auth/useBackendLogin.ts`, `src/stores/useTokenStore.ts`, `src/apis/instance.ts`, `src/utils/auth.ts`, `src/navigation/RootNavigator.tsx` |
| 온보딩/스플래시 | 온보딩 슬라이드와 OAuth 시작 UI가 있음. 앱 시작 시 splash 처리 포함 | `src/pages/onboarding/OnboardingScreen.tsx`, `src/components/common/Splash.tsx` |
| 피드 목록 | 목록 조회 API와 그리드 렌더링, 게시글 타입별 상세 진입이 동작함 | `src/pages/feed/FeedScreen.tsx`, `src/components/feed/FeedList.tsx`, `src/hooks/feed/useFeedApi.ts`, `src/apis/feed/feedApi.ts` |
| 피드 상세 조회 | 일기형/아바타형 상세 조회, 상태별 로딩/에러/빈 댓글 처리, 댓글 입력 흐름이 구현됨 | `src/pages/feed/FeedDiaryScreen.tsx`, `src/pages/feed/FeedAvatarScreen.tsx`, `src/components/feed/FeedDetail.tsx`, `src/components/common/CommentComposer.tsx`, `src/components/common/ScreenHeader.tsx`, `src/components/common/StatusView.tsx`, `src/hooks/log/useDiaryDetailApi.ts`, `src/hooks/feed/useAvatarPostDetailApi.ts` |
| 댓글 작성 | 상세 화면에서 댓글 등록 후 refetch까지 연결됨 | `src/hooks/comments/useCommentApi.ts`, `src/apis/comments/commentApi.ts`, `src/components/common/Comment.tsx` |
| 로그 캘린더 | 월 이동, 캘린더 조회, 일자별 미션 완료 아이콘 렌더링이 구현됨 | `src/pages/log/LogScreen.tsx`, `src/components/log/LogCalendar.tsx`, `src/hooks/log/useCalendarApi.ts`, `src/apis/log/calendarApi.ts` |
| 월별 일기 목록 | 월 이동, 일기 썸네일 목록 조회와 상세 진입 이벤트가 구현됨 | `src/pages/log/LogScreen.tsx`, `src/components/log/MyDiary.tsx`, `src/hooks/log/useDiariesApi.ts`, `src/apis/log/diariesApi.ts` |
| 로그 상세 | `LogDetail` 실제 화면, 댓글 입력, diary detail API 기반 상세 렌더링이 구현됨 | `src/pages/log/LogDetailScreen.tsx`, `src/components/log/MyDiaryDetail.tsx`, `src/components/common/CommentComposer.tsx`, `src/hooks/log/useDiaryDetailApi.ts`, `src/apis/log/diaryDetailApi.ts` |
| 프로필 조회 | 사용자 기본 정보 조회, 대표 정원 정보, 친구 물주기, 팔로우/언팔로우 버튼이 구현됨 | `src/pages/profile/ProfileScreen.tsx`, `src/components/profile/ProfileDetail.tsx`, `src/hooks/profile/useProfileApi.ts`, `src/apis/profile/profileApi.ts`, `src/hooks/follow/useFollowApi.ts` |
| 팔로우 목록 | 팔로잉/팔로워 목록 조회, 탭 전환, 팔로잉 탭 언팔로우, 프로필 이동이 구현됨 | `src/pages/follow/FollowScreen.tsx`, `src/components/follow/UserCard.tsx`, `src/hooks/follow/useFollowApi.ts`, `src/apis/follow/followApi.ts` |
| 정원 해금 | `POST /api/v1/gardens/unlock` body 없는 호출과 홈 재조회가 연결됨 | `src/pages/delivery/UnlockGardenScreen.tsx`, `src/hooks/delivery/useDeliveryApi.ts`, `src/apis/delivery/deliveryApi.ts`, `src/apis/home/homeApi.ts` |
| 배송 신청 | 배송용 식물 선택, 배송 입력 폼, 신청 완료 화면까지 연결됨 | `src/pages/delivery/UnlockGardenScreen.tsx`, `src/pages/delivery/DeliveryScreen.tsx`, `src/pages/delivery/DeliveryCompleteScreen.tsx`, `src/hooks/delivery/useDeliveryApi.ts`, `src/apis/delivery/deliveryApi.ts` |
| 등록 플로우 | 아바타 시작, 생성형 이미지 업로드, 선택형 상세, 별명 짓기와 홈 복귀까지 연결됨 | `src/pages/registration/RegistrationAvatarScreen.tsx`, `src/pages/registration/RegistrationCreationDetailScreen.tsx`, `src/pages/registration/RegistrationSelectionDetailScreen.tsx`, `src/pages/registration/RegistrationPlantNicknameScreen.tsx`, `src/stores/useRegistrationStore.ts`, `src/hooks/avatars/useAvatarApi.ts`, `src/apis/avatars/avatarApi.ts` |
| 데일리 미션 퀴즈 | 객관식/OX 퀴즈 조회와 답안 제출, 홈 진입점이 연결됨 | `src/pages/dailyMission/DailyMissionQuizMultipleChoiceScreen.tsx`, `src/pages/dailyMission/DailyMissionQuizOxScreen.tsx`, `src/hooks/mission/useMissionApi.ts`, `src/apis/missions/missionApi.ts` |
| 오늘의 질문 미션 | `GET /api/v1/survey` 조회, `POST /api/v1/survey/answer` 제출, 홈 완료 상태 반영이 구현됨. `CHECKING` fallback은 제거되었고 포인트 지급은 서버 책임이다. | `src/pages/dailyMission/DailyMissionCheckingScreen.tsx`, `src/hooks/mission/useMissionApi.ts`, `src/apis/missions/missionApi.ts`, `src/pages/home/HomeScreen.tsx` |
| 설정/로그아웃 | 설정 화면에서 계정 상태 확인, 로그아웃 버튼, 운영 안내를 확인할 수 있음 | `src/pages/option/OptionScreen.tsx`, `src/utils/auth.ts`, `src/stores/useTokenStore.ts`, `src/navigation/RootNavigator.tsx` |

### 부분구현

| 기능명 | 현재 MainAPP 상태 | 보완 필요 사항 | 근거 파일 |
|---|---|---|---|
| 비회원 등록 | 닉네임 입력과 회원가입 API 호출은 있음 | 가입 실패 시에도 등록 플로우로 진입시키는 현재 정책이 운영 기준으로 확정된 것은 아님 | `src/pages/register/RegisterScreen.tsx`, `src/hooks/register/useRegister.ts`, `src/apis/register/registerApi.ts` |
| 홈 메인 | 홈 summary API, `panel` API, 물/햇빛 액션, 감정 체크 모달, 미션 시트, 잠금/빈 슬롯 분기와 missionType 라우팅이 연결됨 | 실기기 스와이프 검증, 안전영역 점검, 문구/간격 같은 UI 마감과 물/햇빛 API 계약 상세 확인이 남아 있음 | `src/pages/home/HomeScreen.tsx`, `src/hooks/home/useHomeApi.ts`, `src/apis/home/homeApi.ts`, `src/components/home/*`, `src/stores/useEmotionSurveyStore.ts` |
| 로그 화면 일부 | 캘린더/일기 목록과 로그 상세까지 연결됨 | 미션 탭 날짜 선택 후 상세 액션은 아직 없음 | `src/pages/log/LogScreen.tsx`, `src/pages/log/LogDetailScreen.tsx`, `src/apis/log/diaryDetailApi.ts` |
| 피드 상세 UX | 조회/댓글/상태 처리와 프로필 이동은 됨 | 공감/신고/댓글 수정·삭제는 아직 없음 | `src/components/feed/FeedDetail.tsx`, `src/pages/feed/FeedDiaryScreen.tsx`, `src/pages/feed/FeedAvatarScreen.tsx` |
| 프로필 | 사용자 조회와 대표 정원/팔로우/물주기까지 연결됨 | 방명록, 다중 정원 상세, 추가 상호작용 API는 아직 필요 | `src/pages/profile/ProfileScreen.tsx`, `src/components/profile/ProfileDetail.tsx`, `src/apis/profile/profileApi.ts` |
| 팔로우 | 팔로잉/팔로워 목록 조회와 탭 전환, 팔로잉 언팔로우가 됨 | 팔로워 목록 쪽 follow-back 액션은 응답 정보 부족으로 아직 없음 | `src/pages/follow/FollowScreen.tsx`, `src/components/follow/UserCard.tsx`, `src/apis/follow/followApi.ts` |
| 배송 | 배송용 식물 목록 조회, 배송 신청, 완료 화면, 홈에서의 진입은 연결됨 | 주소 검색 UI, 배송 조회는 추가 확인 필요 | `src/pages/delivery/UnlockGardenScreen.tsx`, `src/pages/delivery/DeliveryScreen.tsx`, `src/pages/delivery/DeliveryCompleteScreen.tsx`, `src/apis/delivery/deliveryApi.ts` |
| 등록 플로우 | 단계 간 상태 저장과 이동, 생성형 업로드, 선택형/생성형 최종 등록은 구현됨 | 신규 유저 자동 강제 진입 정책은 추가 확인 필요 | `src/pages/registration/RegistrationAvatarScreen.tsx`, `src/pages/registration/RegistrationCreationDetailScreen.tsx`, `src/pages/registration/RegistrationSelectionDetailScreen.tsx`, `src/pages/registration/RegistrationPlantNicknameScreen.tsx`, `src/stores/useRegistrationStore.ts` |
| 데일리 미션 일기 작성 | 텍스트 입력, 공개 설정, 제출 구조는 구현됨 | 이미지 업로드-일기 저장 최종 연결은 아직 미완성 | `src/pages/dailyMission/DailyMissionWriteDiaryScreen.tsx`, `src/apis/missions/missionApi.ts`, `src/hooks/mission/useMissionApi.ts` |
| 설정 | 로그아웃과 계정 상태 확인은 가능함 | 버전 표기 자동화, 약관/문의 같은 운영 링크는 아직 없음 | `src/pages/option/OptionScreen.tsx` |

## 3. 플레이스홀더/미구현 목록

### RootNavigator.tsx 기준 플레이스홀더 스택 화면

현재 `RootNavigator` 기준 플레이스홀더 스택 화면은 없다. Step 3~7 범위의 상세 화면 교체가 끝난 상태다.

| 라우트명 | 현재 상태 | 비고 |
|---|---|---|
| 없음 | 모든 대상 라우트가 실제 화면으로 교체됨 | 남은 항목은 운영 보완/정책 정리 성격 |

### 파일은 있으나 기능적으로 미구현에 가까운 화면

| 파일 | 현재 상태 | 판단 |
|---|---|---|
| 없음 | 주요 화면은 모두 실제 기능을 가짐 | 남은 항목은 운영 보완/정책 정리 위주 |

## 4. MainFE 대비 누락 기능 매트릭스

아래 표는 `C:/MainFE/MAINAPP_MIGRATION_MATRIX.md`를 기준으로, `MainAPP`에 아직 없는 기능 또는 부분구현 기능을 정리한 것이다.

| 기능명 | 현재 MainAPP 상태 | 참조할 MainFE 파일 | 필요한 MainAPP 대상 파일 또는 신규 파일 | 선행조건 |
|---|---|---|---|---|
| 홈 메인 패널 | `/api/v1/home`와 `panel` 응답 기준 요약 UI, 접힘/펼침 미션 시트, 오늘의 질문 연결까지 구현됨 | `C:/MainFE/src/pages/home/Homepage.tsx`, `C:/MainFE/src/apis/home/homeApi.ts`, `C:/MainFE/src/apis/missions/panelApi.ts` | 기존 `src/pages/home/HomeScreen.tsx`, 기존 `src/apis/home/homeApi.ts`, 기존 `src/hooks/home/useHomeApi.ts`, `src/components/home/*` | 실기기 스와이프와 UI 마감 확인 |
| 식물 상호작용(물/햇빛) | owner 기준 물/햇빛 액션, 버튼 상태, 토스트, 홈 배치까지 구현됨 | `C:/MainFE/src/components/home/FirstPlant.tsx`, `C:/MainFE/src/components/home/SecondPlant.tsx`, `C:/MainFE/src/components/home/ThirdPlant.tsx`, `C:/MainFE/src/components/home/FourthPlant.tsx` | 기존 `src/components/home/HomeGardenScene.tsx`, 기존 `src/hooks/home/useHomeApi.ts`, 기존 `src/pages/home/HomeScreen.tsx` | 액션 API 계약 상세와 실기기 동작 확인 |
| 로그 상세 | diary detail API 기준 실제 화면 구현 완료. 수정 기능과 추가 소셜 액션만 미완성 | `C:/MainFE/src/pages/log/LogDetailPage.tsx` | 기존 `src/pages/log/LogDetailScreen.tsx`, 기존 `src/components/log/MyDiaryDetail.tsx` | 수정 API 여부 확인 |
| 피드 상세 보완 | 상세 조회, 댓글, 상태 처리는 구현됨. 소셜 상호작용은 미완성 | `C:/MainFE/src/pages/feed/FeedDiaryPage.tsx`, `C:/MainFE/src/pages/feed/FeedAvatarPage.tsx`, `C:/MainFE/src/components/feed/*`, `C:/MainFE/src/components/common/Comment.tsx` | 기존 `src/pages/feed/FeedDiaryScreen.tsx`, 기존 `src/pages/feed/FeedAvatarScreen.tsx`, 기존 `src/components/feed/FeedDetail.tsx`, 기존 `src/components/common/Comment.tsx` | 프로필 화면, 댓글/좋아요 API 범위 확인 |
| 프로필 조회/친구 물주기 | 사용자 조회, 대표 정원 렌더링, 친구 물주기, follow/unfollow까지 구현됨. 방명록 등 추가 기능은 미완성 | `C:/MainFE/src/pages/profile/ProfilePage.tsx`, `C:/MainFE/src/apis/profile/profileApi.ts`, `C:/MainFE/src/components/profile/*` | 기존 `src/pages/profile/ProfileScreen.tsx`, 기존 `src/apis/profile/profileApi.ts`, 기존 `src/hooks/profile/*`, 기존 `src/components/profile/*` | 방명록 및 추가 상호작용 API 확인 |
| 팔로우 목록/관리 | 팔로잉/팔로워 목록 조회와 팔로잉 언팔로우는 구현됨. 팔로워 follow-back은 응답 정보 부족으로 미완성 | `C:/MainFE/src/pages/follow/FollowPage.tsx`, `C:/MainFE/src/apis/follow/followApi.ts`, `C:/MainFE/src/components/follow/*` | 기존 `src/pages/follow/FollowScreen.tsx`, 기존 `src/apis/follow/followApi.ts`, 기존 `src/hooks/follow/*`, 기존 `src/components/follow/*` | 팔로워 목록의 관계 상태 또는 follow-back 정책 확인 |
| 설정/로그아웃 UI | 로그아웃 버튼, 계정 상태, 운영 안내까지 구현됨. 운영 링크와 상세 안내는 미완성 | `C:/MainFE/src/pages/option/OptionPage.tsx` | 기존 `src/pages/option/OptionScreen.tsx`, 기존 `src/utils/auth.ts` | 로그아웃 정책 유지 |
| 배송 신청 | 배송 입력 폼과 제출은 구현됨. 주소 검색과 주문 조회는 미완성 | `C:/MainFE/src/pages/delivery/DeliveryPage.tsx`, `C:/MainFE/src/components/delivery/*` | 기존 `src/pages/delivery/DeliveryScreen.tsx`, 기존 `src/components/delivery/*`, 기존 `src/apis/delivery/deliveryApi.ts` | 주소 검색 방식 확정 |
| 배송 완료 | 완료 화면과 홈 복귀 흐름은 구현됨 | `C:/MainFE/src/pages/delivery/CompletePage.tsx` | 기존 `src/pages/delivery/DeliveryCompleteScreen.tsx` | 배송 상태 조회 API 확인 |
| 정원 확장/잠금 해제 | body 없는 unlock 호출과 홈 재조회가 구현됨 | `C:/MainFE/src/pages/delivery/UnlockGardenPlotPage.tsx`, `C:/MainFE/src/components/delivery/*` | 기존 `src/pages/delivery/UnlockGardenScreen.tsx`, 기존 `src/components/delivery/*`, 기존 `src/apis/delivery/deliveryApi.ts` | 홈 화면 연결점 정의 |
| 등록 플로우 시작 | 시작 화면과 mode 선택, 단계 이동은 구현됨 | `C:/MainFE/src/pages/registration/AvatarCreationPage.tsx`, `C:/MainFE/src/components/registration/*`, `C:/MainFE/src/apis/avatars/avatarApi.ts` | 기존 `src/pages/registration/RegistrationAvatarScreen.tsx`, 기존 `src/components/registration/*`, 기존 `src/stores/useRegistrationStore.ts` | 신규 유저 자동 진입 정책 확정 |
| 생성형 등록 상세 | 이미지 선택과 업로드, 상태 저장은 구현됨 | `C:/MainFE/src/pages/registration/CreationDetailPage.tsx` | 기존 `src/pages/registration/RegistrationCreationDetailScreen.tsx`, 기존 `src/stores/useRegistrationStore.ts`, 기존 `src/apis/avatars/avatarApi.ts` | 기기 권한 UX 보완 |
| 선택형 등록 상세 | 아바타 목록 조회와 선택은 구현됨 | `C:/MainFE/src/pages/registration/SelectionDetailPage.tsx`, `C:/MainFE/src/apis/avatars/avatarApi.ts` | 기존 `src/pages/registration/RegistrationSelectionDetailScreen.tsx`, 기존 `src/apis/avatars/avatarApi.ts`, 기존 `src/hooks/avatars/useAvatarApi.ts` | `GET /api/v1/avatars/masters` 계약 유지 |
| 식물 별명 짓기 | 별명 입력과 완료 흐름은 구현됨. 생성형/선택형 모두 `POST /api/v1/avatars`로 연결됨 | `C:/MainFE/src/pages/registration/PlantNicknamePage.tsx`, `C:/MainFE/src/apis/avatars/avatarApi.ts` | 기존 `src/pages/registration/RegistrationPlantNicknameScreen.tsx`, 기존 `src/apis/avatars/avatarApi.ts`, 기존 `src/hooks/avatars/useAvatarApi.ts` | 신규 유저 분기 정책 확인 |
| 데일리 미션 일기 작성 | 텍스트 입력, 공개 설정, 제출 구조는 구현됨. 이미지 업로드-일기 저장은 미완성 | `C:/MainFE/src/pages/dailyMission/WriteDiaryPage.tsx`, `C:/MainFE/src/components/dailyMission/*`, `C:/MainFE/src/apis/missions/*` | 기존 `src/pages/dailyMission/DailyMissionWriteDiaryScreen.tsx`, 기존 `src/components/dailyMission/*`, 기존 `src/apis/missions/missionApi.ts`, 기존 `src/hooks/mission/useMissionApi.ts` | 일기 작성 최종 제출 UX 보완 |
| 데일리 미션 객관식 퀴즈 | 퀴즈 조회, 선택지 렌더링, 답안 제출, 결과 표시가 구현됨 | `C:/MainFE/src/pages/dailyMission/MultipleChoiceQuestionQuizPage.tsx`, `C:/MainFE/src/components/dailyMission/*`, `C:/MainFE/src/apis/missions/*` | 기존 `src/pages/dailyMission/DailyMissionQuizMultipleChoiceScreen.tsx`, 기존 `src/components/dailyMission/*`, 기존 `src/apis/missions/missionApi.ts` | `GET/POST /api/v1/realQuiz` 계약 유지 |
| 데일리 미션 OX 퀴즈 | 퀴즈 조회, O/X 선택, 답안 제출, 결과 표시가 구현됨 | `C:/MainFE/src/pages/dailyMission/OxQuizPage.tsx`, `C:/MainFE/src/components/dailyMission/*`, `C:/MainFE/src/apis/missions/*` | 기존 `src/pages/dailyMission/DailyMissionQuizOxScreen.tsx`, 기존 `src/components/dailyMission/*`, 기존 `src/apis/missions/missionApi.ts` | OX와 객관식 공통 quiz 계약 유지 |
| 데일리 미션 오늘의 질문 | survey 조회, YES/NEUTRAL/NO 답변 제출, 홈 완료 상태 반영이 구현됨 | `C:/MainFE/src/pages/dailyMission/*`, `C:/MainFE/src/apis/missions/*` | 기존 `src/pages/dailyMission/DailyMissionCheckingScreen.tsx`, 기존 `src/apis/missions/missionApi.ts`, 기존 `src/hooks/mission/useMissionApi.ts` | 응답 문구/보상 노출 정책 확정 |

## 5. 우선순위별 작업 백로그

## P0. 인증 기반 후속 점검 항목

### P0-1. 로그아웃 UI 연결
- 기능명: 설정 화면 로그아웃 연결
- 현재 MainAPP 상태: 완료. 설정 화면에서 로그아웃 버튼과 중복 클릭 방지가 연결됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/option/OptionPage.tsx`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/option/OptionScreen.tsx`
- 선행조건: 없음

### P0-2. 인증 실패 UX 정리
- 기능명: 401/403 이후 사용자 경험 정리
- 현재 MainAPP 상태: 토큰 제거 및 인증 해제는 되지만 안내 UI와 공통 처리 메시지는 없음
- 참조할 MainFE 파일: `C:/MainFE/AUTH_INTEGRATION_CHECKLIST.md`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/apis/instance.ts`, 필요 시 신규 `src/components/common/*`
- 선행조건: 없음

### P0-3. 신규 유저 분기 확정
- 기능명: OAuth/비회원 등록 이후 신규 유저 후속 플로우 명시
- 현재 MainAPP 상태: OAuth `newUser`는 `RegistrationAvatar`로 reset되고, 비회원 등록도 등록 플로우로 진입함. 다만 중도 이탈 후 재진입 정책은 확정되지 않음
- 참조할 MainFE 파일: `C:/MainFE/AUTH_INTEGRATION_CHECKLIST.md`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/hooks/auth/useSupabaseOAuth.ts`, 기존 `src/pages/register/RegisterScreen.tsx`, 향후 등록 플로우 화면들
- 선행조건: 등록 플로우 목표 화면 구조 합의

## P1. 홈/로그/피드 코어 기능

### P1-1. 홈 메인 구현
- 기능명: 홈 메인 화면 및 패널
- 현재 MainAPP 상태: `HomeScreen`이 `/api/v1/home` 응답 기준 요약 UI를 렌더링하고, `missionType` 기반으로 실제 미션 화면을 연결함
- 참조할 MainFE 파일: `C:/MainFE/src/pages/home/Homepage.tsx`, `C:/MainFE/src/apis/home/homeApi.ts`, `C:/MainFE/src/apis/missions/panelApi.ts`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/home/HomeScreen.tsx`, 기존 `src/apis/home/homeApi.ts`, 기존 `src/hooks/home/useHomeApi.ts`, 필요 시 신규 `src/components/home/*`
- 선행조건: MainBE 홈/패널 API 확인

### P1-2. 로그 상세 구현
- 기능명: 로그 상세 화면
- 현재 MainAPP 상태: 실제 상세 화면과 댓글 입력이 연결됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/log/LogDetailPage.tsx`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/log/LogDetailScreen.tsx`, 기존 `src/apis/log/diaryDetailApi.ts`, 기존 `src/hooks/log/useDiaryDetailApi.ts`
- 선행조건: 없음

### P1-3. 피드 상세 보강
- 기능명: 피드 상세 UX 및 상호작용 보강
- 현재 MainAPP 상태: 조회와 댓글 작성은 가능하나 프로필/좋아요/신고 등 소셜 기능이 미완성
- 참조할 MainFE 파일: `C:/MainFE/src/pages/feed/FeedDiaryPage.tsx`, `C:/MainFE/src/pages/feed/FeedAvatarPage.tsx`, `C:/MainFE/src/components/feed/*`, `C:/MainFE/src/components/common/Comment.tsx`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/feed/FeedDiaryScreen.tsx`, 기존 `src/pages/feed/FeedAvatarScreen.tsx`, 기존 `src/components/feed/FeedDetail.tsx`, 기존 `src/components/common/Comment.tsx`
- 선행조건: 프로필 화면 스펙과 좋아요/신고 API 확인

### P1-4. 로그 미션 탭 후속
- 기능명: 로그 내 미션 탭 상세 연결
- 현재 MainAPP 상태: 캘린더는 렌더링되나 날짜 선택 후 액션이 없음
- 참조할 MainFE 파일: `C:/MainFE/src/pages/log/LogPage.tsx`, `C:/MainFE/src/components/log/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/components/log/LogCalendar.tsx`, 기존 `src/pages/log/LogScreen.tsx`
- 선행조건: 날짜 선택 시 보여줄 정보 구조 확정

## P2. 프로필/팔로우/설정

### P2-1. 프로필 화면 구현
- 기능명: 사용자 프로필 조회 및 친구 물주기
- 현재 MainAPP 상태: 사용자 조회, 대표 정원, 물주기, 팔로우/언팔로우까지 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/profile/ProfilePage.tsx`, `C:/MainFE/src/apis/profile/profileApi.ts`, `C:/MainFE/src/components/profile/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/profile/ProfileScreen.tsx`, 기존 `src/apis/profile/profileApi.ts`, 기존 `src/hooks/profile/*`, 기존 `src/components/profile/*`
- 선행조건: 프로필 API 확인

### P2-2. 팔로우 화면 구현
- 기능명: 팔로우 목록 및 관리
- 현재 MainAPP 상태: 목록 조회, 탭 전환, 팔로잉 언팔로우, 프로필 이동까지 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/follow/FollowPage.tsx`, `C:/MainFE/src/apis/follow/followApi.ts`, `C:/MainFE/src/components/follow/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/follow/FollowScreen.tsx`, 기존 `src/apis/follow/followApi.ts`, 기존 `src/hooks/follow/*`
- 선행조건: 팔로우 API 확인

### P2-3. 설정 화면 마감
- 기능명: 설정/옵션
- 현재 MainAPP 상태: 로그아웃과 계정 상태 확인은 가능, 운영 링크는 미완성
- 참조할 MainFE 파일: `C:/MainFE/src/pages/option/OptionPage.tsx`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/option/OptionScreen.tsx`
- 선행조건: 로그아웃 버튼 정책 확정

## P3. 배송/정원확장/등록플로우/데일리미션

### P3-1. 배송 신청
- 기능명: 배송 신청 폼
- 현재 MainAPP 상태: 기본 배송 입력과 제출이 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/delivery/DeliveryPage.tsx`, `C:/MainFE/src/components/delivery/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/delivery/DeliveryScreen.tsx`, 기존 `src/components/delivery/*`, 기존 `src/apis/delivery/deliveryApi.ts`
- 선행조건: 배송 API 확인

### P3-2. 배송 완료
- 기능명: 배송 완료 화면
- 현재 MainAPP 상태: 완료 메시지와 홈 복귀 버튼이 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/delivery/CompletePage.tsx`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/delivery/DeliveryCompleteScreen.tsx`
- 선행조건: 배송 신청 플로우 구현

### P3-3. 정원 확장
- 기능명: 정원 잠금 해제/확장
- 현재 MainAPP 상태: `POST /api/v1/gardens/unlock` body 없는 호출과 홈 재조회가 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/delivery/UnlockGardenPlotPage.tsx`, `C:/MainFE/src/components/delivery/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/delivery/UnlockGardenScreen.tsx`, 기존 `src/components/delivery/*`, 기존 `src/apis/delivery/deliveryApi.ts`
- 선행조건: 홈 화면 연결점 정의

### P3-4. 등록 플로우
- 기능명: 아바타 선택, 생성형/선택형 상세, 식물 별명
- 현재 MainAPP 상태: 단계별 화면과 상태 저장, 생성형 업로드, 최종 등록까지 구현됨
- 참조할 MainFE 파일: `C:/MainFE/src/pages/registration/AvatarCreationPage.tsx`, `C:/MainFE/src/pages/registration/CreationDetailPage.tsx`, `C:/MainFE/src/pages/registration/SelectionDetailPage.tsx`, `C:/MainFE/src/pages/registration/PlantNicknamePage.tsx`, `C:/MainFE/src/components/registration/*`, `C:/MainFE/src/apis/avatars/avatarApi.ts`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/registration/*`, 기존 `src/components/registration/*`, 기존 `src/apis/avatars/avatarApi.ts`, 기존 `src/hooks/avatars/useAvatarApi.ts`, 기존 `src/stores/useRegistrationStore.ts`
- 선행조건: 신규 유저 분기 규칙과 등록 플로우 상태 저장 전략 확정

### P3-5. 데일리 미션
- 기능명: 일기 작성, 객관식 퀴즈, OX 퀴즈, 오늘의 질문
- 현재 MainAPP 상태: 퀴즈와 오늘의 질문은 구현, 일기 작성은 최종 이미지 업로드-저장 연결만 미완성
- 참조할 MainFE 파일: `C:/MainFE/src/pages/dailyMission/WriteDiaryPage.tsx`, `C:/MainFE/src/pages/dailyMission/MultipleChoiceQuestionQuizPage.tsx`, `C:/MainFE/src/pages/dailyMission/OxQuizPage.tsx`, `C:/MainFE/src/components/dailyMission/*`, `C:/MainFE/src/apis/missions/*`
- 필요한 MainAPP 대상 파일 또는 신규 파일: 기존 `src/pages/dailyMission/*`, 기존 `src/components/dailyMission/*`, 기존 `src/apis/missions/missionApi.ts`, 기존 `src/hooks/mission/useMissionApi.ts`
- 선행조건: 일기 작성 업로드-저장 UX 마무리

## 6. 이후 Codex 작업 순서

### Step 3. 홈/로그/피드 공백 메우기
- `src/pages/home/HomeScreen.tsx` 기준 홈 상호작용 기본 연결은 끝났고, 남은 작업은 실기기 스와이프 확인, 안전영역/작은 화면 점검, 문구/간격 마감, 물/햇빛 API 계약 상세 확인이다.
- `src/pages/log/LogDetailScreen.tsx` 이후, 수정 기능과 미션 탭 상세 연결을 보완한다.
- 피드 상세의 좋아요/신고/프로필 실화면 연결 등 미완성 소셜 상호작용을 정리한다.
- 필요한 홈/피드 보조 API와 훅을 추가한다.

### Step 4. 프로필/팔로우
- `Profile`과 `Follow` 플레이스홀더 교체는 완료되었다.
- 피드 상세 작성자 탭과 팔로우 화면 진입 버튼까지 실제 네비게이션 연결이 완료되었다.
- 이후 남은 작업은 방명록, 팔로워 follow-back, 추가 프로필 상호작용 같은 세부 기능 보강이다.

### Step 5. 배송/정원 확장
- `Delivery`, `DeliveryComplete`, `UnlockGarden` 플레이스홀더 교체는 완료되었다.
- 홈 화면에서 `UnlockGarden`으로 이어지는 연결점과 배송 완료 후 홈 복귀 흐름이 정리되었다.
- 이후 남은 작업은 주소 검색과 배송 상태 조회다.

### Step 6. 등록 플로우
- `RegistrationAvatar`, `RegistrationCreationDetail`, `RegistrationSelectionDetail`, `RegistrationPlantNickname` 플레이스홀더 교체는 완료되었다.
- 비회원 등록 진입과 OAuth 신규 유저 분기 연결 포인트가 정리되었다.
- 이후 남은 작업은 신규 유저 강제 진입 정책 확정과 생성형 업로드 UX 보완이다.

### Step 7. 데일리 미션
- `DailyMissionWriteDiary`, `DailyMissionQuizMultipleChoice`, `DailyMissionQuizOx`, `DailyMissionChecking` 화면이 실제로 연결되었다.
- 홈에서 미션 화면으로 진입하는 연결점과 퀴즈/오늘의 질문 제출 흐름이 정리되었다.
- 이후 남은 작업은 일기 작성 최종 업로드-저장 연결과 운영 보완 성격의 정책 정리다.

## 7. 운영 마감 상태

### 완료된 범위
- 인증, 온보딩, 로그인, 재실행 세션 복원, 로그아웃
- 홈 주요 진입점, `panel` 기반 미션 시트, 감정 체크, 물/햇빛 액션, 피드/로그 상세, 프로필/팔로우
- 정원 해금, 배송 신청/완료
- 등록 플로우 기본 구조와 생성형 업로드
- 데일리 미션 진입, 퀴즈 응답, 오늘의 질문 응답

### 부분구현 범위
- 홈 UI 마감과 실기기 검증
- 피드 소셜 액션(좋아요/신고/댓글 수정 삭제)
- 프로필 방명록/다중 정원
- 배송 주소 검색과 배송 조회
- 비회원 등록/신규 유저 정책
- 데일리 미션 일기 작성 최종 제출
- 설정의 운영 링크/버전 자동 표기

### 정책 미확정 범위
- 신규 유저가 등록 플로우를 중도 이탈했을 때 재진입을 강제할지 여부
- 비회원 등록 실패 시에도 등록 플로우로 진입시키는 현재 동작을 유지할지 여부
- 오늘의 질문 완료 후 보상/안내 문구를 앱에서 어느 수준까지 노출할지 여부

### 백엔드 계약 확인 필요 범위
- 물/햇빛 액션 API 계약 상세
- 팔로워 목록의 follow-back 판단용 관계 상태
- 배송 상태 조회와 주소 검색 대체 정책
- 데일리 미션 일기 작성의 최종 저장 UX 정책

### 운영 보완 필요 범위
- 설정 화면의 약관/문의/버전 안내 연결
- 인증 실패 공통 안내 UX
- 문구 일관화와 API 실패 메시지 다듬기

## 8. 남은 리스크

- 데일리 미션 일기 작성은 이미지 업로드-일기 저장 최종 연결이 아직 완결되지 않았다.
- 비회원 등록 실패 시에도 등록 플로우로 진입시키는 현재 동작은 운영 정책 확정이 필요하다.
- 홈 화면은 기본 상호작용이 구현됐지만, 물/햇빛 API 계약 상세와 실기기 레이아웃 검증 전까지는 운영 리스크가 남아 있다.
- 배송 주소 검색과 배송 상태 조회는 아직 앱에서 직접 지원하지 않는다.
- MainFE 종료 이후 기준 문서는 이 파일과 현재 `MainAPP` 코드이며, 남은 보완은 정책/운영 확정 후 `MainAPP`에서 계속 갱신한다.

## 부록. 현재 파일 기준 빠른 판단 메모

### 실제 구현이 있는 현재 화면
- `src/pages/onboarding/OnboardingScreen.tsx`
- `src/pages/register/RegisterScreen.tsx`
- `src/pages/home/HomeScreen.tsx`
- `src/pages/log/LogScreen.tsx`
- `src/pages/log/LogDetailScreen.tsx`
- `src/pages/feed/FeedScreen.tsx`
- `src/pages/feed/FeedDiaryScreen.tsx`
- `src/pages/feed/FeedAvatarScreen.tsx`
- `src/pages/profile/ProfileScreen.tsx`
- `src/pages/follow/FollowScreen.tsx`
- `src/pages/delivery/UnlockGardenScreen.tsx`
- `src/pages/delivery/DeliveryScreen.tsx`
- `src/pages/delivery/DeliveryCompleteScreen.tsx`
- `src/pages/registration/RegistrationAvatarScreen.tsx`
- `src/pages/registration/RegistrationCreationDetailScreen.tsx`
- `src/pages/registration/RegistrationSelectionDetailScreen.tsx`
- `src/pages/registration/RegistrationPlantNicknameScreen.tsx`
- `src/pages/dailyMission/DailyMissionWriteDiaryScreen.tsx`
- `src/pages/dailyMission/DailyMissionQuizMultipleChoiceScreen.tsx`
- `src/pages/dailyMission/DailyMissionQuizOxScreen.tsx`
- `src/pages/dailyMission/DailyMissionCheckingScreen.tsx`
- `src/pages/option/OptionScreen.tsx`

### 파일은 있으나 운영 보완이 남은 화면
- `src/pages/option/OptionScreen.tsx`
- `src/pages/dailyMission/DailyMissionWriteDiaryScreen.tsx`

### 실제 구현이 있는 공용 컴포넌트
- `src/components/common/Splash.tsx`
- `src/components/common/Comment.tsx`
- `src/components/common/ScreenHeader.tsx`
- `src/components/common/StatusView.tsx`
- `src/components/feed/FeedList.tsx`
- `src/components/feed/FeedDetail.tsx`
- `src/components/log/LogCalendar.tsx`
- `src/components/log/MyDiary.tsx`
- `src/components/profile/ProfileDetail.tsx`
- `src/components/follow/UserCard.tsx`
- `src/components/delivery/PlantOptionCard.tsx`
- `src/components/delivery/GardenSlotCard.tsx`
- `src/components/delivery/DeliveryTextField.tsx`
- `src/components/delivery/DeliveryRequestSelector.tsx`
- `src/components/registration/AvatarPreviewCard.tsx`
- `src/components/registration/RegistrationFooter.tsx`
- `src/components/registration/RegistrationModeCard.tsx`
- `src/components/registration/SelectionAvatarCard.tsx`
- `src/components/registration/RegistrationTextField.tsx`
- `src/components/dailyMission/ImageAttachmentCard.tsx`
- `src/components/dailyMission/QuizOptionCard.tsx`
- `src/components/dailyMission/QuizResultCard.tsx`

### 실제 연결된 API
- `src/apis/feed/feedApi.ts`
- `src/apis/feed/avatarPostDetailApi.ts`
- `src/apis/comments/commentApi.ts`
- `src/apis/log/calendarApi.ts`
- `src/apis/log/diariesApi.ts`
- `src/apis/log/diaryDetailApi.ts`
- `src/apis/profile/profileApi.ts`
- `src/apis/follow/followApi.ts`
- `src/apis/delivery/deliveryApi.ts`
- `src/apis/avatars/avatarApi.ts`
- `src/apis/missions/missionApi.ts`
- `src/apis/register/registerApi.ts`
- `src/apis/instance.ts`

