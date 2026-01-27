import api from "@/apis/instance";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type {
  GetUserProfileResponse,
  FriendWaterResponse,
} from "@/types/profile/profileApi.type";

export const getUserProfile = async (
  userId: string | number,
): Promise<GlobalResponse<GetUserProfileResponse>> => {
  const res = await api.get(`/api/v1/users/${userId}`);
  return res.data;
};

export const postFriendWater = async (
  gardenId: number,
): Promise<GlobalResponse<FriendWaterResponse>> => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/friendwater`);
  return res.data;
};
