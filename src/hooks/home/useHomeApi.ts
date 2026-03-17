import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  getGuestbookList,
  getHomePanel,
  getHomeSummary,
  getNotifications,
  getTrackingPromptStatus,
  patchNotificationRead,
  postGardenMyWater,
  postGardenSunlight,
  postTrackingPromptConfirm,
} from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { GuestbookEntry, NotificationItem } from "@/types/home/alerts";
import type { HomeSummaryPayload } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";
import type {
  TrackingPromptConfirmRequest,
  TrackingPromptStatusPayload,
} from "@/types/home/tracking";
import { createTimingLogger, debugLog } from "@/utils/debug";

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

export const useTrackingPromptStatus = () =>
  useQuery<
    GlobalResponse<TrackingPromptStatusPayload>,
    AxiosError,
    TrackingPromptStatusPayload
  >({
    // 한글 주석:
    // 홈 진입, 홈 복귀, 액션 성공 뒤 모두 같은 키를 invalidate/refetch 해서
    // tracking 리포트 노출 여부를 한 군데 기준으로 맞춘다.
    queryKey: ["tracking-report-status"],
    queryFn: getTrackingPromptStatus,
    select: data => data.result,
    refetchOnMount: "always",
  });

export const useTrackingPromptConfirm = () =>
  useMutation<
    GlobalResponse<Record<string, never>>,
    AxiosError,
    TrackingPromptConfirmRequest
  >({
    mutationFn: postTrackingPromptConfirm,
  });

export const useNotifications = (enabled: boolean) =>
  useQuery<GlobalResponse<NotificationItem[]>, AxiosError, NotificationItem[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    select: data => data.result,
    enabled,
  });

export const useReadNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationIds: number[]) => {
      await Promise.all(
        notificationIds.map(notificationId => patchNotificationRead(notificationId))
      );
    },
    onSuccess: async (_, notificationIds) => {
      queryClient.setQueryData<GlobalResponse<NotificationItem[]>>(
        ["notifications"],
        previous =>
          previous
            ? {
                ...previous,
                result: previous.result.map(item =>
                  notificationIds.includes(item.id)
                    ? { ...item, isRead: true, read: true }
                    : item
                ),
              }
            : previous
      );

      queryClient.setQueryData<GlobalResponse<HomeSummaryPayload>>(
        ["home-summary"],
        previous => {
          if (!previous) {
            return previous;
          }

          const unreadDelta = previous.result.userInfo.unreadNotificationCount;
          const nextUnreadCount = Math.max(
            0,
            unreadDelta - notificationIds.length
          );

          return {
            ...previous,
            result: {
              ...previous.result,
              userInfo: {
                ...previous.result.userInfo,
                unreadNotificationCount: nextUnreadCount,
              },
            },
          };
        }
      );

      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
    },
  });
};

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
    onSuccess: () => {
      const finishRefreshTiming = createTimingLogger(
        "useGardenSunlightAction",
        "post-action background refresh"
      );

      void Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["home-panel"] }),
        queryClient.invalidateQueries({ queryKey: ["tracking-report-status"] }),
      ]).then(results => {
        const rejectedCount = results.filter(result => result.status === "rejected").length;

        finishRefreshTiming({ rejectedCount });

        if (rejectedCount > 0) {
          debugLog("useGardenSunlightAction", "background refresh had failures", { results });
        }
      });
    },
  });
};

export const useGardenWaterAction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gardenId: number) => postGardenMyWater(gardenId),
    onSuccess: () => {
      const finishRefreshTiming = createTimingLogger(
        "useGardenWaterAction",
        "post-action background refresh"
      );

      void Promise.allSettled([
        queryClient.invalidateQueries({ queryKey: ["home-summary"] }),
        queryClient.invalidateQueries({ queryKey: ["home-panel"] }),
        queryClient.invalidateQueries({ queryKey: ["tracking-report-status"] }),
      ]).then(results => {
        const rejectedCount = results.filter(result => result.status === "rejected").length;

        finishRefreshTiming({ rejectedCount });

        if (rejectedCount > 0) {
          debugLog("useGardenWaterAction", "background refresh had failures", { results });
        }
      });
    },
  });
};

export default useHomeApi;
