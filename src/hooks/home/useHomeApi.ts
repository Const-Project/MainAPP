import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getGuestbookList,
  getHomePanel,
  getHomeSummary,
  getNotifications,
  getTrackingReport,
  postGardenMyWater,
  postGardenSunlight,
} from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { GuestbookEntry, NotificationItem } from "@/types/home/alerts";
import type { HomeSummaryPayload } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";
import type { TrackingReportPayload } from "@/types/home/tracking";

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

export const useTrackingReport = () =>
  useMutation<GlobalResponse<TrackingReportPayload>, AxiosError>({
    mutationFn: getTrackingReport,
  });

export const useNotifications = (enabled: boolean) =>
  useQuery<GlobalResponse<NotificationItem[]>, AxiosError, NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: data => data.result,
    enabled,
  });

export const useGuestbookList = (userId: number | null, enabled: boolean) =>
  useQuery<GlobalResponse<GuestbookEntry[]>, AxiosError, GuestbookEntry[]>({
    queryKey: ["guestbook-list", userId],
    queryFn: () => getGuestbookList(userId as number),
    select: data => data.result,
    enabled: enabled && userId !== null,
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
