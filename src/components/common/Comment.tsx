import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import type { CommentItem } from "@/types/log/diary";

type Props = {
  comment: CommentItem;
  actionLabel?: string;
  onActionPress?: () => void;
  actionDisabled?: boolean;
  onAuthorPress?: () => void;
};

export default function Comment({
  comment,
  actionLabel,
  onActionPress,
  actionDisabled = false,
  onAuthorPress,
}: Props) {
  const writer = comment.writer?.trim() || "익명";
  const content = comment.content?.trim() || "내용을 불러오지 못했습니다.";
  const AuthorWrap = onAuthorPress ? TouchableOpacity : View;

  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <AuthorWrap
          {...(onAuthorPress ? { activeOpacity: 0.75, onPress: onAuthorPress } : {})}
          style={styles.profileImageWrapper}
        >
          {comment.profileImageUrl ? (
            <Image
              source={{ uri: comment.profileImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
        </AuthorWrap>
      </View>

      {/* 댓글 내용 */}
      <View style={styles.contentContainer}>
        <View style={styles.writerRow}>
          <AuthorWrap
            {...(onAuthorPress ? { activeOpacity: 0.75, onPress: onAuthorPress } : {})}
          >
            <Text style={styles.writerName}>{writer}</Text>
          </AuthorWrap>
          {actionLabel && onActionPress ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onActionPress}
              disabled={actionDisabled}
            >
              <Text style={[styles.reportText, actionDisabled ? styles.reportTextDisabled : null]}>
                {actionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* 댓글 내용 */}
        <Text style={styles.commentContent}>{content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    gap: 8,
  },
  profileContainer: {
    flexShrink: 0,
  },
  profileImageWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  profilePlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  writerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  writerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  reportText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  reportTextDisabled: {
    color: "#9CA3AF",
  },
  commentContent: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 20,
  },
});
