import FeedAvatarDetailCard from "@/components/feed/FeedAvatarDetailCard";
import FeedDiaryDetailCard from "@/components/feed/FeedDiaryDetailCard";
import FeedSeedDetailCard from "@/components/feed/FeedSeedDetailCard";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType } from "@/types/feed/randomFeedApi.type";

type Props = {
  postId: number;
  postType: RandomFeedPostType;
  isSeed: boolean;
  seedResult?: FeedDetailResult;
  commentValue?: string;
  onChangeComment?: (value: string) => void;
  onSubmitComment?: () => void;
  isCommentPending?: boolean;
};

export default function FeedInfiniteDetailItem({
  postId,
  postType,
  isSeed,
  seedResult,
  commentValue = "",
  onChangeComment,
  onSubmitComment,
  isCommentPending = false,
}: Props) {
  if (isSeed && seedResult && onChangeComment && onSubmitComment) {
    return (
      <FeedSeedDetailCard
        result={seedResult}
        commentValue={commentValue}
        onChangeComment={onChangeComment}
        onSubmitComment={onSubmitComment}
        isCommentPending={isCommentPending}
      />
    );
  }

  return postType === "DIARY" ? (
    <FeedDiaryDetailCard postId={postId} />
  ) : (
    <FeedAvatarDetailCard postId={postId} />
  );
}
