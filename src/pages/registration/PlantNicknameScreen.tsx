import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationHeader from "@/components/registration/common/RegistrationHeader";
import AvatarDisplayArea from "@/components/registration/common/AvatarDisplayArea";
import { useFinalChoiceAvatar } from "@/hooks/avatars/useFinalChoiceAvatarApi";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

type Props = RootStackScreenProps<"RegistrationPlantNickname">;

export default function PlantNicknameScreen({ navigation }: Props) {
  const [avatarNameTemp, setAvatarNameTemp] = useState("");
  const { pickAvatar, actions } = useAvatarCreationStore();
  const { mutate: selectFinalAvatar } = useFinalChoiceAvatar();

  const handleChange = (value: string) => {
    if (value.startsWith(" ")) {
      value = value.trimStart();
    }
    setAvatarNameTemp(value);
  };

  const handleNext = () => {
    if (!pickAvatar.id || !pickAvatar.img) return;

    selectFinalAvatar(
      {
        nickname: avatarNameTemp,
        imageUrl: pickAvatar.img,
        masterId: pickAvatar.id,
      },
      {
        onSuccess: () => {
          actions.setAvatarName(avatarNameTemp);
          actions.reset();
          navigation.reset({
            index: 0,
            routes: [{ name: "Main" }],
          });
        },
        onError: () => {
          Alert.alert("오류", "아바타 최종 선택에 실패했습니다.");
        },
      }
    );
  };

  const isInvalid = avatarNameTemp.length > 6;
  const isButtonEnabled = avatarNameTemp.trim().length > 0 && !isInvalid;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RegistrationHeader />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.title}>식물의 별명을 지어주세요</Text>

          <View style={styles.avatarSection}>
            <AvatarDisplayArea />

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, isInvalid && styles.inputError]}
                value={avatarNameTemp}
                onChangeText={handleChange}
                placeholder="별명을 지어주세요"
                placeholderTextColor="#9CA3AF"
                maxLength={10}
              />
              {avatarNameTemp === "" && (
                <Text style={styles.maxLengthHint}>최대 6자</Text>
              )}
            </View>

            {isInvalid && (
              <Text style={styles.errorText}>최대 6자 입력해주세요</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              isButtonEnabled ? styles.primaryButton : styles.disabledButton,
            ]}
            onPress={handleNext}
            disabled={!isButtonEnabled}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>내 텃밭으로 가기</Text>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    paddingVertical: 32,
    paddingLeft: 25,
  },
  avatarSection: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: "center",
  },
  inputContainer: {
    width: 353,
    height: 60,
    marginTop: 16,
    marginBottom: 7,
    position: "relative",
  },
  input: {
    width: "100%",
    height: "100%",
    borderWidth: 1,
    borderColor: "#9CA3AF",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingRight: 80,
    fontSize: 14,
    color: "#171717",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  maxLengthHint: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -7 }],
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  errorText: {
    width: 353,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    paddingLeft: 17,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#7DC960",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
