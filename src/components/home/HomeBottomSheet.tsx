import { useEffect, useRef, useState } from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CheckIcon from "@/assets/icons/Check.svg";
import Check2Icon from "@/assets/icons/Check2.svg";
import PlantBadgeIcon from "@/assets/icons/bottom-sheet/plant.svg";
import WishTreeInfoModal from "@/components/home/WishTreeInfoModal";
import { getMissionCompleted, type TodayMission } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";

const COLLAPSED_HEIGHT = 104;
const EXPANDED_HEIGHT = 580;
const DRAG_RANGE = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

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
  const translateY = useRef(new Animated.Value(expanded ? 0 : DRAG_RANGE)).current;
  const dragStart = useRef(DRAG_RANGE);
  const [isWishInfoVisible, setIsWishInfoVisible] = useState(false);

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: expanded ? 0 : DRAG_RANGE,
      useNativeDriver: true,
      tension: 90,
      friction: 12,
    }).start();
  }, [expanded, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 4,
      onPanResponderGrant: () => {
        translateY.stopAnimation(value => {
          dragStart.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const next = Math.max(0, Math.min(DRAG_RANGE, dragStart.current + gestureState.dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gestureState) => {
        const movedUpEnough = gestureState.dy < -40;
        const movedDownEnough = gestureState.dy > 40;
        const flingUp = gestureState.vy < -0.45;
        const flingDown = gestureState.vy > 0.45;
        const nextExpanded =
          movedUpEnough || flingUp
            ? true
            : movedDownEnough || flingDown
              ? false
              : expanded;

        if (!movedUpEnough && !movedDownEnough) {
          translateY.stopAnimation(value => {
            onExpandedChange(flingUp ? true : flingDown ? false : value < DRAG_RANGE / 2);
          });
          return;
        }

        onExpandedChange(nextExpanded);
      },
      onPanResponderTerminate: () => {
        onExpandedChange(expanded);
      },
    })
  ).current;

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

  return (
    <View pointerEvents="box-none" style={styles.sheetOuter}>
      {expanded ? <Pressable style={styles.sheetBackdrop} onPress={() => onExpandedChange(false)} /> : null}

      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY }] }]}>
        <View style={styles.sheet}>
          <Pressable
            {...panResponder.panHandlers}
            onPress={() => onExpandedChange(!expanded)}
            style={styles.sheetDragArea}
          >
            <View pointerEvents="none" style={styles.sheetHandleButton}>
              <View style={styles.sheetHandle} />
            </View>
            <View pointerEvents="none" style={styles.sheetHeaderRow}>
              <Text style={styles.sheetTitle}>오늘의 미션</Text>
              <View style={styles.sheetChecks}>
                {missionCards.map(card => (
                  <MissionStatusDot key={card.key} checked={card.checked} />
                ))}
              </View>
            </View>
          </Pressable>

          <ScrollView
            style={styles.sheetContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={expanded}
            keyboardShouldPersistTaps="handled"
          >
            {/*
             * 한글 주석:
             * 접힌 상태에서는 오늘의 미션 제목과 진행도만 위로 남기고,
             * 실제 미션 카드와 하단 정보는 패널 안쪽으로 더 들어가 보이도록 간격을 분리한다.
             */}
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
                <Text style={styles.wishTitle}>{"\uC18C\uB9DD \uB098\uBB34"}</Text>
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
                  <Text style={styles.progressMetaUnit}> 남음</Text>
                </Text>
              </View>
            </View>


          </ScrollView>
        </View>
      </Animated.View>
      <WishTreeInfoModal
        visible={isWishInfoVisible}
        onClose={() => setIsWishInfoVisible(false)}
      />
    </View>
  );
}


function MissionStatusDot({ checked }: { checked: boolean }) {
  return (
    <View style={styles.statusDot}>
      {checked ? <CheckIcon width={20} height={20} /> : <Check2Icon width={20} height={20} />}
    </View>
  );
}

const styles = StyleSheet.create({
  sheetOuter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(12, 18, 14, 0.10)",
  },

  sheetWrap: {
    height: EXPANDED_HEIGHT,
  },
  sheet: {
    width: "100%",
    height: EXPANDED_HEIGHT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 30,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  sheetDragArea: {
    paddingTop: 2,
    paddingBottom: 18,
    paddingHorizontal: 4,
  },
  sheetHandleButton: {
    alignItems: "center",
    paddingBottom: 12,
    paddingTop: 8,
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
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
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


