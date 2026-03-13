import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import {
  normalizeHomeSummaryPayload,
  type HomeSummaryPayload,
} from "@/types/home/garden";
import type { GuestbookEntry, NotificationItem } from "@/types/home/alerts";
import type { HomePanelPayload } from "@/types/home/panel";
import type { TrackingReportPayload } from "@/types/home/tracking";

export const getHomeSummary = async (): ApiResponse<HomeSummaryPayload> => {
  const res = await api.get("/api/v1/home");

  return {
    ...res.data,
    result: normalizeHomeSummaryPayload(res.data.result),
  };
};

export const getHomePanel = async (): ApiResponse<HomePanelPayload> => {
  const res = await api.get("/api/v1/home/panel");
  return res.data;
};

export const getTrackingReport = async (): ApiResponse<TrackingReportPayload> => {
  const res = await api.get("/api/v1/tracking/report");
  return res.data;
};

export const getNotifications = async (): ApiResponse<NotificationItem[]> => {
  const res = await api.get("/api/v1/notifications");
  return res.data;
};

export const getGuestbookList = async (
  userId: number
): ApiResponse<GuestbookEntry[]> => {
  const res = await api.get(`/api/v1/users/guestbook/${userId}/list`);
  return res.data;
};

export const postGardenSunlight = async (gardenId: number) => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/sunlight`);
  return res.data;
};

export const postGardenMyWater = async (gardenId: number) => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/mywater`);
  return res.data;
};
