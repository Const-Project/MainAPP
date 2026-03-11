import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { getHomeSummary } from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { HomeSummaryPayload } from "@/types/home/garden";

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

export default useHomeApi;
