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

const mapIcon = require("@/assets/images/map.png");
const emptyGardenImage = require("@/assets/images/null.webp");
const sunlightOverlay = require("@/assets/images/background/sunlight.png");

type Props = {
  background: any;
  slotNumber: number;
  userName?: string | null;
  garden: GardenSummary | null;
  isEmotionAnswered: boolean;
  answeredKind: SurveyAnswerKind | null;
  onPressMap: () => void;
  onPressTracking: () => void;
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
  onPressMap,
  onPressTracking,
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

  const handleActionError = (error: unknown) => {
    const axiosError = error as AxiosError<{ message?: string }>;
    setToastMessage(axiosError.response?.data?.message ?? "홈 상호작용 처리에 실패했습니다.");
  };

  const handleSunlight = async () => {
    if (!gardenId) return;
    if (!canSunlight) {
      setToastMessage("햇빛 주기는 오전 6시에 초기화 됩니다");
      return;
    }

    try {
      await sunlightMutation.mutateAsync(gardenId);
      setCanSunlight(false);
      setIsSunlightVisible(true);
      setTimeout(() => setIsSunlightVisible(false), 1000);
    } catch (error) {
      handleActionError(error);
    }
  };

  const handleWater = async () => {
    if (!gardenId) return;
    if (!canWater) {
      setToastMessage("물 주기는 오전 12시에 초기화 됩니다");
      return;
    }

    try {
      await waterMutation.mutateAsync(gardenId);
      setCanWater(false);
      setIsWateringVisible(true);
      setTimeout(() => setIsWateringVisible(false), 1000);
    } catch (error) {
      handleActionError(error);
    }
  };

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.sceneBackground}>
      <Image
        source={sunlightOverlay}
        resizeMode="cover"
        style={[styles.sunlightOverlay, !isSunlightVisible && styles.sunlightOverlayHidden]}
      />
      <View style={styles.sceneShade} />

      <View style={styles.sceneContent}>
        {/* Slot header follows the FE layout: map affordance, centered slot title, empty spacer. */}
        <View style={styles.sceneHeader}>
          <TouchableOpacity activeOpacity={0.8} onPress={onPressMap} style={styles.mapButton}>
            <Image source={mapIcon} style={styles.mapIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.sceneTitle}>{title ?? `${userName ?? "나풀나풀"}의 정원`}</Text>
          <View style={styles.sceneHeaderSpacer} />
        </View>

        {isLocked ? (
          <View style={styles.lockedOverlay}>
            <Text style={[styles.lockedHeading, isUnlockable && styles.unlockHeading]}>
              {isUnlockable ? "지금 열 수 있어요!" : "아직 해금되지 않았습니다!"}
            </Text>
            <Text style={styles.lockedBody}>
              {isUnlockable
                ? "아래 버튼을 눌러 씨앗을 배송받고,\n새로운 곳에서 식물을 키워보세요."
                : "소망 나무가 충분히 자라면\n새로운 식물을 키울 수 있어요."}
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onPressUnlock}
              style={[styles.unlockButton, !isUnlockable && styles.unlockButtonDisabled]}
            >
              <Text style={styles.unlockButtonText}>
                {isUnlockable ? "씨앗 받고 해금하기!" : "충분하지 않아요"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.sceneBody}>
            {hasAvatar ? (
              <View style={styles.actionRail}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => void handleSunlight()}
                  style={styles.actionButton}
                  disabled={sunlightMutation.isPending}
                >
                  <SunIcon width={64} height={64} opacity={sunlightMutation.isPending ? 0.55 : 1} />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => void handleWater()}
                  style={styles.actionButton}
                  disabled={waterMutation.isPending}
                >
                  <WaterIcon width={64} height={64} opacity={waterMutation.isPending ? 0.55 : 1} />
                </TouchableOpacity>
              </View>
            ) : null}

            {isEmptySlot ? (
              <Pressable onPress={onPressEmpty} style={styles.emptySlotWrap}>
                <View style={styles.emptyBubble}>
                  <Text style={styles.emptyBubbleText}>새로운 식물을{"\n"}심어볼까요?</Text>
                  <Text style={styles.emptyBubblePlus}>+</Text>
                </View>
                <Image source={emptyGardenImage} style={styles.emptyGardenImage} resizeMode="contain" />
              </Pressable>
            ) : (
              <HomeAvatarStage
                avatarImageUrl={garden?.avatar?.avatarImageUrl}
                isWatering={isWateringVisible}
                isEmotionAnswered={isEmotionAnswered}
                answeredKind={answeredKind}
                onPressEmotion={onPressEmotion}
                onPressBird={isEmotionAnswered ? onPressTracking : onPressEmotion}
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
    paddingBottom: 120,
  },
  actionRail: {
    position: "absolute",
    right: 10,
    bottom: 180,
    zIndex: 3,
    gap: 8,
  },
  actionButton: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
  lockedOverlay: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 120,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.68)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    gap: 10,
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
  unlockButton: {
    marginTop: 6,
    borderRadius: 14,
    backgroundColor: "#7DC960",
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  unlockButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  unlockButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  emptySlotWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyBubble: {
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 26,
    paddingVertical: 16,
    alignItems: "center",
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
    width: 300,
    height: 240,
  },
});
