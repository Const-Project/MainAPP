import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import type {
  FriendWaterResponse,
  GetUserProfileResponse,
} from "@/types/profile/profileApi.type";

export const getUserProfile = async (
  userId: string | number
): ApiResponse<GetUserProfileResponse> => {
  const res = await api.get(`/api/v1/users/${userId}`);
  return res.data;
};

export const postFriendWater = async (
  gardenId: number
): ApiResponse<FriendWaterResponse> => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/friendwater`);
  return res.data;
};
