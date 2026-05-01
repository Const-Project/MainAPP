import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import type { RootStackParamList } from "@/navigation/types";

import { HeartIcon, ChatIcon } from "@/assets/icons/CommonIcons";
import Comment from "@/components/common/Comment";
import CommentComposer from "@/components/common/CommentComposer";
import ConfirmModal from "@/components/common/ConfirmModal";
import useTokenStore from "@/stores/useTokenStore";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = {
  result: FeedDetailResult;
  reportTargetLabel?: string;
  liked?: boolean;
  likeCount?: number;
  onToggleLike?: () => void;
  isLikePending?: boolean;
  commentValue?: string;
  onChangeComment?: (text: string) => void;
  onSubmitComment?: (text: string) => Promise<void> | void;
  isCommentPending?: boolean;
  onPressReport?: () => Promise<void> | void;
  onPressCommentReport?: (commentId: number, writer: string) => Promise<void> | void;
  onPressCommentDelete?: (commentId: number) => Promise<void> | void;
  isReportPending?: boolean;
};

type ConfirmModalState = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<ConfirmModalState | void> | ConfirmModalState | void;
};

export default function FeedDetail({
  result,
  reportTargetLabel = "게시물",
  liked = result.isLiked,
  likeCount = result.likeCount,
  onToggleLike,
  isLikePending = false,
  commentValue = "",
  onChangeComment,
  onSubmitComment,
  isCommentPending = false,
  onPressReport,
  onPressCommentReport,
  onPressCommentDelete,
  isReportPending = false,
}: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const myUserId = useTokenStore(state => state.userId);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);
  const [hiddenCommentIds, setHiddenCommentIds] = useState<number[]>([]);
  const [confirmModalState, setConfirmModalState] = useState<ConfirmModalState | null>(null);
  const [isConfirmPending, setIsConfirmPending] = useState(false);
  const [draftComment, setDraftComment] = useState(commentValue);

  const comments = useMemo(
    () =>
      result.comments
        .filter(c => !hiddenCommentIds.includes(c.commentId))
        .map(c => ({
          id: c.commentId,
          writerId: c.writerId,
          profileImageUrl: c.profileImageUrl,
          writer: c.writer?.trim() || "익명",
          content: c.content ?? "",
        })),
    [hiddenCommentIds, result.comments]
  );

  const handleCommentReportPress = async (commentId: number, writer: string) => {
    if (!onPressCommentReport || isReportPending) {
      return;
    }

    setConfirmModalState({
      title: "신고하기",
      description: "댓글을 신고하시겠습니까?\n신고한 댓글은 나에게 숨겨집니다.",
      confirmLabel: "신고하기",
      destructive: true,
      onConfirm: async () => {
        await onPressCommentReport(commentId, writer);
        setHiddenCommentIds(previous =>
          previous.includes(commentId) ? previous : [...previous, commentId]
        );
      },
    });
  };

  const renderCommentItem: ListRenderItem<(typeof comments)[number]> = ({
    item,
  }) => {
    const isOwnComment = Boolean(myUserId && String(item.writerId) === myUserId);

    return (
      <Comment
        comment={item}
        actionLabel={isOwnComment ? "삭제하기" : "신고하기"}
        onActionPress={
          isOwnComment
            ? () => {
                if (!onPressCommentDelete || isReportPending) {
                  return;
                }

                setConfirmModalState({
                  title: "삭제하기",
                  description: "댓글을 삭제하시겠습니까?",
                  confirmLabel: "삭제",
                  destructive: true,
                  onConfirm: async () => {
                    try {
                      await onPressCommentDelete(item.id);
                      setHiddenCommentIds(previous =>
                        previous.includes(item.id) ? previous : [...previous, item.id]
                      );
                    } catch {
                      // Error handling is delegated to the caller.
                    }
                  },
                });
              }
            : onPressCommentReport
              ? () => void handleCommentReportPress(item.id, item.writer)
              : undefined
        }
        actionDisabled={isReportPending}
        onAuthorPress={item.writerId ? () => handleCommentAuthorPress(item.writerId) : undefined}
      />
    );
  };

  const getCommentKey = (item: (typeof comments)[number]) => item.id.toString();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleProfilePress = () => {
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate("Profile", { userId: result.writerId });
  };

  const handleCommentAuthorPress = (writerId?: number | null) => {
    if (!writerId) {
      return;
    }

    bottomSheetModalRef.current?.dismiss();
    requestAnimationFrame(() => {
      navigation.navigate("Profile", { userId: writerId });
    });
  };

  const handleOpenComments = () => {
    bottomSheetModalRef.current?.present();
  };

  const handleReportPress = () => {
    if (!onPressReport || isReportPending) {
      return;
    }

    setConfirmModalState({
      title: "신고하기",
      description: `${reportTargetLabel}을 신고하시겠습니까?\n신고한 ${reportTargetLabel}은 나에게 숨겨집니다.`,
      confirmLabel: "신고하기",
      destructive: true,
      onConfirm: onPressReport,
    });
  };

  const handleConfirmModal = async () => {
    if (!confirmModalState || isConfirmPending) {
      return;
    }

    const activeState = confirmModalState;
    setIsConfirmPending(true);

    try {
      const nextState = await activeState.onConfirm();
      setConfirmModalState(nextState ?? null);
    } finally {
      setIsConfirmPending(false);
    }
  };

  const handleCloseComments = () => {
    bottomSheetModalRef.current?.dismiss();
  };

  const handleChangeComment = useCallback(
    (text: string) => {
      setDraftComment(text);
    },
    []
  );

  const handleSubmitComment = useCallback(async () => {
    if (!draftComment.trim() || isCommentPending) {
      return;
    }

    const submittedComment = draftComment;
    await onSubmitComment?.(submittedComment);
    setDraftComment("");
    onChangeComment?.("");
  }, [draftComment, isCommentPending, onChangeComment, onSubmitComment]);

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

  const renderFooter = useCallback(
    (props: React.ComponentProps<typeof BottomSheetFooter>) => {
      if (!onChangeComment || !onSubmitComment) {
        return null;
      }

      return (
        <BottomSheetFooter {...props} bottomInset={0}>
          <View style={styles.composerContainer}>
            <CommentComposer
              value={draftComment}
              onChangeText={handleChangeComment}
              onSubmit={handleSubmitComment}
              disabled={isCommentPending}
            />
          </View>
        </BottomSheetFooter>
      );
    },
    [draftComment, handleChangeComment, handleSubmitComment, isCommentPending, onChangeComment, onSubmitComment]
  );

  return (
    <>
      <View style={styles.container}>
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
                  resizeMode="contain"
                />
              )}
            </View>
            <View style={styles.writerTextContainer}>
              <Text style={styles.writerName}>{result.writerName}</Text>
              <Text style={styles.createdAt}>{formatDate(result.createdAt)}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReportPress}
            disabled={!onPressReport || isReportPending}
          >
            <Text style={[styles.reportButton, isReportPending ? styles.reportButtonDisabled : null]}>
              {isReportPending ? "신고 중..." : "신고"}
            </Text>
          </TouchableOpacity>
        </View>

        {result.imageUrl ? (
          <Image
            source={{ uri: result.imageUrl }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        ) : null}

        <Text style={styles.content}>{result.content}</Text>

        <View style={styles.actionBar}>
          <View style={styles.actionItems}>
            <TouchableOpacity
              style={styles.actionItem}
              activeOpacity={0.7}
              onPress={onToggleLike}
              disabled={!onToggleLike || isLikePending}
            >
              <HeartIcon
                size={20}
                color={liked ? "#FF5D73" : "#6B7280"}
                filled={liked}
              />
              <Text style={[styles.actionText, liked ? styles.actionTextLiked : null]}>
                공감 {likeCount}
              </Text>
            </TouchableOpacity>
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
        footerComponent={renderFooter}
        handleIndicatorStyle={styles.sheetHandle}
        backgroundStyle={styles.sheetBackground}
        onDismiss={handleCloseComments}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.sheetKeyboard}
        >
          <BottomSheetView style={styles.sheet}>
            <Text style={styles.sheetTitle}>댓글 {comments.length}</Text>
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
          </BottomSheetView>
        </KeyboardAvoidingView>
      </BottomSheetModal>

      <ConfirmModal
        visible={confirmModalState !== null}
        title={confirmModalState?.title ?? ""}
        description={confirmModalState?.description ?? ""}
        confirmLabel={confirmModalState?.confirmLabel ?? "확인"}
        confirmDestructive={confirmModalState?.destructive ?? false}
        confirmDisabled={isConfirmPending || isReportPending}
        onCancel={() => setConfirmModalState(null)}
        onConfirm={() => void handleConfirmModal()}
      />
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
    alignItems: "center",
    justifyContent: "center",
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
  reportButtonDisabled: {
    color: "#9CA3AF",
  },
  mainImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#F3F4F6",
  },
  content: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 20,
    marginBottom: 24,
    backgroundColor: "#F3F4F6",
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
  actionTextLiked: {
    color: "#FF5D73",
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
    width: "100%",
  },
  commentList: {
    flex: 1,
  },
  commentListContent: {
    paddingBottom: 120,
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
    backgroundColor: "#FFFFFF",
  },
});

