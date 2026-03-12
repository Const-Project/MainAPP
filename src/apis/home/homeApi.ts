import api from "@/apis/instance";
import type { ApiResponse } from "@/types/common/apiResponse.type";
import {
  normalizeHomeSummaryPayload,
  type HomeSummaryPayload,
} from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";

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

export const postGardenSunlight = async (gardenId: number) => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/sunlight`);
  return res.data;
};

export const postGardenMyWater = async (gardenId: number) => {
  const res = await api.post(`/api/v1/gardens/${gardenId}/mywater`);
  return res.data;
};
