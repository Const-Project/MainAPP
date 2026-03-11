import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";
import { LeftIcon, EditIcon } from "@/assets/icons/CommonIcons";
import { useRegister } from "@/hooks/register/useRegister";
import useRegistrationStore from "@/stores/useRegistrationStore";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const inputRef = useRef<TextInput>(null);
  const [nickname, setNickname] = useState("");
  const navigation = useNavigation<NavigationProp>();
  const { register, isLoading } = useRegister();
  const resetRegistration = useRegistrationStore(state => state.reset);

  const isValidNickname = nickname.length >= 2 && nickname.length <= 10;

  const handleWrapperPress = () => {
    inputRef.current?.focus();
  };

  const handleRegister = async () => {
    if (!isValidNickname) return;

    try {
      await register(nickname);
      resetRegistration();
      navigation.navigate("RegistrationAvatar");
    } catch (error) {
      console.error(error);
      // 에러가 발생해도 다음 화면으로 이동 (기존 웹과 동일한 동작)
      resetRegistration();
      navigation.navigate("RegistrationAvatar");
    }
  };

  const handleBackPress = () => {
    navigation.navigate("Onboarding");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <LeftIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>가입하기</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>반갑습니다!</Text>
            <Text style={styles.title}>닉네임을 설정해주세요</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.inputWrapper,
              inputRef.current?.isFocused() && styles.inputWrapperFocused,
            ]}
            onPress={handleWrapperPress}
            activeOpacity={1}
          >
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#9CA3AF"
              value={nickname}
              onChangeText={setNickname}
              maxLength={10}
            />
            {nickname.length > 0 ? (
              <EditIcon size={24} />
            ) : (
              <Text style={styles.hintText}>2~10자</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Button */}
        <TouchableOpacity
          style={[styles.button, !isValidNickname && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isValidNickname || isLoading}
        >
          <Text style={[styles.buttonText, !isValidNickname && styles.buttonTextDisabled]}>
            {isLoading ? "처리 중..." : "확인"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
    justifyContent: "space-between",
  },
  topSection: {
    gap: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 12,
    padding: 16,
  },
  inputWrapperFocused: {
    borderColor: "#4B5563",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
    padding: 0,
  },
  hintText: {
    fontSize: 14,
    color: "#4B5563",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonTextDisabled: {
    color: "#9CA3AF",
  },
});
