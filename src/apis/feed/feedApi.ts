import type { ApiResponse } from "@/types/common/apiResponse.type";
import type {
  GetFeedResponse,
  RandomFeedRequest,
  RandomFeedResponse,
} from "@/types/feed/feedApi.type";
import api from "@/apis/instance";

export const getFeed = async (): ApiResponse<GetFeedResponse> => {
  const res = await api.get("/api/v1/feed");
  return res.data;
};

export const getRandomFeed = async (
  request: RandomFeedRequest
): Promise<RandomFeedResponse> => {
  const res = await api.post("/api/v1/feed/random", request);
  return res.data;
};
