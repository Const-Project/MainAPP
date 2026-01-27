import axios from "@/apis/instance";
import type { GlobalResponse } from "@/types/common/apiResponse.type";

export interface Plant {
  seedType: number;
  imageUrl: string;
  name: string;
}

export interface DeliveryRequest {
  seedType: number;
  recipientName: string;
  recipientPhone: string;
  postalCode: string;
  address: string;
  addressDetail: string;
  message: string;
}

export const getPlantsApi = async (): Promise<GlobalResponse<Plant[]>> => {
  const res = await axios.get("/api/v1/deliveries/plants");
  return res.data;
};

export const postDeliverySeedApi = async (
  data: DeliveryRequest,
): Promise<GlobalResponse<null>> => {
  const res = await axios.post("/api/v1/deliveries/seeds", data);
  return res.data;
};
