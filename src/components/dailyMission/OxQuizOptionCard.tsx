import { StyleSheet, TouchableOpacity, View } from "react-native";
import OIcon from "@/assets/icons/common/OX_O.svg";
import XIcon from "@/assets/icons/common/OX_X.svg";

type OxOptionState = "idle" | "selected" | "correct" | "wrong" | "answer";

type Props = {
  label: "O" | "X";
  state?: OxOptionState;
  disabled?: boolean;
  onPress: () => void;
};

export default function OxQuizOptionCard({
  label,
  state = "idle",
  disabled = false,
  onPress,
}: Props) {
  const Icon = label === "O" ? OIcon : XIcon;
  const iconColor =
    state === "correct" || state === "answer"
      ? "#6FCF4A"
      : state === "wrong"
        ? "#FF6B6B"
        : state === "selected"
          ? "#4A4A4A"
          : "#BFBFBF";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        state === "selected" ? styles.cardSelected : null,
        state === "correct" || state === "answer" ? styles.cardCorrect : null,
        state === "wrong" ? styles.cardWrong : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon width={40} height={40} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  cardSelected: {
    backgroundColor: "#EFEFEF",
    borderColor: "#BFBFBF",
  },
  cardCorrect: {
    backgroundColor: "#EFF9EA",
    borderColor: "#6FCF4A",
  },
  cardWrong: {
    backgroundColor: "#FFF1F1",
    borderColor: "#FF6B6B",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
