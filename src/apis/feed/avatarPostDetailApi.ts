import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { GETAvatarPostDetailResponse } from "@/types/feed/avatarPostDetailApi.type";
import api from "@/apis/instance";

export const getAvatarPostDetail = async (
  postId: number
): ApiResponse<GETAvatarPostDetailResponse> => {
  const res = await api.get(`/api/v1/avatar-posts/${postId}`);
  return res.data;
};
