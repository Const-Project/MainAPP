import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  ListRenderItem,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
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
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);

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

  const renderCommentItem: ListRenderItem<(typeof comments)[number]> = ({
    item,
  }) => <Comment comment={item} />;

  const getCommentKey = (item: (typeof comments)[number]) => item.id.toString();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", { userId: result.writerId });
  };

  const handleOpenComments = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleCloseComments = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: React.ComponentProps<typeof BottomSheetBackdrop>) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.28}
        pressBehavior="close"
      />
    ),
    []
  );

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

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={styles.sheetBackground}
        onDismiss={handleCloseComments}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.sheetKeyboard}
        >
          <BottomSheetView style={styles.sheet}>
            <Text style={styles.sheetTitle}>댓글 {result.commentCount}</Text>
            <View style={styles.sheetContent}>
              {comments.length > 0 ? (
                <BottomSheetFlatList<(typeof comments)[number]>
                  data={comments}
                  keyExtractor={getCommentKey}
                  renderItem={renderCommentItem}
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
                    라이브러리 바텀시트로 교체해 드래그와 스냅은 시트가 맡고,
                    입력창은 하단 고정, 댓글 목록은 독립 스크롤 구조를 유지한다. */}
                <CommentComposer
                  value={commentValue}
                  onChangeText={onChangeComment}
                  onSubmit={onSubmitComment}
                  disabled={isCommentPending}
                />
              </View>
            ) : null}
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheetModal>
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
  sheetKeyboard: {
    flex: 1,
  },
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheet: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#D1D5DB",
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    textAlign: "center",
    marginTop: 8,
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
