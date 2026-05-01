import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GetFeedResponse } from "@/types/feed/feedApi.type";
import api from "@/apis/instance";

export const getFeed = async (
  cursor?: string,
  size = 20,
  filter?: string,
): ApiResponse<GetFeedResponse> => {
  const params: Record<string, string | number> = { size };
  if (cursor) params.cursor = cursor;
  if (filter) params.filter = filter;
  const res = await api.get("/api/v1/feed", { params });
  return res.data;
};
