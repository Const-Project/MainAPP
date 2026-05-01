import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useMemo, useState } from "react";
import FeedDetail from "@/components/feed/FeedDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import useFeedLikeToggle from "@/hooks/feed/useFeedLikeToggle";
import { useCreateReport } from "@/hooks/report/useReportApi";
import type { FeedComment, FeedDetailResult } from "@/types/feed/detail";
import type { RandomFeedSessionItem } from "@/types/feed/randomFeedApi.type";
import { removeReportedFeedCache } from "@/utils/feed/removeReportedFeedCache";

type Props = {
  item: RandomFeedSessionItem;
};

const getReportTargetLabel = (postType: RandomFeedSessionItem["postType"]) =>
  postType === "DIARY" ? "일기" : "게시물";

export default function FeedRandomSessionDetailCard({ item }: Props) {
  const queryClient = useQueryClient();
  const reportMutation = useCreateReport();
  const [content, setContent] = useState("");
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [commentCount, setCommentCount] = useState(item.commentCount);
  const [isHidden, setIsHidden] = useState(false);
  const { mutateAsync, isPending } = usePostComment();
  const targetLabel = getReportTargetLabel(item.postType);

  const result = useMemo<FeedDetailResult>(() => {
    const body =
      item.postType === "DIARY"
        ? [item.title, item.content].filter(Boolean).join("\n\n")
        : item.caption ?? "";

    return {
      id: item.postId,
      writerId: item.author.userId,
      writerName: item.author.username,
      profileImageUrl: item.author.profileImageUrl,
      content: body,
      imageUrl: item.imageUrl ?? "",
      isLiked: false,
      likeCount: item.likeCount,
      commentCount,
      comments,
      createdAt: item.createdAt,
      updatedAt: item.createdAt,
      isPublic: true,
    };
  }, [commentCount, comments, item]);

  const { liked, likeCount, toggleLike, isLikePending } = useFeedLikeToggle({
    targetId: item.postId,
    targetType: item.postType,
    initialLiked: false,
    initialLikeCount: item.likeCount,
  });

  const handleSendComment = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      const response = await mutateAsync({
        content,
        targetId: item.postId,
        targetType: item.postType,
      });
      const createdComment = response.result;
      setComments(previous => [
        ...previous,
        {
          commentId: createdComment.commentId ?? createdComment.id,
          writerId: createdComment.writerId,
          profileImageUrl: createdComment.profileImageUrl ?? null,
          writer: createdComment.writer,
          content: createdComment.content,
        },
      ]);
      setCommentCount(previous => previous + 1);
      setContent("");
    } catch (commentError) {
      console.error("[FeedRandomSessionDetailCard] Failed to post comment:", commentError);
    }
  };

  const handleReportPost = async () => {
    try {
      await reportMutation.mutateAsync({
        targetType: item.postType,
        targetId: item.postId,
        reason: "부적절한 콘텐츠",
        additionalComment: "",
      });
      removeReportedFeedCache(queryClient, {
        postId: item.postId,
        postType: item.postType,
        writerId: item.author.userId,
      });
      setIsHidden(true);
      Alert.alert("신고 완료", "신고가 접수되었습니다.");
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      Alert.alert("신고 실패", axiosError.response?.data?.message ?? "잠시 후 다시 시도해주세요.");
    }
  };

  if (isHidden) {
    return (
      <View style={styles.hiddenCard}>
        <Text style={styles.hiddenTitle}>신고한 {targetLabel}입니다.</Text>
        <Text style={styles.hiddenDescription}>이 항목은 나에게 숨김 처리되었습니다.</Text>
      </View>
    );
  }

  return (
    <FeedDetail
      result={result}
      reportTargetLabel={targetLabel}
      liked={liked}
      likeCount={likeCount}
      onToggleLike={toggleLike}
      isLikePending={isLikePending}
      commentValue={content}
      onChangeComment={setContent}
      onSubmitComment={() => void handleSendComment()}
      isCommentPending={isPending}
      onPressReport={handleReportPost}
      isReportPending={reportMutation.isPending}
    />
  );
}

const styles = StyleSheet.create({
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
