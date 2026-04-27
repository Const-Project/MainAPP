import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import type { FollowResponse } from "@/types/follow";
import type { FollowUserResponse } from "@/types/profile/profileApi.type";

export const getFollowing = async (
  userId: string | number
): ApiResponse<FollowResponse["result"]> => {
  const res = await api.get(`/api/v1/users/${userId}/following`);
  return res.data;
};

export const getFollowers = async (
  userId: string | number
): ApiResponse<FollowResponse["result"]> => {
  const res = await api.get(`/api/v1/users/${userId}/followers`);
  return res.data;
};

export const postFollowUser = async (
  userId: string | number
): ApiResponse<FollowUserResponse> => {
  const res = await api.post(`/api/v1/users/${userId}/follow`);
  return res.data;
};

export const deleteFollowUser = async (
  userId: string | number
): ApiResponse<FollowUserResponse> => {
  const res = await api.delete(`/api/v1/users/${userId}/follow`);
  return res.data;
};
