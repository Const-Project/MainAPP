import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import type { MainTabScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import { RightIcon } from "@/assets/icons/CommonIcons";
import useHomeApi from "@/hooks/home/useHomeApi";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import {
  getGardenLocked,
  getGardenUnlockable,
  getMissionCompleted,
  type GardenSummary,
  type HomeMissionType,
  type TodayMission,
} from "@/types/home/garden";
import { debugLog, debugScreenMounted } from "@/utils/debug";
import { getLevelIcon } from "@/assets/icons/LevelIcons";

type Props = MainTabScreenProps<"Home">;

const backgrounds = [
  require("@/assets/images/background/background1.webp"),
  require("@/assets/images/background/background2.webp"),
  require("@/assets/images/background/background3.png"),
  require("@/assets/images/background/background4.webp"),
] as const;

const mapIcon = require("@/assets/images/map.png");
const plantFallback = require("@/assets/images/plant.png");
const emptyGardenImage = require("@/assets/images/null.webp");

type SceneItem = {
  key: string;
  slotNumber: number;
  background: (typeof backgrounds)[number];
  garden: GardenSummary | null;
};

export default function HomeScreen({ navigation }: Props) {
  const { data, error, isLoading, refetch } = useHomeApi();
  const { user, gardens, missions, hydrate } = useHomeSummaryStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);

  useEffect(() => {
    debugScreenMounted("HomeScreen");
  }, []);

  useEffect(() => {
    debugLog("HomeScreen", "query state changed", {
      isLoading,
      hasData: Boolean(data),
      hasError: Boolean(error),
    });
  }, [data, error, isLoading]);

  useEffect(() => {
    if (data) {
      debugLog("HomeScreen", "hydrate store from home api", {
        missionCount: data.todayMissions?.length ?? 0,
        gardenCount: data.gardenSummaries?.length ?? 0,
      });
      hydrate(data);
    }
  }, [data, hydrate]);

  const userInfo = data?.userInfo ?? user;
  const gardenSummaries = data?.gardenSummaries ?? gardens;
  const todayMissions = data?.todayMissions ?? missions;

  // Home summary payload is normalized into four fixed garden scenes for the pager UI.
  const scenes = useMemo<SceneItem[]>(
    () =>
      backgrounds.map((background, index) => ({
        key: `garden-scene-${index + 1}`,
        slotNumber: index + 1,
        background,
        garden:
          gardenSummaries.find(item => item.gardenSlotNumber === index + 1) ?? null,
      })),
    [gardenSummaries]
  );

  if (isLoading && gardenSummaries.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <StatusView title="홈 정보를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error && gardenSummaries.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={["top"]}>
        <StatusView
          title="홈 요약 API를 아직 사용할 수 없습니다."
          description="현재 홈 데이터를 다시 확인해야 합니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Full-screen garden scenes replace the old list-based home summary layout. */}
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageSelected={event => {
          const position = event.nativeEvent.position;
          setCurrentPage(position);
          void refetch();
        }}
      >
        {scenes.map(scene => (
          <View key={scene.key} style={styles.page}>
            <GardenScene
              background={scene.background}
              slotNumber={scene.slotNumber}
              userName={userInfo?.username}
              garden={scene.garden}
              onPressMap={() => {
                Alert.alert("지도", "지도/트래킹 모달은 다음 단계에서 연결합니다.");
              }}
              onPressSun={() => {
                debugLog("HomeScreen", "Sun action pressed", {
                  slotNumber: scene.slotNumber,
                });
              }}
              onPressWater={() => {
                debugLog("HomeScreen", "Water action pressed", {
                  slotNumber: scene.slotNumber,
                });
              }}
              onPressUnlock={() => navigation.navigate("UnlockGarden")}
              onPressEmpty={() => navigation.navigate("RegistrationAvatar")}
            />
          </View>
        ))}
      </PagerView>

      {/* Pagination stays above the scene while the bottom sheet overlays from below. */}
      <SafeAreaView pointerEvents="box-none" style={styles.overlaySafeArea} edges={["top"]}>
        <View style={styles.pagination}>
          {scenes.map((scene, index) => (
            <View
              key={scene.key}
              style={[styles.dot, currentPage === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </SafeAreaView>

      {/* Mission and wish-tree summary are grouped into a single collapsible bottom sheet. */}
      <HomeBottomSheet
        expanded={isSheetExpanded}
        onToggle={() => setIsSheetExpanded(prev => !prev)}
        missions={todayMissions}
        currentExp={userInfo?.currentExp ?? 0}
        requiredExp={userInfo?.requiredExpForNextLevel ?? 100}
        currentLevel={userInfo?.level ?? 0}
        onPressLog={() => navigation.navigate("Log")}
        onPressFeed={() => navigation.navigate("Feed")}
        onPressUnlockGarden={() => navigation.navigate("UnlockGarden")}
        onPressMission={mission => {
          const routeName = getMissionRouteName(mission);
          if (routeName) {
            navigation.navigate(routeName);
          }
        }}
        onPressEmotionCheck={() => {
          Alert.alert("마음 건강 체크", "감정 체크 모달은 다음 단계에서 연결합니다.");
        }}
      />
    </View>
  );
}

function GardenScene({
  background,
  slotNumber,
  userName,
  garden,
  onPressMap,
  onPressSun,
  onPressWater,
  onPressUnlock,
  onPressEmpty,
}: {
  background: (typeof backgrounds)[number];
  slotNumber: number;
  userName?: string | null;
  garden: GardenSummary | null;
  onPressMap: () => void;
  onPressSun: () => void;
  onPressWater: () => void;
  onPressUnlock: () => void;
  onPressEmpty: () => void;
}) {
  const isLocked = garden ? getGardenLocked(garden) : false;
  const isUnlockable = garden ? getGardenUnlockable(garden) : false;
  const hasAvatar = Boolean(garden?.avatar?.avatarImageUrl);
  const isEmptySlot = !isLocked && !hasAvatar;
  const slotTitle = garden?.avatar?.avatarName ?? `${userName ?? "나풀나풀"}의 정원`;

  return (
    <ImageBackground source={background} resizeMode="cover" style={styles.sceneBackground}>
      <View style={styles.sceneShade} />
      <SafeAreaView style={styles.sceneContent} edges={["top"]}>
        {/* Scene header keeps map affordance and slot title aligned across every garden page. */}
        <View style={styles.sceneHeader}>
          <TouchableOpacity activeOpacity={0.8} onPress={onPressMap} style={styles.mapButton}>
            <Image source={mapIcon} style={styles.mapIcon} resizeMode="contain" />
          </TouchableOpacity>
          <Text style={styles.sceneTitle}>
            {hasAvatar ? slotTitle : `텃밭 ${slotNumber}`}
          </Text>
          <View style={styles.sceneHeaderSpacer} />
        </View>

        {isLocked ? (
          // Locked slots share a common CTA until unlock flow is connected to richer state.
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
              style={[
                styles.unlockButton,
                !isUnlockable && styles.unlockButtonDisabled,
              ]}
            >
              <Text style={styles.unlockButtonText}>
                {isUnlockable ? "씨앗 받고 해금하기!" : "충분하지 않아요"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Unlocked slots either expose the empty-state registration CTA or the current avatar stage.
          <View style={styles.sceneBody}>
            <View style={styles.actionRail}>
              <ActionOrb label="햇빛" onPress={onPressSun} />
              <ActionOrb label="물" onPress={onPressWater} />
            </View>

            {isEmptySlot ? (
              <Pressable onPress={onPressEmpty} style={styles.emptySlotWrap}>
                <View style={styles.emptyBubble}>
                  <Text style={styles.emptyBubbleText}>새로운 식물을{"\n"}심어볼까요?</Text>
                  <Text style={styles.emptyBubblePlus}>+</Text>
                </View>
                <Image source={emptyGardenImage} style={styles.emptyGardenImage} resizeMode="contain" />
              </Pressable>
            ) : (
              <View style={styles.avatarStage}>
                <View style={styles.characterBubble}>
                  <Text style={styles.characterBubbleText}>
                    오늘도 만나서 정말 반가워요!
                  </Text>
                </View>
                <Image
                  source={{
                    uri: garden?.avatar?.avatarImageUrl,
                  }}
                  defaultSource={plantFallback}
                  style={styles.avatarImage}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

function ActionOrb({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.actionOrb}>
      <Text style={styles.actionOrbText}>{label}</Text>
    </TouchableOpacity>
  );
}

function QuickLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.quickLink}>
      <Text style={styles.quickLinkText}>{label}</Text>
    </TouchableOpacity>
  );
}

function HomeBottomSheet({
  expanded,
  onToggle,
  missions,
  currentExp,
  requiredExp,
  currentLevel,
  onPressLog,
  onPressFeed,
  onPressUnlockGarden,
  onPressMission,
  onPressEmotionCheck,
}: {
  expanded: boolean;
  onToggle: () => void;
  missions: TodayMission[];
  currentExp: number;
  requiredExp: number;
  currentLevel: number;
  onPressLog: () => void;
  onPressFeed: () => void;
  onPressUnlockGarden: () => void;
  onPressMission: (mission: TodayMission) => void;
  onPressEmotionCheck: () => void;
}) {
  const progressPercent = requiredExp > 0 ? Math.min(100, Math.round((currentExp / requiredExp) * 100)) : 0;
  const LevelIcon = getLevelIcon(Math.max(0, Math.min(3, currentLevel)));
  const checkingMission = missions.find(mission => mission.missionType === "CHECKING");
  const diaryMission = missions.find(mission => mission.missionType === "DIARY");
  const quizMission = missions.find(mission => mission.missionType === "QUIZ");

  // The sheet is rendered from mission-type contracts so missing items degrade gracefully.
  const missionCards: Array<{
    key: string;
    label: string;
    mission?: TodayMission;
    onPress: () => void;
  }> = [
    {
      key: "checking",
      label: "마음 건강 체크",
      mission: checkingMission,
      onPress: onPressEmotionCheck,
    },
    {
      key: "diary",
      label: "일기 쓰기",
      mission: diaryMission,
      onPress: () => diaryMission && onPressMission(diaryMission),
    },
    {
      key: "quiz",
      label: "퀴즈 풀기",
      mission: quizMission,
      onPress: () => quizMission && onPressMission(quizMission),
    },
  ];

  return (
    <View style={[styles.sheetWrap, expanded ? styles.sheetWrapExpanded : styles.sheetWrapCollapsed]}>
      <View style={styles.sheet}>
        <TouchableOpacity activeOpacity={0.8} onPress={onToggle} style={styles.sheetHandleButton}>
          <View style={styles.sheetHandle} />
        </TouchableOpacity>

        <View style={styles.sheetContent}>
          <View style={styles.sheetHeaderRow}>
            <Text style={styles.sheetTitle}>오늘의 미션</Text>
            <View style={styles.sheetChecks}>
              {missionCards.map(card => (
                <MissionStatusDot
                  key={card.key}
                  checked={card.mission ? getMissionCompleted(card.mission) : false}
                />
              ))}
            </View>
          </View>

          <View style={styles.sheetMissionList}>
            {missionCards.map(card => {
              const checked = card.mission ? getMissionCompleted(card.mission) : false;
              return (
                <TouchableOpacity
                  key={card.key}
                  activeOpacity={0.8}
                  onPress={card.onPress}
                  style={[
                    styles.sheetMissionCard,
                    checked && styles.sheetMissionCardDone,
                  ]}
                >
                  <Text
                    style={[
                      styles.sheetMissionLabel,
                      checked && styles.sheetMissionLabelDone,
                    ]}
                  >
                    {card.label}
                  </Text>
                  {checked ? (
                    <MissionStatusDot checked />
                  ) : (
                    <RightIcon size={22} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {expanded ? (
            <>
              <View style={styles.sheetDivider} />

              <View style={styles.wishHeader}>
                <View style={styles.wishTitleRow}>
                  <LevelIcon size={30} />
                  <Text style={styles.wishTitle}>소망 나무</Text>
                </View>
                <Text style={styles.wishBody}>
                  {progressPercent >= 100
                    ? "지금 바로 새로운 텃밭을 열 수 있어요!"
                    : `소망 나무 다음 성장까지 ${100 - progressPercent}%가 남았어요!`}
                </Text>
              </View>

              <View style={styles.wishStageRow}>
                <Text style={styles.wishCurrent}>LV.{currentLevel}</Text>
                <Text style={styles.wishNext}>LV.{currentLevel + 1}</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
              </View>

              <View style={styles.quickLinksRow}>
                <QuickLink label="키움일지" onPress={onPressLog} />
                <QuickLink label="둘러보기" onPress={onPressFeed} />
                <QuickLink label="텃밭 해금" onPress={onPressUnlockGarden} />
              </View>
            </>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function MissionStatusDot({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.statusDot, checked ? styles.statusDotChecked : styles.statusDotUnchecked]}>
      {checked ? <Text style={styles.statusDotCheck}>✓</Text> : null}
    </View>
  );
}

function getMissionRouteName(mission: TodayMission) {
  switch (mission.missionType as HomeMissionType) {
    case "DIARY":
      return "DailyMissionWriteDiary" as const;
    case "QUIZ":
      return "DailyMissionQuizMultipleChoice" as const;
    case "CHECKING":
      return "DailyMissionChecking" as const;
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DDE8D6",
  },
  pager: {
    flex: 1,
  },
  page: {
    flex: 1,
  },
  sceneBackground: {
    flex: 1,
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
    paddingTop: 8,
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
    right: 12,
    bottom: 190,
    zIndex: 3,
    gap: 12,
  },
  actionOrb: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOpacity: 0.14,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionOrbText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#2B4C2E",
  },
  avatarStage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  characterBubble: {
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 14,
    maxWidth: 260,
  },
  characterBubbleText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#171717",
    textAlign: "center",
  },
  avatarImage: {
    width: 280,
    height: 280,
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
  overlaySafeArea: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
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
  quickLink: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#EEF3EA",
    paddingVertical: 12,
    alignItems: "center",
  },
  quickLinkText: {
    fontSize: 13,
    color: "#2E5134",
    fontWeight: "700",
  },
  sheetWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
  },
  sheetWrapCollapsed: {
    height: 196,
  },
  sheetWrapExpanded: {
    height: 430,
  },
  sheet: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 30,
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  sheetHandleButton: {
    alignItems: "center",
    paddingBottom: 8,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#9CA3AF",
  },
  sheetContent: {
    paddingHorizontal: 4,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  sheetChecks: {
    flexDirection: "row",
    gap: 8,
  },
  statusDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  statusDotChecked: {
    backgroundColor: "#7DC960",
  },
  statusDotUnchecked: {
    backgroundColor: "#E5E7EB",
  },
  statusDotCheck: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  sheetMissionList: {
    marginTop: 20,
    gap: 10,
  },
  sheetMissionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  sheetMissionCardDone: {
    borderColor: "transparent",
    backgroundColor: "#EEF7E8",
  },
  sheetMissionLabel: {
    fontSize: 15,
    color: "#6B7280",
  },
  sheetMissionLabelDone: {
    color: "#2E5134",
    fontWeight: "700",
  },
  sheetDivider: {
    marginVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  wishHeader: {
    gap: 6,
  },
  wishTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  wishTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  wishBody: {
    fontSize: 14,
    lineHeight: 20,
    color: "#171717",
  },
  wishStageRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wishCurrent: {
    fontSize: 13,
    color: "#59A647",
    fontWeight: "700",
  },
  wishNext: {
    fontSize: 13,
    color: "#171717",
    fontWeight: "600",
  },
  progressTrack: {
    marginTop: 10,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#7DC960",
  },
  quickLinksRow: {
    marginTop: 18,
    flexDirection: "row",
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F7F0",
  },
});
