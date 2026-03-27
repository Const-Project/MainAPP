import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type {
  CreateGuestbookRequest,
  GuestbookEntry,
} from "@/types/profile/guestbookApi.type";
import { getGuestbookList, postGuestbook } from "@/apis/profile/guestbookApi";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";

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
  const currentUsername = useHomeSummaryStore(state => state.user?.username ?? "");

  return useMutation<
    unknown,
    AxiosError,
    CreateGuestbookRequest,
    { previous: GlobalResponse<GuestbookEntry[]> | undefined; queryKey: (string | number | undefined)[] }
  >({
    mutationFn: (body: CreateGuestbookRequest) => postGuestbook(String(userId), body),
    onMutate: async (body: CreateGuestbookRequest) => {
      const queryKey = ["guestbook-list", userId];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<GlobalResponse<GuestbookEntry[]>>(queryKey);
      const optimisticEntry: GuestbookEntry = {
        author: currentUsername,
        content: body.content,
        createdAt: new Date().toISOString(),
      };
      queryClient.setQueryData<GlobalResponse<GuestbookEntry[]>>(queryKey, old =>
        old ? { ...old, result: [optimisticEntry, ...old.result] } : old
      );
      return { previous, queryKey };
    },
    onError: (_err, _body, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSuccess: async () => {
      /*
       * 한글 주석:
       * 방명록 작성 후에는 현재 프로필 화면의 목록뿐 아니라
       * 홈 비둘기 모달이 바라보는 방명록/알림 조회도 함께 새로 읽게 맞춘다.
       */
      await queryClient.invalidateQueries({ queryKey: ["guestbook-list"] });
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
