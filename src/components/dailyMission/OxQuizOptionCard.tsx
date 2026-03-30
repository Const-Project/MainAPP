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
  const isCorrect = state === "correct" || state === "answer";
  const isWrong = state === "wrong";
  const isSelected = state === "selected";
  const iconColor = isCorrect ? "#3AB40B" : isWrong ? "#F76868" : isSelected ? "#171717" : "#BFBFBF";

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        isSelected ? styles.cardSelected : null,
        isCorrect ? styles.cardCorrect : null,
        isWrong ? styles.cardWrong : null,
      ]}
    >
      <View style={styles.iconWrap}>
        <Icon width={52} height={52} color={iconColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    height: 160,
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
    backgroundColor: "#EEF9EA",
    borderColor: "#72D14E",
  },
  cardWrong: {
    backgroundColor: "#FFEFEF",
    borderColor: "#F76868",
  },
  iconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
});
