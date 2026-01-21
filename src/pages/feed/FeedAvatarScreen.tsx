import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";

import { LeftIcon, SendIcon } from "@/assets/icons/CommonIcons";
import FeedDetail from "@/components/feed/FeedDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useAvatarPostDetail } from "@/hooks/feed/useAvatarPostDetailApi";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = RootStackScreenProps<"FeedAvatar">;

export default function FeedAvatarScreen({ navigation, route }: Props) {
  const { postId } = route.params;

  const id = Number(postId);
  const isValidId = Number.isFinite(id) && id > 0;
  const { data, refetch } = useAvatarPostDetail(isValidId ? id : 0);

  const [content, setContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => refetch());

  const handleBackClick = () => navigation.goBack();

  const handleSend = async () => {
    if (!isValidId || !content.trim()) return;
    await mutateAsync({ content, targetId: id, targetType: "AVATAR_POST" });
    setContent("");
  };

  if (!isValidId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>잘못된 게시글 ID입니다.</Text>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
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
        keyboardVerticalOffset={0}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackClick} activeOpacity={0.7}>
            <LeftIcon size={24} color="#171717" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>둘러보기</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 메인 콘텐츠 */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <FeedDetail result={result} />
        </ScrollView>

        {/* 댓글 입력 */}
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="댓글을 입력해주세요."
              placeholderTextColor="#9CA3AF"
              value={content}
              onChangeText={setContent}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isPending}
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={isPending}
              activeOpacity={0.7}
            >
              <SendIcon size={32} />
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerSpacer: {
    width: 24,
    height: 24,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#171717",
    textAlign: "center",
    marginTop: 20,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    fontSize: 14,
    color: "#171717",
  },
});
