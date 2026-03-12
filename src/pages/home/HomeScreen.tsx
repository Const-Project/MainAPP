import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import HomeEmotionModal from "@/components/home/HomeEmotionModal";
import HomeGardenScene from "@/components/home/HomeGardenScene";
import HomeTrackingModal from "@/components/home/HomeTrackingModal";
import StatusView from "@/components/common/StatusView";
import useHomeApi from "@/hooks/home/useHomeApi";
import { useDailySurvey } from "@/hooks/mission/useMissionApi";
import type { MainTabScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import {
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
  const surveyQuery = useDailySurvey();
  const { user, gardens, missions, hydrate } = useHomeSummaryStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
  const [isEmotionModalOpen, setIsEmotionModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);
  const [emotionAnswerKind, setEmotionAnswerKind] = useState<SurveyAnswerKind | null>(null);

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
  const isEmotionAnswered = surveyQuery.data?.isAnswered ?? false;

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
      {/* Full-screen garden scenes follow the MainFE slide-per-plot structure. */}
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
            <HomeGardenScene
              background={scene.background}
              slotNumber={scene.slotNumber}
              userName={userInfo?.username}
              garden={scene.garden}
              isEmotionAnswered={isEmotionAnswered}
              answeredKind={emotionAnswerKind}
              onPressTracking={() => setIsTrackingModalOpen(true)}
              onPressEmotion={() => setIsEmotionModalOpen(true)}
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
        onPressEmotionCheck={() => setIsEmotionModalOpen(true)}
      />

      <HomeEmotionModal
        visible={isEmotionModalOpen}
        onClose={() => setIsEmotionModalOpen(false)}
        onAnswered={answer => setEmotionAnswerKind(answer)}
      />
      <HomeTrackingModal
        visible={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
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
