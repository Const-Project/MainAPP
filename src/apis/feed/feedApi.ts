import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GetFeedResponse } from "@/types/feed/feedApi.type";
import api from "@/apis/instance";

export const getFeed = async (): ApiResponse<GetFeedResponse> => {
  const res = await api.get("/api/v1/feed");
  return res.data;
};
