import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetDiariesResponse } from "@/types/log/diariesApi.type";
import { getDiaries } from "@/apis/log/diariesApi";

export const useDiaries = (year: number, month: number) =>
  useQuery<{ result: GetDiariesResponse }, unknown, GetDiariesResponse>({
    queryKey: ["diaries", year, month],
    queryFn: () => getDiaries(year, month),
    select: data => data.result,
    placeholderData: keepPreviousData,
    refetchOnMount: "always",
  });

export default useDiaries;
