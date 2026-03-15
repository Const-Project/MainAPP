import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { GardenInfo } from "@/types/profile/profileApi.type";
import WaterIcon from "@/assets/icons/water.svg";

const ACTION_RAIL_BOTTOM_OFFSET = 128;

type FollowAction = {
  label: string;
  onPress: () => void;
  pending: boolean;
};

type Props = {
  background: any;
  garden: GardenInfo;
  userNickname: string;
  leftWaterCountForOthers: number;
  isMe: boolean;
  followAction: FollowAction | null;
  onBack: () => void;
  onWater: () => void;
  waterDisabled?: boolean;
};

export default function ProfileGardenScene({
  background,
  garden,
  userNickname,
  leftWaterCountForOthers,
  isMe,
  followAction,
  onBack,
  onWater,
  waterDisabled = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const canWater = !isMe && garden.isWateringAbleByMe && !waterDisabled;
  const avatarName = garden.avatarInfo?.avatarName ?? `${userNickname}의 정원`;

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.sceneBackground}>
      <View style={styles.sceneShade} />

      <View style={[styles.sceneHeader, { paddingTop: insets.top + 12 }]}>
        <TouchableOpacity activeOpacity={0.8} onPress={onBack} style={styles.headerSideButton}>
          <Text style={styles.backArrow}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.sceneTitle}>{avatarName}</Text>

        <View style={styles.headerSideButton}>
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
      </View>

      {!isMe ? (
        <View style={[styles.waterCountBadge, { top: insets.top + 16 }]}>
          <WaterIcon width={18} height={18} />
          <Text style={styles.waterCountText}>{leftWaterCountForOthers}회</Text>
        </View>
      ) : null}

      <View style={styles.sceneBody}>
        {garden.avatarInfo?.avatarImageUrl ? (
          <Image
            source={{ uri: garden.avatarInfo.avatarImageUrl }}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.emptyAvatarBubble}>
            <Text style={styles.emptyAvatarTitle}>정원 정보가 준비되지 않았습니다.</Text>
            <Text style={styles.emptyAvatarBody}>
              현재 프로필 API 기준으로 표시할 식물 이미지가 없습니다.
            </Text>
          </View>
        )}
      </View>

      {!isMe ? (
        <View style={[styles.actionRail, { bottom: ACTION_RAIL_BOTTOM_OFFSET + insets.bottom }]}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onWater}
            style={[styles.actionButton, !canWater && styles.actionButtonDisabled]}
            disabled={!canWater}
          >
            <WaterIcon width={60} height={60} opacity={!canWater ? 0.4 : 1} />
          </TouchableOpacity>
        </View>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  sceneBackground: {
    flex: 1,
  },
  sceneShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 20, 10, 0.08)",
  },
  sceneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 2,
  },
  headerSideButton: {
    width: 72,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  backArrow: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sceneTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  followTextButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    textAlign: "center",
  },
  selfBadgeText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
  },
  waterCountBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 3,
  },
  waterCountText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sceneBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  avatarImage: {
    width: 300,
    height: 300,
  },
  emptyAvatarBubble: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 24,
    paddingVertical: 18,
    alignItems: "center",
    gap: 6,
  },
  emptyAvatarTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    textAlign: "center",
  },
  emptyAvatarBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    textAlign: "center",
  },
  actionRail: {
    position: "absolute",
    right: 12,
    zIndex: 3,
    gap: 8,
  },
  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.08)",
  },
});
