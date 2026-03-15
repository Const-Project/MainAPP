import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import Splash from "@/components/common/Splash";
import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";
import { onboardingSlides } from "@/constants/onboardingSlides";
import { useSupabaseOAuth } from "@/hooks/auth/useSupabaseOAuth";
import useRegistrationStore from "@/stores/useRegistrationStore";
import { debugLog, debugScreenMounted } from "@/utils/debug";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function OnboardingScreen() {
  const [isSplash, setIsSplash] = useState(true);
  const navigation = useNavigation<NavigationProp>();
  const { performOAuth, isLoading, isExpoGo } = useSupabaseOAuth();
  const resetRegistration = useRegistrationStore(state => state.reset);

  useEffect(() => {
    debugScreenMounted("OnboardingScreen");
    const timer = setTimeout(() => {
      debugLog("OnboardingScreen", "Splash timer finished");
      setIsSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStart = () => {
    debugLog("OnboardingScreen", "Navigate -> Register");
    navigation.navigate("Register");
  };

  const handleOAuthLogin = async (provider: "kakao" | "google") => {
    debugLog("OnboardingScreen", "OAuth button pressed", { provider });

    if (provider === "kakao" && isExpoGo) {
      debugLog("OnboardingScreen", "Blocked Kakao login in Expo Go");
      Alert.alert(
        "카카오 로그인은 Expo Go에서 지원하지 않아요",
        "카카오톡 앱 전환 때문에 인증이 초기화될 수 있어요. 카카오 로그인은 development build에서 테스트해주세요."
      );
      return;
    }

    const result = await performOAuth(provider);
    debugLog("OnboardingScreen", "OAuth result received", {
      provider,
      success: result?.success,
      isNewUser: result?.isNewUser,
      cancelled: result?.cancelled,
    });

    if (result?.success && result.isNewUser) {
      resetRegistration();
      debugLog("OnboardingScreen", "Reset -> SocialNickname for new social user");
      navigation.reset({
        index: 0,
        routes: [
          {
            name: "SocialNickname",
            params: { initialNickname: result.nickname },
          },
        ],
      });
    }
  };

  if (isSplash) return <Splash />;

  return (
    <View style={styles.container}>
      <OnboardingCarousel />

      <View style={styles.buttonContainer}>
        <View style={styles.socialAuthContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              styles.kakaoButton,
              (isLoading || isExpoGo) && styles.buttonDisabled,
            ]}
            onPress={() => handleOAuthLogin("kakao")}
            disabled={isLoading || isExpoGo}
          >
            <Text style={styles.kakaoButtonText}>
              {isLoading ? "처리 중..." : "카카오로 시작하기"}
            </Text>
          </TouchableOpacity>

          {isExpoGo ? (
            <Text style={styles.helperText}>
              Expo Go에서는 카카오 로그인 대신 구글 로그인 또는 development build를 사용해주세요.
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.socialButton, styles.googleButton, isLoading && styles.buttonDisabled]}
            onPress={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>
              {isLoading ? "처리 중..." : "구글로 시작하기"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton} onPress={handleStart} disabled={isLoading}>
            <Text style={styles.guestButtonText}>비회원으로 화단 만들기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
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
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
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
  helperText: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: -4,
  },
});
