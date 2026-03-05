import type { ApiResponse } from "@/types/common/apiResponse.type";
import type {
  GetFeedResponse,
  RandomFeedSessionRequest,
  RandomFeedSessionResponse,
  RandomFeedNextRequest,
  RandomFeedNextResponse,
} from "@/types/feed/feedApi.type";
import api from "@/apis/instance";

export const getFeed = async (): ApiResponse<GetFeedResponse> => {
  const res = await api.get("/api/v1/feed");
  return res.data;
};

// Session-based random feed
export const startRandomFeedSession = async (
  request: RandomFeedSessionRequest
): Promise<RandomFeedSessionResponse> => {
  const res = await api.post("/api/v1/feed/random/session", request);
  return res.data;
};

export const getRandomFeedNext = async (
  request: RandomFeedNextRequest
): Promise<RandomFeedNextResponse> => {
  const res = await api.post("/api/v1/feed/random/next", request);
  return res.data;
};
