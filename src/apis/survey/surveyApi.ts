import axios from "@/apis/instance";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { PostSurveyResponse } from "@/types/apis/survey";

export const getSurveyApi = async (): Promise<PostSurveyResponse> => {
  const { data } = await axios.get<GlobalResponse<PostSurveyResponse>>("/api/v1/survey");
  return data.result;
};

export const postSurveyAnswerApi = async (params: {
  questionId: number;
  answer: number;
}) => {
  const response = await axios.post("/api/v1/survey/answer", params);
  return response.data;
};
