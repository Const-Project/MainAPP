import React from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";

const PendingImage = require("@/assets/images/creationAvatar/PendingImage.svg");

export default function Pending() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#7DC960" />
        <Text style={styles.text}>
          아바타를 만들고 있어요{"\n"}잠시만 기다려주세요...
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  text: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
