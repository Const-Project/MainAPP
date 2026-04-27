import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LeftIcon from "@/assets/icons/common/left.svg";

const refreshIcon = require("../../../assets/refresh-icon.png");

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
  const resolvedRightLabel = rightActionLabel ?? "완료";
  const isRefreshAction = resolvedRightLabel === "새로고침";

  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.sideButton}>
          <LeftIcon width={24} height={24} />
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}

      <Text style={styles.title}>{title}</Text>

      {onRightAction ? (
        <TouchableOpacity
          onPress={onRightAction}
          disabled={rightActionDisabled}
          activeOpacity={0.7}
          style={styles.sideButton}
          accessibilityRole="button"
          accessibilityLabel={resolvedRightLabel}
        >
          {isRefreshAction ? (
            <Image
              source={refreshIcon}
              style={[styles.refreshIcon, rightActionDisabled && styles.refreshIconDisabled]}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.completeText, rightActionDisabled && styles.disabledText]}>
              {resolvedRightLabel}
            </Text>
          )}
        </TouchableOpacity>
      ) : (
        <View style={styles.sideButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  sideButton: {
    width: 48,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  refreshIcon: {
    width: 22,
    height: 22,
  },
  refreshIconDisabled: {
    opacity: 0.4,
  },
  completeText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#171717",
    textAlign: "right",
  },
  disabledText: {
    color: "#BFBFBF",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
});
