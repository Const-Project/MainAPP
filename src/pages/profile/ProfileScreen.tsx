import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import ProfileGardenScene from "@/components/profile/ProfileGardenScene";
import { useFriendWater, useUserProfile } from "@/hooks/profile/useProfileApi";
import { useFollowUser, useUnfollowUser } from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";
import { FollowStatus } from "@/types/profile/profileApi.type";

type Props = RootStackScreenProps<"Profile">;

const backgrounds = [
  require("@/assets/images/background/background1.webp"),
  require("@/assets/images/background/background2.webp"),
  require("@/assets/images/background/background3.png"),
  require("@/assets/images/background/background4.webp"),
] as const;

export default function ProfileScreen({ navigation, route }: Props) {
  const { userId: myUserId } = useTokenStore();
  const userId = route.params.userId;
  const { data, error, isLoading, refetch } = useUserProfile(userId);
  const waterMutation = useFriendWater(userId);
  const followMutation = useFollowUser(myUserId);
  const unfollowMutation = useUnfollowUser(myUserId);
  const [currentPage, setCurrentPage] = useState(0);

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
        <StatusView title="프로필을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
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
        <StatusView
          title="프로필 정보가 없습니다."
          description="현재 API에서 반환된 사용자 데이터가 비어 있습니다."
          actionLabel="뒤로가기"
          onAction={handleBack}
        />
      </SafeAreaView>
    );
  }

  const scenes = data.userGardens.map((garden, index) => ({
    key: `profile-garden-${garden.gardenId}`,
    background: backgrounds[index % backgrounds.length],
    garden,
  }));

  if (scenes.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer} edges={["top", "bottom"]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.emptyHeader}>
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
              <Text style={styles.emptyBackText}>뒤로가기</Text>
            </TouchableOpacity>
          </View>

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
            <Text style={styles.nickname}>{data.userNickname}</Text>
            {followAction ? (
              <TouchableOpacity
                onPress={followAction.onPress}
                disabled={followAction.pending}
                activeOpacity={0.7}
              >
                <Text style={styles.followTextButton}>
                  {followAction.pending ? "처리 중..." : followAction.label}
                </Text>
              </TouchableOpacity>
            ) : isMe ? (
              <Text style={styles.selfBadgeText}>내 프로필</Text>
            ) : null}
          </View>

          <View style={styles.emptyGardenWrap}>
            <Text style={styles.emptyGardenTitle}>정원 정보가 없습니다.</Text>
            <Text style={styles.emptyGardenDescription}>
              현재 API 기준으로 표시할 정원 데이터가 없어 기본 정보만 표시합니다.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.sceneContainer}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={event => setCurrentPage(event.nativeEvent.position)}
      >
        {scenes.map(scene => (
          <View key={scene.key} style={styles.page}>
            {/* 한글 주석:
                타인 프로필은 홈처럼 정원 중심 화면을 쓰되,
                정원 개수는 해금된 userGardens 길이만큼만 페이지를 만든다. */}
            <ProfileGardenScene
              background={scene.background}
              garden={scene.garden}
              userNickname={data.userNickname}
              leftWaterCountForOthers={data.leftWaterCountForOthers}
              isMe={isMe}
              followAction={followAction}
              onBack={handleBack}
              onWater={() => void waterMutation.mutateAsync(scene.garden.gardenId)}
              waterDisabled={waterMutation.isPending}
            />
          </View>
        ))}
      </PagerView>

      <SafeAreaView pointerEvents="box-none" style={styles.overlaySafeArea} edges={["top"]}>
        <View style={styles.pagination}>
          {scenes.map((scene, index) => (
            <View
              key={scene.key}
              style={[
                styles.dot,
                currentPage === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7F0",
  },
  sceneContainer: {
    flex: 1,
    backgroundColor: "#DDE8D6",
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  overlaySafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  pagination: {
    marginTop: 84,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    width: 22,
    backgroundColor: "#FFFFFF",
  },
  dotInactive: {
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  emptyHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyBackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 10,
  },
  profileImageWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  nickname: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  followTextButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
  },
  selfBadgeText: {
    fontSize: 13,
    color: "#9CA3AF",
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
});
