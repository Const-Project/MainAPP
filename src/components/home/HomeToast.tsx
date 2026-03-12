import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HomeToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2200);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <View pointerEvents="none" style={styles.wrap}>
      <View style={styles.toast}>
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 120,
    alignItems: "center",
    zIndex: 90,
  },
  toast: {
    maxWidth: 300,
    borderRadius: 18,
    backgroundColor: "rgba(23, 23, 23, 0.88)",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  message: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
