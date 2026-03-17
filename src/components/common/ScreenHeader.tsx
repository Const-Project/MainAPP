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
      {/* 왼쪽: 닫기(X) 버튼 */}
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

      {/* 중앙: 화면 타이틀 */}
      <Text style={styles.title}>{title}</Text>

      {/* 오른쪽: 완료 텍스트 버튼 */}
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
  closeText: {
    fontSize: 18,
    color: "#171717",
  },
  // 완료 버튼: Regular 16px 검정
  completeText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#171717",
    textAlign: "right",
  },
  disabledText: {
    color: "#BFBFBF",
  },
  // 타이틀: SemiBold 18px
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
});
