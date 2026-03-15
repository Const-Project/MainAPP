import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserProfile,
  patchMyNickname,
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

export const useUpdateMyNickname = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newNickname: string) => patchMyNickname(newNickname),
    onSuccess: async () => {
      // 한글 주석:
      // 유저 닉네임은 프로필, 방명록, 알림 문구에 함께 노출되므로
      // 저장 직후 관련 캐시를 함께 갱신해서 임시 닉네임이 남지 않게 맞춘다.
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile"] }),
        queryClient.invalidateQueries({ queryKey: ["guestbook-list"] }),
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      ]);
    },
  });
};
