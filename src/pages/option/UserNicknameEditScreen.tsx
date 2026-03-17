import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import { LeftIcon } from "@/assets/icons/CommonIcons";
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
  const isButtonEnabled = isValidNickname && isChanged && !updateNickname.isPending;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!isButtonEnabled) return;

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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>유저 닉네임 변경</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>변경할 닉네임을 입력해주세요</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draftNickname}
            onChangeText={setDraftNickname}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor="#BFBFBF"
            maxLength={10}
          />
          <Text style={styles.maxLength}>최대 10자</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isButtonEnabled ? styles.buttonActive : styles.buttonDisabled]}
          onPress={() => void handleSubmit()}
          disabled={!isButtonEnabled}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, isButtonEnabled ? styles.buttonTextActive : styles.buttonTextDisabled]}>
            {updateNickname.isPending ? "처리 중..." : "확인"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#171717",
    lineHeight: 28,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#171717",
    paddingVertical: 0,
  },
  maxLength: {
    fontSize: 14,
    color: "#7C7C7C",
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 34,
  },
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#2F7D32",
  },
  buttonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  buttonTextActive: {
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#BFBFBF",
  },
});
