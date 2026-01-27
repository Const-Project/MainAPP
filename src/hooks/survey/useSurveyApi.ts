import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import type { PostSurveyResponse } from "@/types/apis/survey";
import { getSurveyApi, postSurveyAnswerApi } from "@/apis/survey/surveyApi";

export const useGetSurvey = () => {
  return useMutation<PostSurveyResponse, AxiosError>({
    mutationFn: getSurveyApi,
  });
};

export const usePostSurveyAnswer = () => {
  return useMutation<unknown, AxiosError, { questionId: number; answer: number }>({
    mutationFn: postSurveyAnswerApi,
  });
};
