import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetHandleProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CheckIcon from "@/assets/icons/Check.svg";
import Check2Icon from "@/assets/icons/Check2.svg";
import PlantBadgeIcon from "@/assets/icons/bottom-sheet/plant.svg";
import WishTreeInfoModal from "@/components/home/WishTreeInfoModal";
import { getMissionCompleted, type TodayMission } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";

const COLLAPSED_HEIGHT = 90;
const EXPANDED_HEIGHT = 580;

export default function HomeBottomSheet({
  expanded,
  onExpandedChange,
  missions,
  panel,
  currentLevel,
  onPressMission,
  onPressEmotionCheck,
}: {
  expanded: boolean;
  onExpandedChange: (next: boolean) => void;
  missions: TodayMission[];
  panel?: HomePanelPayload;
  currentLevel: number;
  onPressMission: (mission: TodayMission) => void;
  onPressEmotionCheck: () => void;
}) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isWishInfoVisible, setIsWishInfoVisible] = useState(false);
  const snapPoints = useMemo(() => [COLLAPSED_HEIGHT, EXPANDED_HEIGHT], []);

  useEffect(() => {
    bottomSheetRef.current?.snapToIndex(expanded ? 1 : 0);
  }, [expanded]);

  const checkingMission = missions.find(mission => mission.missionType === "CHECKING");
  const diaryMission = missions.find(mission => mission.missionType === "DIARY");
  const quizMission = missions.find(mission => mission.missionType === "QUIZ");
  const progressPercent = panel?.wishTree.progressPercent ?? 0;
  const currentStage = panel?.wishTree.currentStage ?? `LV.${currentLevel}`;
  const nextStage = panel?.wishTree.nextStage ?? `LV.${currentLevel + 1}`;
  const currentGrowthPoints = panel?.wishTree.currentPoints ?? 0;
  const requiredGrowthPoints = panel?.wishTree.requiredPointsForNextStage ?? 0;
  const remainingGrowthPoints = Math.max(requiredGrowthPoints - currentGrowthPoints, 0);

  const missionCards: Array<{
    key: string;
    label: string;
    checked: boolean;
    disabled?: boolean;
    onPress: () => void;
  }> = [
    {
      key: "checking",
      label: "마음 건강 체크",
      checked: panel?.isCheckingCompleted ?? (checkingMission ? getMissionCompleted(checkingMission) : false),
      disabled: panel?.isCheckingCompleted ?? (checkingMission ? getMissionCompleted(checkingMission) : false),
      onPress: onPressEmotionCheck,
    },
    {
      key: "diary",
      label: "일기 쓰기",
      checked: panel?.isDairyCompleted ?? (diaryMission ? getMissionCompleted(diaryMission) : false),
      onPress: () => diaryMission && onPressMission(diaryMission),
    },
    {
      key: "quiz",
      label: "퀴즈 풀기",
      checked: panel?.isQuizCompleted ?? (quizMission ? getMissionCompleted(quizMission) : false),
      onPress: () => quizMission && onPressMission(quizMission),
    },
  ];

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        opacity={0.1}
        pressBehavior="collapse"
      />
    ),
    []
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      const nextExpanded = index > 0;
      if (nextExpanded !== expanded) {
        onExpandedChange(nextExpanded);
      }
    },
    [expanded, onExpandedChange]
  );

  const renderHandle = useCallback(
    (_props: BottomSheetHandleProps) => (
      <View style={styles.handleWrap}>
        <View style={styles.sheetHandleButton}>
          <View style={styles.sheetHandle} />
        </View>
        <View style={styles.sheetHeaderRow}>
          <Text style={styles.sheetTitle}>오늘의 미션</Text>
          <View style={styles.sheetChecks}>
            {missionCards.map(card => (
              <MissionStatusDot key={card.key} checked={card.checked} />
            ))}
          </View>
        </View>
      </View>
    ),
    [missionCards]
  );

  return (
    <View pointerEvents="box-none" style={styles.sheetOuter}>
      <BottomSheet
        ref={bottomSheetRef}
        index={expanded ? 1 : 0}
        snapPoints={snapPoints}
        handleComponent={renderHandle}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={false}
        enableOverDrag={false}
        backgroundStyle={styles.sheetBackground}
        onChange={handleSheetChange}
      >
        <BottomSheetScrollView
          style={styles.sheetContent}
          contentContainerStyle={styles.sheetContentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.sheetMissionList}>
            {missionCards.map(card => (
              <TouchableOpacity
                key={card.key}
                activeOpacity={card.disabled ? 1 : 0.8}
                onPress={card.onPress}
                disabled={card.disabled}
                style={[styles.sheetMissionCard, card.checked && styles.sheetMissionCardDone]}
              >
                <Text style={[styles.sheetMissionLabel, card.checked && styles.sheetMissionLabelDone]}>
                  {card.label}
                </Text>
                <MissionStatusDot checked={card.checked} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.sheetDivider} />

          <View style={styles.wishHeader}>
            <View style={styles.wishTitleRow}>
              <View style={styles.wishTreeBadge}>
                <PlantBadgeIcon width={22} height={22} />
              </View>
              <Text style={styles.wishTitle}>소망 나무</Text>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                hitSlop={12}
                onPress={() => setIsWishInfoVisible(true)}
                style={styles.wishInfoButton}
              >
                <Text style={styles.wishInfoIcon}>?</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.wishBody}>
              {progressPercent >= 100
                ? "지금 바로 새로운 텃밭을 열 수 있어요!"
                : `소망 나무 다음 성장까지 ${100 - progressPercent}%가 남았어요!`}
            </Text>
          </View>

          <View style={styles.wishStageRow}>
            <Text style={styles.wishCurrent}>{currentStage}</Text>
            <Text style={styles.wishNext}>{nextStage}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
          <View style={styles.progressMetaRow}>
            <View style={styles.progressMetaCard}>
              <Text style={styles.progressMetaLabel}>현재 성장</Text>
              <Text style={styles.progressMetaValue}>
                {currentGrowthPoints}
                <Text style={styles.progressMetaUnit}> / {requiredGrowthPoints}</Text>
              </Text>
            </View>
            <View style={styles.progressMetaCard}>
              <Text style={styles.progressMetaLabel}>다음 성장까지</Text>
              <Text style={styles.progressMetaValue}>
                {remainingGrowthPoints}
                <Text style={styles.progressMetaUnit}> 걸음</Text>
              </Text>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <WishTreeInfoModal visible={isWishInfoVisible} onClose={() => setIsWishInfoVisible(false)} />
    </View>
  );
}

function MissionStatusDot({ checked }: { checked: boolean }) {
  return (
    <View style={styles.statusDot}>
      {checked ? <CheckIcon width={24} height={24} /> : <Check2Icon width={24} height={24} />}
    </View>
  );
}

const styles = StyleSheet.create({
  sheetOuter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheetBackground: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  handleWrap: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetHandleButton: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 14,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 999,
    backgroundColor: "#B8C0CC",
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
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sheetMissionList: {
    marginTop: 8,
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
    flex: 1,
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
    gap: 6,
  },
  wishTreeBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#EEF7E8",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  wishTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  wishInfoButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: "#9CA3AF",
    alignItems: "center",
    justifyContent: "center",
  },
  wishInfoIcon: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    lineHeight: 16,
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
    height: 12,
    borderRadius: 999,
    backgroundColor: "#E7EEE1",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#D6E4CD",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#6FBE57",
  },
  progressMetaRow: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
  },
  progressMetaCard: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#F5F9F0",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  progressMetaLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
  },
  progressMetaValue: {
    fontSize: 16,
    color: "#2E5134",
    fontWeight: "700",
  },
  progressMetaUnit: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "600",
  },
});



