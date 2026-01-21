import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import type { CommentItem } from "@/types/log/diary";

type Props = {
  comment: CommentItem;
};

export default function Comment({ comment }: Props) {
  return (
    <View style={styles.container}>
      {/* 프로필 이미지 */}
      <View style={styles.profileContainer}>
        <View style={styles.profileImageWrapper}>
          {comment.profileImageUrl ? (
            <Image
              source={{ uri: comment.profileImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
        </View>
      </View>

      {/* 댓글 내용 */}
      <View style={styles.contentContainer}>
        <View style={styles.writerRow}>
          <Text style={styles.writerName}>{comment.writer}</Text>
        </View>

        {/* 댓글 내용 */}
        <Text style={styles.commentContent}>{comment.content}</Text>
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
  commentContent: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 20,
  },
});
