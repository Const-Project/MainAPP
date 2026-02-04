import React, { useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";

import { UserPlusIcon } from "@/assets/icons/CommonIcons";
import { useInfiniteFeed } from "@/hooks/feed/useFeedApi";
import type { RandomFeedItem } from "@/types/feed/feedApi.type";

const { width } = Dimensions.get("window");
const NUM_COLUMNS = 3;
const ITEM_SIZE = width / NUM_COLUMNS;

type Props = MainTabScreenProps<"Feed">;

export default function FeedScreen({ navigation }: Props) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteFeed();

  const handleUserPlusClick = () => {
    navigation.navigate("Follow");
  };

  const handleSelectPost = (postId: number, postType: string) => {
    if (postType === "DIARY") {
      navigation.navigate("FeedDiary", { postId });
    } else {
      navigation.navigate("FeedAvatar", { postId });
    }
  };

  const feedData = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap(page => page.result.items);
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: RandomFeedItem }) => (
      <TouchableOpacity
        style={styles.gridItem}
        onPress={() => handleSelectPost(item.postId, item.postType)}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </TouchableOpacity>
    ),
    []
  );

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#7DC960" />
      </View>
    );
  }, [isFetchingNextPage]);

  const keyExtractor = useCallback(
    (item: RandomFeedItem) => `${item.postType}-${item.postId}`,
    []
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>둘러보기</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7DC960" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>둘러보기</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>피드를 불러오지 못했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>둘러보기</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleUserPlusClick}
          activeOpacity={0.7}
        >
          <UserPlusIcon size={24} color="#171717" />
        </TouchableOpacity>
      </View>

      {/* 무한 스크롤 피드 그리드 */}
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={NUM_COLUMNS}
        showsVerticalScrollIndicator={false}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  headerSpacer: {
    width: 24,
    marginLeft: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerButton: {
    paddingRight: 0,
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
