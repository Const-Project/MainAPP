import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { LeftIcon } from "@/assets/icons/CommonIcons";
import { EditIcon } from "@/assets/icons/CommonIcons";
import { useUpdateAvatarNickname } from "@/hooks/option/useAvatarNicknameApi";

type Props = RootStackScreenProps<"AvatarNicknameEditStep2">;

export default function AvatarNicknameEditStep2Screen({ navigation, route }: Props) {
  const { avatarId, avatarName, avatarImageUrl } = route.params;
  const updateAvatarNickname = useUpdateAvatarNickname();
  const [draftName, setDraftName] = useState(avatarName);

  const trimmed = draftName.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 6;
  const isChanged = trimmed !== avatarName;
  const isButtonEnabled = isValid && isChanged && !updateAvatarNickname.isPending;

  const handleBack = () => navigation.goBack();

  const handleSubmit = async () => {
    if (!isButtonEnabled) return;
    try {
      await updateAvatarNickname.mutateAsync({ avatarId, newAvatarName: trimmed });
      navigation.pop(2);
    } catch {
      Alert.alert("아바타 닉네임 변경에 실패했습니다", "잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아바타 닉네임 변경</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatarCard}>
          <Image source={{ uri: avatarImageUrl }} style={styles.avatarImage} resizeMode="contain" />
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={draftName}
            onChangeText={setDraftName}
            placeholder="닉네임을 입력해주세요"
            placeholderTextColor="#BFBFBF"
            maxLength={6}
          />
          <EditIcon size={24} color="#7C7C7C" />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isButtonEnabled ? styles.buttonActive : styles.buttonDisabled]}
          onPress={() => void handleSubmit()}
          disabled={!isButtonEnabled}
          activeOpacity={0.85}
        >
          <Text style={[styles.buttonText, !isButtonEnabled && styles.buttonTextDisabled]}>
            {updateAvatarNickname.isPending ? "처리 중..." : "확인"}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingHorizontal: 20,
  },
  avatarCard: {
    width: 258,
    height: 292,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#72D14E",
    backgroundColor: "#EEF9EA",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#171717",
    borderRadius: 8,
    width: "100%",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#171717",
    paddingVertical: 0,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#72D14E",
  },
  buttonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonTextDisabled: {
    color: "#BFBFBF",
  },
});
