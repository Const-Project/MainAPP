import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import type { FeedResponse, FeedPost } from "@/types/feed/feedApi.type";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3;

type Props = {
  feedData: FeedResponse;
  onSelectPost?: (postId: number, postType: string) => void;
  isLoading?: boolean;
  error?: string | null;
};

export default function FeedList({
  feedData,
  onSelectPost,
  isLoading,
  error,
}: Props) {
  const handlePostClick = (postId: number, postType: string) => {
    onSelectPost?.(postId, postType);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#7DC960" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>에러: {error}</Text>
      </View>
    );
  }

  if (!feedData.result.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>아직 올라온 게시글이 없습니다.</Text>
        <Text style={styles.emptyDescription}>
          피드 데이터가 준비되면 이 화면에서 바로 상세로 이동할 수 있습니다.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FeedPost }) => (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => handlePostClick(item.postId, item.postType)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={feedData.result}
      renderItem={renderItem}
      keyExtractor={item => `${item.postType}-${item.postId}`}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
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
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#171717",
  },
  emptyDescription: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  gridItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: "#F3F4F6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
