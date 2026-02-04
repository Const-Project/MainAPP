import api from "@/apis/instance";
import type {
  ChangeNicknameRequest,
  ChangeNicknameResponse,
  DeleteAccountResponse,
} from "@/types/user/userApi.type";

export const patchUserNickname = async (
  request: ChangeNicknameRequest
): Promise<ChangeNicknameResponse> => {
  const res = await api.patch("/api/v1/users/me/nickname", request);
  return res.data;
};

export const deleteUserAccount = async (): Promise<DeleteAccountResponse> => {
  const res = await api.delete("/api/v1/users/me");
  return res.data;
};
