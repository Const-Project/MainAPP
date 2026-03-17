import React from "react";
import {
  RefreshControl,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";

import { UserPlusIcon } from "@/assets/icons/CommonIcons";
import StatusView from "@/components/common/StatusView";
import FeedList from "@/components/feed/FeedList";
import { useFeed } from "@/hooks/feed/useFeedApi";

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

  // API 결과가 null/빈 배열이면 빈 배열로 대체
  const dataForRender = result && result.length > 0 ? result : [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header spacing is tuned to match the centered title layout from the FE design. */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerTextButton}
          onPress={() => void refetch()}
          activeOpacity={0.7}
          disabled={isLoading || isRefetching}
        >
          <Text style={[styles.headerTextButtonLabel, (isLoading || isRefetching) && styles.headerTextButtonDisabled]}>
            새로고침
          </Text>
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
              onRefresh={() => void refetch()}
              tintColor="#7DC960"
            />
          }
        >
          {/* 한글 주석:
              피드 메인에서는 빈 상태와 로딩 상태를 리스트 컴포넌트가 맡고,
              네트워크 재시도는 상단 버튼과 pull-to-refresh 둘 다 열어 둔다. */}
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
  headerTextButton: {
    minWidth: 56,
    justifyContent: "center",
  },
  headerTextButtonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTextButtonDisabled: {
    color: "#9CA3AF",
  },
  headerButton: {
    width: 24,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
});
