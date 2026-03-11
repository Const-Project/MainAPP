import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import GardenSlotCard from "@/components/delivery/GardenSlotCard";
import PlantOptionCard from "@/components/delivery/PlantOptionCard";
import { useDeliverablePlants, useUnlockGarden } from "@/hooks/delivery/useDeliveryApi";
import useHomeApi from "@/hooks/home/useHomeApi";
import type { RootStackScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import { getGardenLocked, getGardenUnlockable } from "@/types/home/garden";

type Props = RootStackScreenProps<"UnlockGarden">;

export default function UnlockGardenScreen({ navigation }: Props) {
  const {
    data: homeData,
    refetch: refetchHome,
  } = useHomeApi();
  const {
    data: plants,
    error,
    isLoading,
    refetch,
  } = useDeliverablePlants();
  const unlockGarden = useUnlockGarden();
  const { gardens, hydrate } = useHomeSummaryStore();
  const [selectedSeedType, setSelectedSeedType] = useState<number | null>(null);
  const [selectedGardenId, setSelectedGardenId] = useState<number | null>(null);

  useEffect(() => {
    if (homeData) {
      hydrate(homeData);
    }
  }, [homeData, hydrate]);

  const lockedGardens = useMemo(
    () => gardens.filter(garden => getGardenLocked(garden)),
    [gardens]
  );

  useEffect(() => {
    if (!selectedGardenId && lockedGardens.length > 0) {
      const initialGarden =
        lockedGardens.find(garden => getGardenUnlockable(garden)) ?? lockedGardens[0];
      setSelectedGardenId(initialGarden.gardenId);
    }
  }, [lockedGardens, selectedGardenId]);

  useEffect(() => {
    if (!selectedSeedType && plants && plants.length > 0) {
      setSelectedSeedType(plants[0].seedType);
    }
  }, [plants, selectedSeedType]);

  const selectedPlant =
    plants?.find(plant => plant.seedType === selectedSeedType) ?? null;
  const selectedGarden =
    lockedGardens.find(garden => garden.gardenId === selectedGardenId) ?? null;
  const canUnlock = Boolean(selectedGarden && getGardenUnlockable(selectedGarden));

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Home" });
  };

  const handleUnlock = async () => {
    if (!canUnlock || unlockGarden.isPending) {
      return;
    }

    try {
      await unlockGarden.mutateAsync();
      await refetchHome();
      Alert.alert("정원 해금 완료", "홈에서 변경된 정원 상태를 확인할 수 있습니다.", [
        {
          text: "홈으로 이동",
          onPress: () => navigation.navigate("Main", { screen: "Home" }),
        },
      ]);
    } catch (unlockError) {
      const message =
        unlockError instanceof Error
          ? unlockError.message
          : "정원 해금 중 오류가 발생했습니다.";
      Alert.alert("정원 해금 실패", message);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView title="해금 가능한 식물을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView
          title="식물 목록을 불러오지 못했습니다."
          description="현재 확인된 API는 배송용 식물 목록 조회까지만 연결했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
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
          description="`GET /api/v1/deliveries/plants` 응답이 비어 있으면 배송 신청 단계로 넘어갈 수 없습니다."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>정원 해금</Text>
          <Text style={styles.heroTitle}>
            해금 가능한 슬롯을 선택하고 정원을 열어주세요.
          </Text>
          <Text style={styles.heroDescription}>
            정원 해금은 `POST /api/v1/gardens/unlock`를 body 없이 호출하고, 성공 후 홈 데이터를 다시 조회합니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>잠금 슬롯 상태</Text>
          <Text style={styles.sectionDescription}>
            홈 summary에 내려온 `isLocked`, `isUnlockable` 상태를 기준으로 표시합니다.
          </Text>
          {lockedGardens.length > 0 ? (
            lockedGardens.map(garden => (
              <GardenSlotCard
                key={garden.gardenId}
                garden={garden}
                selected={selectedGardenId === garden.gardenId}
                onPress={() => setSelectedGardenId(garden.gardenId)}
              />
            ))
          ) : (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>잠금된 정원 슬롯이 없습니다.</Text>
              <Text style={styles.infoDescription}>
                홈 summary에 잠금 슬롯이 내려오면 이 화면에서 바로 확인할 수 있습니다.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배송 받을 식물</Text>
          <Text style={styles.sectionDescription}>
            배송은 정원 해금과 독립적인 흐름이라, 필요할 때만 별도로 진행합니다.
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
        </View>

        {unlockGarden.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>정원 해금에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>
              서버 공통 에러 응답을 확인한 뒤 다시 시도해주세요.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("Delivery", {
              seedType: selectedPlant?.seedType,
              seedName: selectedPlant?.name,
              gardenId: selectedGardenId ?? undefined,
            })
          }
          disabled={!selectedPlant}
        >
          <Text style={styles.secondaryButtonText}>배송 정보 입력</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            (!canUnlock || unlockGarden.isPending) ? styles.primaryButtonDisabled : null,
          ]}
          activeOpacity={0.85}
          disabled={!canUnlock || unlockGarden.isPending}
          onPress={() => void handleUnlock()}
        >
          <Text style={styles.primaryButtonText}>
            {unlockGarden.isPending ? "해금 중..." : "정원 해금하기"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  content: {
    padding: 20,
    gap: 20,
  },
  heroCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#234A2F",
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    color: "#D7E9D8",
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E5F4E5",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  horizontalList: {
    gap: 12,
    paddingRight: 20,
  },
  infoCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#EEF3EA",
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  errorCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FEF2F2",
    gap: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7F1D1D",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#2F7D32",
  },
  primaryButtonDisabled: {
    backgroundColor: "#A7D4A5",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
