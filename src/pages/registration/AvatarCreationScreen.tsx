import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationHeader from "@/components/registration/common/RegistrationHeader";
import AvatarSelectionOption from "@/components/registration/avatarCreation/AvatarSelectionOption";
import AvatarCreationOption from "@/components/registration/avatarCreation/AvatarCreationOption";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

type Props = RootStackScreenProps<"RegistrationAvatar">;

export default function AvatarCreationScreen({ navigation }: Props) {
  const { activeOption } = useAvatarCreationStore();

  const handleNextPress = () => {
    if (activeOption !== "none") {
      navigation.navigate("RegistrationPlantNickname");
    }
  };

  const isButtonEnabled = activeOption !== "none";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RegistrationHeader />

      <View style={styles.content}>
        <View style={styles.optionContainer}>
          <AvatarSelectionOption />
        </View>

        <View style={styles.optionContainer}>
          <AvatarCreationOption />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            isButtonEnabled ? styles.primaryButton : styles.disabledButton,
          ]}
          onPress={handleNextPress}
          disabled={!isButtonEnabled}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  optionContainer: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
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
