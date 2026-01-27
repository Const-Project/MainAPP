import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";
import {
  RightIcon,
  ToggleOnIcon,
  ToggleOffIcon,
} from "@/assets/icons/CommonIcons";

type Props = MainTabScreenProps<"Option">;

type MenuItemProps = {
  label: string;
  onPress?: () => void;
  danger?: boolean;
  rightElement?: React.ReactNode;
};

function MenuItem({ label, onPress, danger, rightElement }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.menuLabel, danger && styles.dangerText]}>
        {label}
      </Text>
      {rightElement || <RightIcon size={24} color="#171717" />}
    </TouchableOpacity>
  );
}

export default function OptionScreen({ navigation }: Props) {
  const [pushNotification, setPushNotification] = useState(true);

  const handlePushNotificationToggle = () => {
    setPushNotification(!pushNotification);
  };

  const handleUserNicknameChange = () => {
    // TODO: 유저 닉네임 변경 화면으로 이동
    // navigation.navigate("ChangeUserNickname");
  };

  const handleAvatarNicknameChange = () => {
    // TODO: 아바타 닉네임 변경 화면으로 이동
    // navigation.navigate("ChangeAvatarNickname");
  };

  const handleTerms = () => {
    // TODO: 이용 약관 화면으로 이동
    // navigation.navigate("Terms");
  };

  const handleServiceInfo = () => {
    // TODO: 서비스 안내 화면으로 이동
    // navigation.navigate("ServiceInfo");
  };

  const handleWithdraw = () => {
    // TODO: 회원 탈퇴 화면으로 이동
    // navigation.navigate("Withdraw");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>설정</Text>
      </View>

      {/* 설정 메뉴 목록 */}
      <ScrollView style={styles.content}>
        {/* 푸시 알림 */}
        <MenuItem
          label="푸시 알림"
          onPress={handlePushNotificationToggle}
          rightElement={
            <TouchableOpacity onPress={handlePushNotificationToggle}>
              {pushNotification ? (
                <ToggleOnIcon size={36} />
              ) : (
                <ToggleOffIcon size={36} />
              )}
            </TouchableOpacity>
          }
        />

        {/* 유저 닉네임 변경 */}
        <MenuItem label="유저 닉네임 변경" onPress={handleUserNicknameChange} />

        {/* 아바타 닉네임 변경 */}
        <MenuItem
          label="아바타 닉네임 변경"
          onPress={handleAvatarNicknameChange}
        />

        {/* 이용 약관 */}
        <MenuItem label="이용 약관" onPress={handleTerms} />

        {/* 서비스 안내 */}
        <MenuItem label="서비스 안내" onPress={handleServiceInfo} />

        {/* 회원 탈퇴 */}
        <MenuItem label="회원 탈퇴" onPress={handleWithdraw} danger />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    color: "#171717",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: "#171717",
  },
  dangerText: {
    color: "#EF4444",
  },
});
