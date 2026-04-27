# 타인 프로필 / 방명록 재구성 계획

## 목표

타인 프로필 화면을 현재의 "대표 정원 1개 + 카드형 상세" 구조에서 벗어나,
홈 화면과 유사한 정원 중심 화면으로 재구성한다.

핵심 UX 목표는 아래와 같다.

1. 타인 프로필도 정원 중심의 전체 화면 레이아웃을 사용한다.
2. 정원은 홈처럼 좌우 스와이프가 가능하다.
3. 단, 타인 프로필은 해금된 정원 개수만큼만 스와이프 가능하다.
4. 상단에는 뒤로가기, 정원/식물 이름, 친구 추가/언팔로우 버튼이 함께 보여야 한다.
5. 우측 액션 레일에는 홈처럼 물주기 아이콘이 떠야 한다.
6. 남은 친구 물주기 횟수도 함께 보여야 한다.
7. 하단에는 방명록 진입 버튼이 있어야 한다.
8. 방명록 버튼을 누르면 별도 전체 화면의 방명록 페이지로 이동해야 한다.
9. 방명록 페이지에서는 기존 방명록 목록이 위에서부터 스크롤되고,
   하단 고정 입력창으로 새 방명록을 작성할 수 있어야 한다.
10. 받은 유저는 홈의 비둘기 알림에서 방명록 목록을 확인할 수 있어야 한다.

## 현재 상태와 의도 불일치

현재 프로필 구현은 아래와 같은 한계가 있다.

1. `ProfileScreen`은 `data.userGardens[0]`만 사용한다.
   즉, 다중 정원 / 스와이프 UX가 전혀 없다.
2. `ProfileDetail`은 카드형 상세 구조라 홈 화면의 몰입형 정원 화면과 다르다.
3. 현재 프로필 타입의 `GardenInfo`에는 `gardenImageUrl`, `gardenSlotNumber`, `isLocked` 같은 정보가 없다.
   따라서 홈 화면의 정원 배경/슬롯 로직을 그대로 재사용할 수 없다.
4. 방명록은 홈의 `HomeAlertsModal`에서 읽기만 가능하고,
   별도 전체 화면 작성 플로우가 없다.
5. 프로필에서 방명록 버튼을 눌렀을 때 이동할 라우트/페이지가 아직 없다.

## 데이터 전제

현재 백엔드 기준으로 프로필 API는 아래 데이터만 확실하다.

- `GetUserProfileResponse`
  - `id`
  - `userNickname`
  - `profileImageUrl`
  - `followStatus`
  - `leftWaterCountForOthers`
  - `userGardens`
- `GardenInfo`
  - `gardenId`
  - `avatarInfo`
  - `isWateringAbleByMe`

현재 스펙 기준으로는 아래 사항을 가정해야 한다.

1. `userGardens`는 "해금된 정원만" 내려온다.
2. 타인 프로필은 `userGardens.length`만큼만 페이지를 만들면 된다.
3. 정원 배경 이미지가 없다면 홈 배경의 fallback 이미지를 사용한다.
4. 물주기 카운트 표기는 당장은 `leftWaterCountForOthers`만 노출한다.
   `1/5` 같은 최대치 표기는 API가 보장하지 않으므로 하드코딩을 피한다.

추후 백엔드가 아래 필드를 내려주면 더 정확하게 확장 가능하다.

- `gardenSlotNumber`
- `gardenImageUrl`
- `isLocked`
- `maxWaterCountForOthers`

## 목표 화면 구조

### 1. 타인 프로필 화면

`ProfileScreen`을 홈과 유사한 구조로 재편한다.

- 최상위는 전체 화면 배경형 레이아웃
- 내부에 `PagerView` 사용
- `userGardens.length`만큼만 페이지 생성
- 각 페이지는 `ProfileGardenScene` 컴포넌트로 렌더링

페이지마다 보여야 하는 요소:

- 상단
  - 뒤로가기
  - 현재 정원의 식물 이름 또는 기본 이름
  - 친구 추가 / 맞팔로우 / 언팔로우
- 우측 상단
  - 남은 친구 물주기 횟수
- 중앙
  - 정원/아바타 비주얼
- 우측 하단
  - 물주기 아이콘 버튼
- 하단
  - 방명록 진입 버튼

### 2. 방명록 전체 화면

새 `GuestbookScreen`을 추가한다.

- 전체 화면 페이지
- 상단 헤더
- 방명록 목록 `FlatList`
- 하단 고정 입력창
- 댓글 UX처럼 입력창은 목록과 분리된 하단 고정 구조

화면 진입 경로는 두 가지다.

1. 타인 프로필 하단 `방명록 작성`
2. 내 홈 비둘기 흐름에서 방명록 목록 보기

## 구현 방향

### A. 프로필 화면 재구성

새 구조 제안:

- `ProfileScreen`
  - 데이터 로딩
  - `followAction` 계산
  - `PagerView` 페이지 관리
  - 방명록 화면 이동
- `ProfileGardenScene`
  - 홈의 `HomeGardenScene` 스타일을 참고한 정원 중심 씬
  - 물주기 버튼 포함
  - 방명록 버튼 포함

`ProfileDetail`은 아래 둘 중 하나로 정리한다.

1. 제거하고 `ProfileGardenScene`으로 대체
2. 이름을 `ProfileGardenScene`으로 바꾸고 홈형 UI로 전환

권장:

- 기존 `ProfileDetail`을 억지로 확장하지 말고,
  `ProfileGardenScene`을 새 컴포넌트로 분리하는 편이 구조가 깔끔하다.

### B. 방명록 페이지 추가

새 파일 후보:

- `src/pages/profile/GuestbookScreen.tsx`
- `src/components/profile/GuestbookListItem.tsx`
- `src/apis/profile/guestbookApi.ts`
- `src/hooks/profile/useGuestbookApi.ts`
- `src/types/profile/guestbookApi.type.ts`

필요 API:

- GET `/api/v1/users/guestbook/{userId}/list`
- POST `/api/v1/users/{userId}/guestbook`

### C. 홈 비둘기와의 관계

기존 `HomeAlertsModal`은 당장 제거하지 않는다.

단계별 정리 방향:

1. 우선 `GuestbookScreen`을 새로 만든다.
2. 타인 프로필에서 방명록 버튼으로 `GuestbookScreen` 진입을 붙인다.
3. 이후 홈 비둘기에서 방명록 탭을 눌렀을 때도
   필요하면 `GuestbookScreen(myUserId)`로 연결할 수 있게 확장한다.

## 작업 단위

### 1단계. 문서화

- 이 문서 추가

커밋 메시지:

- `chore: 타인 프로필과 방명록 재구성 계획 문서 추가`

### 2단계. 프로필 라우트/타입 기반 정리

- `ProfileScreen`이 다중 정원 배열을 사용할 수 있게 구조 변경
- 현재 타입 기준으로 해금된 정원 수만큼 페이저 페이지 생성
- `ProfileGardenScene` 뼈대 추가

커밋 메시지:

- `refactor: 타인 프로필을 정원 페이저 구조로 재구성`

### 3단계. 프로필 씬 홈 스타일 적용

- 홈과 유사한 배경형 정원 씬 적용
- 상단 헤더 / 팔로우 버튼 / 물주기 카운트 / 액션 레일 / 방명록 버튼 반영
- 물주기 버튼은 기존 `useFriendWater`와 연결

커밋 메시지:

- `feat: 타인 프로필 정원 씬과 물주기 UI 적용`

### 4단계. 방명록 API / 타입 / 훅 추가

- 방명록 목록 조회 API
- 방명록 작성 API
- react-query 훅 추가

커밋 메시지:

- `feat: 방명록 조회와 작성 API 훅 추가`

### 5단계. 방명록 전체 화면 추가

- `GuestbookScreen` 라우트 추가
- 목록 스크롤 + 하단 고정 입력창 구현
- 빈 상태 문구 처리

커밋 메시지:

- `feat: 방명록 전체 화면과 입력 UX 구현`

### 6단계. 프로필 방명록 버튼 연결

- 타인 프로필의 `방명록 작성` 버튼을 `GuestbookScreen(userId)`로 연결

커밋 메시지:

- `feat: 타인 프로필 방명록 진입 연결`

### 7단계. 홈 비둘기와 방명록 흐름 정리

- `HomeAlertsModal`에서 방명록 진입 전략 결정
- 필요 시 내 방명록 전체 보기로 연결

커밋 메시지:

- `refactor: 홈 비둘기와 방명록 조회 흐름 정리`

## 구현 시 주의점

1. 타인 프로필은 홈과 비슷해도 완전히 같은 규칙을 쓰면 안 된다.
   홈은 4슬롯 고정, 타인 프로필은 해금된 정원 수만큼만 페이지 생성해야 한다.
2. 현재 프로필 API엔 정원 배경 정보가 없으므로 fallback 배경 전략이 필요하다.
3. 방명록 입력창은 댓글 시트처럼 "하단 고정"이 핵심이다.
4. 방명록 버튼은 동작 없는 더미 상태로 두지 않는다.
5. 비둘기 모달과 새 방명록 페이지가 역할 충돌하지 않도록,
   모달은 요약/알림, 화면은 읽기+작성 전체 흐름으로 분리한다.

## 최종 기대 결과

구현 완료 후에는 아래가 성립해야 한다.

1. 타인 프로필에 들어가면 홈과 유사한 정원 중심 화면이 보인다.
2. 해금된 정원 수만큼만 좌우 스와이프가 된다.
3. 친구 추가 / 맞팔 / 언팔로우 버튼이 상단에서 동작한다.
4. 우측 액션 레일의 물주기 버튼으로 실제 친구 물주기가 가능하다.
5. 하단 `방명록 작성` 버튼을 누르면 별도 전체 화면의 방명록 페이지로 이동한다.
6. 방명록 페이지에서 기존 글을 스크롤로 보고, 하단 입력창으로 새 글을 남길 수 있다.
7. 받은 유저는 홈 비둘기 알림에서도 방명록 흐름을 확인할 수 있다.
