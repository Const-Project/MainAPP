import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { CheckIcon, UnCheckIcon } from "@/assets/icons/CommonIcons";
import type { QuizOption } from "@/types/quiz/getQuiz";

interface MultipleChoiceQuizProps {
  quizQuestion: string;
  quizOptions: QuizOption[] | null;
  selected: number | null;
  setSelected: (value: number) => void;
  disabled?: boolean;
  isCorrect?: boolean;
  answerNumber?: number;
  answerDescription?: string;
}

export default function MultipleChoiceQuiz({
  quizQuestion,
  quizOptions,
  selected,
  setSelected,
  disabled,
  isCorrect,
  answerNumber,
  answerDescription,
}: MultipleChoiceQuizProps) {
  const getOptionStyle = (index: number) => {
    if (disabled && answerNumber !== undefined && isCorrect !== undefined) {
      if (isCorrect) {
        if (index === answerNumber)
          return [styles.option, styles.correctOption];
      } else {
        if (selected === index) return [styles.option, styles.wrongOption];
        if (index === answerNumber)
          return [styles.option, styles.correctOption];
      }
    }
    return selected === index
      ? [styles.option, styles.selectedOption]
      : [styles.option, styles.defaultOption];
  };

  const getOptionLabel = (index: number) => {
    if (disabled && answerNumber !== undefined && isCorrect !== undefined) {
      if (isCorrect && index === answerNumber) return "정답!";
      if (!isCorrect) {
        if (selected === index) return "오답!";
        if (index === answerNumber) return "정답!";
      }
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{quizQuestion}</Text>
      <View style={styles.optionsContainer}>
        {quizOptions?.map((option, index) => {
          const label = getOptionLabel(index);
          const showExplanation = label === "정답!" && answerDescription;

          return (
            <View key={index} style={styles.optionWrapper}>
              <TouchableOpacity
                style={getOptionStyle(index)}
                onPress={() => !disabled && setSelected(index)}
                activeOpacity={0.7}
                disabled={disabled}
              >
                <Text style={styles.optionText}>{option.optionText}</Text>
                {!label ? (
                  selected === index ? (
                    <CheckIcon size={24} />
                  ) : (
                    <UnCheckIcon size={24} />
                  )
                ) : (
                  <Text
                    style={[
                      styles.labelText,
                      label === "정답!" ? styles.correctText : styles.wrongText,
                    ]}
                  >
                    {label}
                  </Text>
                )}
              </TouchableOpacity>
              {showExplanation && (
                <Text style={styles.explanationText}>{answerDescription}</Text>
              )}
            </View>
          );
        })}
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
    gap: 8,
  },
  optionWrapper: {
    gap: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  defaultOption: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },
  selectedOption: {
    backgroundColor: "#E5E7EB",
    borderColor: "#9CA3AF",
  },
  correctOption: {
    backgroundColor: "#DCFCE7",
    borderColor: "#7DC960",
  },
  wrongOption: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: "#171717",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "600",
  },
  correctText: {
    color: "#7DC960",
  },
  wrongText: {
    color: "#EF4444",
  },
  explanationText: {
    fontSize: 14,
    color: "#7DC960",
    paddingLeft: 4,
  },
});
