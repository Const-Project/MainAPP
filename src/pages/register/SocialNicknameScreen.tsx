import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import { useUpdateMyNickname } from "@/hooks/profile/useProfileApi";
import { logout } from "@/utils/auth";

type Props = RootStackScreenProps<"SocialNickname">;

export default function SocialNicknameScreen({ navigation, route }: Props) {
  const initialNickname = route.params?.initialNickname?.trim() ?? "";
  const [nickname, setNickname] = useState(
    initialNickname.startsWith("user") ? "" : initialNickname
  );
  const updateNickname = useUpdateMyNickname();

  const trimmedNickname = nickname.trim();
  const isValidNickname = trimmedNickname.length >= 2 && trimmedNickname.length <= 10;

  const helperText = useMemo(() => {
    if (trimmedNickname.length === 0) {
      return "방명록과 피드에 표시될 이름을 입력해주세요.";
    }
    if (trimmedNickname.length < 2) {
      return "닉네임은 2자 이상이어야 합니다.";
    }
    if (trimmedNickname.length > 10) {
      return "닉네임은 10자 이하로 입력해주세요.";
    }
    return "이 닉네임으로 프로필과 방명록 작성자명이 표시됩니다.";
  }, [trimmedNickname]);

  const handleBack = async () => {
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Onboarding" }],
    });
  };

  const handleSubmit = async () => {
    if (!isValidNickname || updateNickname.isPending) {
      return;
    }

    try {
      await updateNickname.mutateAsync(trimmedNickname);
      navigation.reset({
        index: 0,
        routes: [{ name: "RegistrationAvatar" }],
      });
    } catch {
      Alert.alert(
        "닉네임 저장에 실패했습니다",
        "네트워크 상태를 확인한 뒤 다시 시도해주세요."
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => void handleBack()} activeOpacity={0.7} style={styles.sideButton}>
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>닉네임 설정</Text>
        <View style={styles.sideButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>소셜 로그인 완료</Text>
          <Text style={styles.heroTitle}>먼저 사용할 닉네임을 정해주세요.</Text>
          <Text style={styles.heroDescription}>
            {/* 한글 주석:
                소셜 신규 유저는 기존 비회원 가입처럼 닉네임 입력 화면을 거치지 않았기 때문에
                식물 등록으로 넘어가기 전에 유저 닉네임을 먼저 확정한다. */}
            방명록 작성자명과 프로필 이름으로 바로 노출되기 때문에, 지금 한 번 먼저 정하고 시작합니다.
          </Text>
        </View>

        <RegistrationTextField
          label="유저 닉네임"
          value={nickname}
          onChangeText={setNickname}
          placeholder="닉네임을 입력해주세요"
          helperText={helperText}
        />
      </ScrollView>

      <RegistrationFooter
        primaryLabel="다음"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={!isValidNickname || updateNickname.isPending}
        primaryLoading={updateNickname.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  sideButton: {
    width: 56,
    height: 44,
    justifyContent: "center",
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  heroCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#234A2F",
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    color: "#D7E9D8",
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E5F4E5",
  },
});
