import axios from "@/apis/instance";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { HomeSummaryPayload } from "@/types/home/garden";
import type { MissionStatus } from "@/types/apis/panel";

export const homeApi = async (): Promise<GlobalResponse<HomeSummaryPayload>> => {
  const response = await axios.get<GlobalResponse<HomeSummaryPayload>>("/api/v1/home");
  return response.data;
};

export const panelApi = async (): Promise<GlobalResponse<MissionStatus>> => {
  const response = await axios.get<GlobalResponse<MissionStatus>>("/api/v1/home/panel");
  return response.data;
};
