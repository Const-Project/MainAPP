import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ChatIcon, EditIcon, HeartIcon } from "@/assets/icons/CommonIcons";
import Comment from "@/components/common/Comment";
import type { GETDiaryDetailResponse } from "@/types/log/diaryDetailApi.type";

type Props = {
  detail: GETDiaryDetailResponse;
  onEdit?: () => void;
};

export default function MyDiaryDetail({ detail, onEdit }: Props) {
  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.date}>{formatDate(detail.createdAt)}</Text>
      <Text style={styles.title}>{detail.title}</Text>

      {detail.imageUrl ? (
        <Image
          source={{ uri: detail.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : null}

      <Text style={styles.content}>{detail.content}</Text>

      <View style={styles.actionBar}>
        <View style={styles.actionItems}>
          <View style={styles.actionItem}>
            <HeartIcon size={20} color="#6B7280" filled={detail.isLiked} />
            <Text style={styles.actionText}>공감 {detail.likeCount}</Text>
          </View>
          <View style={styles.actionItem}>
            <ChatIcon size={20} color="#6B7280" />
            <Text style={styles.actionText}>댓글 {detail.commentCount}</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={onEdit}
          disabled={!onEdit}
          style={styles.editItem}
        >
          <EditIcon size={18} color="#6B7280" />
          <Text style={styles.editText}>수정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.commentSection}>
        {detail.comments.length > 0 ? (
          detail.comments.map(comment => (
            <Comment
              key={comment.commentId}
              comment={{
                id: comment.commentId,
                writerId: comment.writerId,
                profileImageUrl: comment.profileImageUrl,
                writer: comment.writer?.trim() || "익명",
                content: comment.content ?? "",
              }}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>아직 작성된 댓글이 없습니다.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  date: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#F3F4F6",
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: "#171717",
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
  editItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  editText: {
    fontSize: 12,
    color: "#6B7280",
  },
  commentSection: {
    paddingVertical: 16,
    marginHorizontal: -20,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 24,
  },
});
