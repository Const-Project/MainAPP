import { useMemo, useState } from "react";
import type { AxiosError } from "axios";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAnswerDailySurvey, useDailySurvey } from "@/hooks/mission/useMissionApi";
import type { ErrorResponse } from "@/types/common/apiResponse.type";
import {
  SURVEY_ANSWER_VALUE_MAP,
  type SurveyAnswerKind,
} from "@/types/missions";

const characterImage = require("@/assets/images/char.webp");

const ANSWER_COPY: Record<SurveyAnswerKind, string> = {
  YES: "좋은 기분으로 오늘 하루 계속 이어가요!",
  NEUTRAL: "제가 푸른 활력을 선물해 드릴게요.",
  NO: "기운을 내볼까요? 제가 곁에 있을게요.",
};

export default function HomeEmotionModal({
  visible,
  onClose,
  onAnswered,
}: {
  visible: boolean;
  onClose: () => void;
  onAnswered: (answer: SurveyAnswerKind) => void;
}) {
  const { data, isLoading } = useDailySurvey();
  const answerMutation = useAnswerDailySurvey();
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(null);

  const answerOptions = useMemo(
    () =>
      [
        { kind: "YES", label: "그럼요" },
        { kind: "NEUTRAL", label: "글쎄요" },
        { kind: "NO", label: "아니요" },
      ] satisfies Array<{ kind: SurveyAnswerKind; label: string }>,
    []
  );

  const handleAnswer = async (answer: SurveyAnswerKind) => {
    if (!data?.id || answerMutation.isPending) {
      return;
    }

    if (data.isAnswered) {
      onAnswered(answer);
      onClose();
      return;
    }

    setSubmitErrorMessage(null);

    try {
      await answerMutation.mutateAsync({
        questionId: data.id,
        answer: SURVEY_ANSWER_VALUE_MAP[answer],
      });

      /*
       * 한글 주석:
       * 홈 팝업은 제출 직후 닫히고 말풍선 상태도 즉시 바뀌어야 한다.
       * 서버 재조회 완료를 기다리지 않고 성공 시점을 홈 화면에 바로 전달한다.
       */
      onAnswered(answer);
      onClose();
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const status = axiosError.response?.status;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 409) {
        onAnswered(answer);
        onClose();
        return;
      }

      setSubmitErrorMessage(serverMessage ?? "답변 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const isAnswered = data?.isAnswered ?? false;

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>마음 건강 체크</Text>
          <View style={styles.bodyBlock}>
            <Image source={characterImage} style={styles.characterImage} resizeMode="contain" />
            <Text style={styles.body}>
              {isLoading
                ? "오늘의 질문을 불러오는 중입니다."
                : isAnswered
                  ? "오늘의 질문에 이미 답변했어요.\n홈에서 완료 상태를 확인해보세요."
                  : (data?.question ?? "오늘 하루는 어떠셨는지 살짝 알려주시겠어요?")}
            </Text>
          </View>

          {isAnswered ? (
            <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
              <Text style={styles.primaryButtonText}>좋아요</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.answerList}>
              {answerOptions.map(option => (
                <TouchableOpacity
                  key={option.kind}
                  style={styles.secondaryButton}
                  onPress={() => void handleAnswer(option.kind)}
                  disabled={answerMutation.isPending}
                >
                  <Text style={styles.secondaryButtonText}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {submitErrorMessage ? (
            <Text style={styles.errorText}>{submitErrorMessage}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

export { ANSWER_COPY };

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },
  bodyBlock: {
    alignItems: "center",
    gap: 12,
  },
  characterImage: {
    width: 82,
    height: 82,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: "#171717",
    textAlign: "center",
  },
  answerList: {
    width: "100%",
    gap: 10,
  },
  primaryButton: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#7DC960",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#EEF3EA",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2E5134",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    width: "100%",
    fontSize: 13,
    lineHeight: 18,
    color: "#B91C1C",
    textAlign: "center",
  },
});

