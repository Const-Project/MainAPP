import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from "react-native";
import type { FeedPost } from "@/types/feed/feedApi.type";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3;
const SKELETON_COUNT = 12;

type Props = {
  posts: FeedPost[];
  onSelectPost?: (postId: number, postType: string) => void;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  error?: unknown;
};

function SkeletonGrid() {
  return (
    <View style={styles.skeletonGrid}>
      {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <View key={i} style={styles.skeletonCell} />
      ))}
    </View>
  );
}

type FeedGridItemProps = {
  item: FeedPost;
  onSelectPost?: (postId: number, postType: string) => void;
};

const FeedGridItem = memo(function FeedGridItem({ item, onSelectPost }: FeedGridItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <TouchableOpacity
      style={styles.gridItem}
      onPress={() => onSelectPost?.(item.postId, item.postType)}
      activeOpacity={0.8}
    >
      {!imageLoaded ? <View style={styles.imagePlaceholder} /> : null}
      <Image
        source={{ uri: item.imageUrl }}
        style={[styles.image, !imageLoaded && styles.imageLoading]}
        resizeMode="cover"
        onLoadEnd={() => setImageLoaded(true)}
      />
    </TouchableOpacity>
  );
});

export default function FeedList({
  posts,
  onSelectPost,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  onRefresh,
  isRefreshing,
  error,
}: Props) {
  if (isLoading) {
    return <SkeletonGrid />;
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>피드를 불러오지 못했습니다.</Text>
      </View>
    );
  }

  if (!posts.length) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>아직 올라온 게시글이 없습니다.</Text>
        <Text style={styles.emptyDescription}>
          팔로우한 사람들의 게시글이 여기에 표시됩니다.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: FeedPost }) => (
    <FeedGridItem item={item} onSelectPost={onSelectPost} />
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#7DC960" />
      </View>
    );
  };

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={item => `${item.postType}-${item.postId}`}
      numColumns={3}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) onLoadMore();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      initialNumToRender={9}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={50}
      windowSize={7}
      removeClippedSubviews={Platform.OS === "android"}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  skeletonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skeletonCell: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: "#E5E7EB",
    padding: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#171717",
    textAlign: "center",
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
    padding: 3,
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    margin: 3,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  imageLoading: {
    opacity: 0,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
