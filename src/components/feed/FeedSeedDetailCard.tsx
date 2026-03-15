import { StyleSheet, View } from "react-native";
import CommentComposer from "@/components/common/CommentComposer";
import FeedDetail from "@/components/feed/FeedDetail";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = {
  result: FeedDetailResult;
  commentValue: string;
  onChangeComment: (value: string) => void;
  onSubmitComment: () => void;
  isCommentPending: boolean;
};

export default function FeedSeedDetailCard({
  result,
  commentValue,
  onChangeComment,
  onSubmitComment,
  isCommentPending,
}: Props) {
  return (
    <View style={styles.container}>
      {/* 한글 주석:
          사용자가 둘러보기에서 처음 선택한 포스트는 항상 첫 카드로 고정하고,
          기존 상세 댓글 작성 UX도 이 카드 안에서만 유지한다. */}
      <FeedDetail result={result} />
      <View style={styles.composerWrapper}>
        <CommentComposer
          value={commentValue}
          onChangeText={onChangeComment}
          onSubmit={onSubmitComment}
          disabled={isCommentPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  composerWrapper: {
    marginTop: 4,
  },
});
