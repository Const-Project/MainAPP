import api from "@/apis/instance";
import type { ApiResponse, NoResponse } from "@/types/common/apiResponse.type";

export type NotificationSettings = {
  notificationEnabled: boolean;
  marketingConsent: boolean;
};

export const getNotificationSettings = async (): ApiResponse<NotificationSettings> => {
  const res = await api.get("/api/v1/notifications/settings");
  return res.data;
};

export const patchNotificationSettings = async (
  settings: Partial<NotificationSettings>
): ApiResponse<NoResponse> => {
  const res = await api.patch("/api/v1/notifications/settings", settings);
  return res.data;
};

export const postFcmToken = async (token: string): ApiResponse<NoResponse> => {
  const res = await api.post("/api/v1/notifications/token", { token });
  return res.data;
};
