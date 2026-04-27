import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  primaryLabel: string;
  onPrimaryPress: () => void;
  primaryDisabled?: boolean;
  primaryLoading?: boolean;
  secondaryLabel?: string;
  onSecondaryPress?: () => void;
};

export default function RegistrationFooter({
  primaryLabel,
  onPrimaryPress,
  primaryDisabled = false,
  primaryLoading = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.footer, primaryDisabled ? styles.footerDisabled : null]}
      onPress={onPrimaryPress}
      disabled={primaryDisabled}
      activeOpacity={0.85}
    >
      <Text style={styles.label}>
        {primaryLoading ? "처리 중..." : primaryLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 72,
    backgroundColor: "#2F7D32",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#2F7D32",
  },
  footerDisabled: {
    backgroundColor: "#A7D4A5",
    borderTopColor: "#A7D4A5",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
