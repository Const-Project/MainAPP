import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { CreateReportPayload } from "@/types/report";

export const postReport = async (
  payload: CreateReportPayload
): ApiResponse<void> => {
  const res = await api.post("/api/v1/reports", payload);
  return res.data;
};
