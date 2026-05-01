import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";

export type UpdateAvatarPayload = {
  avatarId: number;
  newAvatarName: string;
};

export const updateAvatarNickname = async (
  payload: UpdateAvatarPayload
): ApiResponse<void> => {
  const res = await api.patch(`/api/v1/users/me/avatar/${payload.avatarId}/nickname`, {
    newAvatarName: payload.newAvatarName,
  });
  return res.data;
};
