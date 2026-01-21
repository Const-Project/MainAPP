import { useQuery } from "@tanstack/react-query";

import type { GetFeedResponse } from "@/types/feed/feedApi.type";

import { getFeed } from "@/apis/feed/feedApi";

export const useFeed = () =>
  useQuery<{ result: GetFeedResponse }, unknown, GetFeedResponse>({
    queryKey: ["feed"],
    queryFn: () => getFeed(),
    select: data => data.result,
    refetchOnMount: "always",
  });

export default useFeed;
