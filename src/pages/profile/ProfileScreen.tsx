import { useMemo, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { AxiosError } from "axios";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import HomeToast from "@/components/home/HomeToast";
import ProfileGardenScene from "@/components/profile/ProfileGardenScene";
import { useFriendWater, useUserProfile } from "@/hooks/profile/useProfileApi";
import { useFollowUser, useUnfollowUser } from "@/hooks/follow/useFollowApi";
import useTokenStore from "@/stores/useTokenStore";
import { FollowStatus } from "@/types/profile/profileApi.type";

type Props = RootStackScreenProps<"Profile">;

const FRIEND_WATER_ACTION_COOLDOWN_MS = 700;

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
  const [wateringGardenId, setWateringGardenId] = useState<number | null>(null);
  const [isFriendWaterCooldownActive, setIsFriendWaterCooldownActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isMe = String(userId) === myUserId;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Feed" });
  };

  const handleOpenGuestbook = () => {
    navigation.navigate("Guestbook", {
      userId,
      userNickname: data?.userNickname,
    });
  };

  const handleFriendWater = async (gardenId: number) => {
    try {
      await waterMutation.mutateAsync(gardenId);

      // Show a short overlay and toast so the success state is obvious.
      setWateringGardenId(gardenId);
      setToastMessage("\uce5c\uad6c \uc815\uc6d0\uc5d0 \ubb3c\uc744 \uc8fc\uc5c8\uc2b5\ub2c8\ub2e4.");
      setTimeout(() => {
        setWateringGardenId(prev => (prev === gardenId ? null : prev));
      }, 1000);
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      setToastMessage(
        axiosError.response?.data?.message ?? "\uce5c\uad6c \ubb3c\uc8fc\uae30\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4."
      );
    }
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

  const renderProfileHeader = () => (
    <SafeAreaView pointerEvents="box-none" style={styles.headerSafeArea} edges={["top"]}>
      {/* 한글 주석:
          프로필 화면의 상단은 방명록 화면과 톤을 맞춘 박스형 헤더로 분리해서,
          뒤로가기/프로필/친구추가 역할이 정원 씬 위에 명확하게 보이도록 정리한다. */}
      <View style={styles.headerCard}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.headerSideButton}>
          <Text style={styles.headerBackText}>뒤로</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>프로필</Text>

        <View style={styles.headerActionWrap}>
          {followAction ? (
            <TouchableOpacity
              onPress={followAction.onPress}
              disabled={followAction.pending}
              activeOpacity={0.7}
              style={styles.followButton}
            >
              <Text style={styles.followButtonText}>
                {followAction.pending ? "처리 중..." : followAction.label}
              </Text>
            </TouchableOpacity>
          ) : isMe ? (
            <Text style={styles.selfBadgeText}>내 프로필</Text>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );

  if (scenes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {renderProfileHeader()}
        <SafeAreaView style={styles.emptyScrollSafeArea} edges={["bottom"]}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.emptyScrollContent}>
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
            </View>

            <View style={styles.emptyGardenWrap}>
              <Text style={styles.emptyGardenTitle}>정원 정보가 없습니다.</Text>
              <Text style={styles.emptyGardenDescription}>
                현재 API 기준으로 표시할 정원 데이터가 없어 기본 정보만 표시합니다.
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
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
              isMe={isMe}
              leftWaterCountForOthers={data.leftWaterCountForOthers}
              isWateringVisible={wateringGardenId === scene.garden.gardenId}
              onWater={() => void handleFriendWater(scene.garden.gardenId)}
              onPressGuestbook={handleOpenGuestbook}
              waterDisabled={waterMutation.isPending || isFriendWaterCooldownActive}
            />
          </View>
        ))}
      </PagerView>

      {renderProfileHeader()}

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

      {toastMessage ? (
        <HomeToast message={toastMessage} onClose={() => setToastMessage(null)} />
      ) : null}
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
  headerSafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.96)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerSideButton: {
    width: 56,
    minHeight: 44,
    justifyContent: "center",
  },
  headerBackText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerActionWrap: {
    minWidth: 72,
    alignItems: "flex-end",
  },
  followButton: {
    borderRadius: 12,
    backgroundColor: "#E9F6EA",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  followButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2F7D32",
  },
  selfBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  overlaySafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  pagination: {
    marginTop: 86,
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
  emptyScrollSafeArea: {
    flex: 1,
  },
  emptyScrollContent: {
    paddingTop: 104,
    paddingBottom: 28,
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
