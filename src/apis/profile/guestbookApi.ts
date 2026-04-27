import api from "@/apis/instance";
import type { ApiResponse, NoResponse } from "@/types/common/apiResponse.type";
import type {
  CreateGuestbookRequest,
  GuestbookEntry,
} from "@/types/profile/guestbookApi.type";

export const getGuestbookList = async (
  userId: string | number
): ApiResponse<GuestbookEntry[]> => {
  const res = await api.get(`/api/v1/users/guestbook/${userId}/list`);
  return res.data;
};

export const postGuestbook = async (
  userId: string | number,
  body: CreateGuestbookRequest
): ApiResponse<NoResponse> => {
  const res = await api.post(`/api/v1/users/${userId}/guestbook`, body);
  return res.data;
};
