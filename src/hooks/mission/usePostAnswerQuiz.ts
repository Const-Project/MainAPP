import { useMutation } from "@tanstack/react-query";

import type { AnswerQuizResponse } from "@/types/quiz/answerQuiz";

import { postAnswerQuizApi } from "@/apis/missions/quizApi";

interface AnswerQuizParams {
  quizId: number;
  selectedOptionOrder: number;
}

export const useAnswerQuiz = () => {
  return useMutation<AnswerQuizResponse, Error, AnswerQuizParams>({
    mutationFn: ({ quizId, selectedOptionOrder }) =>
      postAnswerQuizApi({ quizId, selectedOptionOrder }),
  });
};
