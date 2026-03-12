import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SurveyAnswerKind } from "@/types/missions";

const EMOTION_SURVEY_COOLDOWN_MS = 24 * 60 * 60 * 1000;

type EmotionSurveyState = {
  lastAnsweredAt: number | null;
  lastAnswerKind: SurveyAnswerKind | null;
  markAnswered: (answerKind: SurveyAnswerKind, answeredAt?: number) => void;
  resetIfExpired: () => void;
  reset: () => void;
};

export const useEmotionSurveyStore = create<EmotionSurveyState>()(
  persist(
    set => ({
      lastAnsweredAt: null,
      lastAnswerKind: null,

      markAnswered: (answerKind, answeredAt = Date.now()) =>
        set(() => ({
          lastAnsweredAt: answeredAt,
          lastAnswerKind: answerKind,
        })),

      resetIfExpired: () =>
        set(state => {
          if (!state.lastAnsweredAt) {
            return state;
          }

          /*
           * 한글 주석:
           * 홈 말풍선 노출 여부는 마지막 응답 시각 기준 24시간으로 계산한다.
           * 유효 시간이 지나면 로컬 완료 상태를 비워 다음 질문 노출을 허용한다.
           */
          if (Date.now() - state.lastAnsweredAt >= EMOTION_SURVEY_COOLDOWN_MS) {
            return {
              lastAnsweredAt: null,
              lastAnswerKind: null,
            };
          }

          return state;
        }),

      reset: () =>
        set(() => ({
          lastAnsweredAt: null,
          lastAnswerKind: null,
        })),
    }),
    {
      name: "emotion-survey",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        lastAnsweredAt: state.lastAnsweredAt,
        lastAnswerKind: state.lastAnswerKind,
      }),
    }
  )
);

export const getEmotionSurveyCooldownActive = (lastAnsweredAt: number | null) => {
  if (!lastAnsweredAt) {
    return false;
  }

  return Date.now() - lastAnsweredAt < EMOTION_SURVEY_COOLDOWN_MS;
};
