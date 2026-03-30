import React, { useCallback } from "react";
import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";

import { UserPlusIcon } from "@/assets/icons/CommonIcons";
import StatusView from "@/components/common/StatusView";
import FeedList from "@/components/feed/FeedList";
import { useFeed } from "@/hooks/feed/useFeedApi";

const refreshIcon = require("../../../assets/refresh-icon.png");

type Props = MainTabScreenProps<"Feed">;

export default function FeedScreen({ navigation }: Props) {
  const { data: result, isLoading, isRefetching, error, refetch } = useFeed();

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

  const handleRefetch = useCallback(() => {
    void refetch();
  }, [refetch]);

  const dataForRender = result && result.length > 0 ? result : [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={handleRefetch}
          activeOpacity={0.7}
          disabled={isLoading || isRefetching}
          accessibilityRole="button"
          accessibilityLabel="새로고침"
        >
          <Image
            source={refreshIcon}
            style={[styles.refreshIcon, (isLoading || isRefetching) && styles.refreshIconDisabled]}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>둘러보기</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleUserPlusClick}
          activeOpacity={0.7}
        >
          <UserPlusIcon size={24} color="#171717" />
        </TouchableOpacity>
      </View>

      {error && !isLoading ? (
        <StatusView
          title="피드를 불러오지 못했습니다."
          description="헤더 새로고침이나 아래 버튼으로 다시 시도해주세요."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      ) : (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={handleRefetch}
              tintColor="#7DC960"
            />
          }
        >
          <FeedList
            feedData={{ result: dataForRender }}
            onSelectPost={handleSelectPost}
            isLoading={isLoading}
            error={null}
          />
        </ScrollView>
      )}
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
    paddingTop: 12,
    paddingRight: 20,
    paddingBottom: 12,
    paddingLeft: 20,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerIconButton: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshIcon: {
    width: 22,
    height: 22,
  },
  refreshIconDisabled: {
    opacity: 0.4,
  },
  headerButton: {
    width: 24,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
});
