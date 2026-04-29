import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";
import api from "@/apis/instance";

export type UpdateDiaryPayload = {
  title: string;
  content: string;
  isPublic: boolean;
};

export const getDiaryDetail = async (
  diaryId: number
): ApiResponse<GETDiaryDetailResponse> => {
  const res = await api.get(`/api/v1/diaries/${diaryId}`);
  return res.data;
};

export const updateDiaryDetail = async (
  diaryId: number,
  payload: UpdateDiaryPayload
): ApiResponse<GETDiaryDetailResponse> => {
  const res = await api.patch(`/api/v1/diaries/${diaryId}`, payload);
  return res.data;
};
