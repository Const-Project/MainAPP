import { StyleSheet, View } from "react-native";
import FeedDetail from "@/components/feed/FeedDetail";
import useFeedLikeToggle from "@/hooks/feed/useFeedLikeToggle";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType } from "@/types/feed/randomFeedApi.type";

type Props = {
  result: FeedDetailResult;
  postType: RandomFeedPostType;
  onRefetch: () => void | Promise<unknown>;
  commentValue: string;
  onChangeComment: (value: string) => void;
  onSubmitComment: () => void;
  isCommentPending: boolean;
};

export default function FeedSeedDetailCard({
  result,
  postType,
  onRefetch,
  commentValue,
  onChangeComment,
  onSubmitComment,
  isCommentPending,
}: Props) {
  const { liked, likeCount, toggleLike, isLikePending } = useFeedLikeToggle({
    targetId: result.id,
    targetType: postType,
    initialLiked: result.isLiked,
    initialLikeCount: result.likeCount,
    onSuccessRefetch: onRefetch,
  });

  return (
    <View style={styles.container}>
      {/* 한글 주석:
          사용자가 둘러보기에서 처음 선택한 포스트는 항상 첫 카드로 고정하고,
          기존 상세 댓글 작성 UX도 댓글 시트 안에서만 유지한다. */}
      <FeedDetail
        result={result}
        liked={liked}
        likeCount={likeCount}
        onToggleLike={toggleLike}
        isLikePending={isLikePending}
        commentValue={commentValue}
        onChangeComment={onChangeComment}
        onSubmitComment={onSubmitComment}
        isCommentPending={isCommentPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
});
