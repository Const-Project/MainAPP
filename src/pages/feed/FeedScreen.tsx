import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";

import { UserPlusIcon } from "@/assets/icons/CommonIcons";
import FeedList from "@/components/feed/FeedList";
import { useFeed } from "@/hooks/feed/useFeedApi";

type Props = MainTabScreenProps<"Feed">;

export default function FeedScreen({ navigation }: Props) {
  const { data: result, isLoading, error } = useFeed();

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

  // API 결과가 null/빈 배열이면 빈 배열로 대체
  const dataForRender = result && result.length > 0 ? result : [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header spacing is tuned to match the centered title layout from the FE design. */}
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

      {/* Feed content remains unchanged; only the surrounding layout was tightened. */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <FeedList
          feedData={{ result: dataForRender }}
          onSelectPost={handleSelectPost}
          isLoading={isLoading}
          error={error ? "피드를 불러오지 못했습니다." : null}
        />
      </ScrollView>
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
  headerSpacer: {
    width: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerButton: {
    width: 24,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
});
