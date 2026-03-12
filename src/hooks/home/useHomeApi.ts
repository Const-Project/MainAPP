import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getHomePanel,
  getHomeSummary,
  postGardenMyWater,
  postGardenSunlight,
} from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { HomeSummaryPayload } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";

export const useHomeApi = () =>
  useQuery<
    GlobalResponse<HomeSummaryPayload>,
    AxiosError,
    HomeSummaryPayload
  >({
    queryKey: ["home-summary"],
    queryFn: getHomeSummary,
    select: data => data.result,
    refetchOnMount: "always",
  });

export const useHomePanelApi = () =>
  useQuery<GlobalResponse<HomePanelPayload>, AxiosError, HomePanelPayload>({
    queryKey: ["home-panel"],
    queryFn: getHomePanel,
    select: data => data.result,
    refetchOnMount: "always",
  });

export const useGardenSunlightAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gardenId: number) => postGardenSunlight(gardenId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["home-panel"] });
    },
  });
};

export const useGardenWaterAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gardenId: number) => postGardenMyWater(gardenId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["home-panel"] });
    },
  });
};

export default useHomeApi;
