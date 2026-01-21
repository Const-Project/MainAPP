import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";
import api from "@/apis/instance";

export const getDiaryDetail = async (
  diaryId: number
): ApiResponse<GETDiaryDetailResponse> => {
  const res = await api.get(`/api/v1/diaries/${diaryId}`);
  return res.data;
};
