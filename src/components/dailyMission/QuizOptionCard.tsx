import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CheckIcon from "@/assets/icons/Check.svg";
import Check2Icon from "@/assets/icons/Check2.svg";

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
  const BadgeIcon =
    state === "correct" || state === "answer" || selected ? CheckIcon : Check2Icon;
  const badgeText =
    state === "correct" || state === "answer"
      ? "\uC815\uB2F5"
      : state === "wrong"
        ? "\uC624\uB2F5"
        : selected
          ? "\uC120\uD0DD\uB428"
          : null;

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
      <View style={styles.badgeWrap}>
        <BadgeIcon width={20} height={20} />
        {badgeText ? (
          <Text
            style={[
              styles.badgeText,
              state === "correct" || state === "answer" ? styles.badgeTextCorrect : null,
              state === "wrong" ? styles.badgeTextWrong : null,
            ]}
          >
            {badgeText}
          </Text>
        ) : null}
      </View>
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
  badgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 54,
    justifyContent: "flex-end",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B5563",
  },
  badgeTextCorrect: {
    color: "#2F7D32",
  },
  badgeTextWrong: {
    color: "#DC2626",
  },
});
