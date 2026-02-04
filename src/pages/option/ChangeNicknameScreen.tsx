import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { LeftIcon, EditIcon } from "@/assets/icons/CommonIcons";
import { patchUserNickname } from "@/apis/user/userApi";

type Props = RootStackScreenProps<"ChangeNickname">;

export default function ChangeNicknameScreen({ navigation }: Props) {
  const [nickname, setNickname] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValid = nickname.length > 0 && nickname.length <= 10;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await patchUserNickname({ newNickname: nickname });
      if (response.isSuccess) {
        Alert.alert("완료", "닉네임이 변경되었습니다.", [
          { text: "확인", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("오류", response.message || "닉네임 변경에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "닉네임 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
          >
            <LeftIcon size={24} color="#171717" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>유저 닉네임 변경</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 컨텐츠 */}
        <View style={styles.content}>
          <Text style={styles.label}>변경할 닉네임을 입력해주세요</Text>

          <View
            style={[
              styles.inputContainer,
              isFocused && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#9CA3AF"
              value={nickname}
              onChangeText={setNickname}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={10}
              autoFocus
            />
            <EditIcon size={20} color="#9CA3AF" />
          </View>

          <Text style={styles.hint}>최대 10자 입력해주세요</Text>
        </View>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              !isValid && styles.confirmButtonDisabled,
            ]}
            onPress={handleConfirm}
            activeOpacity={0.8}
            disabled={!isValid || isLoading}
          >
            <Text
              style={[
                styles.confirmButtonText,
                !isValid && styles.confirmButtonTextDisabled,
              ]}
            >
              {isLoading ? "변경 중..." : "확인"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainerFocused: {
    borderColor: "#7DC960",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#171717",
    padding: 0,
  },
  hint: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#7DC960",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  confirmButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
