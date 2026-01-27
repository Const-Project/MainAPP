import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";

import MissionHeader from "@/components/dailyMission/common/MissionHeader";
import OXQuiz from "@/components/dailyMission/quiz/OXQuiz";
import { useGetQuiz } from "@/hooks/mission/useGetQuizApi";
import { useAnswerQuiz } from "@/hooks/mission/usePostAnswerQuiz";

type Props = RootStackScreenProps<"DailyMissionQuizOx">;

export default function OxQuizScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<{
    isCorrect: boolean;
    answerDescription: string;
    answerNumber: number;
  } | null>(null);

  const { data, isLoading, isError } = useGetQuiz({ quizType: "OX" });
  const { mutate: submitAnswer } = useAnswerQuiz();

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <MissionHeader showSubmit={false} context="퀴즈 풀기" />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7DC960" />
          <Text style={styles.loadingText}>퀴즈 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError || !data?.result) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <MissionHeader showSubmit={false} context="퀴즈 풀기" />
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>퀴즈 불러오기 실패</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { quizId, quizQuestion } = data.result;

  const handleSubmit = () => {
    if (!quizId || selected === null) {
      Alert.alert("알림", "답을 선택해주세요!");
      return;
    }

    submitAnswer(
      { quizId, selectedOptionOrder: selected },
      {
        onSuccess: res => {
          const { isCorrect, answerDescription, answerNumber } = res.result;
          setAnswerResult({ isCorrect, answerDescription, answerNumber });
        },
        onError: () => {
          Alert.alert("오류", "정답 제출에 실패했습니다.");
        },
      }
    );
  };

  const handleNext = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MissionHeader showSubmit={false} context="퀴즈 풀기" />

      <View style={styles.content}>
        <Text style={styles.title}>오늘의 퀴즈 !</Text>
        <OXQuiz
          quizQuestion={quizQuestion}
          selected={selected}
          setSelected={setSelected}
          disabled={!!answerResult}
          isCorrect={answerResult?.isCorrect}
          answerNumber={answerResult?.answerNumber}
        />

        {answerResult && (
          <View style={styles.resultContainer}>
            <Text
              style={[
                styles.resultTitle,
                answerResult.isCorrect ? styles.correctText : styles.wrongText,
              ]}
            >
              {answerResult.isCorrect ? "정답!" : "오답!"}
            </Text>
            <Text style={styles.resultDescription}>
              {answerResult.answerDescription}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {answerResult ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>다음</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.button,
              selected !== null ? styles.primaryButton : styles.grayButton,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>정답 확인하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 16,
  },
  resultContainer: {
    marginTop: 26,
    gap: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  resultDescription: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 20,
  },
  correctText: {
    color: "#7DC960",
  },
  wrongText: {
    color: "#EF4444",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#7DC960",
  },
  grayButton: {
    backgroundColor: "#E5E7EB",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
