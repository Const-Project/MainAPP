import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  postFriendWater,
} from "@/apis/profile/profileApi";
import type { GetUserProfileResponse } from "@/types/profile/profileApi.type";

export const useUserProfile = (userId: string | number | undefined) =>
  useQuery<{ result: GetUserProfileResponse }, unknown, GetUserProfileResponse>({
    queryKey: ["profile", userId],
    queryFn: () => getUserProfile(String(userId)),
    select: data => data.result,
    enabled: !!userId,
    refetchOnMount: "always",
  });

export const useFriendWater = (userId: string | number | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (gardenId: number) => postFriendWater(gardenId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
};
