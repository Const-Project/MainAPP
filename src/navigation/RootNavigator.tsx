import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

// 메인 탭
import MainTabNavigator from "./MainTabNavigator";

// 실제 스크린
import OnboardingScreen from "@/pages/onboarding/OnboardingScreen";
import RegisterScreen from "@/pages/register/RegisterScreen";
import FeedDiaryScreen from "@/pages/feed/FeedDiaryScreen";
import FeedAvatarScreen from "@/pages/feed/FeedAvatarScreen";
import FollowScreen from "@/pages/follow/FollowScreen";
import LogDetailScreen from "@/pages/log/LogDetailScreen";
import WriteDiaryScreen from "@/pages/dailyMission/WriteDiaryScreen";
import OxQuizScreen from "@/pages/dailyMission/OxQuizScreen";
import MultipleChoiceQuizScreen from "@/pages/dailyMission/MultipleChoiceQuizScreen";
import AvatarCreationScreen from "@/pages/registration/AvatarCreationScreen";
import SelectionDetailScreen from "@/pages/registration/SelectionDetailScreen";
import CreationDetailScreen from "@/pages/registration/CreationDetailScreen";
import PlantNicknameScreen from "@/pages/registration/PlantNicknameScreen";
import UnlockGardenScreen from "@/pages/delivery/UnlockGardenScreen";
import DeliveryScreen from "@/pages/delivery/DeliveryScreen";
import DeliveryCompleteScreen from "@/pages/delivery/DeliveryCompleteScreen";
import ProfileScreen from "@/pages/profile/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
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
        options={{ headerShown: false }}
      />

      {/* 팔로우 */}
      <Stack.Screen
        name="Follow"
        component={FollowScreen}
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      />

      {/* 배송 */}
      <Stack.Screen
        name="Delivery"
        component={DeliveryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryComplete"
        component={DeliveryCompleteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UnlockGarden"
        component={UnlockGardenScreen}
        options={{ headerShown: false }}
      />

      {/* 식물 등록 플로우 */}
      <Stack.Screen
        name="RegistrationAvatar"
        component={AvatarCreationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationCreationDetail"
        component={CreationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationSelectionDetail"
        component={SelectionDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationPlantNickname"
        component={PlantNicknameScreen}
        options={{ headerShown: false }}
      />

      {/* 데일리 미션 */}
      <Stack.Screen
        name="DailyMissionWriteDiary"
        component={WriteDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionQuizMultipleChoice"
        component={MultipleChoiceQuizScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionQuizOx"
        component={OxQuizScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
