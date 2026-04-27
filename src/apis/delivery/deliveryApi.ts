import api from "@/apis/instance";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { CreateSeedDeliveryRequest, DeliverablePlant } from "@/types/delivery";

export const getDeliverablePlants = async (): Promise<
  GlobalResponse<DeliverablePlant[]>
> => {
  const res = await api.get("/api/v1/deliveries/plants");
  return res.data;
};

export const postSeedDelivery = async (
  payload: CreateSeedDeliveryRequest
): Promise<GlobalResponse<string>> => {
  const res = await api.post("/api/v1/deliveries/seeds", payload);
  return res.data;
};

export const postUnlockGarden = async (): Promise<void> => {
  await api.post("/api/v1/gardens/unlock");
};
