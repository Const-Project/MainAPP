import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import useHomeApi from "@/hooks/home/useHomeApi";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import useTokenStore from "@/stores/useTokenStore";

import GardenSlot from "@/components/home/GardenSlot";
import HomeBottomSheet from "@/components/home/HomeBottomSheet";
import TrackingModal from "@/components/home/TrackingModal";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { accessToken, hasHydrated } = useTokenStore();
  const { setUser, setGardens, updateMissions, gardens } = useHomeSummaryStore();
  const { data, refetch } = useHomeApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  // 토큰 없으면 온보딩으로
  useEffect(() => {
    if (hasHydrated && !accessToken) {
      navigation.reset({ index: 0, routes: [{ name: "Onboarding" }] });
    }
  }, [hasHydrated, accessToken, navigation]);

  // API 데이터 → 스토어 동기화
  useEffect(() => {
    if (data) {
      setUser(data.userInfo);
      setGardens(data.gardenSummaries);
      updateMissions(data.todayMissions);
    }
  }, [data]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
      if (page !== currentPage) {
        setCurrentPage(page);
        refetch();
      }
    },
    [currentPage, refetch],
  );

  // 토큰 hydration 전이거나 토큰 없으면 렌더 안함
  if (!hasHydrated || !accessToken) return null;

  return (
    <View style={styles.container}>
      {/* 가든 슬롯 스와이퍼 */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.swiper}
      >
        {[0, 1, 2, 3].map(i => (
          <GardenSlot
            key={i}
            garden={gardens[i] || null}
            slotNumber={i + 1}
            isFirst={i === 0}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        ))}
      </ScrollView>

      {/* 페이지 인디케이터 */}
      <View style={styles.pagination}>
        {[0, 1, 2, 3].map(i => (
          <View
            key={i}
            style={[styles.dot, i === currentPage && styles.activeDot]}
          />
        ))}
      </View>

      {/* 하단 미션 시트 */}
      <HomeBottomSheet setIsModalOpen={setIsModalOpen} />

      {/* 트래킹 모달 */}
      {isTrackingModalOpen && (
        <TrackingModal onClose={() => setIsTrackingModalOpen(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  swiper: {
    flex: 1,
  },
  pagination: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    backgroundColor: "#FFFFFF",
  },
});
