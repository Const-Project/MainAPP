import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  state?: "correct" | "wrong" | "answer" | "idle";
  onPress: () => void;
};

export default function QuizOptionCard({
  label,
  selected,
  disabled = false,
  state = "idle",
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected ? styles.cardSelected : null,
        state === "correct" || state === "answer" ? styles.cardCorrect : null,
        state === "wrong" ? styles.cardWrong : null,
      ]}
      disabled={disabled}
      activeOpacity={0.86}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.badge}>
        {state === "correct" || state === "answer"
          ? "정답"
          : state === "wrong"
            ? "오답"
            : selected
              ? "선택됨"
              : ""}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardSelected: {
    backgroundColor: "#F3F4F6",
    borderColor: "#9CA3AF",
  },
  cardCorrect: {
    backgroundColor: "#EDF7ED",
    borderColor: "#2F7D32",
  },
  cardWrong: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  text: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#171717",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
});
