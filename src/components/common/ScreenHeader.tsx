import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onBack?: () => void;
};

export default function ScreenHeader({ title, onBack }: Props) {
  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity
          onPress={onBack}
          activeOpacity={0.7}
          style={styles.sideButton}
        >
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.sideButton}
      >
        <Text style={styles.completeText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  sideButton: {
    width: 48,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  closeText: {
    fontSize: 18,
    color: "#374151",
  },
  completeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#171717",
  },
});