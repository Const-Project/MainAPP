import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteFollowUser,
  getFollowers,
  getFollowing,
  postFollowUser,
} from "@/apis/follow/followApi";
import type { FollowResponse } from "@/types/follow";
import { FollowStatus, type GetUserProfileResponse } from "@/types/profile/profileApi.type";

type ProfileCache = { result: GetUserProfileResponse };
type FollowMutateContext = { previous: ProfileCache | undefined; queryKey: string[] };

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

  return useMutation<unknown, unknown, string | number, FollowMutateContext>({
    mutationFn: (targetUserId: string | number) => postFollowUser(targetUserId),
    onMutate: async (targetUserId: string | number) => {
      const queryKey = ["profile", String(targetUserId)];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ProfileCache>(queryKey);
      queryClient.setQueryData<ProfileCache>(queryKey, old =>
        old ? { ...old, result: { ...old.result, followStatus: FollowStatus.FOLLOWING } } : old
      );
      return { previous, queryKey };
    },
    onError: (_err, _targetUserId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
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

  return useMutation<unknown, unknown, string | number, FollowMutateContext>({
    mutationFn: (targetUserId: string | number) => deleteFollowUser(targetUserId),
    onMutate: async (targetUserId: string | number) => {
      const queryKey = ["profile", String(targetUserId)];
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<ProfileCache>(queryKey);
      queryClient.setQueryData<ProfileCache>(queryKey, old =>
        old ? { ...old, result: { ...old.result, followStatus: FollowStatus.NOT_FOLLOWING } } : old
      );
      return { previous, queryKey };
    },
    onError: (_err, _targetUserId, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previous);
      }
    },
    onSuccess: async (_, targetUserId) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["profile", String(targetUserId)] }),
        queryClient.invalidateQueries({ queryKey: ["following", userId] }),
        queryClient.invalidateQueries({ queryKey: ["followers", userId] }),
      ]);
    },
  });
};
