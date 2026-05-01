import FeedAvatarDetailCard from "@/components/feed/FeedAvatarDetailCard";
import FeedDiaryDetailCard from "@/components/feed/FeedDiaryDetailCard";
import FeedRandomSessionDetailCard from "@/components/feed/FeedRandomSessionDetailCard";
import FeedSeedDetailCard from "@/components/feed/FeedSeedDetailCard";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType, RandomFeedSessionItem } from "@/types/feed/randomFeedApi.type";

type Props = {
  postId: number;
  postType: RandomFeedPostType;
  isSeed: boolean;
  sessionItem?: RandomFeedSessionItem;
  seedResult?: FeedDetailResult;
  onSeedRefetch?: () => void | Promise<unknown>;
  commentValue?: string;
  onChangeComment?: (value: string) => void;
  onSubmitComment?: (value: string) => Promise<void> | void;
  isCommentPending?: boolean;
};

export default function FeedInfiniteDetailItem({
  postId,
  postType,
  isSeed,
  sessionItem,
  seedResult,
  onSeedRefetch,
  commentValue = "",
  onChangeComment,
  onSubmitComment,
  isCommentPending = false,
}: Props) {
  if (isSeed && seedResult && onSeedRefetch && onChangeComment && onSubmitComment) {
    return (
      <FeedSeedDetailCard
        result={seedResult}
        postType={postType}
        onRefetch={onSeedRefetch}
        commentValue={commentValue}
        onChangeComment={onChangeComment}
        onSubmitComment={onSubmitComment}
        isCommentPending={isCommentPending}
      />
    );
  }

  if (sessionItem) {
    return <FeedRandomSessionDetailCard item={sessionItem} />;
  }

  return postType === "DIARY" ? (
    <FeedDiaryDetailCard postId={postId} />
  ) : (
    <FeedAvatarDetailCard postId={postId} />
  );
}
