import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RootStackParamList } from "@/navigation/types";
import { getPlantsApi, type Plant } from "@/apis/delivery/deliveryApi";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import ProgressBar from "@/components/common/ProgressBar";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH * 0.65;
const SLIDE_SPACING = 16;

export default function UnlockGardenScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const selectedPlant = plants[selectedIndex] ?? null;

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const res = await getPlantsApi();
        const list = res.result ?? [];
        setPlants(list);

        if (list.length > 0) {
          const raw = await AsyncStorage.getItem("selectedId");
          const savedId = raw ? parseInt(raw, 10) : NaN;
          if (Number.isFinite(savedId)) {
            const idx = list.findIndex(p => p.seedType === savedId);
            setSelectedIndex(idx >= 0 ? idx : 0);
          }
        }
      } catch {
        setErrorMsg("식물 목록을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    if (selectedPlant) {
      AsyncStorage.setItem("selectedId", String(selectedPlant.seedType));
    }
  }, [selectedPlant]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / (SLIDE_WIDTH + SLIDE_SPACING));
      if (page >= 0 && page < plants.length && page !== selectedIndex) {
        setSelectedIndex(page);
      }
    },
    [plants.length, selectedIndex],
  );

  const scrollToIndex = (index: number) => {
    setSelectedIndex(index);
    scrollRef.current?.scrollTo({
      x: index * (SLIDE_WIDTH + SLIDE_SPACING),
      animated: true,
    });
  };

  const goDelivery = () => {
    navigation.navigate("Delivery");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7DC960" />
        <Text style={styles.loadingText}>불러오는 중…</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.screen}>
        <DeliveryHeader title="텃밭 해금하기" />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      </View>
    );
  }

  const sidePadding = (SCREEN_WIDTH - SLIDE_WIDTH) / 2;

  return (
    <View style={styles.screen}>
      <DeliveryHeader title="텃밭 해금하기" />

      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={1} totalSteps={3} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>받고 싶은 식물을 골라주세요!</Text>

        <View style={styles.swiperArea}>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled={false}
            showsHorizontalScrollIndicator={false}
            snapToInterval={SLIDE_WIDTH + SLIDE_SPACING}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: sidePadding,
            }}
            onMomentumScrollEnd={handleScroll}
          >
            {plants.map((p, index) => (
              <TouchableOpacity
                key={p.seedType}
                style={[
                  styles.slide,
                  { marginRight: index < plants.length - 1 ? SLIDE_SPACING : 0 },
                ]}
                onPress={() => scrollToIndex(index)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: p.imageUrl }}
                  style={[
                    styles.plantImage,
                    selectedIndex !== index && styles.plantImageInactive,
                  ]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.plantName}>{selectedPlant?.name ?? " "}</Text>

          {/* 페이지네이션 닷 */}
          <View style={styles.pagination}>
            {plants.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === selectedIndex && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>나중에 받기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, !selectedPlant && styles.disabledButton]}
            onPress={goDelivery}
            disabled={!selectedPlant}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    padding: 24,
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  progressBarContainer: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    paddingHorizontal: 24,
    marginTop: 16,
  },
  swiperArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    width: SLIDE_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  plantImage: {
    width: SLIDE_WIDTH - 16,
    height: SLIDE_WIDTH * 1.15,
    borderRadius: 12,
  },
  plantImageInactive: {
    opacity: 0.5,
  },
  plantName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
    marginTop: 24,
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginTop: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#D1D5DB",
  },
  activeDot: {
    backgroundColor: "#7DC960",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#7DC960",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
});
