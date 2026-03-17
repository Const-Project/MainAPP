import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title: string;
  onBack?: () => void;
  rightActionLabel?: string;
  onRightAction?: () => void;
  rightActionDisabled?: boolean;
};

export default function ScreenHeader({
  title,
  onBack,
  rightActionLabel,
  onRightAction,
  rightActionDisabled = false,
}: Props) {
  const resolvedRightAction = onRightAction ?? onBack;
  const resolvedRightLabel = rightActionLabel ?? "완료";

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
      {resolvedRightAction ? (
        <TouchableOpacity
          onPress={resolvedRightAction}
          disabled={rightActionDisabled}
          activeOpacity={0.7}
          style={styles.sideButton}
        >
          <Text style={[styles.completeText, rightActionDisabled && styles.disabledText]}>
            {resolvedRightLabel}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}
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
  disabledText: {
    color: "#9CA3AF",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#171717",
  },
});
