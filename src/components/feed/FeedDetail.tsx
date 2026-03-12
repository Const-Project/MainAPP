import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { HeartIcon, ChatIcon } from "@/assets/icons/CommonIcons";
import Comment from "@/components/common/Comment";
import type { FeedDetailResult } from "@/types/feed/detail";

type Props = {
  result: FeedDetailResult;
};

export default function FeedDetail({ result }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", { userId: result.writerId });
  };

  return (
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
          <View style={styles.actionItem}>
            <ChatIcon size={20} color="#6B7280" />
            <Text style={styles.actionText}>댓글 {result.commentCount}</Text>
          </View>
        </View>
        <View style={styles.spacer} />
      </View>

      {/* 댓글 목록 */}
      <View style={styles.commentsContainer}>
        {result.comments.length > 0 ? (
          result.comments.map(c => (
            <Comment
              key={c.commentId}
              comment={{
                id: c.commentId,
                profileImageUrl: c.profileImageUrl,
                writer: c.writer,
                content: c.content,
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
  commentsContainer: {
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
