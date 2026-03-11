import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import useTokenStore from "@/stores/useTokenStore";
import Splash from "@/components/common/Splash";

// 메인 탭
import MainTabNavigator from "./MainTabNavigator";

// 실제 스크린
import OnboardingScreen from "@/pages/onboarding/OnboardingScreen";
import RegisterScreen from "@/pages/register/RegisterScreen";
import FeedDiaryScreen from "@/pages/feed/FeedDiaryScreen";
import FeedAvatarScreen from "@/pages/feed/FeedAvatarScreen";
import LogDetailScreen from "@/pages/log/LogDetailScreen";
import ProfileScreen from "@/pages/profile/ProfileScreen";
import FollowScreen from "@/pages/follow/FollowScreen";
import DeliveryScreen from "@/pages/delivery/DeliveryScreen";
import DeliveryCompleteScreen from "@/pages/delivery/DeliveryCompleteScreen";
import UnlockGardenScreen from "@/pages/delivery/UnlockGardenScreen";
import RegistrationAvatarScreen from "@/pages/registration/RegistrationAvatarScreen";
import RegistrationCreationDetailScreen from "@/pages/registration/RegistrationCreationDetailScreen";
import RegistrationSelectionDetailScreen from "@/pages/registration/RegistrationSelectionDetailScreen";
import RegistrationPlantNicknameScreen from "@/pages/registration/RegistrationPlantNicknameScreen";
import DailyMissionWriteDiaryScreen from "@/pages/dailyMission/DailyMissionWriteDiaryScreen";
import DailyMissionQuizMultipleChoiceScreen from "@/pages/dailyMission/DailyMissionQuizMultipleChoiceScreen";
import DailyMissionQuizOxScreen from "@/pages/dailyMission/DailyMissionQuizOxScreen";
import DailyMissionCheckingScreen from "@/pages/dailyMission/DailyMissionCheckingScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { accessToken, hasHydrated } = useTokenStore();
  const isAuthenticated = Boolean(accessToken);

  if (!hasHydrated) {
    return <Splash />;
  }

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Main" : "Onboarding"}
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#FFFFFF" },
      }}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
        </>
      ) : (
        <>
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
        </>
      )}

      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Follow"
        component={FollowScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="LogDetail"
        component={LogDetailScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="RegistrationAvatar"
        component={RegistrationAvatarScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationCreationDetail"
        component={RegistrationCreationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationSelectionDetail"
        component={RegistrationSelectionDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationPlantNickname"
        component={RegistrationPlantNicknameScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionWriteDiary"
        component={DailyMissionWriteDiaryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionQuizMultipleChoice"
        component={DailyMissionQuizMultipleChoiceScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionQuizOx"
        component={DailyMissionQuizOxScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DailyMissionChecking"
        component={DailyMissionCheckingScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
