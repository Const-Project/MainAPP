import { StyleSheet, Text, View } from "react-native";

type Props = {
  correct: boolean;
  description: string;
};

export default function QuizResultCard({ correct, description }: Props) {
  return (
    <View style={[styles.card, correct ? styles.correct : styles.wrong]}>
      <Text style={[styles.title, correct ? styles.correctText : styles.wrongText]}>
        {correct ? "정답!" : "오답!"}
      </Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  correct: {
    backgroundColor: "#EDF7ED",
  },
  wrong: {
    backgroundColor: "#FEF2F2",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  correctText: {
    color: "#1F5C27",
  },
  wrongText: {
    color: "#B91C1C",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
});
