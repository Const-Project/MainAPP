import { useQuery } from "@tanstack/react-query";

import type { GetQuizRequest, GetQuizResponse } from "@/types/quiz/getQuiz";

import { getQuizApi } from "@/apis/missions/quizApi";

export const useGetQuiz = (params: GetQuizRequest) => {
  return useQuery<GetQuizResponse>({
    queryKey: ["quiz", params],
    queryFn: () => getQuizApi(params),
  });
};
