import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import { usePanelApi } from "@/hooks/home/usePanelApi";
import { CheckIcon, UnCheckIcon } from "@/assets/icons/CommonIcons";
import Svg, { Path } from "react-native-svg";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const SNAP_CLOSED = SCREEN_HEIGHT - 150; // 하단 130px만 보이는 상태
const SNAP_OPEN = SCREEN_HEIGHT * 0.2; // 위로 75% 열림

function RightArrowIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 6L15 12L9 18"
        stroke="#9CA3AF"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function PlantIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M16 28V16M16 16C16 16 10 14 8 8C14 10 16 16 16 16ZM16 16C16 16 22 14 24 8C18 10 16 16 16 16Z"
        stroke="#7DC960"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

interface HomeBottomSheetProps {
  setIsModalOpen: (open: boolean) => void;
}

export default function HomeBottomSheet({
  setIsModalOpen,
}: HomeBottomSheetProps) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { data } = usePanelApi();

  const [isChecked, setIsChecked] = useState(
    data?.isCheckingCompleted || false,
  );
  const [isChecked2, setIsChecked2] = useState(data?.isDairyCompleted || false);
  const [isChecked3, setIsChecked3] = useState(data?.isQuizCompleted || false);
  const [percent, setPercent] = useState(data?.wishTree?.progressPercent || 0);

  useEffect(() => {
    if (data) {
      setIsChecked(data.isCheckingCompleted);
      setIsChecked2(data.isDairyCompleted);
      setIsChecked3(data.isQuizCompleted);
      setPercent(data.wishTree?.progressPercent || 0);
    }
  }, [data]);

  const translateY = useRef(new Animated.Value(SNAP_CLOSED)).current;
  const lastSnap = useRef(SNAP_CLOSED);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 5,
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        translateY.setOffset(lastSnap.current);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        const next = lastSnap.current + gesture.dy;
        const clamped = Math.min(Math.max(next, SNAP_OPEN), SNAP_CLOSED);
        translateY.setValue(clamped - lastSnap.current);
      },
      onPanResponderRelease: (_, gesture) => {
        translateY.flattenOffset();
        const current = lastSnap.current + gesture.dy;
        const projected = current + gesture.vy * 160;
        const mid = (SNAP_CLOSED + SNAP_OPEN) / 2;
        const target = projected < mid ? SNAP_OPEN : SNAP_CLOSED;

        lastSnap.current = target;
        Animated.spring(translateY, {
          toValue: target,
          useNativeDriver: true,
          bounciness: 4,
        }).start();
      },
    }),
  ).current;

  const randomQuizPath = () => {
    return Math.random() > 0.5
      ? "DailyMissionQuizMultipleChoice"
      : "DailyMissionQuizOx";
  };

  const missions = [
    {
      label: "마음 건강 체크",
      on: isChecked,
      action: () => setIsModalOpen(true),
    },
    {
      label: "일기 쓰기",
      on: isChecked2,
      action: () => navigation.navigate("DailyMissionWriteDiary"),
    },
    {
      label: "퀴즈 풀기",
      on: isChecked3,
      action: () => navigation.navigate(randomQuizPath() as any),
    },
  ];

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      {/* 드래그 핸들 */}
      <View style={styles.handleContainer}>
        <View style={styles.handle} />
      </View>

      {/* 콘텐츠 */}
      <View style={styles.content}>
        {/* 오늘의 미션 헤더 */}
        <View style={styles.missionHeader}>
          <Text style={styles.sectionTitle}>오늘의 미션</Text>
          <View style={styles.checkIcons}>
            {isChecked ? <CheckIcon size={32} /> : <UnCheckIcon size={32} />}
            {isChecked2 ? <CheckIcon size={32} /> : <UnCheckIcon size={32} />}
            {isChecked3 ? <CheckIcon size={32} /> : <UnCheckIcon size={32} />}
          </View>
        </View>

        {/* 미션 리스트 */}
        <View style={styles.missionList}>
          {missions.map((mission, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.missionItem,
                mission.on ? styles.missionCompleted : styles.missionPending,
              ]}
              onPress={mission.action}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.missionLabel,
                  mission.on
                    ? styles.missionCompletedLabel
                    : styles.missionPendingLabel,
                ]}
              >
                {mission.label}
              </Text>
              {mission.on ? <CheckIcon size={32} /> : <RightArrowIcon />}
            </TouchableOpacity>
          ))}
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 소망 나무 */}
        <View style={styles.wishTreeSection}>
          <View style={styles.wishTreeHeader}>
            <PlantIcon />
            <Text style={styles.sectionTitle}>소망 나무</Text>
          </View>
          <Text style={styles.wishTreeText}>
            {percent >= 100 ? (
              <>
                지금 바로 <Text style={styles.primaryText}>새로운 텃밭</Text>을
                열 수 있어요!
              </>
            ) : (
              <>
                소망 나무 다음 성장까지{" "}
                <Text style={styles.primaryText}>{100 - percent}%</Text>가
                남았어요!
              </>
            )}
          </Text>

          <View style={styles.stageRow}>
            <Text style={styles.currentStage}>
              {data?.wishTree?.currentStage}
            </Text>
            <Text style={styles.nextStage}>{data?.wishTree?.nextStage}</Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${percent}%` }]} />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: SCREEN_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 50,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#9CA3AF",
  },
  content: {
    padding: 16,
  },
  missionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  checkIcons: {
    flexDirection: "row",
    gap: 8,
  },
  missionList: {
    marginTop: 24,
    gap: 12,
  },
  missionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
  },
  missionCompleted: {
    backgroundColor: "#E8F5E3",
  },
  missionPending: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  missionLabel: {
    fontSize: 14,
  },
  missionCompletedLabel: {
    fontWeight: "600",
    color: "#2D7A1D",
  },
  missionPendingLabel: {
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 40,
  },
  wishTreeSection: {
    gap: 4,
  },
  wishTreeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  wishTreeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    marginTop: 4,
  },
  primaryText: {
    color: "#2D7A1D",
  },
  stageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  currentStage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D7A1D",
  },
  nextStage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2D7A1D",
    borderRadius: 4,
  },
});
