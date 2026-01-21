import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GetDiariesResponse } from "@/types/log/diariesApi.type";
import api from "@/apis/instance";

/** GET /api/v1/diaries?year=YYYY&month=MM */
export const getDiaries = async (
  year: number,
  month: number
): ApiResponse<GetDiariesResponse> => {
  const res = await api.get("/api/v1/diaries", { params: { year, month } });
  return res.data;
};
