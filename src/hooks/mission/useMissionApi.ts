import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  answerDailySurveyApi,
  answerQuizApi,
  getDailySurveyApi,
  getQuizApi,
  uploadDiaryImageApi,
  writeDiaryApi,
} from "@/apis/missions/missionApi";
import type {
  AnswerDailySurveyRequest,
  AnswerDailySurveyResponse,
  AnswerQuizRequest,
  AnswerQuizResponse,
  DailySurvey,
  DiaryImageUploadResponse,
  GetDailySurveyResponse,
  GetQuizRequest,
  GetQuizResponse,
  MissionQuiz,
  WriteDiaryRequest,
  WriteDiaryResponse,
} from "@/types/missions";

export const useWriteDiaryImageUpload = () =>
  useMutation<DiaryImageUploadResponse, Error, FormData>({
    mutationFn: formData => uploadDiaryImageApi(formData),
  });

export const useWriteDiarySubmit = () =>
  useMutation<WriteDiaryResponse, Error, WriteDiaryRequest>({
    mutationFn: payload => writeDiaryApi(payload),
  });

export const useMissionQuiz = (params: GetQuizRequest) =>
  useQuery<GetQuizResponse, Error, MissionQuiz>({
    queryKey: ["mission-quiz", params.quizType],
    queryFn: () => getQuizApi(params),
    select: data => data.result,
  });

export const useAnswerQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<AnswerQuizResponse, Error, AnswerQuizRequest>({
    mutationFn: payload => answerQuizApi(payload),
    onSuccess: async () => {
      /*
       * 한글 주석:
       * 퀴즈 완료 직후 홈 미션 패널과 홈 요약을 함께 갱신해야
       * 사용자가 홈으로 돌아왔을 때 완료 상태가 즉시 반영된다.
       */
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["home-panel"] });
      await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-panel"], type: "all" });
    },
  });
};

export const useDailySurvey = () =>
  useQuery<GetDailySurveyResponse, Error, DailySurvey>({
    queryKey: ["daily-survey"],
    queryFn: getDailySurveyApi,
    select: data => data.result,
  });

export const useAnswerDailySurvey = () => {
  const queryClient = useQueryClient();

  return useMutation<AnswerDailySurveyResponse, Error, AnswerDailySurveyRequest>({
    mutationFn: payload => answerDailySurveyApi(payload),
    onSuccess: async () => {
      /*
       * 한글 주석:
       * 마음 건강 체크는 홈 캐릭터 상태와 미션 패널 양쪽에서 사용하므로
       * 설문 결과와 홈 데이터를 모두 같은 시점에 다시 받아온다.
       */
      await queryClient.invalidateQueries({ queryKey: ["daily-survey"] });
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["home-panel"] });
      await queryClient.refetchQueries({ queryKey: ["daily-survey"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-panel"], type: "all" });
    },
  });
};

