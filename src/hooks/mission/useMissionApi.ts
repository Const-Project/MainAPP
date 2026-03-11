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

export const useAnswerQuiz = () =>
  useMutation<AnswerQuizResponse, Error, AnswerQuizRequest>({
    mutationFn: payload => answerQuizApi(payload),
  });

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
      await queryClient.invalidateQueries({ queryKey: ["daily-survey"] });
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.refetchQueries({ queryKey: ["daily-survey"], type: "all" });
      await queryClient.refetchQueries({ queryKey: ["home-summary"], type: "all" });
    },
  });
};
