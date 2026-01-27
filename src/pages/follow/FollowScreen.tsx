import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";

import { LeftIcon } from "@/assets/icons/CommonIcons";
import UserCard from "@/components/follow/UserCard";
import { useFollowers, useFollowing } from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";

type Props = RootStackScreenProps<"Follow">;
type Tab = "added" | "followed";

export default function FollowScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("added");
  const userId = useTokenStore(state => state.userId);

  const {
    data: following,
    isLoading: loadingFollowing,
    error: errorFollowing,
    refetch: refetchFollowing,
  } = useFollowing(userId);

  const {
    data: followers,
    isLoading: loadingFollowers,
    error: errorFollowers,
  } = useFollowers(userId);

  const handleBackClick = () => {
    navigation.goBack();
  };

  const handleRemoveUser = () => {
    if (activeTab === "added") {
      refetchFollowing();
    }
  };

  const isLoading = activeTab === "added" ? loadingFollowing : loadingFollowers;
  const error = (activeTab === "added" ? errorFollowing : errorFollowers)
    ? "데이터 로드 실패"
    : null;
  const currentList =
    activeTab === "added" ? (following ?? []) : (followers ?? []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackClick} activeOpacity={0.7}>
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>내 친구</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 탭: 내가 추가한 / 나를 추가한 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "added" && styles.activeTab]}
          onPress={() => setActiveTab("added")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "added" && styles.activeTabText,
            ]}
          >
            내가 추가한
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "followed" && styles.activeTab]}
          onPress={() => setActiveTab("followed")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followed" && styles.activeTabText,
            ]}
          >
            나를 추가한
          </Text>
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 영역 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#7DC960" />
            <Text style={styles.loadingText}>로딩 중...</Text>
          </View>
        ) : error ? (
          <View style={styles.centerContainer}>
            <Text style={styles.errorText}>에러: {error}</Text>
          </View>
        ) : currentList.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>
              {activeTab === "added"
                ? "추가한 친구가 없습니다."
                : "나를 추가한 친구가 없습니다."}
            </Text>
          </View>
        ) : (
          <View>
            {currentList.map(user => (
              <UserCard
                key={user.userId}
                user={user}
                onRemove={handleRemoveUser}
              />
            ))}
          </View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerSpacer: {
    width: 24,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#7DC960",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#171717",
  },
  content: {
    flex: 1,
  },
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
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
});
