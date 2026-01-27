import { useQuery } from "@tanstack/react-query";

import type { FollowResponse } from "@/types/follow";

import { getFollowers, getFollowing } from "@/apis/follow/followApi";

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

export default { useFollowing, useFollowers };
