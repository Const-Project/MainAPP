import React, { useMemo, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Image,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { HeartIcon, ChatIcon } from "@/assets/icons/CommonIcons";
import Comment from "@/components/common/Comment";
import CommentComposer from "@/components/common/CommentComposer";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = {
  result: FeedDetailResult;
  commentValue?: string;
  onChangeComment?: (text: string) => void;
  onSubmitComment?: () => void;
  isCommentPending?: boolean;
};

export default function FeedDetail({
  result,
  commentValue = "",
  onChangeComment,
  onSubmitComment,
  isCommentPending = false,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isCommentSheetVisible, setCommentSheetVisible] = useState(false);
  const { height: windowHeight } = useWindowDimensions();

  const comments = useMemo(
    () =>
      result.comments.map(c => ({
        id: c.commentId,
        profileImageUrl: c.profileImageUrl,
        writer: c.writer,
        content: c.content,
      })),
    [result.comments]
  );

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", { userId: result.writerId });
  };

  const handleOpenComments = () => {
    setCommentSheetVisible(true);
  };

  const handleCloseComments = () => {
    setCommentSheetVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        {/* 작성자 영역 */}
        <View style={styles.writerRow}>
          <TouchableOpacity
            style={styles.writerInfo}
            onPress={handleProfilePress}
            activeOpacity={0.7}
          >
            <View style={styles.profileImageWrapper}>
              {result.profileImageUrl && (
                <Image
                  source={{ uri: result.profileImageUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              )}
            </View>
            <View style={styles.writerTextContainer}>
              <Text style={styles.writerName}>{result.writerName}</Text>
              <Text style={styles.createdAt}>{formatDate(result.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.reportButton}>신고</Text>
        </View>

        {/* 이미지 */}
        <Image
          source={{ uri: result.imageUrl }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {/* 내용 */}
        <Text style={styles.content}>{result.content}</Text>

        {/* 액션 바 */}
        <View style={styles.actionBar}>
          <View style={styles.actionItems}>
            {/* 공감 */}
            <View style={styles.actionItem}>
              <HeartIcon size={20} color="#6B7280" filled={result.isLiked} />
              <Text style={styles.actionText}>공감 {result.likeCount}</Text>
            </View>
            {/* 댓글 */}
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={handleOpenComments}
            >
              <ChatIcon size={20} color="#6B7280" />
              <Text style={styles.actionText}>댓글 {result.commentCount}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.spacer} />
        </View>
      </View>

      <Modal
        visible={isCommentSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={handleCloseComments}
      >
        <View style={styles.modalRoot}>
          <Pressable style={styles.backdrop} onPress={handleCloseComments} />
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.sheetKeyboard}
          >
            <View
              style={[
                styles.sheet,
                {
                  height: Math.min(windowHeight * 0.6, 560),
                },
              ]}
            >
              <View style={styles.sheetHandle} />
              <Text style={styles.sheetTitle}>댓글 {result.commentCount}</Text>
              <View style={styles.sheetContent}>
                {comments.length > 0 ? (
                  <FlatList
                    data={comments}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => <Comment comment={item} />}
                    style={styles.commentList}
                    contentContainerStyle={styles.commentListContent}
                    showsVerticalScrollIndicator={false}
                  />
                ) : (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>아직 작성된 댓글이 없습니다.</Text>
                  </View>
                )}
              </View>
              {onChangeComment && onSubmitComment ? (
                <View style={styles.composerContainer}>
                  {/* 한글 주석:
                      인스타처럼 댓글 입력창은 시트 하단에 고정하고,
                      위쪽 댓글 목록만 독립적으로 스크롤되게 분리한다. */}
                  <CommentComposer
                    value={commentValue}
                    onChangeText={onChangeComment}
                    onSubmit={onSubmitComment}
                    disabled={isCommentPending}
                  />
                </View>
              ) : null}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  writerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  writerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImageWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  writerTextContainer: {
    flexDirection: "column",
  },
  writerName: {
    fontSize: 14,
    // Match the lighter author text weight from the current FE detail layout.
    fontWeight: "400",
    color: "#171717",
  },
  createdAt: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  reportButton: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  mainImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  content: {
    fontSize: 14,
    color: "#171717",
    // Slightly tighter line height keeps multi-line posts closer to the FE proportions.
    lineHeight: 20,
    marginBottom: 24,
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: -20,
  },
  actionItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#171717",
  },
  spacer: {
    width: 40,
  },
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.28)",
  },
  sheetKeyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetHandle: {
    alignSelf: "center",
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
    marginTop: 10,
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    textAlign: "center",
    marginBottom: 8,
  },
  sheetContent: {
    flex: 1,
  },
  commentList: {
    flex: 1,
  },
  commentListContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  composerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
});
