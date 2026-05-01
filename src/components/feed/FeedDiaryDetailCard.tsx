import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import FeedDetail from "@/components/feed/FeedDetail";
import usePostComment, { useDeleteComment } from "@/hooks/comments/useCommentApi";
import useFeedLikeToggle from "@/hooks/feed/useFeedLikeToggle";
import { useCreateReport } from "@/hooks/report/useReportApi";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";
import type { FeedDetailResult } from "@/types/feed/detail";
import { removeReportedFeedCache } from "@/utils/feed/removeReportedFeedCache";

type Props = {
  postId: number;
};

export default function FeedDiaryDetailCard({ postId }: Props) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useDiaryDetail(postId);
  const [content, setContent] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const { mutateAsync, isPending } = usePostComment(() => void refetch());
  const deleteCommentMutation = useDeleteComment(() => void refetch());
  const reportMutation = useCreateReport();
  const { liked, likeCount, toggleLike, isLikePending } = useFeedLikeToggle({
    targetId: postId,
    targetType: "DIARY",
    initialLiked: data?.isLiked ?? false,
    initialLikeCount: data?.likeCount ?? 0,
    onSuccessRefetch: refetch,
  });

  const handleSendComment = async (commentText: string) => {
    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      return;
    }

    try {
      await mutateAsync({ content: trimmedComment, targetId: postId, targetType: "DIARY" });
      setContent("");
    } catch (commentError) {
      console.error("[FeedDiaryDetailCard] Failed to post comment:", commentError);
    }
  };

  const handleReportPost = async () => {
    try {
      await reportMutation.mutateAsync({
        targetType: "DIARY",
        targetId: postId,
        reason: "부적절한 콘텐츠",
        additionalComment: "",
      });
      removeReportedFeedCache(queryClient, {
        postId,
        postType: "DIARY",
        writerId: data?.writerId,
      });
      setIsHidden(true);
      Alert.alert("신고 완료", "신고가 접수되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("신고 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
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
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await deleteCommentMutation.mutateAsync({ commentId, targetType: "DIARY", targetId: postId });
      Alert.alert("삭제 완료", "댓글이 삭제되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("삭제 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.statusCard}>
        <ActivityIndicator color="#7DC960" />
        <Text style={styles.statusText}>일기 상세를 불러오는 중입니다.</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.statusCard}>
        <Text style={styles.statusText}>일기 상세를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  if (isHidden) {
    return (
      <View style={styles.statusCard}>
        <Text style={styles.hiddenTitle}>신고한 일기입니다.</Text>
        <Text style={styles.statusText}>이 항목은 나에게 숨김 처리되었습니다.</Text>
      </View>
    );
  }

  const result: FeedDetailResult = {
    id: data.id,
    writerId: data.writerId,
    writerName: data.writerName,
    profileImageUrl: data.profileImageUrl,
    content: data.content,
    imageUrl: data.imageUrl,
    isLiked: data.isLiked,
    likeCount: data.likeCount,
    commentCount: data.commentCount,
    comments: data.comments,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    isPublic: data.isPublic,
  };

  return (
    <FeedDetail
      result={result}
      reportTargetLabel="일기"
      liked={liked}
      likeCount={likeCount}
      onToggleLike={toggleLike}
      isLikePending={isLikePending}
      commentValue={content}
      onChangeComment={setContent}
      onSubmitComment={handleSendComment}
      isCommentPending={isPending}
      onPressReport={handleReportPost}
      onPressCommentReport={handleReportComment}
      onPressCommentDelete={handleDeleteComment}
      isReportPending={reportMutation.isPending || deleteCommentMutation.isPending}
    />
  );
}

const styles = StyleSheet.create({
  statusCard: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: "center",
    gap: 12,
  },
  statusText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  hiddenTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },
});
