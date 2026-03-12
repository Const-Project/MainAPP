import { useEffect, useRef } from "react";
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RightIcon } from "@/assets/icons/CommonIcons";
import { getMissionCompleted, type TodayMission } from "@/types/home/garden";
import type { HomePanelPayload } from "@/types/home/panel";

const COLLAPSED_HEIGHT = 104;
const EXPANDED_HEIGHT = 430;
const DRAG_RANGE = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;

export default function HomeBottomSheet({
  expanded,
  onExpandedChange,
  missions,
  panel,
  currentLevel,
  onPressLog,
  onPressFeed,
  onPressUnlockGarden,
  onPressMission,
  onPressEmotionCheck,
}: {
  expanded: boolean;
  onExpandedChange: (next: boolean) => void;
  missions: TodayMission[];
  panel?: HomePanelPayload;
  currentLevel: number;
  onPressLog: () => void;
  onPressFeed: () => void;
  onPressUnlockGarden: () => void;
  onPressMission: (mission: TodayMission) => void;
  onPressEmotionCheck: () => void;
}) {
  const translateY = useRef(new Animated.Value(expanded ? 0 : DRAG_RANGE)).current;
  const dragStart = useRef(DRAG_RANGE);

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
        const nextExpanded = movedUpEnough ? true : movedDownEnough ? false : !expanded ? false : true;
        if (!movedUpEnough && !movedDownEnough) {
          translateY.stopAnimation(value => {
            onExpandedChange(value < DRAG_RANGE / 2);
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

  const missionCards: Array<{
    key: string;
    label: string;
    checked: boolean;
    onPress: () => void;
  }> = [
    {
      key: "checking",
      label: "마음 건강 체크",
      checked: panel?.isCheckingCompleted ?? (checkingMission ? getMissionCompleted(checkingMission) : false),
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
      <Animated.View style={[styles.sheetWrap, { transform: [{ translateY }] }]}>
        <View style={styles.sheet}>
          <View {...panResponder.panHandlers} style={styles.sheetDragArea}>
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

          <View style={styles.sheetContent}>
            {/*
             * 한글 주석:
             * 접힌 상태에서는 오늘의 미션 제목과 진행도만 위로 남기고,
             * 실제 미션 카드와 하단 정보는 패널 안쪽으로 더 들어가 보이도록 간격을 분리한다.
             */}
            <View style={styles.sheetMissionList}>
              {missionCards.map(card => (
                <TouchableOpacity
                  key={card.key}
                  activeOpacity={0.8}
                  onPress={card.onPress}
                  style={[styles.sheetMissionCard, card.checked && styles.sheetMissionCardDone]}
                >
                  <Text style={[styles.sheetMissionLabel, card.checked && styles.sheetMissionLabelDone]}>
                    {card.label}
                  </Text>
                  {card.checked ? <MissionStatusDot checked /> : <RightIcon size={22} color="#9CA3AF" />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sheetDivider} />

            <View style={styles.wishHeader}>
              <View style={styles.wishTitleRow}>
                <View style={styles.wishTreeBadge}>
                  <Text style={styles.wishTreeBadgeText}>T</Text>
                </View>
                <Text style={styles.wishTitle}>소망 나무</Text>
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

            <View style={styles.quickLinksRow}>
              <QuickLink label="키움일지" onPress={onPressLog} />
              <QuickLink label="둘러보기" onPress={onPressFeed} />
              <QuickLink label="텃밭 해금" onPress={onPressUnlockGarden} />
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

function QuickLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.quickLink}>
      <Text style={styles.quickLinkText}>{label}</Text>
    </TouchableOpacity>
  );
}

function MissionStatusDot({ checked }: { checked: boolean }) {
  return (
    <View style={[styles.statusDot, checked ? styles.statusDotChecked : styles.statusDotUnchecked]}>
      {checked ? <Text style={styles.statusDotCheck}>✓</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sheetOuter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
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
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#EEF7E8",
    alignItems: "center",
    justifyContent: "center",
  },
  wishTreeBadgeText: {
    color: "#59A647",
    fontSize: 13,
    fontWeight: "700",
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
});
