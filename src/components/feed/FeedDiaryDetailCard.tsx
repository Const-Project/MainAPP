import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FeedDetail from "@/components/feed/FeedDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = {
  postId: number;
};

export default function FeedDiaryDetailCard({ postId }: Props) {
  const { data, isLoading, error, refetch } = useDiaryDetail(postId);
  const [content, setContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => void refetch());

  const handleSendComment = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await mutateAsync({ content, targetId: postId, targetType: "DIARY" });
      setContent("");
    } catch (commentError) {
      console.error(
        "[FeedDiaryDetailCard] Failed to post comment:",
        commentError
      );
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
      commentValue={content}
      onChangeComment={setContent}
      onSubmitComment={() => void handleSendComment()}
      isCommentPending={isPending}
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
  },
});
