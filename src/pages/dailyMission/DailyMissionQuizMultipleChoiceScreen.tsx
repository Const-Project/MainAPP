import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import QuizOptionCard from "@/components/dailyMission/QuizOptionCard";
import QuizResultCard from "@/components/dailyMission/QuizResultCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import { useAnswerQuiz, useMissionQuiz } from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";
import type { AnswerQuizResult } from "@/types/missions";

type Props = RootStackScreenProps<"DailyMissionQuizMultipleChoice">;

export default function DailyMissionQuizMultipleChoiceScreen({
  navigation,
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const { data, isLoading, isError, refetch } = useMissionQuiz({
    quizType: "MULTI_CHOICE",
  });
  const submitAnswer = useAnswerQuiz();

  useEffect(() => {
    if (data?.selectedOptionNumber != null) {
      setSelected(data.selectedOptionNumber);
    }
  }, [data?.selectedOptionNumber]);

  /*
   * 한글 주석:
   * 이미 푼 퀴즈에 다시 진입했을 때도 선택한 선지와 해설을 복원해야 하므로
   * 조회 응답에 포함된 완료 상태를 제출 응답과 같은 형태로 맞춰서 사용한다.
   */
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

  const goHome = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="객관식 퀴즈" onBack={() => navigation.goBack()} />
        <StatusView title="퀴즈를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="객관식 퀴즈" onBack={() => navigation.goBack()} />
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
        <ScreenHeader title="객관식 퀴즈" onBack={() => navigation.goBack()} />
        <StatusView title="표시할 퀴즈가 없습니다." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="객관식 퀴즈" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>오늘의 퀴즈</Text>
          <Text style={styles.question}>{data.quizQuestion}</Text>
        </View>

        <View style={styles.options}>
          {data.quizOptions?.map(option => {
            const state =
              answerResult != null
                ? answerResult.isCorrect
                  ? option.optionOrder === answerResult.answerNumber
                    ? "correct"
                    : "idle"
                  : option.optionOrder === answerResult.selectedOptionNumber
                    ? "wrong"
                    : option.optionOrder === answerResult.answerNumber
                      ? "answer"
                      : "idle"
                : "idle";

            return (
              <QuizOptionCard
                key={option.optionOrder}
                label={option.optionText}
                selected={selected === option.optionOrder}
                disabled={!!answerResult}
                state={state}
                onPress={() => setSelected(option.optionOrder)}
              />
            );
          })}
        </View>

        {answerResult ? (
          <QuizResultCard
            correct={answerResult.isCorrect}
            description={answerResult.answerDescription}
          />
        ) : null}

        {submitAnswer.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>정답 제출에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>
              `POST /api/v1/realQuiz/{'{quizId}'}/answer` 응답을 다시 확인해야 합니다.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="홈으로"
        onSecondaryPress={goHome}
        primaryLabel={answerResult ? "홈으로" : "정답 확인하기"}
        onPrimaryPress={answerResult ? goHome : () => void handleSubmit()}
        primaryDisabled={answerResult ? false : selected === null || submitAnswer.isPending}
        primaryLoading={submitAnswer.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  headerBlock: {
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    color: "#2F7D32",
    fontWeight: "700",
  },
  question: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#171717",
  },
  options: {
    gap: 12,
  },
  errorCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FEF2F2",
    gap: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7F1D1D",
  },
});

