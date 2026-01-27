import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

const SelectionDefaultImg = require("@/assets/images/creationAvatar/SelectionDefultImg.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AvatarSelectionOption() {
  const navigation = useNavigation<NavigationProp>();
  const { pickSelectionAvatar, pickSelection, activeOption, actions } =
    useAvatarCreationStore();

  const handleContainerPress = () => {
    if (!pickSelection) return;
    actions.setPickAvatar({
      description: pickSelectionAvatar.description,
      img: pickSelectionAvatar.img,
      id: pickSelectionAvatar.id,
    });
    actions.setActiveOption("selection");
  };

  const handleButtonPress = () => {
    navigation.navigate("RegistrationSelectionDetail");
  };

  const isActive = pickSelection && activeOption === "selection";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={pickSelection ? handleContainerPress : undefined}
      activeOpacity={pickSelection ? 0.7 : 1}
    >
      <View style={styles.leftContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>아바타 선택</Text>
          <Text style={styles.description}>
            10종의 아바타 중에서{"\n"}선택할 수 있어요
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            pickSelection ? styles.defaultButton : styles.primaryButton,
          ]}
          onPress={handleButtonPress}
        >
          <Text
            style={[
              styles.buttonText,
              pickSelection ? styles.defaultButtonText : styles.primaryButtonText,
            ]}
          >
            {pickSelection ? "다시 선택하기" : "선택하러 가기"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={
            pickSelectionAvatar.img
              ? { uri: pickSelectionAvatar.img }
              : SelectionDefaultImg
          }
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 32,
    paddingLeft: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  activeContainer: {
    backgroundColor: "#E8F5E3",
    borderBottomWidth: 0,
  },
  leftContent: {
    flex: 1,
    justifyContent: "space-between",
    height: "100%",
  },
  textContainer: {
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 20,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  primaryButton: {
    backgroundColor: "#7DC960",
  },
  defaultButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButtonText: {
    color: "#FFFFFF",
  },
  defaultButtonText: {
    color: "#171717",
  },
  imageContainer: {
    flex: 1,
    height: 228,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
