import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import StatusView from "@/components/common/StatusView";
import { useUpdateMyNickname, useUserProfile } from "@/hooks/profile/useProfileApi";
import useTokenStore from "@/stores/useTokenStore";

type Props = RootStackScreenProps<"UserNicknameEdit">;

export default function UserNicknameEditScreen({ navigation }: Props) {
  const { userId } = useTokenStore();
  const { data, isLoading, error, refetch } = useUserProfile(userId);
  const updateNickname = useUpdateMyNickname();
  const [draftNickname, setDraftNickname] = useState("");

  const nickname = draftNickname || data?.userNickname || "";
  const trimmedNickname = nickname.trim();
  const isValidNickname = trimmedNickname.length >= 2 && trimmedNickname.length <= 10;
  const isChanged = trimmedNickname.length > 0 && trimmedNickname !== (data?.userNickname ?? "");

  const helperText = useMemo(() => {
    if (trimmedNickname.length === 0) {
      return "프로필과 방명록에 표시될 이름입니다.";
    }
    if (trimmedNickname.length < 2) {
      return "닉네임은 2자 이상이어야 합니다.";
    }
    if (trimmedNickname.length > 10) {
      return "닉네임은 10자 이하로 입력해주세요.";
    }
    return "저장하면 프로필, 피드, 방명록에 새 이름이 반영됩니다.";
  }, [trimmedNickname]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!isValidNickname || !isChanged || updateNickname.isPending) {
      return;
    }

    try {
      await updateNickname.mutateAsync(trimmedNickname);
      navigation.goBack();
    } catch {
      Alert.alert("닉네임 변경에 실패했습니다", "잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView title="현재 닉네임을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="닉네임 정보를 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.sideButton}>
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>유저 닉네임 변경</Text>
        <View style={styles.sideButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>설정</Text>
          <Text style={styles.heroTitle}>보여질 이름을 수정합니다.</Text>
          <Text style={styles.heroDescription}>
            {/* 한글 주석:
                설정 메뉴에서 바꾸는 유저 닉네임은 프로필 이름뿐 아니라
                피드 작성자명과 방명록 작성자명에도 함께 쓰이는 공통 이름이다. */}
            현재 닉네임을 바꾸면 프로필과 소셜 영역 전반에 같은 이름으로 반영됩니다.
          </Text>
        </View>

        <RegistrationTextField
          label="유저 닉네임"
          value={nickname}
          onChangeText={setDraftNickname}
          placeholder="닉네임을 입력해주세요"
          helperText={helperText}
        />
      </ScrollView>

      <RegistrationFooter
        primaryLabel="저장"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={!isValidNickname || !isChanged || updateNickname.isPending}
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
