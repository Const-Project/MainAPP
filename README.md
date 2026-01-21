# 나풀나풀 (Hanium App)

React Native (Expo) 기반 모바일 애플리케이션

## 기술 스택

- **Framework**: React Native with Expo SDK 54
- **Language**: TypeScript
- **Navigation**: React Navigation 7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: react-native-svg

---

## 초기 세팅 가이드

### 1. 사전 요구사항

```bash
# Node.js 버전 확인 (18.x 이상 권장)
node -v

# npm 버전 확인
npm -v
```

Node.js가 설치되어 있지 않다면 [nodejs.org](https://nodejs.org)에서 LTS 버전을 설치하세요.

---

### 2. 프로젝트 클론 및 의존성 설치

```bash
# 저장소 클론
git clone <repository-url>
cd hanium-app

# 의존성 설치
npm install
```

---

### 3. 개발 서버 실행

이거 권장 -> WIFI 같지 않아도 됨. (규영)
npx expo start --clear --tunnel


```bash
npx expo start
```

실행 후 터미널에 QR 코드가 표시됩니다.

---

### 4. 앱 실행 방법

#### 방법 A: 실제 기기 (권장)

1. **Expo Go 앱 설치**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **QR 코드 스캔**
   - Android: Expo Go 앱 내에서 직접 스캔
   - iOS: 기본 카메라 앱으로 스캔 후 링크 터치

> **주의**: PC와 휴대폰이 **같은 Wi-Fi 네트워크**에 연결되어 있어야 합니다.

#### 방법 B: 에뮬레이터 (선택사항)

```bash
# iOS 시뮬레이터 (Mac 전용, Xcode 필요)
npx expo start --ios

# Android 에뮬레이터 (Android Studio 필요)
npx expo start --android
```

---

### 5. 유용한 명령어

```bash
# 캐시 초기화 후 실행 (문제 발생 시)
npx expo start -c

# 터널 모드 (Wi-Fi 연결 문제 시)
npx expo start --tunnel

# TypeScript 타입 체크
npx tsc --noEmit

# 린트 검사
npm run lint
```

---

### 6. 트러블슈팅

| 문제 | 해결 방법 |
|------|-----------|
| QR 코드 스캔이 안됨 | 같은 Wi-Fi인지 확인, `npx expo start --tunnel` 시도 |
| 의존성 설치 에러 | `rm -rf node_modules && npm install` |
| Metro bundler 에러 | `npx expo start -c` (캐시 초기화) |
| Expo Go 버전 불일치 | Expo Go 앱을 최신 버전으로 업데이트 |
| 네트워크 연결 실패 | 방화벽 확인, 터널 모드 사용 |

---

## 프로젝트 구조

```
src/
├── apis/           # API 호출 함수
│   ├── instance.ts # Axios 인스턴스
│   ├── feed/       # 피드 관련 API
│   ├── log/        # 로그 관련 API
│   └── ...
├── assets/         # 정적 리소스
│   ├── icons/      # SVG 아이콘 컴포넌트
│   └── images/     # 이미지 파일
├── components/     # 재사용 컴포넌트
│   ├── common/     # 공통 컴포넌트
│   ├── feed/       # 피드 관련 컴포넌트
│   └── log/        # 로그 관련 컴포넌트
├── hooks/          # 커스텀 훅 (React Query)
├── navigation/     # 네비게이션 설정
│   ├── RootNavigator.tsx
│   ├── MainTabNavigator.tsx
│   └── types.ts
├── pages/          # 화면 컴포넌트
│   ├── home/
│   ├── feed/
│   ├── log/
│   └── ...
├── stores/         # Zustand 상태 관리
└── types/          # TypeScript 타입 정의
```

---

## 주요 화면

| 탭 | 화면 | 설명 |
|----|------|------|
| 홈 | HomeScreen | 메인 홈 화면 |
| 키움일지 | LogScreen | 미션/일기 캘린더 |
| 둘러보기 | FeedScreen | 피드 목록 |
| 설정 | OptionScreen | 앱 설정 |

---

## 개발 규칙

### 스타일링
- `StyleSheet.create()` 사용 (NativeWind/className 사용 안함)
- 색상: `#171717` (텍스트), `#7DC960` (프라이머리), `#BFBFBF` (비활성)

### 컴포넌트
- 함수형 컴포넌트 + TypeScript
- Props 타입은 컴포넌트 파일 내에 정의

### API 호출
- TanStack Query 사용
- hooks 폴더에 useXxxApi.ts 형태로 관리

---

## 참고 문서

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation 문서](https://reactnavigation.org/)
- [TanStack Query 문서](https://tanstack.com/query/latest)
