import { useMemo } from "react";
import {
  Image,
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
import ProfileDetail from "@/components/profile/ProfileDetail";
import {
  useFriendWater,
  useUserProfile,
} from "@/hooks/profile/useProfileApi";
import { useFollowUser, useUnfollowUser } from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";
import { FollowStatus } from "@/types/profile/profileApi.type";

type Props = RootStackScreenProps<"Profile">;

export default function ProfileScreen({ navigation, route }: Props) {
  const { userId: myUserId } = useTokenStore();
  const userId = route.params.userId;
  const { data, error, isLoading, refetch } = useUserProfile(userId);
  const waterMutation = useFriendWater(userId);
  const followMutation = useFollowUser(myUserId);
  const unfollowMutation = useUnfollowUser(myUserId);

  const isMe = String(userId) === myUserId;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Feed" });
  };

  const followAction = useMemo(() => {
    if (!data || isMe) return null;

    switch (data.followStatus) {
      case FollowStatus.NOT_FOLLOWING:
        return {
          label: "친구 추가",
          onPress: () => void followMutation.mutateAsync(userId),
          pending: followMutation.isPending,
        };
      case FollowStatus.FOLLOW_BACK_POSSIBLE:
        return {
          label: "맞팔로우",
          onPress: () => void followMutation.mutateAsync(userId),
          pending: followMutation.isPending,
        };
      case FollowStatus.FOLLOWING:
        return {
          label: "언팔로우",
          onPress: () => void unfollowMutation.mutateAsync(userId),
          pending: unfollowMutation.isPending,
        };
      default:
        return null;
    }
  }, [data, followMutation, unfollowMutation, userId, isMe]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="프로필" onBack={handleBack} />
        <StatusView title="프로필을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="프로필" onBack={handleBack} />
        <StatusView
          title="프로필을 불러오지 못했습니다."
          description="현재 MainBE의 사용자 조회 응답을 다시 확인해야 합니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <ScreenHeader title="프로필" onBack={handleBack} />
        <StatusView
          title="프로필 정보가 없습니다."
          description="현재 API에서 반환된 사용자 데이터가 비어 있습니다."
          actionLabel="뒤로가기"
          onAction={handleBack}
        />
      </SafeAreaView>
    );
  }

  const primaryGarden = data.userGardens[0];

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScreenHeader title="프로필" onBack={handleBack} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.profileImageWrap}>
              {data.profileImageUrl ? (
                <Image
                  source={{ uri: data.profileImageUrl }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <View style={styles.summaryTextWrap}>
              <Text style={styles.nickname}>{data.userNickname}</Text>
              <Text style={styles.metaText}>
                남은 친구 물주기 {data.leftWaterCountForOthers}회
              </Text>
            </View>
            {followAction ? (
              <TouchableOpacity
                style={styles.followButton}
                onPress={followAction.onPress}
                disabled={followAction.pending}
                activeOpacity={0.85}
              >
                <Text style={styles.followButtonText}>
                  {followAction.pending ? "처리 중..." : followAction.label}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.selfBadge}>
                <Text style={styles.selfBadgeText}>{isMe ? "내 프로필" : ""}</Text>
              </View>
            )}
          </View>
        </View>

        {primaryGarden ? (
          <ProfileDetail
            garden={primaryGarden}
            leftWaterCountForOthers={data.leftWaterCountForOthers}
            onWater={() => void waterMutation.mutateAsync(primaryGarden.gardenId)}
            waterDisabled={waterMutation.isPending}
          />
        ) : (
          <View style={styles.emptyGardenWrap}>
            <Text style={styles.emptyGardenTitle}>정원 정보가 없습니다.</Text>
            <Text style={styles.emptyGardenDescription}>
              현재 API 기준으로 대표 정원 정보가 없어서 기본 정보만 표시합니다.
            </Text>
          </View>
        )}

        <View style={styles.todoCard}>
          <Text style={styles.todoTitle}>이번 단계에서 보류된 항목</Text>
          <Text style={styles.todoText}>
            방명록, 프로필 추가 상호작용, 대표 정원 외 상세 뷰는 API 범위 확인 후 확장합니다.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  summaryCard: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  summaryTextWrap: {
    flex: 1,
    gap: 4,
  },
  nickname: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },
  metaText: {
    fontSize: 13,
    color: "#6B7280",
  },
  followButton: {
    borderRadius: 999,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  selfBadge: {
    minWidth: 64,
    alignItems: "flex-end",
  },
  selfBadgeText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyGardenWrap: {
    paddingHorizontal: 20,
    paddingVertical: 28,
    gap: 6,
  },
  emptyGardenTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  emptyGardenDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  todoCard: {
    margin: 20,
    marginTop: 4,
    borderRadius: 16,
    backgroundColor: "#F8FAF6",
    padding: 16,
    gap: 6,
  },
  todoTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },
  todoText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
});
