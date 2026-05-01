import { useInfiniteQuery } from "@tanstack/react-query";

import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { FeedPost, GetFeedResponse } from "@/types/feed/feedApi.type";

import { getFeed } from "@/apis/feed/feedApi";

const PAGE_SIZE = 12;

export const useFeed = () =>
  useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getFeed(pageParam, PAGE_SIZE),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: GlobalResponse<GetFeedResponse>) => {
      const items = lastPage.result;
      if (items.length < PAGE_SIZE) return undefined;
      return items[items.length - 1].createdAt;
    },
    select: data => data.pages.flatMap((p: GlobalResponse<GetFeedResponse>) => p.result),
    refetchOnMount: "always",
  });

export default useFeed;
