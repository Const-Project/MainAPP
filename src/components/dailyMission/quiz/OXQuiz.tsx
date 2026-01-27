import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { OXOIcon, OXXIcon } from "@/assets/icons/CommonIcons";

interface OXQuizProps {
  quizQuestion: string;
  selected: number | null;
  setSelected: (value: number) => void;
  disabled?: boolean;
  isCorrect?: boolean;
  answerNumber?: number;
}

export default function OXQuiz({
  quizQuestion,
  selected,
  setSelected,
  disabled = false,
  isCorrect,
  answerNumber,
}: OXQuizProps) {
  const getBoxStyle = (value: number) => {
    if (answerNumber !== undefined && isCorrect !== undefined) {
      const answerValue = answerNumber === 0 ? 0 : 1;

      if (isCorrect) {
        if (value === answerValue) {
          return [styles.box, styles.correctBox];
        }
      } else {
        if (selected === value) {
          return [styles.box, styles.wrongBox];
        }
        if (value === answerValue) {
          return [styles.box, styles.correctBox];
        }
      }
    }
    return selected === value
      ? [styles.box, styles.selectedBox]
      : [styles.box, styles.defaultBox];
  };

  const getIconColor = (value: number) => {
    if (answerNumber !== undefined && isCorrect !== undefined) {
      const answerValue = answerNumber === 0 ? 0 : 1;

      if (isCorrect && value === answerValue) {
        return "#7DC960";
      }
      if (!isCorrect) {
        if (selected === value) return "#EF4444";
        if (value === answerValue) return "#7DC960";
      }
    }
    return selected === value ? "#374151" : "#9CA3AF";
  };

  const handleClick = (value: number) => {
    if (disabled) return;
    setSelected(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quizQuestion}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={getBoxStyle(0)}
          onPress={() => handleClick(0)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <OXOIcon size={48} color={getIconColor(0)} />
        </TouchableOpacity>
        <TouchableOpacity
          style={getBoxStyle(1)}
          onPress={() => handleClick(1)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <OXXIcon size={48} color={getIconColor(1)} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    gap: 32,
  },
  question: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 22,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  box: {
    flex: 1,
    aspectRatio: 140 / 123,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
  },
  defaultBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  selectedBox: {
    backgroundColor: "#E5E7EB",
    borderColor: "#4B5563",
  },
  correctBox: {
    backgroundColor: "#DCFCE7",
    borderColor: "#7DC960",
  },
  wrongBox: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
});
