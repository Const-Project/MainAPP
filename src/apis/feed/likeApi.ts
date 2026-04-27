import api from "@/apis/instance";
import type { ApiResponse, NoResponse } from "@/types/common/apiResponse.type";

export type FeedLikeTargetType = "DIARY" | "AVATAR_POST";

export const likeFeedTarget = async (
  targetId: number,
  targetType: FeedLikeTargetType
): ApiResponse<NoResponse> => {
  const endpoint =
    targetType === "DIARY"
      ? `/api/v1/diaries/${targetId}/likes`
      : `/api/v1/avatar-posts/${targetId}/likes`;

  const res = await api.post(endpoint);
  return res.data;
};

export const unlikeFeedTarget = async (
  targetId: number,
  targetType: FeedLikeTargetType
): ApiResponse<NoResponse> => {
  const endpoint =
    targetType === "DIARY"
      ? `/api/v1/diaries/${targetId}/likes`
      : `/api/v1/avatar-posts/${targetId}/likes`;

  const res = await api.delete(endpoint);
  return res.data;
};
