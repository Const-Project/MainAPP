import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";

import {
  getDiaryDetail,
  updateDiaryDetail,
  type UpdateDiaryPayload,
} from "@/apis/log/diaryDetailApi";

export const useDiaryDetail = (diaryId: number) =>
  useQuery<{ result: GETDiaryDetailResponse }, unknown, GETDiaryDetailResponse>(
    {
      queryKey: ["diary-detail", diaryId],
      queryFn: () => getDiaryDetail(diaryId),
      select: data => data.result,
      enabled: Number.isFinite(diaryId) && diaryId > 0,
      staleTime: 60_000,
    }
  );

export default useDiaryDetail;

export const useUpdateDiaryDetail = (diaryId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateDiaryPayload) => updateDiaryDetail(diaryId, payload),
    onSuccess: response => {
      queryClient.setQueryData(["diary-detail", diaryId], response);
      void queryClient.invalidateQueries({ queryKey: ["diaries"] });
      void queryClient.invalidateQueries({ queryKey: ["feed"] });
      void queryClient.invalidateQueries({ queryKey: ["random-feed-session"] });
    },
  });
};
