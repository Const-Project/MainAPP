import { useQuery } from "@tanstack/react-query";

import { getUserProfile } from "@/apis/profile/profileApi";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { GetUserProfileResponse } from "@/types/profile/profileApi.type";

export const useUserProfile = (userId: string | number | undefined) =>
  useQuery<GlobalResponse<GetUserProfileResponse>, Error, GetUserProfileResponse>({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(String(userId)),
    select: data => data.result,
    enabled: !!userId,
    refetchOnMount: true,
  });

export default useUserProfile;
