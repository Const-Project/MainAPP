import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import {
  normalizeHomeSummaryPayload,
  type HomeSummaryPayload,
} from "@/types/home/garden";
import type { GuestbookEntry, NotificationItem } from "@/types/home/alerts";
import type { HomePanelPayload } from "@/types/home/panel";
import type {
  TrackingPromptConfirmRequest,
  TrackingPromptStatusPayload,
} from "@/types/home/tracking";

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

export const getTrackingPromptStatus =
  async (): ApiResponse<TrackingPromptStatusPayload> => {
    // 한글 주석:
    // 홈 자동 팝업 여부는 앱이 계산하지 않고 서버의 eligible 판정만 그대로 조회한다.
    const res = await api.get("/api/v1/tracking/report/status");
    return res.data;
  };

export const postTrackingPromptConfirm = async (
  payload: TrackingPromptConfirmRequest
) => {
  // 한글 주석:
  // 사용자가 이번 주기 리포트를 확인했다는 사실을 서버에 저장해 같은 cycle 재노출을 막는다.
  const res = await api.post("/api/v1/tracking/report/confirm", payload);
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
