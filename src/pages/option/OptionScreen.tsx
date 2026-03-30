import { useState, type ReactNode } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";
import {
  RightIcon,
  ToggleOffIcon,
  ToggleOnIcon,
} from "@/assets/icons/CommonIcons";
import ConfirmModal from "@/components/common/ConfirmModal";
import ScreenHeader from "@/components/common/ScreenHeader";
import { useNotificationSettings, useUpdateNotificationSettings } from "@/hooks/option/useNotificationApi";
import useTokenStore from "@/stores/useTokenStore";
import { logout } from "@/utils/auth";
import { registerDeviceFcmToken, unregisterDeviceFcmToken } from "@/utils/fcm";

type Props = MainTabScreenProps<"Option">;

export default function OptionScreen({ navigation }: Props) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutConfirmVisible, setIsLogoutConfirmVisible] = useState(false);
  const { accessToken, userId, hasHydrated } = useTokenStore();
  const { data: notificationSettings } = useNotificationSettings();
  const updateSettingsMutation = useUpdateNotificationSettings();
  const pushNotification = notificationSettings?.notificationEnabled ?? true;
  const marketingConsent = notificationSettings?.marketingConsent ?? false;

  const handleTogglePushNotification = async () => {
    if (updateSettingsMutation.isPending) {
      return;
    }

    if (!pushNotification) {
      const registered = await registerDeviceFcmToken();
      if (!registered) {
        Alert.alert("알림 권한 필요", "기기 알림 권한을 허용한 뒤 다시 시도해주세요.");
        return;
      }
    } else {
      const removed = await unregisterDeviceFcmToken();
      if (!removed) {
        Alert.alert("알림 설정 변경 실패", "토큰 해제에 실패했습니다. 잠시 후 다시 시도해주세요.");
        return;
      }
    }

    updateSettingsMutation.mutate(
      {
        notificationEnabled: !pushNotification,
        marketingConsent,
      },
      {
        onError: () => {
          Alert.alert("알림 설정 변경 실패", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  const handleLogout = () => {
    if (isLoggingOut || !accessToken) {
      return;
    }

    setIsLogoutConfirmVisible(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut || !accessToken) {
      return;
    }

    setIsLogoutConfirmVisible(false);
    setIsLoggingOut(true);
    await logout();
  };

  const loginStatus = !hasHydrated ? "세션 확인 중" : accessToken ? "로그인 상태" : "로그아웃 상태";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScreenHeader title="설정" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <OptionRow
          label="푸시 알림"
          rightSlot={
            <TouchableOpacity
              onPress={() => void handleTogglePushNotification()}
              activeOpacity={0.7}
              disabled={updateSettingsMutation.isPending}
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
        <OptionRow label="서비스 안내" onPress={() => navigation.navigate("ServiceGuide")} />
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

      <ConfirmModal
        visible={isLogoutConfirmVisible}
        title="로그아웃"
        description="현재 계정에서 로그아웃할까요?"
        confirmLabel="로그아웃"
        confirmDestructive
        confirmDisabled={isLoggingOut}
        onCancel={() => setIsLogoutConfirmVisible(false)}
        onConfirm={() => void handleConfirmLogout()}
      />
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

  if (!onPress) {
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
