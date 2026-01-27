import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface LockViewProps {
  isUnlockable: boolean;
  onUnlock: () => void;
}

export default function LockView({ isUnlockable, onUnlock }: LockViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.backdrop} />
      <View style={styles.content}>
        <Text style={styles.icon}>{isUnlockable ? "🔓" : "🔒"}</Text>
        <Text style={styles.title}>
          {isUnlockable ? "지금 열 수 있어요!" : "아직 잠겨 있어요"}
        </Text>
        <Text style={styles.description}>
          {isUnlockable
            ? "씨앗을 받고 새로운 식물을 키워보세요"
            : "소망 나무가 자라면 새로운 텃밭을 열 수 있어요"}
        </Text>
        <TouchableOpacity
          style={[
            styles.button,
            isUnlockable ? styles.primaryButton : styles.grayButton,
          ]}
          onPress={onUnlock}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {isUnlockable ? "씨앗 받고 해금하기!" : "충분하지 않아요"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  content: {
    alignItems: "center",
    gap: 12,
    zIndex: 1,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  button: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: "#7DC960",
  },
  grayButton: {
    backgroundColor: "#9CA3AF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
