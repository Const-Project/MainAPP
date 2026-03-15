import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";

export const getPolicy = async (): ApiResponse<string> => {
  const res = await api.get("/api/v1/policy");
  return res.data;
};
