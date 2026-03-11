import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import QuizOptionCard from "@/components/dailyMission/QuizOptionCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import {
  useAnswerDailySurvey,
  useDailySurvey,
} from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";
import type { ErrorResponse } from "@/types/common/apiResponse.type";
import {
  SURVEY_ANSWER_VALUE_MAP,
  type SurveyAnswerKind,
} from "@/types/missions";

type Props = RootStackScreenProps<"DailyMissionChecking">;

type SurveyOption = {
  kind: SurveyAnswerKind;
  label: string;
  description: string;
};

const SURVEY_OPTIONS: SurveyOption[] = [
  { kind: "YES", label: "네", description: "YES" },
  { kind: "NEUTRAL", label: "그저 그래요", description: "NEUTRAL" },
  { kind: "NO", label: "아니요", description: "NO" },
];

export default function DailyMissionCheckingScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<SurveyAnswerKind | null>(null);
  const [answeredLocally, setAnsweredLocally] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);
  const { data, isLoading, isError, refetch } = useDailySurvey();
  const answerSurvey = useAnswerDailySurvey();

  const goHome = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });

  const handleSubmit = async () => {
    if (!data?.id || !selected || answerSurvey.isPending || data.isAnswered || answeredLocally) {
      return;
    }

    setSubmitErrorMessage(null);

    try {
      await answerSurvey.mutateAsync({
        questionId: data.id,
        answer: SURVEY_ANSWER_VALUE_MAP[selected],
      });

      await queryClient.refetchQueries({ queryKey: ["daily-survey"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
      setAnsweredLocally(true);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 409) {
        setAnsweredLocally(true);
        setSubmitErrorMessage("이미 오늘의 질문에 답변했습니다. 홈으로 돌아가 완료 상태를 확인해주세요.");
        await queryClient.refetchQueries({ queryKey: ["daily-survey"], type: "all" });
        await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
        return;
      }

      setSubmitErrorMessage(serverMessage ?? "답변 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="오늘의 질문" onBack={() => navigation.goBack()} />
        <StatusView title="오늘의 질문을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="오늘의 질문" onBack={() => navigation.goBack()} />
        <StatusView
          title="오늘의 질문을 불러오지 못했습니다."
          description="`GET /api/v1/survey` 호출을 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="오늘의 질문" onBack={() => navigation.goBack()} />
        <StatusView title="표시할 오늘의 질문이 없습니다." />
      </SafeAreaView>
    );
  }

  const isAnswered = data.isAnswered || answeredLocally || answerSurvey.isSuccess;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="오늘의 질문" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.eyebrow}>오늘의 체크인</Text>
          <Text style={styles.question}>{data.question}</Text>
          <Text style={styles.subtitle}>
            하루에 한 번만 답할 수 있고, 답변 완료 시 홈 미션 상태가 갱신됩니다.
          </Text>
        </View>

        <View style={styles.options}>
          {SURVEY_OPTIONS.map(option => (
            <View key={option.kind} style={styles.optionBlock}>
              <QuizOptionCard
                label={option.label}
                selected={selected === option.kind}
                disabled={isAnswered || answerSurvey.isPending}
                state="idle"
                onPress={() => setSelected(option.kind)}
              />
              <Text style={styles.optionDescription}>{option.description}</Text>
            </View>
          ))}
        </View>

        {isAnswered ? (
          <View style={styles.successCard}>
            <Text style={styles.successTitle}>오늘의 질문에 이미 답변했습니다.</Text>
            <Text style={styles.successDescription}>
              중복 저장은 막혀 있으며, 홈으로 돌아가면 완료 상태를 볼 수 있습니다.
            </Text>
          </View>
        ) : null}

        {submitErrorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>답변 저장 안내</Text>
            <Text style={styles.errorDescription}>{submitErrorMessage}</Text>
          </View>
        ) : null}
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="홈으로"
        onSecondaryPress={goHome}
        primaryLabel={isAnswered ? "완료" : "답변 제출"}
        onPrimaryPress={isAnswered ? goHome : () => void handleSubmit()}
        primaryDisabled={(!selected && !isAnswered) || answerSurvey.isPending}
        primaryLoading={answerSurvey.isPending}
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
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  options: {
    gap: 12,
  },
  optionBlock: {
    gap: 6,
  },
  optionDescription: {
    fontSize: 12,
    color: "#6B7280",
    paddingHorizontal: 4,
  },
  successCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#EDF7ED",
    gap: 6,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F5C27",
  },
  successDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#2F5D3B",
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
