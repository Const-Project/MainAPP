import type { AnswerQuizResponse } from "@/types/quiz/answerQuiz";
import type { GetQuizRequest, GetQuizResponse } from "@/types/quiz/getQuiz";

import api from "@/apis/instance";

export const getQuizApi = async (
  params: GetQuizRequest
): Promise<GetQuizResponse> => {
  const response = await api.get("/api/v1/realQuiz", { params });
  return response.data;
};

export const postAnswerQuizApi = async ({
  selectedOptionOrder,
  quizId,
}: {
  selectedOptionOrder: number;
  quizId: number;
}): Promise<AnswerQuizResponse> => {
  const response = await api.post<AnswerQuizResponse>(
    `/api/v1/realQuiz/${quizId}/answer`,
    { selectedOptionOrder }
  );
  return response.data;
};
