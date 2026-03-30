import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import OxQuizOptionCard from "@/components/dailyMission/OxQuizOptionCard";
import { useAnswerQuiz, useMissionQuiz } from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";
import type { AnswerQuizResult } from "@/types/missions";

type Props = RootStackScreenProps<"DailyMissionQuizOx">;

export default function DailyMissionQuizOxScreen({ navigation }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading, isError, refetch } = useMissionQuiz({
    quizType: "OX",
  });
  const submitAnswer = useAnswerQuiz();

  const options = useMemo(
    () =>
      data?.quizOptions?.length
        ? data.quizOptions
        : [
            { optionOrder: 0, optionText: "O" },
            { optionOrder: 1, optionText: "X" },
          ],
    [data?.quizOptions]
  );

  useEffect(() => {
    if (data?.selectedOptionNumber != null) {
      setSelected(data.selectedOptionNumber);
    }
  }, [data?.selectedOptionNumber]);

  const persistedAnswerResult = useMemo<AnswerQuizResult | null>(() => {
    if (
      !data?.isCompleted ||
      data.selectedOptionNumber == null ||
      data.answerNumber == null ||
      data.isCorrect == null ||
      data.answerDescription == null
    ) {
      return null;
    }

    return {
      isCorrect: data.isCorrect,
      answerDescription: data.answerDescription,
      answerNumber: data.answerNumber,
      isCompleted: true,
      selectedOptionNumber: data.selectedOptionNumber,
      quizQuestion: data.quizQuestion,
      quizType: data.quizType,
    };
  }, [data]);

  const answerResult = submitAnswer.data?.result ?? persistedAnswerResult;

  const handleSubmit = async () => {
    if (!data?.quizId || selected === null || submitAnswer.isPending || answerResult) {
      return;
    }

    await submitAnswer.mutateAsync({
      quizId: data.quizId,
      selectedOptionOrder: selected,
    });
  };

  const goNext = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="퀴즈 풀기" onBack={() => navigation.goBack()} />
        <StatusView title="퀴즈를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="퀴즈 풀기" onBack={() => navigation.goBack()} />
        <StatusView
          title="퀴즈를 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="퀴즈 풀기" onBack={() => navigation.goBack()} />
        <StatusView title="표시할 퀴즈가 없습니다." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="퀴즈 풀기" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>오늘의 퀴즈!</Text>
          <Text style={styles.question}>{data.quizQuestion}</Text>
        </View>

        <View style={styles.optionsRow}>
          {options.map(option => {
            const isCorrectAnswer = option.optionOrder === answerResult?.answerNumber;
            const isWrongSelected =
              option.optionOrder === answerResult?.selectedOptionNumber &&
              answerResult != null &&
              !answerResult.isCorrect;

            const state = answerResult
              ? isWrongSelected
                ? "wrong"
                : isCorrectAnswer
                  ? "correct"
                  : "idle"
              : selected === option.optionOrder
                ? "selected"
                : "idle";

            return (
              <OxQuizOptionCard
                key={option.optionOrder}
                label={option.optionText === "X" ? "X" : "O"}
                state={state}
                disabled={Boolean(answerResult)}
                onPress={() => setSelected(option.optionOrder)}
              />
            );
          })}
        </View>

        {answerResult ? (
          <View style={styles.resultBlock}>
            <Text
              style={[
                styles.resultTitle,
                answerResult.isCorrect ? styles.resultTitleCorrect : styles.resultTitleWrong,
              ]}
            >
              {answerResult.isCorrect ? "정답!" : "오답!"}
            </Text>
            <Text
              style={[
                styles.resultDescription,
                answerResult.isCorrect ? styles.resultDescriptionCorrect : styles.resultDescriptionWrong,
              ]}
            >
              {answerResult.answerDescription}
            </Text>
          </View>
        ) : null}

        {submitAnswer.isError ? (
          <View style={styles.errorBlock}>
            <Text style={styles.errorTitle}>정답 제출에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>잠시 후 다시 시도해주세요.</Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!answerResult && (selected === null || submitAnswer.isPending)}
          onPress={answerResult ? goNext : () => void handleSubmit()}
          style={[
            styles.primaryButton,
            !answerResult && (selected === null || submitAnswer.isPending) ? styles.primaryButtonDisabled : null,
            answerResult ? styles.primaryButtonResult : null,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              !answerResult && (selected === null || submitAnswer.isPending) ? styles.primaryButtonTextDisabled : null,
              answerResult ? styles.primaryButtonTextResult : null,
            ]}
          >
            {answerResult ? "다음" : submitAnswer.isPending ? "확인 중..." : "정답 확인하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 24,
  },
  headerBlock: {
    gap: 8,
    marginBottom: 52,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
  },
  question: {
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
    color: "#171717",
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  resultBlock: {
    gap: 8,
  },
  resultTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
  },
  resultTitleCorrect: {
    color: "#3AB40B",
  },
  resultTitleWrong: {
    color: "#F76868",
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  resultDescriptionCorrect: {
    color: "#3AB40B",
  },
  resultDescriptionWrong: {
    color: "#F76868",
  },
  errorBlock: {
    marginTop: 20,
    gap: 6,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#7F1D1D",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: "#72D14E",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  primaryButtonResult: {
    backgroundColor: "#EEF9EA",
  },
  primaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  primaryButtonTextDisabled: {
    color: "#BFBFBF",
  },
  primaryButtonTextResult: {
    color: "#3AB40B",
  },
});
