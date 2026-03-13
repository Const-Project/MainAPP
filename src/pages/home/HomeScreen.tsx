import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import HomeEmotionModal from "@/components/home/HomeEmotionModal";
import HomeGardenScene from "@/components/home/HomeGardenScene";
import HomeMapModal from "@/components/home/HomeMapModal";
import HomeTrackingModal from "@/components/home/HomeTrackingModal";
import StatusView from "@/components/common/StatusView";
import useHomeApi, { useHomePanelApi } from "@/hooks/home/useHomeApi";
import { useDailySurvey } from "@/hooks/mission/useMissionApi";
import type { MainTabScreenProps } from "@/navigation/types";
import { useEmotionSurveyStore, getEmotionSurveyCooldownActive } from "@/stores/useEmotionSurveyStore";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import {
  getGardenLocked,
  type GardenSummary,
  type HomeMissionType,
  type TodayMission,
} from "@/types/home/garden";
import type { SurveyAnswerKind } from "@/types/missions";
import { debugLog, debugScreenMounted } from "@/utils/debug";

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
  const { data, error, isLoading, refetch } = useHomeApi();
  const { data: panel } = useHomePanelApi();
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
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [emotionAnswerKind, setEmotionAnswerKind] = useState<SurveyAnswerKind | null>(null);

  useEffect(() => {
    debugScreenMounted("HomeScreen");
  }, []);

  useEffect(() => {
    resetIfExpired();
  }, [lastAnsweredAt, resetIfExpired]);

  useEffect(() => {
    debugLog("HomeScreen", "query state changed", {
      isLoading,
      hasData: Boolean(data),
      hasError: Boolean(error),
      hasPanel: Boolean(panel),
    });
  }, [data, error, isLoading, panel]);

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

  /*
   * 한글 주석:
   * 홈 말풍선은 서버 응답과 별개로, 홈에서 방금 답한 직후 상태도 바로 반영해야 한다.
   * 로컬 24시간 완료 상태를 함께 보아야 버튼이 다시 나타나는 깜빡임을 막을 수 있다.
   */
  const isEmotionAnswered = (surveyQuery.data?.isAnswered ?? false) || isEmotionCooldownActive;
  const answeredKind = emotionAnswerKind ?? lastAnswerKind;
  const initialPage = Math.max(0, Math.min(3, (userInfo?.lastAccessedSlotNumber ?? 1) - 1));

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

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
              onPressMap={() => setIsMapModalOpen(true)}
              onPressTracking={() => setIsTrackingModalOpen(true)}
              onPressEmotion={() => setIsEmotionModalOpen(true)}
              onPressUnlock={() => navigation.navigate("UnlockGarden")}
              onPressEmpty={() => navigation.navigate("RegistrationAvatar")}
            />
          </View>
        ))}
      </PagerView>

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

      {!isCurrentGardenLocked ? (
        <HomeBottomSheet
          expanded={isSheetExpanded}
          onExpandedChange={setIsSheetExpanded}
          missions={todayMissions}
          panel={panel}
          currentLevel={userInfo?.level ?? 0}
          onPressMission={mission => {
            /*
             * 한글 주석:
             * 완료된 일기 미션은 다시 작성 화면으로 보내지 않고,
             * 오늘 방금 작성한 일기 상세로 연결해야 결과 확인 흐름이 자연스럽다.
             */
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
      <HomeTrackingModal
        visible={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
      />
      <HomeMapModal
        visible={isMapModalOpen}
        slotNumber={currentPage + 1}
        onClose={() => setIsMapModalOpen(false)}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F4F7F0",
  },
});

