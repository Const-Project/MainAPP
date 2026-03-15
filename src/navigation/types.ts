import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

/**
 * Root Stack Navigator - 앱 전체 네비게이션
 */
export type RootStackParamList = {
  // 메인 탭
  Main: NavigatorScreenParams<MainTabParamList>;

  // 인증/온보딩
  Onboarding: undefined;
  Register: undefined;
  SocialNickname: { initialNickname?: string } | undefined;

  // 프로필
  Profile: { userId: number };
  Guestbook: { userId: number; userNickname?: string };

  // 설정
  UserNicknameEdit: undefined;
  AvatarNicknameEdit: undefined;
  Policy: undefined;
  ServiceGuide: undefined;

  // 팔로우
  Follow: undefined;

  // 피드 상세
  FeedDiary: { postId: number };
  FeedAvatar: { postId: number };

  // 로그 상세
  LogDetail: { id: number };

  // 배송
  Delivery:
    | {
        seedType?: number;
        seedName?: string;
        gardenId?: number;
      }
    | undefined;
  DeliveryComplete:
    | {
        seedName?: string;
        gardenId?: number;
      }
    | undefined;
  UnlockGarden: undefined;

  // 식물 등록 플로우
  RegistrationAvatar: undefined;
  RegistrationCreationDetail: undefined;
  RegistrationSelectionDetail: undefined;
  RegistrationPlantNickname: undefined;

  // 데일리 미션
  DailyMissionWriteDiary: undefined;
  DailyMissionQuizMultipleChoice: undefined;
  DailyMissionQuizOx: undefined;
  DailyMissionChecking: undefined;
};

/**
 * Main Tab Navigator - 하단 탭 바
 */
export type MainTabParamList = {
  Home: undefined;
  Log: undefined;
  Feed: undefined;
  Option: undefined;
};

/**
 * Screen Props 타입들
 */

// Root Stack 스크린 Props
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

// Main Tab 스크린 Props (Root Stack 내부에 중첩됨)
export type MainTabScreenProps<T extends keyof MainTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

/**
 * Navigation 전역 타입 선언
 * useNavigation() 훅에서 타입 추론 가능하게 함
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
