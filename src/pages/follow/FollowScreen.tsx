import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import UserCard from "@/components/follow/UserCard";
import {
  useFollowers,
  useFollowing,
  useUnfollowUser,
} from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";

type Props = RootStackScreenProps<"Follow">;
type Tab = "following" | "followers";

export default function FollowScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("following");
  const userId = useTokenStore(state => state.userId);
  const followingQuery = useFollowing(userId);
  const followersQuery = useFollowers(userId);
  const unfollowMutation = useUnfollowUser(userId);

  const isLoading =
    activeTab === "following" ? followingQuery.isLoading : followersQuery.isLoading;
  const error = activeTab === "following" ? followingQuery.error : followersQuery.error;
  const users =
    activeTab === "following"
      ? followingQuery.data ?? []
      : followersQuery.data ?? [];

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Feed" });
  };

  const handleRetry = () => {
    if (activeTab === "following") {
      void followingQuery.refetch();
      return;
    }

    void followersQuery.refetch();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenHeader title="내 친구" onBack={handleBack} />

      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "following" && styles.tabButtonActive]}
          onPress={() => setActiveTab("following")}
        >
          <Text
            style={[styles.tabText, activeTab === "following" && styles.tabTextActive]}
          >
            내가 추가한
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "followers" && styles.tabButtonActive]}
          onPress={() => setActiveTab("followers")}
        >
          <Text
            style={[styles.tabText, activeTab === "followers" && styles.tabTextActive]}
          >
            나를 추가한
          </Text>
        </TouchableOpacity>
      </View>

      {!userId ? (
        <StatusView
          title="사용자 식별 정보가 없습니다."
          description="로그인 상태를 다시 확인해야 팔로우 목록을 조회할 수 있습니다."
        />
      ) : isLoading ? (
        <StatusView title="팔로우 목록을 불러오는 중입니다." loading />
      ) : error ? (
        <StatusView
          title="팔로우 목록을 불러오지 못했습니다."
          description="현재 MainBE의 팔로우 목록 응답을 다시 확인해야 합니다."
          actionLabel="다시 시도"
          onAction={handleRetry}
        />
      ) : users.length === 0 ? (
        <StatusView
          title={activeTab === "following" ? "추가한 친구가 없습니다." : "나를 추가한 친구가 없습니다."}
          description="팔로우 데이터가 준비되면 이 화면에서 바로 목록을 볼 수 있습니다."
        />
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {users.map(user => (
            <UserCard
              key={user.userId}
              user={user}
              onPress={() => navigation.navigate("Profile", { userId: user.userId })}
              actionLabel={activeTab === "following" ? "삭제" : undefined}
              actionDisabled={unfollowMutation.isPending}
              onActionPress={
                activeTab === "following"
                  ? () => void unfollowMutation.mutateAsync(user.userId)
                  : undefined
              }
            />
          ))}
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
  tabRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: "#171717",
    fontWeight: "700",
  },
  list: {
    flex: 1,
  },
});
