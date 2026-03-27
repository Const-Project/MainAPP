import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import PlantOptionCard from "@/components/delivery/PlantOptionCard";
import { useDeliverablePlants } from "@/hooks/delivery/useDeliveryApi";
import type { RootStackScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import { getGardenLocked, getGardenUnlockable } from "@/types/home/garden";

type Props = RootStackScreenProps<"UnlockGarden">;

export default function UnlockGardenScreen({ navigation, route }: Props) {
  const { data: plants, error, isLoading, refetch } = useDeliverablePlants();
  const gardens = useHomeSummaryStore(state => state.gardens);
  const [selectedSeedType, setSelectedSeedType] = useState<number | null>(null);

  const selectedGarden = useMemo(() => {
    if (route.params?.gardenId) {
      const routedGarden = gardens.find(garden => garden.gardenId === route.params?.gardenId);
      if (routedGarden && getGardenLocked(routedGarden)) {
        return routedGarden;
      }
    }

    return gardens.find(garden => getGardenLocked(garden) && getGardenUnlockable(garden)) ?? null;
  }, [gardens, route.params?.gardenId]);

  useEffect(() => {
    if (!selectedSeedType && plants && plants.length > 0) {
      setSelectedSeedType(plants[0].seedType);
    }
  }, [plants, selectedSeedType]);

  const selectedPlant = plants?.find(plant => plant.seedType === selectedSeedType) ?? null;

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Home" });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView title="배송 받을 식물을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView
          title="식물 목록을 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!selectedGarden) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView
          title="지금 열 수 있는 텃밭이 없습니다."
          description="홈에서 해금 가능한 텃밭이 생기면 다시 진행할 수 있습니다."
        />
      </SafeAreaView>
    );
  }

  if (!plants || plants.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView
          title="선택 가능한 식물이 없습니다."
          description="배송 가능한 식물 목록이 내려오면 씨앗 선택을 진행할 수 있습니다."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: "33.33%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>원하는 식물을 선택해주세요</Text>
          <Text style={styles.description}>
            선택한 씨앗은 새로 열리는 텃밭 {selectedGarden.gardenSlotNumber}번으로 배송 요청됩니다.
          </Text>
        </View>

        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {plants.map(plant => (
            <PlantOptionCard
              key={plant.seedType}
              plant={plant}
              selected={selectedSeedType === plant.seedType}
              onPress={() => setSelectedSeedType(plant.seedType)}
            />
          ))}
        </ScrollView>

        {selectedPlant ? <Text style={styles.selectedName}>{selectedPlant.name}</Text> : null}

        <View style={styles.pagination}>
          {plants.map(plant => (
            <View
              key={plant.seedType}
              style={[
                styles.dot,
                selectedSeedType === plant.seedType ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate("Main", { screen: "Home" })}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>나중에 받기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!selectedPlant}
          onPress={() =>
            navigation.navigate("Delivery", {
              seedType: selectedPlant?.seedType,
              seedName: selectedPlant?.name,
              gardenId: selectedGarden.gardenId,
              gardenSlotNumber: selectedGarden.gardenSlotNumber,
            })
          }
          style={[styles.primaryButton, !selectedPlant ? styles.primaryButtonDisabled : null]}
        >
          <Text style={styles.primaryButtonText}>다음</Text>
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
  progressTrack: {
    marginHorizontal: 20,
    marginTop: 16,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#F1F1F1",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#6FCF4A",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },
  headerBlock: {
    gap: 12,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#171717",
  },
  carousel: {
    gap: 18,
    paddingHorizontal: 48,
  },
  selectedName: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    color: "#171717",
  },
  pagination: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotActive: {
    backgroundColor: "#7A7A7A",
  },
  dotInactive: {
    backgroundColor: "#E2E2E2",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF9EA",
  },
  secondaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#46C02B",
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6FCF4A",
  },
  primaryButtonDisabled: {
    backgroundColor: "#EAEAEA",
  },
  primaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
