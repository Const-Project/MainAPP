import React from "react";
import { View, Image, StyleSheet } from "react-native";

import { useAvatarCreationStore } from "@/stores/avatarCreationStore";

export default function CreationDetail() {
  const { pickCreationAvatar } = useAvatarCreationStore();

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        {pickCreationAvatar.img && (
          <Image
            source={{ uri: pickCreationAvatar.img }}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 54,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  avatarContainer: {
    width: 258,
    height: 292,
    backgroundColor: "#E8F5E3",
    borderWidth: 2,
    borderColor: "#7DC960",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
});
