import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import FeedDetail from "@/components/feed/FeedDetail";
import useFeedLikeToggle from "@/hooks/feed/useFeedLikeToggle";
import { useDeleteComment } from "@/hooks/comments/useCommentApi";
import { useCreateReport } from "@/hooks/report/useReportApi";
import type { FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedPostType } from "@/types/feed/randomFeedApi.type";
import { removeReportedFeedCache } from "@/utils/feed/removeReportedFeedCache";

type Props = {
  result: FeedDetailResult;
  postType: RandomFeedPostType;
  onRefetch: () => void | Promise<unknown>;
  commentValue: string;
  onChangeComment: (value: string) => void;
  onSubmitComment: () => void;
  isCommentPending: boolean;
};

const getReportTargetLabel = (postType: RandomFeedPostType) =>
  postType === "DIARY" ? "일기" : "게시물";

export default function FeedSeedDetailCard({
  result,
  postType,
  onRefetch,
  commentValue,
  onChangeComment,
  onSubmitComment,
  isCommentPending,
}: Props) {
  const queryClient = useQueryClient();
  const reportMutation = useCreateReport();
  const deleteCommentMutation = useDeleteComment(() => void onRefetch());
  const [isHidden, setIsHidden] = useState(false);
  const { liked, likeCount, toggleLike, isLikePending } = useFeedLikeToggle({
    targetId: result.id,
    targetType: postType,
    initialLiked: result.isLiked,
    initialLikeCount: result.likeCount,
    onSuccessRefetch: onRefetch,
  });

  const handleReportPost = async () => {
    try {
      await reportMutation.mutateAsync({
        targetType: postType,
        targetId: result.id,
        reason: "부적절한 콘텐츠",
        additionalComment: "",
      });
      removeReportedFeedCache(queryClient, {
        postId: result.id,
        postType,
        writerId: result.writerId,
      });
      setIsHidden(true);
      Alert.alert("신고 완료", "신고가 접수되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("신고 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
      throw error;
    }
  };

  const handleReportComment = async (commentId: number) => {
    try {
      await reportMutation.mutateAsync({
        targetType: "COMMENT",
        targetId: commentId,
        reason: "부적절한 댓글",
        additionalComment: "",
      });
      Alert.alert("신고 완료", "신고가 접수되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("신고 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId, targetType: postType, targetId: result.id });
      Alert.alert("삭제 완료", "댓글이 삭제되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("삭제 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
      throw error;
    }
  };

  if (isHidden) {
    return (
      <View style={styles.hiddenCard}>
        <Text style={styles.hiddenTitle}>신고한 {getReportTargetLabel(postType)}입니다.</Text>
        <Text style={styles.hiddenDescription}>이 항목은 나에게 숨김 처리되었습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FeedDetail
        result={result}
        reportTargetLabel={getReportTargetLabel(postType)}
        liked={liked}
        likeCount={likeCount}
        onToggleLike={toggleLike}
        isLikePending={isLikePending}
        commentValue={commentValue}
        onChangeComment={onChangeComment}
        onSubmitComment={onSubmitComment}
        isCommentPending={isCommentPending}
        onPressReport={handleReportPost}
        onPressCommentReport={handleReportComment}
        onPressCommentDelete={handleDeleteComment}
        isReportPending={reportMutation.isPending || deleteCommentMutation.isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
  },
  hiddenCard: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
    gap: 6,
  },
  hiddenTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },
  hiddenDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
});
