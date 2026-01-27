import { useQuery } from "@tanstack/react-query";

import { panelApi } from "@/apis/home/homeApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { MissionStatus } from "@/types/apis/panel";

export const usePanelApi = () => {
  return useQuery<GlobalResponse<MissionStatus>, Error, MissionStatus>({
    queryKey: ["panel"],
    queryFn: panelApi,
    select: data => data.result,
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    gcTime: 0,
  });
};
