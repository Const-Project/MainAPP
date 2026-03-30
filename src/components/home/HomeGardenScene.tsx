import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { AxiosError } from "axios";
import HomeAvatarStage from "@/components/home/HomeAvatarStage";
import HomeToast from "@/components/home/HomeToast";
import { useGardenSunlightAction, useGardenWaterAction } from "@/hooks/home/useHomeApi";
import {
  getGardenLocked,
  getGardenUnlockable,
  type GardenSummary,
} from "@/types/home/garden";
import type { SurveyAnswerKind } from "@/types/missions";
import SunIcon from "@/assets/icons/sun.svg";
import WaterIcon from "@/assets/icons/water.svg";
import LockIcon from "@/assets/icons/lock.svg";
import UnlockedIcon from "@/assets/icons/unlocked.svg";
import { createTimingLogger, debugLog } from "@/utils/debug";

const mapIcon = require("@/assets/images/map.png");
const emptyGardenImage = require("@/assets/images/null.webp");
const sunlightOverlay = require("@/assets/images/background/sunlight.png");

const SCENE_BOTTOM_OFFSET = 56;
const EMPTY_SCENE_BOTTOM_OFFSET = 124;
const ACTION_RAIL_BOTTOM_OFFSET = 128;
const WATER_ACTION_COOLDOWN_MS = 700;

type Props = {
  background: any;
  slotNumber: number;
  userName?: string | null;
  garden: GardenSummary | null;
  isEmotionAnswered: boolean;
  answeredKind: SurveyAnswerKind | null;
  unreadNotificationCount?: number;
  onPressMap: () => void;
  onPressBird: () => void;
  onPressEmotion: () => void;
  onPressUnlock: () => void;
  onPressEmpty: () => void;
};

export default function HomeGardenScene({
  background,
  slotNumber,
  userName,
  garden,
  isEmotionAnswered,
  answeredKind,
  unreadNotificationCount = 0,
  onPressMap,
  onPressBird,
  onPressEmotion,
  onPressUnlock,
  onPressEmpty,
}: Props) {
  const sunlightMutation = useGardenSunlightAction();
  const waterMutation = useGardenWaterAction();
  const [isSunlightVisible, setIsSunlightVisible] = useState(false);
  const [isWateringVisible, setIsWateringVisible] = useState(false);
  const [canSunlight, setCanSunlight] = useState(Boolean(garden?.ownerSunlightAble));
  const [canWater, setCanWater] = useState(Boolean(garden?.ownerWateringAble));
  const [isWaterCooldownActive, setIsWaterCooldownActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setCanSunlight(Boolean(garden?.ownerSunlightAble));
    setCanWater(Boolean(garden?.ownerWateringAble));
  }, [garden?.ownerSunlightAble, garden?.ownerWateringAble]);

  const isLocked = garden ? getGardenLocked(garden) : false;
  const isUnlockable = garden ? getGardenUnlockable(garden) : false;
  const hasAvatar = Boolean(garden?.avatar?.avatarImageUrl);
  const isEmptySlot = !isLocked && !hasAvatar;
  const title = hasAvatar ? garden?.avatar?.avatarName : `텃밭 ${slotNumber}`;
  const gardenId = garden?.gardenId;
  const LockStatusIcon = isUnlockable ? UnlockedIcon : LockIcon;

  const handleActionError = (action: "sunlight" | "water", error: unknown) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message;

    debugLog("HomeGardenScene", `${action} action failed`, {
      gardenId,
      slotNumber,
      status: status ?? null,
      serverMessage: serverMessage ?? null,
    });
    setToastMessage(serverMessage ?? "홈 상호작용 처리에 실패했습니다.");
  };

  const handleSunlight = async () => {
    if (!gardenId) return;
    if (!canSunlight || sunlightMutation.isPending) {
      if (!canSunlight) {
        setToastMessage("햇빛 주기는 오전 6시에 초기화 됩니다");
      }
      return;
    }

    const finishActionTiming = createTimingLogger("HomeGardenScene", "sunlight action", {
      gardenId,
      slotNumber,
    });

    setCanSunlight(false);
    setIsSunlightVisible(true);
    setTimeout(() => setIsSunlightVisible(false), 1000);

    try {
      await sunlightMutation.mutateAsync(gardenId);
      finishActionTiming({ startedImmediately: true });
    } catch (error) {
      setCanSunlight(true);
      setIsSunlightVisible(false);
      finishActionTiming({
        startedImmediately: true,
        rolledBack: true,
      });
      handleActionError("sunlight", error);
    }
  };

  const handleWater = async () => {
    if (!gardenId) return;
    if (!canWater || waterMutation.isPending || isWaterCooldownActive) {
      if (!canWater) {
        setToastMessage("물 주기는 오전 12시에 초기화 됩니다");
      }
      return;
    }

    const finishActionTiming = createTimingLogger("HomeGardenScene", "water action", {
      gardenId,
      slotNumber,
    });

    setCanWater(false);
    setIsWaterCooldownActive(true);
    setIsWateringVisible(true);
    setTimeout(() => setIsWateringVisible(false), 1000);
    setTimeout(() => setIsWaterCooldownActive(false), WATER_ACTION_COOLDOWN_MS);

    try {
      await waterMutation.mutateAsync(gardenId);
      finishActionTiming({ startedImmediately: true });
    } catch (error) {
      setCanWater(true);
      setIsWateringVisible(false);
      setIsWaterCooldownActive(false);
      finishActionTiming({
        startedImmediately: true,
        rolledBack: true,
      });
      handleActionError("water", error);
    }
  };

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.sceneBackground}>
      {isLocked ? <Image source={background} resizeMode="cover" blurRadius={18} style={styles.lockedBackgroundBlur} /> : null}

      <Image
        source={sunlightOverlay}
        resizeMode="cover"
        style={[styles.sunlightOverlay, !isSunlightVisible && styles.sunlightOverlayHidden]}
      />
      <View style={styles.sceneShade} />
      {isLocked ? <View style={styles.lockedScreenFog} /> : null}

      <View style={styles.sceneContent}>
        <View style={styles.sceneHeader}>
          <TouchableOpacity activeOpacity={0.8} onPress={onPressMap} style={styles.mapButton}>
            <Image source={mapIcon} style={styles.mapIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.sceneTitle}>{title ?? `${userName ?? "나풀나풀"}의 정원`}</Text>
          <View style={styles.sceneHeaderSpacer} />
        </View>

        {isLocked ? (
          <View style={styles.lockedSceneBody}>
            <View style={styles.lockedOverlay}>
              <LockStatusIcon
                width={isUnlockable ? 52 : 40}
                height={isUnlockable ? 52 : 44}
                style={styles.lockStatusIcon}
              />
              <Text style={[styles.lockedHeading, isUnlockable && styles.unlockHeading]}>
                {isUnlockable ? "지금 열 수 있어요" : "해금되지 않았습니다"}
              </Text>
              <Text style={styles.lockedBody}>
                {isUnlockable
                  ? "씨앗을 받아 새로운 텃밭을 열 수 있어요."
                  : "소망 나무가 충분히 자라면 새로운 텃밭을 열 수 있어요."}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={isUnlockable ? 0.9 : 1}
              onPress={isUnlockable ? onPressUnlock : undefined}
              disabled={!isUnlockable}
              style={[
                styles.lockedFooterButton,
                isUnlockable ? styles.lockedFooterButtonActive : styles.lockedFooterButtonDisabled,
              ]}
            >
              <Text style={styles.lockedFooterButtonText}>
                {isUnlockable ? "씨앗 받고 해금하기" : "아직 감자가 충분히 모이지 않았어요"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.sceneBody, isEmptySlot ? styles.emptySceneBody : null]}>
            {hasAvatar ? (
              <View style={styles.actionRail}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => void handleSunlight()}
                  style={styles.actionButton}
                  disabled={sunlightMutation.isPending}
                >
                  <SunIcon width={60} height={60} opacity={sunlightMutation.isPending ? 0.55 : 1} style={{ marginTop: 2, marginLeft: 1 }} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => void handleWater()}
                  style={styles.actionButton}
                  disabled={waterMutation.isPending || isWaterCooldownActive}
                >
                  <WaterIcon
                    width={60}
                    height={60}
                    opacity={waterMutation.isPending || isWaterCooldownActive ? 0.55 : 1}
                  />
                </TouchableOpacity>
              </View>
            ) : null}

            {isEmptySlot ? (
              <Pressable onPress={onPressEmpty} style={styles.emptySlotWrap}>
                <View style={styles.emptyBubbleWrap}>
                  <View style={styles.emptyBubble}>
                    <Text style={styles.emptyBubbleText}>새로운 식물을{"\n"}심어볼까요?</Text>
                    <Text style={styles.emptyBubblePlus}>+</Text>
                  </View>
                  <View style={styles.emptyBubbleTail} />
                </View>
                <Image source={emptyGardenImage} style={styles.emptyGardenImage} resizeMode="contain" />
              </Pressable>
            ) : (
              <HomeAvatarStage
                avatarImageUrl={garden?.avatar?.avatarImageUrl}
                isWatering={isWateringVisible}
                isEmotionAnswered={isEmotionAnswered}
                answeredKind={answeredKind}
                unreadNotificationCount={unreadNotificationCount}
                onPressEmotion={onPressEmotion}
                onPressBird={onPressBird}
              />
            )}
          </View>
        )}
      </View>

      {toastMessage ? <HomeToast message={toastMessage} onClose={() => setToastMessage(null)} /> : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  sceneBackground: {
    flex: 1,
  },
  lockedBackgroundBlur: {
    ...StyleSheet.absoluteFillObject,
  },
  sunlightOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 1,
  },
  sunlightOverlayHidden: {
    opacity: 0,
  },
  sceneShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(8, 20, 10, 0.08)",
  },
  lockedScreenFog: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(242, 246, 241, 0.58)",
  },
  sceneContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  sceneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    zIndex: 2,
  },
  mapButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  mapIcon: {
    width: 48,
    height: 48,
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
  sceneHeaderSpacer: {
    width: 48,
    height: 48,
  },
  sceneBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: SCENE_BOTTOM_OFFSET,
  },
  emptySceneBody: {
    justifyContent: "flex-end",
    paddingBottom: EMPTY_SCENE_BOTTOM_OFFSET,
  },
  lockedSceneBody: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 28,
    zIndex: 2,
  },
  actionRail: {
    position: "absolute",
    right: 12,
    bottom: ACTION_RAIL_BOTTOM_OFFSET,
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
  lockedOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 10,
  },
  lockStatusIcon: {
    marginBottom: 6,
  },
  lockedHeading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#D64545",
    textAlign: "center",
  },
  unlockHeading: {
    color: "#59A647",
  },
  lockedBody: {
    fontSize: 15,
    lineHeight: 22,
    color: "#171717",
    textAlign: "center",
  },
  lockedFooterButton: {
    width: "100%",
    minHeight: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  lockedFooterButtonActive: {
    backgroundColor: "#59A647",
  },
  lockedFooterButtonDisabled: {
    backgroundColor: "#BFC6BC",
  },
  lockedFooterButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  emptySlotWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBubbleWrap: {
    alignItems: "center",
    marginBottom: -64,
  },
  emptyBubble: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 26,
    paddingVertical: 16,
    alignItems: "center",
  },
  emptyBubbleTail: {
    width: 18,
    height: 18,
    marginTop: -9,
    backgroundColor: "rgba(255,255,255,0.95)",
    transform: [{ rotate: "45deg" }],
    borderBottomRightRadius: 4,
  },
  emptyBubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#171717",
    textAlign: "center",
  },
  emptyBubblePlus: {
    marginTop: 6,
    fontSize: 28,
    lineHeight: 30,
    color: "#7DC960",
    fontWeight: "700",
  },
  emptyGardenImage: {
    width: 360,
    height: 288,
  },
});
