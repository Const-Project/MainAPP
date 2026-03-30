import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useFocusEffect } from "@react-navigation/native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import HomeAlertsModal from "@/components/home/HomeAlertsModal";
import HomeEmotionModal from "@/components/home/HomeEmotionModal";
import HomeGardenScene from "@/components/home/HomeGardenScene";
import HomeMapModal from "@/components/home/HomeMapModal";
import HomeTrackingModal from "@/components/home/HomeTrackingModal";
import StatusView from "@/components/common/StatusView";
import useHomeApi, {
  useHomePanelApi,
  useTrackingPromptConfirm,
  useTrackingPromptStatus,
} from "@/hooks/home/useHomeApi";
import { useDailySurvey } from "@/hooks/mission/useMissionApi";
import type { MainTabScreenProps } from "@/navigation/types";
import {
  getEmotionSurveyCooldownActive,
  useEmotionSurveyStore,
} from "@/stores/useEmotionSurveyStore";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import {
  getGardenLocked,
  type GardenSummary,
  type HomeMissionType,
  type TodayMission,
} from "@/types/home/garden";
import type { SurveyAnswerKind } from "@/types/missions";
import { createTimingLogger, debugLog, debugScreenMounted } from "@/utils/debug";

type Props = MainTabScreenProps<"Home">;

const backgrounds = [
  require("@/assets/images/background/background1.webp"),
  require("@/assets/images/background/background2.webp"),
  require("@/assets/images/background/background3.png"),
  require("@/assets/images/background/background4.webp"),
] as const;

type SceneItem = {
  key: string;
  slotNumber: number;
  background: (typeof backgrounds)[number];
  garden: GardenSummary | null;
};

export default function HomeScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch } = useHomeApi();
  const { data: panel } = useHomePanelApi();
  const {
    data: trackingPromptStatus,
    refetch: refetchTrackingPromptStatus,
  } = useTrackingPromptStatus();
  const trackingPromptConfirmMutation = useTrackingPromptConfirm();
  const surveyQuery = useDailySurvey();
  const { user, gardens, missions, todayDiaryId, hydrate } = useHomeSummaryStore();
  const {
    lastAnsweredAt,
    lastAnswerKind,
    markAnswered,
    resetIfExpired,
  } = useEmotionSurveyStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [emotionAnswerKind, setEmotionAnswerKind] = useState<SurveyAnswerKind | null>(null);
  const openedTrackingCycleKeysRef = useRef<Set<string>>(new Set());
  const initialLoadTimingRef = useRef<ReturnType<typeof createTimingLogger> | null>(null);

  useEffect(() => {
    debugScreenMounted("HomeScreen");
    initialLoadTimingRef.current = createTimingLogger("HomeScreen", "initial data load");
  }, []);

  useEffect(() => {
    resetIfExpired();
  }, [lastAnsweredAt, resetIfExpired]);

  useFocusEffect(
    useCallback(() => {
      void refetch();
      void refetchTrackingPromptStatus();
    }, [refetch, refetchTrackingPromptStatus])
  );

  useEffect(() => {
    debugLog("HomeScreen", "query state changed", {
      isLoading,
      hasData: Boolean(data),
      hasError: Boolean(error),
      hasPanel: Boolean(panel),
      trackingEligible: trackingPromptStatus?.eligible ?? false,
      trackingCycleKey: trackingPromptStatus?.cycleKey ?? null,
    });
  }, [data, error, isLoading, panel, trackingPromptStatus]);

  useEffect(() => {
    if (data) {
      debugLog("HomeScreen", "hydrate store from home api", {
        missionCount: data.todayMissions?.length ?? 0,
        gardenCount: data.gardenSummaries?.length ?? 0,
      });
      hydrate(data);
    }
  }, [data, hydrate]);

  useEffect(() => {
    if (!data || !initialLoadTimingRef.current) {
      return;
    }

    initialLoadTimingRef.current({
      gardenCount: data.gardenSummaries?.length ?? 0,
      missionCount: data.todayMissions?.length ?? 0,
    });
    initialLoadTimingRef.current = null;
  }, [data]);

  useEffect(() => {
    if (!trackingPromptStatus?.eligible || !trackingPromptStatus.cycleKey) {
      return;
    }

    if (openedTrackingCycleKeysRef.current.has(trackingPromptStatus.cycleKey)) {
      return;
    }

    openedTrackingCycleKeysRef.current.add(trackingPromptStatus.cycleKey);
    setIsTrackingModalOpen(true);
  }, [trackingPromptStatus]);

  const userInfo = data?.userInfo ?? user;
  const gardenSummaries = data?.gardenSummaries ?? gardens;
  const todayMissions = data?.todayMissions ?? missions;
  const latestTodayDiaryId = data?.todayDiaryId ?? todayDiaryId;
  const isEmotionCooldownActive = getEmotionSurveyCooldownActive(lastAnsweredAt);

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

  const currentScene = scenes[currentPage] ?? scenes[0] ?? null;
  const isCurrentGardenLocked = currentScene?.garden ? getGardenLocked(currentScene.garden) : false;

  useEffect(() => {
    if (isCurrentGardenLocked && isSheetExpanded) {
      setIsSheetExpanded(false);
    }
  }, [isCurrentGardenLocked, isSheetExpanded]);

  const isEmotionAnswered = (surveyQuery.data?.isAnswered ?? false) || isEmotionCooldownActive;
  const answeredKind = emotionAnswerKind ?? lastAnswerKind;
  const initialPage = Math.max(0, Math.min(3, (userInfo?.lastAccessedSlotNumber ?? 1) - 1));

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const handleTrackingPromptConfirm = useCallback(async () => {
    if (!trackingPromptStatus?.cycleKey || trackingPromptConfirmMutation.isPending) {
      return;
    }

    try {
      await trackingPromptConfirmMutation.mutateAsync({
        cycleKey: trackingPromptStatus.cycleKey,
      });
      await queryClient.invalidateQueries({ queryKey: ["tracking-report-status"] });
      setIsTrackingModalOpen(false);
    } catch (confirmError) {
      debugLog("HomeScreen", "tracking prompt confirm failed", { confirmError });
    }
  }, [queryClient, trackingPromptConfirmMutation, trackingPromptStatus?.cycleKey]);

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
      <PagerView
        key={`home-pager-${initialPage}`}
        style={styles.pager}
        initialPage={initialPage}
        onPageSelected={event => {
          const position = event.nativeEvent.position;
          setCurrentPage(position);
          void refetch();
        }}
      >
        {scenes.map(scene => (
          <View key={scene.key} style={styles.page}>
            <HomeGardenScene
              background={scene.background}
              slotNumber={scene.slotNumber}
              userName={userInfo?.username}
              garden={scene.garden}
              isEmotionAnswered={isEmotionAnswered}
              answeredKind={answeredKind}
              unreadNotificationCount={userInfo?.unreadNotificationCount ?? 0}
              onPressMap={() => setIsMapModalOpen(true)}
              onPressBird={() => setIsAlertsModalOpen(true)}
              onPressEmotion={() => setIsEmotionModalOpen(true)}
              onPressUnlock={() =>
                navigation.navigate("UnlockGarden", {
                  gardenId: scene.garden?.gardenId,
                  gardenSlotNumber: scene.slotNumber,
                })
              }
              onPressEmpty={() => navigation.navigate("RegistrationAvatar", { entry: "garden" })}
            />
          </View>
        ))}
      </PagerView>

      {!isCurrentGardenLocked ? (
        <View pointerEvents="none" style={styles.paginationWrap}>
          <View style={styles.pagination}>
            {scenes.map((scene, index) => (
              <View
                key={scene.key}
                style={[styles.dot, currentPage === index ? styles.dotActive : styles.dotInactive]}
              />
            ))}
          </View>
        </View>
      ) : null}

      {!isCurrentGardenLocked ? (
        <HomeBottomSheet
          expanded={isSheetExpanded}
          onExpandedChange={setIsSheetExpanded}
          missions={todayMissions}
          panel={panel}
          currentLevel={userInfo?.level ?? 0}
          onPressMission={mission => {
            if (mission.missionType === "DIARY" && mission.isCompleted && latestTodayDiaryId) {
              navigation.navigate("LogDetail", { id: latestTodayDiaryId });
              return;
            }

            const routeName = getMissionRouteName(mission);
            if (routeName) {
              navigation.navigate(routeName as never);
            }
          }}
          onPressEmotionCheck={() => setIsEmotionModalOpen(true)}
        />
      ) : null}

      <HomeEmotionModal
        visible={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        onAnswered={answer => {
          setEmotionAnswerKind(answer);
          markAnswered(answer);
          setIsEmotionModalOpen(false);
        }}
      />
      <HomeAlertsModal
        visible={isAlertsModalOpen}
        userId={userInfo?.id ?? null}
        onClose={() => setIsAlertsModalOpen(false)}
      />
      <HomeMapModal
        visible={isMapModalOpen}
        slotNumber={currentPage + 1}
        onClose={() => setIsMapModalOpen(false)}
      />
      <HomeTrackingModal
        visible={isTrackingModalOpen}
        report={trackingPromptStatus ?? null}
        isConfirming={trackingPromptConfirmMutation.isPending}
        onConfirm={() => void handleTrackingPromptConfirm()}
      />
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
  paginationWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 156,
    alignItems: "center",
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
    backgroundColor: "rgba(124,124,124,0.7)",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F7F0",
  },
});


