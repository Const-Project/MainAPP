import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import { useAvatarMasters } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationSelectionDetail">;

type PaginationDotTone = "active" | "default" | "edge" | "hidden";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = 258;
const CARD_HEIGHT = 292;
const CARD_SPACING = 16;
const SNAP_INTERVAL = CARD_WIDTH + CARD_SPACING;
const SIDE_PADDING = Math.max((screenWidth - CARD_WIDTH) / 2, 20);
const DOT_SIZE = 8;
const DOT_SPACING = 6;

function buildPaginationSlots(total: number, currentIndex: number): PaginationDotTone[] {
  if (total <= 0) {
    return ["hidden", "hidden", "hidden"];
  }

  if (total === 1) {
    return ["hidden", "active", "hidden"];
  }

  if (total === 2) {
    return currentIndex === 0
      ? ["hidden", "active", "default"]
      : ["default", "active", "hidden"];
  }

  if (currentIndex === 0) {
    return ["hidden", "active", "default"];
  }

  if (currentIndex === total - 1) {
    return ["default", "active", "hidden"];
  }

  if (currentIndex === 1) {
    return ["default", "active", "edge"];
  }

  if (currentIndex === total - 2) {
    return ["edge", "active", "default"];
  }

  return ["edge", "active", "edge"];
}

function getDotColor(tone: PaginationDotTone) {
  return tone === "active" ? "#7C7C7C" : "#D9D9D9";
}

function getDotOpacity(tone: PaginationDotTone) {
  if (tone === "active" || tone === "default") {
    return 1;
  }

  if (tone === "edge") {
    return 0.35;
  }

  return 0;
}

function getDotScale(tone: PaginationDotTone) {
  if (tone === "active") {
    return 1;
  }

  if (tone === "default") {
    return 0.92;
  }

  if (tone === "edge") {
    return 0.82;
  }

  return 0.4;
}

function getClampedIndex(total: number, offsetX: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.min(total - 1, Math.max(0, Math.round(offsetX / SNAP_INTERVAL)));
}

export default function RegistrationSelectionDetailScreen({
  navigation,
  route,
}: Props) {
  const entry = route.params?.entry;
  const { data, isLoading, isError, refetch } = useAvatarMasters();
  const scrollRef = useRef<ScrollView>(null);
  const dotOpacity = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0)),
  ).current;
  const dotScale = useRef(
    Array.from({ length: 3 }, () => new Animated.Value(0.4)),
  ).current;
  const { selectedMaster, setMode, setSelectedMaster, setSelectedPreview } =
    useRegistrationStore();
  const [indicatorIndex, setIndicatorIndex] = useState(0);

  useEffect(() => {
    if (!selectedMaster && data && data.length > 0) {
      setSelectedMaster(data[0]);
      setSelectedPreview({
        masterId: data[0].id,
        description: data[0].description,
        imageUrl: data[0].defaultImageUrl,
      });
      setIndicatorIndex(0);
    }
  }, [data, selectedMaster, setSelectedMaster, setSelectedPreview]);

  const selectedIndex =
    data && selectedMaster
      ? Math.max(
          data.findIndex(avatar => avatar.id === selectedMaster.id),
          0,
        )
      : 0;

  useEffect(() => {
    setIndicatorIndex(selectedIndex);
  }, [selectedIndex]);

  const paginationSlots = useMemo(
    () => buildPaginationSlots(data?.length ?? 0, indicatorIndex),
    [data?.length, indicatorIndex],
  );

  useEffect(() => {
    Animated.parallel(
      paginationSlots.map((tone, index) =>
        Animated.parallel([
          Animated.timing(dotOpacity[index], {
            toValue: getDotOpacity(tone),
            duration: 140,
            useNativeDriver: false,
          }),
          Animated.timing(dotScale[index], {
            toValue: getDotScale(tone),
            duration: 140,
            useNativeDriver: false,
          }),
        ]),
      ),
    ).start();
  }, [dotOpacity, dotScale, paginationSlots]);

  const selectAvatarAtIndex = (index: number, shouldScroll = false) => {
    if (!data || index < 0 || index >= data.length) {
      return;
    }

    const avatar = data[index];
    setSelectedMaster(avatar);
    setSelectedPreview({
      masterId: avatar.id,
      description: avatar.description,
      imageUrl: avatar.defaultImageUrl,
    });
    setIndicatorIndex(index);

    if (shouldScroll) {
      scrollRef.current?.scrollTo({
        x: index * SNAP_INTERVAL,
        animated: true,
      });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = getClampedIndex(data?.length ?? 0, event.nativeEvent.contentOffset.x);

    if (nextIndex !== indicatorIndex) {
      setIndicatorIndex(nextIndex);
    }
  };

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    if (!data || data.length === 0) {
      return;
    }

    const nextIndex = getClampedIndex(data.length, event.nativeEvent.contentOffset.x);

    if (data[nextIndex].id !== selectedMaster?.id) {
      selectAvatarAtIndex(nextIndex);
    }
  };

  const goNext = () => {
    if (!selectedMaster) {
      return;
    }

    setMode("selection");
    setSelectedPreview({
      masterId: selectedMaster.id,
      description: selectedMaster.description,
      imageUrl: selectedMaster.defaultImageUrl,
    });
    navigation.navigate("RegistrationPlantNickname");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScreenHeader
          title="식물 데려오기"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView title="선택 가능한 식물을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScreenHeader
          title="식물 데려오기"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView
          title="식물 아바타 목록을 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <ScreenHeader
          title="식물 데려오기"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView title="선택 가능한 아바타가 없습니다." />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader
        title="식물 데려오기"
        onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
      />

      <View style={styles.content}>
        <Text style={styles.title}>원하는 아바타를 선택해주세요</Text>

        <View style={styles.carouselSection}>
          <ScrollView
            ref={scrollRef}
            horizontal
            bounces={false}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            snapToAlignment="start"
            snapToInterval={SNAP_INTERVAL}
            scrollEventThrottle={16}
            contentContainerStyle={styles.carouselContent}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleMomentumScrollEnd}
          >
            {data.map((avatar, index) => {
              const isSelected = selectedMaster?.id === avatar.id;

              return (
                <TouchableOpacity
                  key={avatar.id}
                  activeOpacity={0.92}
                  style={styles.cardBlock}
                  onPress={() => selectAvatarAtIndex(index, true)}
                >
                  <View
                    style={[
                      styles.cardFrame,
                      isSelected ? styles.cardFrameSelected : styles.cardFrameIdle,
                    ]}
                  >
                    <Image
                      source={{ uri: avatar.defaultImageUrl }}
                      resizeMode="contain"
                      style={[
                        styles.cardImage,
                        isSelected ? styles.cardImageSelected : styles.cardImageIdle,
                      ]}
                    />
                  </View>
                  <Text style={styles.cardLabel}>{avatar.description}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !selectedMaster ? styles.primaryButtonDisabled : null,
          ]}
          onPress={goNext}
          disabled={!selectedMaster}
          activeOpacity={0.88}
        >
          <Text
            style={[
              styles.primaryButtonLabel,
              !selectedMaster ? styles.primaryButtonLabelDisabled : null,
            ]}
          >
            다음
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  title: {
    marginTop: 32,
    marginLeft: 25,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
  },
  carouselSection: {
    flex: 1,
    paddingTop: 84,
    position: "relative",
  },
  carouselContent: {
    paddingHorizontal: SIDE_PADDING,
  },
  cardBlock: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
    alignItems: "center",
  },
  cardFrame: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#72D14E",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardFrameSelected: {
    backgroundColor: "#EEF9EA",
    opacity: 1,
  },
  cardFrameIdle: {
    backgroundColor: "#FFFFFF",
    opacity: 0.5,
  },
  cardImage: {
    width: CARD_WIDTH - 24,
    height: CARD_HEIGHT - 24,
  },
  cardImageSelected: {
    opacity: 1,
  },
  cardImageIdle: {
    opacity: 0.92,
  },
  cardLabel: {
    marginTop: 16,
    width: "100%",
    paddingHorizontal: 8,
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#171717",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 18,
  },
  primaryButton: {
    height: 56,
    borderRadius: 8,
    backgroundColor: "#72D14E",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#7C7C7C",
  },
  primaryButtonLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  primaryButtonLabelDisabled: {
    color: "#BFBFBF",
  },
});

