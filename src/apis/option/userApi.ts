import api from "@/apis/instance";
import type { ApiResponse, NoResponse } from "@/types/common/apiResponse.type";

export const deleteMeApi = async (): ApiResponse<NoResponse> => {
  const res = await api.delete("/api/v1/users/me");
  return res.data;
};
