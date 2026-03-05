import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import type {
  GetFeedResponse,
  RandomFeedSessionResponse,
  RandomFeedNextResponse,
} from "@/types/feed/feedApi.type";

import {
  getFeed,
  startRandomFeedSession,
  getRandomFeedNext,
} from "@/apis/feed/feedApi";

export const useFeed = () =>
  useQuery<{ result: GetFeedResponse }, unknown, GetFeedResponse>({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
    select: data => data.result,
    refetchOnMount: "always",
  });

interface SessionPageParam {
  sessionToken?: string;
}

type FeedPageResponse = RandomFeedSessionResponse | RandomFeedNextResponse;

export const useInfiniteFeed = (size: number = 21) =>
  useInfiniteQuery<
    FeedPageResponse,
    Error,
    { pages: FeedPageResponse[]; pageParams: SessionPageParam[] },
    string[],
    SessionPageParam
  >({
    queryKey: ["feed", "infinite"],
    queryFn: async ({ pageParam }) => {
      // First page: start session
      if (!pageParam.sessionToken) {
        return startRandomFeedSession({ size });
      }
      // Subsequent pages: use session token
      return getRandomFeedNext({
        sessionToken: pageParam.sessionToken,
        size,
      });
    },
    initialPageParam: {},
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.result.hasMore) {
        return undefined;
      }

      // Extract sessionToken from the first page (session start response)
      const firstPage = allPages[0];
      const sessionToken =
        "sessionToken" in firstPage.result
          ? firstPage.result.sessionToken
          : undefined;

      if (!sessionToken) {
        return undefined;
      }

      return { sessionToken };
    },
    refetchOnMount: "always",
  });

export default useFeed;
