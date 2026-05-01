import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import ConfirmModal from "@/components/common/ConfirmModal";
import StatusView from "@/components/common/StatusView";
import HomeToast from "@/components/home/HomeToast";
import ProfileGardenScene from "@/components/profile/ProfileGardenScene";
import ScreenHeader from "@/components/common/ScreenHeader";
import { useUserProfile } from "@/hooks/profile/useProfileApi";
import { useFollowUser } from "@/hooks/follow/useFollowApi";
import { useBlockUser, useUnblockUser } from "@/hooks/block/useBlockApi";
import useTokenStore from "@/stores/useTokenStore";
import { createTimingLogger } from "@/utils/debug";
import { FollowStatus } from "@/types/profile/profileApi.type";

type Props = RootStackScreenProps<"Profile">;

type BlockConfirmState = {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void> | void;
} | null;

const getActionErrorMessage = (
  error: unknown,
  fallbackMessage: string
) => {
  const axiosError = error as { response?: { data?: { message?: string } } };
  return axiosError.response?.data?.message ?? fallbackMessage;
};

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
  const followMutation = useFollowUser(myUserId);
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();
  const [currentPage, setCurrentPage] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isBlockedUser, setIsBlockedUser] = useState(false);
  const [blockConfirmState, setBlockConfirmState] = useState<BlockConfirmState>(null);
  const initialLoadTimingRef = useRef<ReturnType<typeof createTimingLogger> | null>(null);

  const isMe = String(userId) === myUserId;
  const isBlockActionPending = blockMutation.isPending || unblockMutation.isPending;

  useEffect(() => {
    initialLoadTimingRef.current = createTimingLogger("ProfileScreen", "initial profile load", { userId });
  }, [userId]);

  useEffect(() => {
    if (!data || !initialLoadTimingRef.current) {
      return;
    }

    initialLoadTimingRef.current({ gardenCount: data.userGardens.length });
    initialLoadTimingRef.current = null;
  }, [data]);

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

  const handleToggleBlock = () => {
    if (isMe || isBlockActionPending) {
      return;
    }

    if (isBlockedUser) {
      setBlockConfirmState({
        title: "차단 해제",
        description: "이 사용자의 차단을 해제할까요?",
        confirmLabel: "차단 해제",
        onConfirm: async () => {
          try {
            await unblockMutation.mutateAsync(userId);
            setIsBlockedUser(false);
            setToastMessage("사용자 차단을 해제했습니다.");
          } catch (error) {
            Alert.alert("차단 해제 실패", getActionErrorMessage(error, "잠시 후 다시 시도해주세요."));
          }
        },
      });
      return;
    }

    setBlockConfirmState({
      title: "차단",
      description: "이 사용자를 차단할까요?\n서로 팔로우가 해제되고 콘텐츠가 숨겨집니다.",
      confirmLabel: "차단",
      destructive: true,
      onConfirm: async () => {
        try {
          await blockMutation.mutateAsync(userId);
          setIsBlockedUser(true);
          setToastMessage("사용자를 차단했습니다.");
        } catch (error) {
          Alert.alert("차단 실패", getActionErrorMessage(error, "잠시 후 다시 시도해주세요."));
        }
      },
    });
  };

  const handleConfirmBlock = async () => {
    if (!blockConfirmState || isBlockActionPending) {
      return;
    }

    const currentConfirm = blockConfirmState;
    setBlockConfirmState(null);
    await currentConfirm.onConfirm();
  };

  const followAction = useMemo(() => {
    if (!data || isMe || isBlockedUser) {
      return null;
    }

    switch (data.followStatus) {
      case FollowStatus.NOT_FOLLOWING:
        return {
          kind: "button" as const,
          label: "친구 추가",
          onPress: () => void followMutation.mutateAsync(userId),
          pending: followMutation.isPending,
        };
      case FollowStatus.FOLLOW_BACK_POSSIBLE:
        return {
          kind: "button" as const,
          label: "맞팔로우",
          onPress: () => void followMutation.mutateAsync(userId),
          pending: followMutation.isPending,
        };
      case FollowStatus.FOLLOWING:
        return {
          kind: "badge" as const,
          label: "이미 친구",
        };
      default:
        return null;
    }
  }, [data, followMutation, userId, isMe, isBlockedUser]);

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
      <ScreenHeader title="프로필" onBack={handleBack} />
      <View style={styles.userInfoBar}>
        <View style={styles.userInfoLeft}>
          <View style={styles.userAvatarWrap}>
            {data.profileImageUrl ? (
              <Image source={{ uri: data.profileImageUrl }} style={styles.userAvatarImage} resizeMode="cover" />
            ) : null}
          </View>
          <Text style={styles.userNickname}>{data.userNickname}</Text>
        </View>
        <View style={styles.userInfoRight}>
          {followAction ? (
            followAction.kind === "button" ? (
              <TouchableOpacity onPress={followAction.onPress} disabled={followAction.pending} activeOpacity={0.7}>
                <Text style={styles.followText}>
                  {followAction.pending ? "처리 중..." : followAction.label}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.followedText}>{followAction.label}</Text>
            )
          ) : null}
          {!isMe ? (
            <TouchableOpacity onPress={handleToggleBlock} disabled={isBlockActionPending} activeOpacity={0.7}>
              <Text style={[styles.blockText, isBlockedUser && styles.blockActiveText]}>
                {isBlockActionPending ? "처리 중..." : isBlockedUser ? "차단 해제" : "차단"}
              </Text>
            </TouchableOpacity>
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
                  <Image source={{ uri: data.profileImageUrl }} style={styles.profileImage} resizeMode="cover" />
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

            {!isMe ? (
              <View style={styles.emptyGuestbookWrap}>
                <TouchableOpacity
                  style={styles.guestbookButton}
                  onPress={handleOpenGuestbook}
                  activeOpacity={0.8}
                >
                  <Text style={styles.guestbookButtonText}>방명록 작성</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </ScrollView>
        </SafeAreaView>

        <ConfirmModal
          visible={blockConfirmState !== null}
          title={blockConfirmState?.title ?? ""}
          description={blockConfirmState?.description ?? ""}
          confirmLabel={blockConfirmState?.confirmLabel ?? "확인"}
          confirmDestructive={blockConfirmState?.destructive ?? false}
          confirmDisabled={isBlockActionPending}
          onCancel={() => setBlockConfirmState(null)}
          onConfirm={() => void handleConfirmBlock()}
        />
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
            <ProfileGardenScene
              background={scene.background}
              garden={scene.garden}
              isMe={isMe}
              onPressGuestbook={handleOpenGuestbook}
            />
          </View>
        ))}
      </PagerView>

      {renderProfileHeader()}

      <SafeAreaView pointerEvents="box-none" style={styles.overlaySafeArea} edges={["bottom"]}>
        <View style={styles.pagination}>
          {scenes.map((scene, index) => (
            <View
              key={scene.key}
              style={[styles.dot, currentPage === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </SafeAreaView>

      {toastMessage ? <HomeToast message={toastMessage} onClose={() => setToastMessage(null)} /> : null}

      <ConfirmModal
        visible={blockConfirmState !== null}
        title={blockConfirmState?.title ?? ""}
        description={blockConfirmState?.description ?? ""}
        confirmLabel={blockConfirmState?.confirmLabel ?? "확인"}
        confirmDestructive={blockConfirmState?.destructive ?? false}
        confirmDisabled={isBlockActionPending}
        onCancel={() => setBlockConfirmState(null)}
        onConfirm={() => void handleConfirmBlock()}
      />
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
    backgroundColor: "#FFFFFF",
  },
  userInfoBar: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  userInfoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userAvatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  userAvatarImage: {
    width: "100%",
    height: "100%",
  },
  userNickname: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  userInfoRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  followText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#3AB40B",
  },
  followedText: {
    fontSize: 14,
    color: "#BFBFBF",
  },
  blockText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  blockActiveText: {
    color: "#6B7280",
  },
  overlaySafeArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pagination: {
    paddingBottom: 96,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
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
  emptyGuestbookWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  guestbookButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#2F7D32",
    alignItems: "center",
    justifyContent: "center",
  },
  guestbookButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
