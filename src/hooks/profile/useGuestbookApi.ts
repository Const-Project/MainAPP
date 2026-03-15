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
