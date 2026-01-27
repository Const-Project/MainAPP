import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { HeartIcon, ChatIcon, EditIcon } from "@/assets/icons/CommonIcons";
import Comment from "@/components/common/Comment";
import type { DiaryDetailResponse } from "@/types/log/diary";

type Props = {
  diaryDetail: DiaryDetailResponse;
};

export default function MyDiaryDetail({ diaryDetail }: Props) {
  const { data } = diaryDetail;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`;
  };

  return (
    <View style={styles.container}>
      {/* 작성 시기 */}
      <Text style={styles.dateText}>{formatDate(data.createdAt)}</Text>

      {/* 제목 */}
      <Text style={styles.title}>{data.title}</Text>

      {/* 이미지 */}
      <Image
        source={{ uri: data.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* 상세 일기 내용 */}
      <Text style={styles.content}>{data.content}</Text>

      {/* 액션 바 */}
      <View style={styles.actionBar}>
        <View style={styles.actionLeft}>
          {/* 공감 */}
          <View style={styles.actionItem}>
            <HeartIcon size={20} color="#6B7280" />
            <Text style={styles.actionText}>공감 {data.likeCount}</Text>
          </View>
          {/* 댓글 */}
          <View style={styles.actionItem}>
            <ChatIcon size={20} color="#6B7280" />
            <Text style={styles.actionText}>댓글 {data.commentCount}</Text>
          </View>
        </View>
        {/* 수정하기 */}
        <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
          <EditIcon size={20} color="#6B7280" />
          <Text style={styles.editText}>수정하기</Text>
        </TouchableOpacity>
      </View>

      {/* 댓글 목록 */}
      <View style={styles.commentSection}>
        {data.comment.map(comment => (
          <Comment
            key={comment.id}
            comment={{
              id: comment.id,
              profileImageUrl: comment.profileImageUrl,
              writer: comment.writer,
              content: comment.content,
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 24,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 24,
  },
  content: {
    fontSize: 14,
    color: "#171717",
    lineHeight: 22,
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
  actionLeft: {
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
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    fontSize: 14,
    color: "#6B7280",
  },
  commentSection: {
    paddingVertical: 16,
    marginHorizontal: -20,
  },
});
