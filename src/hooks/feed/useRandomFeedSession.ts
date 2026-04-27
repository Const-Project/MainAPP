import { useInfiniteQuery } from "@tanstack/react-query";
import {
  getRandomFeedSessionNext,
  startRandomFeedSession,
} from "@/apis/feed/randomFeedApi";
import type {
  RandomFeedSessionNextRequest,
  RandomFeedSessionPayload,
} from "@/types/feed/randomFeedApi.type";

type SessionPageParam = string | null;

export const useRandomFeedSession = ({
  enabled,
  sessionKey,
  size = 6,
}: {
  enabled: boolean;
  sessionKey: string;
  size?: number;
}) =>
  useInfiniteQuery<
    { result: RandomFeedSessionPayload },
    unknown,
    RandomFeedSessionPayload,
    [string, string, number],
    SessionPageParam
  >({
    queryKey: ["random-feed-session", sessionKey, size],
    enabled,
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      if (!pageParam) {
        return startRandomFeedSession({ size });
      }

      const payload: RandomFeedSessionNextRequest = {
        sessionToken: pageParam,
        size,
      };
      return getRandomFeedSessionNext(payload);
    },
    select: data => ({
      sessionToken:
        data.pages[data.pages.length - 1]?.result.sessionToken ?? "",
      items: data.pages.flatMap(page => page.result.items),
      hasMore: data.pages[data.pages.length - 1]?.result.hasMore ?? false,
      remaining: data.pages[data.pages.length - 1]?.result.remaining ?? 0,
    }),
    getNextPageParam: lastPage =>
      lastPage.result.hasMore ? lastPage.result.sessionToken : undefined,
  });

export default useRandomFeedSession;
