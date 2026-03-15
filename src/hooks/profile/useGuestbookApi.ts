import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type {
  CreateGuestbookRequest,
  GuestbookEntry,
} from "@/types/profile/guestbookApi.type";
import { getGuestbookList, postGuestbook } from "@/apis/profile/guestbookApi";

export const useGuestbookList = (userId: string | number | undefined) =>
  useQuery<GlobalResponse<GuestbookEntry[]>, AxiosError, GuestbookEntry[]>({
    queryKey: ["guestbook-list", userId],
    queryFn: () => getGuestbookList(String(userId)),
    select: data => data.result,
    enabled: !!userId,
    refetchOnMount: "always",
  });

export const useCreateGuestbook = (userId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateGuestbookRequest) => postGuestbook(String(userId), body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["guestbook-list", userId] });
    },
  });
};
