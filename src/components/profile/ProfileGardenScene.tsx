import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { GardenInfo } from "@/types/profile/profileApi.type";
import WaterIcon from "@/assets/icons/water.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const mailboxImage = require("@/assets/images/profile/letterbox.png");
const wateringImage = require("@/assets/images/background/watering.png");
const dropImage = require("@/assets/images/profile/drop.png");
const ACTION_RAIL_BOTTOM_OFFSET = 128;
const MAX_WATER_COUNT = 3;

type Props = {
  background: any;
  garden: GardenInfo;
  isMe: boolean;
  leftWaterCountForOthers: number;
  isWateringVisible: boolean;
  onWater: () => void;
  onPressGuestbook: () => void;
  waterDisabled?: boolean;
};

export default function ProfileGardenScene({
  background,
  garden,
  isMe,
  leftWaterCountForOthers,
  isWateringVisible,
  onWater,
  onPressGuestbook,
  waterDisabled = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const canWater = !isMe && garden.isWateringAbleByMe && !waterDisabled;
  const topOverlayOffset = insets.top + 144;

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.sceneBackground}>
      <View style={styles.sceneShade} />

      {garden.avatarInfo?.avatarName ? (
        <Text style={[styles.scenePlantName, { top: topOverlayOffset }]}>
          {garden.avatarInfo.avatarName}
        </Text>
      ) : null}

      {!isMe ? (
        <View style={[styles.waterCountBadge, { top: topOverlayOffset }]}>
          <Image source={dropImage} style={styles.waterDropIcon} resizeMode="contain" />
          <Text style={styles.waterCountText}>{leftWaterCountForOthers}/{MAX_WATER_COUNT}</Text>
        </View>
      ) : null}

      <View style={styles.sceneBody}>
        {garden.avatarInfo?.avatarImageUrl ? (
          <>
            <Image
              source={{ uri: garden.avatarInfo.avatarImageUrl }}
              style={styles.avatarImage}
              resizeMode="contain"
            />
            <Image
              source={wateringImage}
              style={[styles.wateringImage, !isWateringVisible && styles.wateringImageHidden]}
              resizeMode="contain"
            />
          </>
        ) : (
          <View style={styles.emptyAvatarBubble}>
            <Text style={styles.emptyAvatarTitle}>정원 정보가 준비되지 않았습니다.</Text>
            <Text style={styles.emptyAvatarBody}>
              현재 프로필 API 기준으로 표시할 식물 이미지가 없습니다.
            </Text>
          </View>
        )}

        {!isMe ? (
          <View pointerEvents="none" style={styles.mailboxWrap}>
            {/* 한글 주석:
                타인 프로필의 우편함은 홈의 비둘기처럼 식물 우하단에 붙는 장식 요소로만 두고,
                실제 방명록 진입은 하단 버튼에서 처리한다. */}
            <Image source={mailboxImage} style={styles.mailboxImage} resizeMode="contain" />
          </View>
        ) : null}
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

      {!isMe ? (
        <View style={[styles.guestbookWrap, { paddingBottom: insets.bottom + 16 }]}>
          {/* 한글 주석:
              타인 프로필의 방명록 버튼은 별도 전체 화면 방명록 페이지로 이동시키고,
              목록 확인과 새 글 작성은 그 화면에서 처리한다. */}
          <TouchableOpacity style={styles.guestbookButton} activeOpacity={0.85} onPress={onPressGuestbook}>
            <Text style={styles.guestbookButtonText}>방명록 작성</Text>
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
  waterCountBadge: {
    position: "absolute",
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    zIndex: 3,
  },
  scenePlantName: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "600",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    zIndex: 3,
  },
  waterDropIcon: {
    width: 18,
    height: 18,
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
    paddingTop: 340,
    paddingBottom: -32,
    position: "relative",
  },
  avatarImage: {
    width: 300,
    height: 300,
  },
  wateringImage: {
    position: "absolute",
    left: "24%",
    bottom: 196,
    width: 118,
    height: 118,
  },
  wateringImageHidden: {
    opacity: 0,
  },
  mailboxWrap: {
    position: "absolute",
    right: 48,
    bottom: 18,
    zIndex: 2,
  },
  mailboxImage: {
    width: 84,
    height: 84,
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
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  actionButtonDisabled: {
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  guestbookWrap: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  guestbookButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#7DC960",
    alignItems: "center",
    justifyContent: "center",
  },
  guestbookButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3AB40B",
  },
});
