import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import { logout } from "@/utils/auth";
import useTokenStore from "@/stores/useTokenStore";
import type { MainTabScreenProps } from "@/navigation/types";

type Props = MainTabScreenProps<"Option">;

export default function OptionScreen(_: Props) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { accessToken, userId, hasHydrated } = useTokenStore();

  let loginStatus = "로그인 상태";

  if (!hasHydrated) {
    loginStatus = "세션 확인 중";
  } else if (!accessToken) {
    loginStatus = "로그아웃 상태";
  }

  const handleLogout = () => {
    if (isLoggingOut || !accessToken) {
      return;
    }

    Alert.alert("로그아웃", "현재 계정에서 로그아웃할까요?", [
      { text: "취소", style: "cancel" },
      {
        text: "로그아웃",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          await logout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="설정" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>계정</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>인증 상태</Text>
              <Text style={styles.value}>{loginStatus}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>사용자 ID</Text>
              <Text style={styles.value}>{userId ?? "확인되지 않음"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>운영 안내</Text>
          <View style={styles.card}>
            <Text style={styles.infoTitle}>MainAPP 단독 운영 기준</Text>
            <Text style={styles.infoText}>
              MainFE 종료 이후에는 현재 앱 레포와 MainBE 계약이 기준입니다.
            </Text>
            <Text style={styles.infoText}>
              버전 표기, 약관, 고객 문의 연결은 운영 정책 확정 후 추가합니다.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoggingOut || !accessToken}
          onPress={handleLogout}
          style={[
            styles.logoutButton,
            (isLoggingOut || !accessToken) && styles.logoutButtonDisabled,
          ]}
        >
          {isLoggingOut ? (
            <View style={styles.logoutLoading}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.logoutButtonText}>로그아웃 중...</Text>
            </View>
          ) : (
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 20,
    gap: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
  },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  logoutButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#DC2626",
    paddingVertical: 16,
    marginTop: 8,
  },
  logoutButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  logoutLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
