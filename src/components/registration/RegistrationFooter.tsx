import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
  primaryLoading?: boolean;
};

export default function RegistrationFooter({
  primaryLabel,
  onPrimaryPress,
  primaryDisabled = false,
  secondaryLabel,
  onSecondaryPress,
  primaryLoading = false,
}: Props) {
  return (
    <View style={styles.container}>
      {secondaryLabel && onSecondaryPress ? (
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onSecondaryPress}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      ) : null}
      <TouchableOpacity
        style={[
          styles.primaryButton,
          primaryDisabled ? styles.primaryButtonDisabled : null,
        ]}
        onPress={onPrimaryPress}
        disabled={primaryDisabled}
        activeOpacity={0.85}
      >
        <Text style={styles.primaryText}>
          {primaryLoading ? "처리 중..." : primaryLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E5E7EB",
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F7D32",
  },
  primaryButtonDisabled: {
    backgroundColor: "#A7D4A5",
  },
  primaryText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
