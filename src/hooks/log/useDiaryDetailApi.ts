import { useQuery } from "@tanstack/react-query";

import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";

import { getDiaryDetail } from "@/apis/log/diaryDetailApi";

export const useDiaryDetail = (diaryId: number) =>
  useQuery<{ result: GETDiaryDetailResponse }, unknown, GETDiaryDetailResponse>(
    {
      queryKey: ["diary-detail", diaryId],
      queryFn: () => getDiaryDetail(diaryId),
      select: data => data.result,
      enabled: Number.isFinite(diaryId) && diaryId > 0,
    }
  );

export default useDiaryDetail;
