import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";

import type { RootStackParamList } from "@/navigation/types";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";
import Pending from "@/components/registration/creationFlow/Pending";

const CreationDefaultImg = require("@/assets/images/creationAvatar/CreationDefultImg.png");

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AvatarCreationOption() {
  const navigation = useNavigation<NavigationProp>();
  const { pickCreationAvatar, pickCreation, activeOption, actions } =
    useAvatarCreationStore();
  const [isPending, setIsPending] = useState(false);

  const handleContainerPress = () => {
    if (!pickCreation) return;
    actions.setPickAvatar({
      description: pickCreationAvatar.description,
      img: pickCreationAvatar.img,
      id: pickCreationAvatar.id,
    });
    actions.setActiveOption("creation");
  };

  const handleButtonPress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      setIsPending(true);

      // Mock: 실제로는 서버에 이미지 업로드 후 생성된 아바타 URL을 받음
      setTimeout(() => {
        actions.setPickCreationAvatar({
          id: null,
          description: "생성된 아바타",
          img: imageUri,
        });

        actions.setPickAvatar({
          id: null,
          description: "생성된 아바타",
          img: imageUri,
        });

        actions.setActiveOption("creation");
        setIsPending(false);
        navigation.navigate("RegistrationCreationDetail");
      }, 2500);
    }
  };

  if (isPending) {
    return <Pending />;
  }

  const isActive = pickCreation && activeOption === "creation";

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isActive && styles.activeContainer,
      ]}
      onPress={pickCreation ? handleContainerPress : undefined}
      activeOpacity={pickCreation ? 0.7 : 1}
    >
      <View style={styles.leftContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>나만의 아바타</Text>
          <Text style={styles.description}>
            내 식물의 생김새를{"\n"}반영한 나만의 아바타를{"\n"}만들 수 있어요
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            pickCreation ? styles.defaultButton : styles.primaryButton,
          ]}
          onPress={handleButtonPress}
        >
          <Text
            style={[
              styles.buttonText,
              pickCreation ? styles.defaultButtonText : styles.primaryButtonText,
            ]}
          >
            {pickCreation ? "다시 만들기" : "만들러 가기"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={
            pickCreationAvatar.img
              ? { uri: pickCreationAvatar.img }
              : CreationDefaultImg
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
    backgroundColor: "#FFFFFF",
  },
  activeContainer: {
    backgroundColor: "#E8F5E3",
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
    height: 168,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
