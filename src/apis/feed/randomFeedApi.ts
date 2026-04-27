import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import type {
  RandomFeedSessionNextRequest,
  RandomFeedSessionPayload,
  RandomFeedSessionStartRequest,
} from "@/types/feed/randomFeedApi.type";

export const startRandomFeedSession = async (
  payload: RandomFeedSessionStartRequest
): ApiResponse<RandomFeedSessionPayload> => {
  const res = await api.post("/api/v1/feed/random/session", payload);
  return res.data;
};

export const getRandomFeedSessionNext = async (
  payload: RandomFeedSessionNextRequest
): ApiResponse<RandomFeedSessionPayload> => {
  const res = await api.post("/api/v1/feed/random/next", payload);
  return res.data;
};
