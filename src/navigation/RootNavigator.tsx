import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

// 메인 탭
import MainTabNavigator from "./MainTabNavigator";

// 플레이스홀더 (추후 실제 스크린으로 교체)
import PlaceholderScreen from "@/pages/placeholder/PlaceholderScreen";

// 실제 스크린
import OnboardingScreen from "@/pages/onboarding/OnboardingScreen";
import RegisterScreen from "@/pages/register/RegisterScreen";
import FeedDiaryScreen from "@/pages/feed/FeedDiaryScreen";
import FeedAvatarScreen from "@/pages/feed/FeedAvatarScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function ProfileScreen() {
  return <PlaceholderScreen title="프로필" description="사용자 프로필 화면" />;
}

function FollowScreen() {
  return <PlaceholderScreen title="팔로우" description="팔로우 관리" />;
}

function LogDetailScreen() {
  return <PlaceholderScreen title="로그 상세" description="성장 기록 상세 보기" />;
}

function DeliveryScreen() {
  return <PlaceholderScreen title="배송" description="식물 배송 정보" />;
}

function DeliveryCompleteScreen() {
  return <PlaceholderScreen title="배송 완료" description="배송이 완료되었습니다" />;
}

function UnlockGardenScreen() {
  return (
    <PlaceholderScreen title="정원 잠금 해제" description="새로운 정원 공간 열기" />
  );
}

// 등록 플로우 스크린들
function RegistrationAvatarScreen() {
  return (
    <PlaceholderScreen title="아바타 선택" description="식물 아바타를 선택하세요" />
  );
}

function RegistrationCreationDetailScreen() {
  return (
    <PlaceholderScreen
      title="생성 상세"
      description="식물 생성 정보를 입력하세요"
    />
  );
}

function RegistrationSelectionDetailScreen() {
  return (
    <PlaceholderScreen
      title="선택 상세"
      description="식물 선택 정보를 확인하세요"
    />
  );
}

function RegistrationPlantNicknameScreen() {
  return (
    <PlaceholderScreen
      title="식물 별명"
      description="식물에게 별명을 지어주세요"
    />
  );
}

// 데일리 미션 스크린들
function DailyMissionWriteDiaryScreen() {
  return <PlaceholderScreen title="일기 쓰기" description="오늘의 식물 일기" />;
}

function DailyMissionQuizMultipleChoiceScreen() {
  return <PlaceholderScreen title="객관식 퀴즈" description="식물 지식 퀴즈" />;
}

function DailyMissionQuizOxScreen() {
  return <PlaceholderScreen title="OX 퀴즈" description="참/거짓 퀴즈" />;
}

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      {/* 메인 탭 네비게이터 */}
      <Stack.Screen name="Main" component={MainTabNavigator} />

      {/* 인증/온보딩 */}
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />

      {/* 프로필 */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: true, title: "프로필" }}
      />

      {/* 팔로우 */}
      <Stack.Screen
        name="Follow"
        component={FollowScreen}
        options={{ headerShown: true, title: "팔로우" }}
      />

      {/* 피드 상세 */}
      <Stack.Screen
        name="FeedDiary"
        component={FeedDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedAvatar"
        component={FeedAvatarScreen}
        options={{ headerShown: false }}
      />

      {/* 로그 상세 */}
      <Stack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ headerShown: true, title: "성장 기록" }}
      />

      {/* 배송 */}
      <Stack.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{ headerShown: true, title: "배송" }}
      />
      <Stack.Screen
        name="DeliveryComplete"
        component={DeliveryCompleteScreen}
        options={{
          headerShown: true,
          title: "배송 완료",
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="UnlockGarden"
        component={UnlockGardenScreen}
        options={{ headerShown: true, title: "정원 확장" }}
      />

      {/* 식물 등록 플로우 */}
      <Stack.Screen
        name="RegistrationAvatar"
        component={RegistrationAvatarScreen}
        options={{ headerShown: true, title: "아바타 선택" }}
      />
      <Stack.Screen
        name="RegistrationCreationDetail"
        component={RegistrationCreationDetailScreen}
        options={{ headerShown: true, title: "식물 등록" }}
      />
      <Stack.Screen
        name="RegistrationSelectionDetail"
        component={RegistrationSelectionDetailScreen}
        options={{ headerShown: true, title: "식물 선택" }}
      />
      <Stack.Screen
        name="RegistrationPlantNickname"
        component={RegistrationPlantNicknameScreen}
        options={{ headerShown: true, title: "별명 짓기" }}
      />

      {/* 데일리 미션 */}
      <Stack.Screen
        name="DailyMissionWriteDiary"
        component={DailyMissionWriteDiaryScreen}
        options={{ headerShown: true, title: "일기 쓰기" }}
      />
      <Stack.Screen
        name="DailyMissionQuizMultipleChoice"
        component={DailyMissionQuizMultipleChoiceScreen}
        options={{ headerShown: true, title: "객관식 퀴즈" }}
      />
      <Stack.Screen
        name="DailyMissionQuizOx"
        component={DailyMissionQuizOxScreen}
        options={{ headerShown: true, title: "OX 퀴즈" }}
      />
    </Stack.Navigator>
  );
}
