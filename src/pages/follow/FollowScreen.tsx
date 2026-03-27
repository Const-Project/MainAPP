import { useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { XmarkIcon } from "@/assets/icons/CommonIcons";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import {
  useFollowers,
  useFollowing,
  useUnfollowUser,
} from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";

type Props = RootStackScreenProps<"Follow">;
type Tab = "added" | "followed";

export default function FollowScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("added");
  const userId = useTokenStore(state => state.userId);
  const followingQuery = useFollowing(userId);
  const followersQuery = useFollowers(userId);
  const unfollowMutation = useUnfollowUser(userId);

  const isLoading = activeTab === "added" ? followingQuery.isLoading : followersQuery.isLoading;
  const isRefetching = activeTab === "added"
    ? followingQuery.isRefetching
    : followersQuery.isRefetching;
  const error = activeTab === "added" ? followingQuery.error : followersQuery.error;
  const users =
    activeTab === "added"
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
    if (activeTab === "added") {
      void followingQuery.refetch();
      return;
    }

    void followersQuery.refetch();
  };

  const handleConfirmRemoveFriend = (targetUserId: number) => {
    if (unfollowMutation.isPending) {
      return;
    }

    Alert.alert(
      "친구 삭제하기",
      "사용자를 친구에서 삭제하시겠습니까?\n언제든 다시 추가할 수 있습니다.",
      [
        {
          text: "취소",
          style: "cancel",
        },
        {
          text: "삭제",
          style: "destructive",
          onPress: () => void unfollowMutation.mutateAsync(targetUserId),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenHeader
        title="내 친구"
        onBack={handleBack}
        rightActionLabel="새로고침"
        onRightAction={handleRetry}
        rightActionDisabled={isLoading || isRefetching}
      />

      {/* Tabs are renamed to match the app copy while still mapping to following/follower queries. */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "added" && styles.tabButtonActive]}
          onPress={() => setActiveTab("added")}
        >
          <Text style={[styles.tabText, activeTab === "added" && styles.tabTextActive]}>
            내가 추가한
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "followed" && styles.tabButtonActive]}
          onPress={() => setActiveTab("followed")}
        >
          <Text style={[styles.tabText, activeTab === "followed" && styles.tabTextActive]}>
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
          title={activeTab === "added" ? "추가한 친구가 없습니다." : "나를 추가한 친구가 없습니다."}
          description="팔로우 데이터가 준비되면 이 화면에서 바로 목록을 볼 수 있습니다."
        />
      ) : (
        <ScrollView
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={handleRetry}
              tintColor="#7DC960"
            />
          }
        >
          {/* 한글 주석:
              팔로우 탭은 활성 탭 쿼리만 다시 읽으면 되므로,
              헤더 새로고침과 pull-to-refresh 모두 같은 handleRetry로 묶는다. */}
          {users.map(user => (
            // The custom row matches the FE design more closely than the previous generic card.
            <View key={user.userId} style={styles.userRow}>
              <TouchableOpacity
                style={styles.userInfo}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("Profile", { userId: user.userId })}
              >
                <View style={styles.avatarWrap}>
                  {user.userImageUrl ? (
                    <Image source={{ uri: user.userImageUrl }} style={styles.avatar} />
                  ) : null}
                </View>
                <Text style={styles.username}>{user.username}</Text>
              </TouchableOpacity>
              {activeTab === "added" ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  disabled={unfollowMutation.isPending}
                  onPress={() => handleConfirmRemoveFriend(user.userId)}
                  style={styles.removeButton}
                >
                  <XmarkIcon color={unfollowMutation.isPending ? "#D1D5DB" : "#9CA3AF"} />
                </TouchableOpacity>
              ) : (
                <View style={styles.removeButton} />
              )}
            </View>
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
    marginBottom: 24,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabButtonActive: {
    borderBottomColor: "#7DC960",
  },
  tabText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: "#171717",
    fontWeight: "400",
  },
  list: {
    flex: 1,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  username: {
    fontSize: 15,
    color: "#171717",
  },
  removeButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
