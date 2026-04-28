import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import type { GlobalResponse } from "@/types/common/apiResponse.type";
import type { FeedPost, GetFeedResponse, PostType } from "@/types/feed/feedApi.type";
import type { RandomFeedSessionPayload } from "@/types/feed/randomFeedApi.type";

type RemoveReportedFeedParams = {
  postId: number;
  postType: PostType;
  writerId?: number | null;
};

type RandomFeedPage = GlobalResponse<RandomFeedSessionPayload>;

const removePostFromFeed = (
  posts: FeedPost[],
  postId: number,
  postType: PostType
) => posts.filter(post => post.postId !== postId || post.postType !== postType);

export const removeReportedFeedCache = (
  queryClient: QueryClient,
  { postId, postType, writerId }: RemoveReportedFeedParams
) => {
  queryClient.setQueryData<GlobalResponse<GetFeedResponse>>(["feed"], previous =>
    previous
      ? {
          ...previous,
          result: removePostFromFeed(previous.result, postId, postType),
        }
      : previous
  );

  queryClient.setQueriesData<InfiniteData<RandomFeedPage>>(
    { queryKey: ["random-feed-session"] },
    previous => {
      if (!previous) {
        return previous;
      }

      return {
        ...previous,
        pages: previous.pages.map(page => ({
          ...page,
          result: {
            ...page.result,
            items: page.result.items.filter(item => {
              if (writerId && item.author.userId === writerId) {
                return false;
              }

              return item.postId !== postId || item.postType !== postType;
            }),
          },
        })),
      };
    }
  );

  void queryClient.invalidateQueries({ queryKey: ["feed"] });
};
