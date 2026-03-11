import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFollowUser,
  getFollowers,
  getFollowing,
  postFollowUser,
} from "@/apis/follow/followApi";
import type { FollowResponse } from "@/types/follow";

export const useFollowing = (userId: string | undefined) =>
  useQuery<
    { result: FollowResponse["result"] },
    unknown,
    FollowResponse["result"]
  >({
    queryKey: ["following", userId],
    queryFn: () => getFollowing(userId ?? ""),
    select: data => data.result,
    enabled: !!userId,
    refetchOnMount: "always",
  });

export const useFollowers = (userId: string | undefined) =>
  useQuery<
    { result: FollowResponse["result"] },
    unknown,
    FollowResponse["result"]
  >({
    queryKey: ["followers", userId],
    queryFn: () => getFollowers(userId ?? ""),
    select: data => data.result,
    enabled: !!userId,
    refetchOnMount: "always",
  });

export const useFollowUser = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string | number) => postFollowUser(targetUserId),
    onSuccess: async (_, targetUserId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile", String(targetUserId)] }),
        queryClient.invalidateQueries({ queryKey: ["following", userId] }),
        queryClient.invalidateQueries({ queryKey: ["followers", userId] }),
      ]);
    },
  });
};

export const useUnfollowUser = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (targetUserId: string | number) => deleteFollowUser(targetUserId),
    onSuccess: async (_, targetUserId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile", String(targetUserId)] }),
        queryClient.invalidateQueries({ queryKey: ["following", userId] }),
        queryClient.invalidateQueries({ queryKey: ["followers", userId] }),
      ]);
    },
  });
};
