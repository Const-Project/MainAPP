import api from "@/apis/instance";
import type {
  AnswerDailySurveyRequest,
  AnswerDailySurveyResponse,
  AnswerQuizRequest,
  AnswerQuizResponse,
  DiaryImageUploadResponse,
  GetDailySurveyResponse,
  GetQuizRequest,
  GetQuizResponse,
  GetTodayKeywordResponse,
  WriteDiaryRequest,
  WriteDiaryResponse,
} from "@/types/missions";

export const uploadDiaryImageApi = async (
  formData: FormData
): Promise<DiaryImageUploadResponse> => {
  const res = await api.post("/api/v1/diaries/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const writeDiaryApi = async (
  payload: WriteDiaryRequest
): Promise<WriteDiaryResponse> => {
  const res = await api.post("/api/v1/diaries", payload);
  return res.data;
};

export const getTodayKeywordApi = async (): Promise<GetTodayKeywordResponse> => {
  const res = await api.get("/api/v1/keywords/today");
  return res.data;
};

export const getQuizApi = async (
  params: GetQuizRequest
): Promise<GetQuizResponse> => {
  const res = await api.get("/api/v1/realQuiz", { params });
  return res.data;
};

export const answerQuizApi = async ({
  quizId,
  selectedOptionOrder,
}: AnswerQuizRequest): Promise<AnswerQuizResponse> => {
  const res = await api.post(`/api/v1/realQuiz/${quizId}/answer`, {
    selectedOptionOrder,
  });
  return res.data;
};

export const getDailySurveyApi = async (): Promise<GetDailySurveyResponse> => {
  const res = await api.get("/api/v1/survey");
  return res.data;
};

export const answerDailySurveyApi = async (
  payload: AnswerDailySurveyRequest
): Promise<AnswerDailySurveyResponse> => {
  const res = await api.post("/api/v1/survey/answer", payload);
  return res.data;
};
