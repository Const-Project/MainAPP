import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationHeader from "@/components/registration/common/RegistrationHeader";
import CreationDetail from "@/components/registration/creationFlow/CreationDetail";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

type Props = RootStackScreenProps<"RegistrationCreationDetail">;

export default function CreationDetailScreen({ navigation }: Props) {
  const { actions } = useAvatarCreationStore();
  const userName = "나풀나풀";

  const handleNextPress = () => {
    actions.completeCreation();
    navigation.navigate("RegistrationAvatar");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RegistrationHeader showBackButton={false} />

      <Text style={styles.title}>
        {userName}님만의{"\n"}아바타가 완성되었어요!
      </Text>

      <View style={styles.content}>
        <CreationDetail />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNextPress}
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
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    paddingTop: 32,
    paddingLeft: 25,
    lineHeight: 32,
  },
  content: {
    flex: 1,
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
    backgroundColor: "#7DC960",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
