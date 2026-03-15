import { useState, type ReactNode } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";
import {
  RightIcon,
  ToggleOffIcon,
  ToggleOnIcon,
} from "@/assets/icons/CommonIcons";
import ScreenHeader from "@/components/common/ScreenHeader";
import useTokenStore from "@/stores/useTokenStore";
import { logout } from "@/utils/auth";

type Props = MainTabScreenProps<"Option">;

export default function OptionScreen({ navigation }: Props) {
  const [pushNotification, setPushNotification] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { accessToken, userId, hasHydrated } = useTokenStore();

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

  const loginStatus = !hasHydrated ? "세션 확인 중" : accessToken ? "로그인 상태" : "로그아웃 상태";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="설정" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Settings are rendered as a simple list so FE-style rows can expand without changing layout structure. */}
        <OptionRow
          label="푸시 알림"
          rightSlot={
            <TouchableOpacity
              onPress={() => setPushNotification(prev => !prev)}
              activeOpacity={0.7}
              accessibilityRole="switch"
              accessibilityState={{ checked: pushNotification }}
            >
              {pushNotification ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </TouchableOpacity>
          }
        />
        <OptionRow label="유저 닉네임 변경" onPress={() => navigation.navigate("UserNicknameEdit")} />
        <OptionRow label="아바타 닉네임 변경" onPress={() => navigation.navigate("AvatarNicknameEdit")} />
        <OptionRow label="이용 약관" onPress={() => navigation.navigate("Policy")} />
        <OptionRow label="서비스 안내" />
        <OptionRow
          label={isLoggingOut ? "로그아웃 중..." : "로그아웃"}
          danger
          disabled={!hasHydrated || !accessToken || isLoggingOut}
          onPress={handleLogout}
        />

        <View style={styles.metaBlock}>
          <Text style={styles.metaText}>{loginStatus}</Text>
          <Text style={styles.metaText}>{userId ? `사용자 ID ${userId}` : "사용자 ID 없음"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OptionRow({
  label,
  rightSlot,
  danger = false,
  disabled = false,
  onPress,
}: {
  label: string;
  rightSlot?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onPress?: () => void;
}) {
  const content = (
    // A shared row component keeps label-only, toggle, and action rows visually consistent.
    <View style={styles.row}>
      <Text
        style={[
          styles.label,
          danger && styles.labelDanger,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
      {rightSlot ?? <RightIcon size={24} color="#171717" />}
    </View>
  );

  if (!onPress && !rightSlot) {
    return content;
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.7}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  label: {
    fontSize: 14,
    color: "#171717",
  },
  labelDanger: {
    color: "#EF4444",
  },
  labelDisabled: {
    color: "#D1D5DB",
  },
  metaBlock: {
    marginTop: 20,
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});
