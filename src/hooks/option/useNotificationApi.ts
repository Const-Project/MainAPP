import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotificationSettings,
  patchNotificationSettings,
  type NotificationSettings,
} from "@/apis/option/notificationApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";

const SETTINGS_QUERY_KEY = ["notificationSettings"];

export const useNotificationSettings = () =>
  useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: getNotificationSettings,
    select: data => data.result,
  });

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchNotificationSettings,
    onMutate: async newSettings => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_QUERY_KEY });
      const previous = queryClient.getQueryData<GlobalResponse<NotificationSettings>>(SETTINGS_QUERY_KEY);
      queryClient.setQueryData<GlobalResponse<NotificationSettings>>(SETTINGS_QUERY_KEY, old =>
        old ? { ...old, result: { ...old.result, ...newSettings } } : old
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTINGS_QUERY_KEY, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
};
