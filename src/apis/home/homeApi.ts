import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import {
  normalizeHomeSummaryPayload,
  type HomeSummaryPayload,
} from "@/types/home/garden";

export const getHomeSummary = async (): ApiResponse<HomeSummaryPayload> => {
  const res = await api.get("/api/v1/home");

  return {
    ...res.data,
    result: normalizeHomeSummaryPayload(res.data.result),
  };
};
