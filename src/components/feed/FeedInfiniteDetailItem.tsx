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
  onSeedRefetch?: () => void | Promise<unknown>;
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

  return postType === "DIARY" ? (
    <FeedDiaryDetailCard postId={postId} />
  ) : (
    <FeedAvatarDetailCard postId={postId} />
  );
}
