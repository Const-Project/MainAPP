import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import { useGetSurvey, usePostSurveyAnswer } from "@/hooks/survey/useSurveyApi";
import type { PostSurveyResponse } from "@/types/apis/survey";

const CharacterImg = require("@/assets/images/character.png");

interface HomeModalProps {
  onClose: () => void;
  setIsChecked: (value: number) => void;
  isAnswered: boolean;
  setIsAnswered: (value: boolean) => void;
}

export default function HomeModal({
  onClose,
  setIsChecked,
  isAnswered,
  setIsAnswered,
}: HomeModalProps) {
  const { mutateAsync: fetchSurvey, isPending } = useGetSurvey();
  const { mutate: postAnswer } = usePostSurveyAnswer();
  const [survey, setSurvey] = useState<PostSurveyResponse | null>(null);

  useEffect(() => {
    const loadSurvey = async () => {
      try {
        const result = await fetchSurvey();
        setSurvey(result);
        setIsAnswered(result.answered);
      } catch {
        // 에러 무시
      }
    };
    loadSurvey();
  }, []);

  const handleCheck = (answer: number) => {
    if (survey) {
      postAnswer({ questionId: survey.id, answer });
    }
    setIsChecked(answer);
    onClose();
  };

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>마음 건강 체크</Text>

          <Image source={CharacterImg} style={styles.character} resizeMode="contain" />

          {!isAnswered && (
            <>
              {isPending ? (
                <ActivityIndicator size="small" color="#7DC960" />
              ) : (
                <Text style={styles.question}>{survey?.question}</Text>
              )}
              <View style={styles.buttonGroup}>
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={() => handleCheck(1)}
                >
                  <Text style={styles.answerText}>그럼요</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={() => handleCheck(2)}
                >
                  <Text style={styles.answerText}>글쎄요</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.answerButton}
                  onPress={() => handleCheck(3)}
                >
                  <Text style={styles.answerText}>아니요</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {isAnswered && (
            <>
              <Text style={styles.question}>
                좋은 기분으로 오늘 하루 계속 이어가요!
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                <Text style={styles.primaryButtonText}>좋아요</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  character: {
    width: 80,
    height: 80,
  },
  question: {
    fontSize: 14,
    color: "#171717",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonGroup: {
    width: "100%",
    gap: 8,
  },
  answerButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  answerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#7DC960",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
