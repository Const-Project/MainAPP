import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import CommentComposer from "@/components/common/CommentComposer";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import FeedDetail from "@/components/feed/FeedDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = RootStackScreenProps<"FeedDiary">;

export default function FeedDiaryScreen({ navigation, route }: Props) {
  const { postId } = route.params;

  const id = Number(postId);
  const isValidId = Number.isFinite(id) && id > 0;
  const { data, error, isLoading, refetch } = useDiaryDetail(isValidId ? id : 0);
  const [content, setContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => refetch());

  const handleBackClick = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Feed" });
  };

  const handleSend = async () => {
    if (!isValidId || !content.trim()) return;

    try {
      await mutateAsync({ content, targetId: id, targetType: "DIARY" });
      setContent("");
    } catch (commentError) {
      console.error("[FeedDiaryScreen] Failed to post comment:", commentError);
    }
  };

  if (!isValidId) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="잘못된 게시글입니다."
          description="피드 목록에서 다시 선택해주세요."
          actionLabel="목록으로"
          onAction={handleBackClick}
        />
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView title="게시글을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="게시글을 불러오지 못했습니다."
          description="현재 API 응답을 다시 확인해야 합니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <StatusView
          title="게시글 정보가 없습니다."
          description="현재 API에서 반환된 상세 데이터가 비어 있습니다."
          actionLabel="목록으로"
          onAction={handleBackClick}
        />
      </SafeAreaView>
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
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="둘러보기" onBack={handleBackClick} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <FeedDetail result={result} />
        </ScrollView>
        <CommentComposer
          value={content}
          onChangeText={setContent}
          onSubmit={() => void handleSend()}
          disabled={isPending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
