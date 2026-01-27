import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { homeApi } from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { HomeSummaryPayload } from "@/types/home/garden";

export const useHomeApi = () => {
  return useQuery<GlobalResponse<HomeSummaryPayload>, AxiosError, HomeSummaryPayload>({
    queryKey: ["homeSummary"],
    queryFn: homeApi,
    select: data => data.result,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export default useHomeApi;
