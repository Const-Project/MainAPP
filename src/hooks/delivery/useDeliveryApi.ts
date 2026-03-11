import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getDeliverablePlants,
  postSeedDelivery,
  postUnlockGarden,
} from "@/apis/delivery/deliveryApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { CreateSeedDeliveryRequest, DeliverablePlant } from "@/types/delivery";

export const useDeliverablePlants = () =>
  useQuery<
    GlobalResponse<DeliverablePlant[]>,
    AxiosError,
    DeliverablePlant[]
  >({
    queryKey: ["deliverable-plants"],
    queryFn: getDeliverablePlants,
    select: data => data.result,
  });

export const useCreateSeedDelivery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSeedDeliveryRequest) => postSeedDelivery(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
    },
  });
};

export const useUnlockGarden = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postUnlockGarden(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
    },
  });
};
