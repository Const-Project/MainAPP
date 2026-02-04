import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import type {
  GetFeedResponse,
  RandomFeedResponse,
  RandomFeedItem,
} from "@/types/feed/feedApi.type";

import { getFeed, getRandomFeed } from "@/apis/feed/feedApi";

export const useFeed = () =>
  useQuery<{ result: GetFeedResponse }, unknown, GetFeedResponse>({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
    select: data => data.result,
    refetchOnMount: "always",
  });

interface ExcludeIds {
  excludeDiaryIds: number[];
  excludeAvatarPostIds: number[];
}

export const useInfiniteFeed = (size: number = 21) =>
  useInfiniteQuery<
    RandomFeedResponse,
    Error,
    { pages: RandomFeedResponse[]; pageParams: ExcludeIds[] },
    string[],
    ExcludeIds
  >({
    queryKey: ["feed", "infinite"],
    queryFn: async ({ pageParam }) => {
      return getRandomFeed({
        excludeDiaryIds: pageParam.excludeDiaryIds,
        excludeAvatarPostIds: pageParam.excludeAvatarPostIds,
        size,
      });
    },
    initialPageParam: { excludeDiaryIds: [], excludeAvatarPostIds: [] },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.result.hasMore) {
        return undefined;
      }

      // Collect all IDs from all pages to exclude
      const allItems = allPages.flatMap(page => page.result.items);
      const excludeDiaryIds = allItems
        .filter(item => item.postType === "DIARY")
        .map(item => item.postId);
      const excludeAvatarPostIds = allItems
        .filter(item => item.postType === "AVATAR_POST")
        .map(item => item.postId);

      return { excludeDiaryIds, excludeAvatarPostIds };
    },
    refetchOnMount: "always",
  });

export default useFeed;
