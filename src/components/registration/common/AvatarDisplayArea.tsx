import React from "react";
import { View, Image, StyleSheet } from "react-native";

import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

export default function AvatarDisplayArea() {
  const { pickAvatar } = useAvatarCreationStore();

  return (
    <View style={styles.container}>
      {pickAvatar.img && (
        <Image
          source={{ uri: pickAvatar.img }}
          style={styles.image}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 258,
    height: 292,
    backgroundColor: "#E8F5E3",
    borderWidth: 2,
    borderColor: "#7DC960",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
