import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import Splash from "@/components/common/Splash";
import { useSupabaseOAuth } from "@/hooks/auth/useSupabaseOAuth";
import useRegistrationStore from "@/stores/useRegistrationStore";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    image: require("@/assets/images/onboarding/onboarding1.png"),
    title: "나만의 식물을 화면 속에서 만나보세요",
    subtitle: "물과 햇빛을 주며 직접 키울 수 있어요",
  },
  {
    id: 2,
    image: require("@/assets/images/onboarding/onboarding2.png"),
    title: "실제 식물을 배송받아 키워보세요",
    subtitle: "식물 아바타에 해당하는 실제 식물을 키울 수 있어요",
  },
  {
    id: 3,
    image: require("@/assets/images/onboarding/onboarding3.png"),
    title: "미션을 통해 나무 레벨을 올리고\n새로운 식물을 키울 수 있어요",
    subtitle: "미션 기록은 키움일지에 기록돼요",
  },
  {
    id: 4,
    image: require("@/assets/images/onboarding/onboarding4.png"),
    title: "다른 친구들의 이야기를 들을 수 있어요",
    subtitle: "둘러보기로 친구를 만들고 방명록을 남겨보세요",
  },
];

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingScreen() {
  const [isSplash, setIsSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NavigationProp>();
  const { performOAuth, isLoading } = useSupabaseOAuth();
  const resetRegistration = useRegistrationStore(state => state.reset);

  const isLastSlide = currentIndex === onboardingData.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  const handleStart = () => {
    navigation.navigate("Register");
  };

  // [UI 연동] 소셜 로그인 버튼 클릭 핸들러
  // SupabaseOAuth 훅을 호출하고, 최종적으로 완료되면 전체 네비게이션을 Main 구조로 리셋합니다.
  const handleOAuthLogin = async (provider: 'kakao' | 'google') => {
    const result = await performOAuth(provider);
    if (result?.success) {
      if (result.isNewUser) {
        resetRegistration();
        navigation.reset({
          index: 0,
          routes: [{ name: "RegistrationAvatar" }],
        });
        return;
      }

      navigation.reset({ index: 0, routes: [{ name: 'Main' as any }] }); // Main Tab navigator
    }
  };

  if (isSplash) return <Splash />;

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Button */}
      <View style={styles.buttonContainer}>
        {isLastSlide ? (
          <View style={styles.socialAuthContainer}>
            <TouchableOpacity
              style={[styles.socialButton, styles.kakaoButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleOAuthLogin('kakao')}
              disabled={isLoading}
            >
              <Text style={styles.kakaoButtonText}>
                {isLoading ? "처리 중..." : "카카오로 시작하기"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton, isLoading && styles.buttonDisabled]}
              onPress={() => handleOAuthLogin('google')}
              disabled={isLoading}
            >
              <Text style={styles.googleButtonText}>
                {isLoading ? "처리 중..." : "구글로 시작하기"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.guestButton}
              onPress={handleStart}
              disabled={isLoading}
            >
              <Text style={styles.guestButtonText}>비회원으로 화단 만들기</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonDisabled]}
            disabled={true}
          >
            <Text style={[styles.buttonText, styles.buttonTextDisabled]}>
              나만의 화단 만들러 가기
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 48,
  },
  image: {
    width: 256,
    height: 256,
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 80,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#4CAF50",
  },
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
  socialAuthContainer: {
    gap: 12,
  },
  socialButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  kakaoButton: {
    backgroundColor: "#FEE500",
  },
  kakaoButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  googleButtonText: {
    color: "#000000",
    fontSize: 16,
    fontWeight: "600",
  },
  guestButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  guestButtonText: {
    color: "#6B7280",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
