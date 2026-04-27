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
  const isCorrect = state === "correct" || state === "answer";
  const isWrong = state === "wrong";
  const isSelected = selected && !isCorrect && !isWrong;
  const BadgeIcon = isCorrect || isSelected ? CheckIcon : Check2Icon;
  const badgeText = isCorrect ? "정답!" : isWrong ? "오답!" : null;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        isSelected ? styles.cardSelected : null,
        isCorrect ? styles.cardCorrect : null,
        isWrong ? styles.cardWrong : null,
      ]}
      disabled={disabled}
      activeOpacity={0.86}
      onPress={onPress}
    >
      <Text style={styles.text}>{label}</Text>
      <View style={styles.badgeWrap}>
        {badgeText ? (
          <Text style={[styles.badgeText, isCorrect ? styles.badgeTextCorrect : styles.badgeTextWrong]}>
            {badgeText}
          </Text>
        ) : (
          <BadgeIcon width={32} height={32} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    paddingLeft: 24,
    paddingRight: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  cardSelected: {
    backgroundColor: "#EFEFEF",
    borderColor: "#BFBFBF",
  },
  cardCorrect: {
    backgroundColor: "#EEF9EA",
    borderColor: "#72D14E",
  },
  cardWrong: {
    backgroundColor: "#FFEFEF",
    borderColor: "#F76868",
  },
  text: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: "#282828",
    fontWeight: "400",
  },
  badgeWrap: {
    minWidth: 60,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
  },
  badgeTextCorrect: {
    color: "#3AB40B",
  },
  badgeTextWrong: {
    color: "#F76868",
  },
});
