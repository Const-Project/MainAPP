import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";

import { LeftIcon, SendIcon } from "@/assets/icons/CommonIcons";
import MyDiaryDetail from "@/components/log/MyDiaryDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";

type Props = RootStackScreenProps<"LogDetail">;

export default function LogDetailScreen({ navigation, route }: Props) {
  const { id } = route.params;

  const isValidId = Number.isFinite(id) && id > 0;
  const { data: detail, refetch, isLoading } = useDiaryDetail(isValidId ? id : 0);

  const [content, setContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => refetch());

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleSend = async () => {
    if (!content.trim() || isPending) return;
    await mutateAsync({ content, targetId: id, targetType: "DIARY" });
    setContent("");
  };

  // 잘못된 ID
  if (!isValidId) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>잘못된 일기 ID입니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 로딩 중
  if (isLoading || !detail) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7DC960" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // 데이터 변환
  const diaryDetail = {
    data: {
      id: detail.id,
      title: detail.title,
      content: detail.content,
      imageUrl: detail.imageUrl,
      likeCount: detail.likeCount,
      commentCount: detail.commentCount,
      comment: detail.comments.map(c => ({
        id: c.commentId,
        profileImageUrl: c.profileImageUrl,
        writer: c.writer,
        content: c.content,
      })),
      createdAt: detail.createdAt,
      updatedAt: detail.updatedAt,
      public: detail.isPublic,
    },
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackClick} activeOpacity={0.7}>
            <LeftIcon size={24} color="#171717" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>나의 일기</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* 메인 콘텐츠 */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MyDiaryDetail diaryDetail={diaryDetail} />
        </ScrollView>

        {/* 하단 댓글 입력창 */}
        <View style={styles.commentInputContainer}>
          <View style={styles.commentInputWrapper}>
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
              disabled={isPending || !content.trim()}
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
  keyboardContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  },
  content: {
    flex: 1,
  },
  commentInputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  commentInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  commentInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    fontSize: 14,
    color: "#171717",
  },
});
