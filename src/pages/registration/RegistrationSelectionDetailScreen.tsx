import { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import SelectionAvatarCard from "@/components/registration/SelectionAvatarCard";
import { useAvatarMasters } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationSelectionDetail">;

export default function RegistrationSelectionDetailScreen({
  navigation,
  route,
}: Props) {
  const entry = route.params?.entry;
  const { data, isLoading, isError, refetch } = useAvatarMasters();
  const {
    selectedMaster,
    setMode,
    setSelectedMaster,
    setSelectedPreview,
  } = useRegistrationStore();

  useEffect(() => {
    if (!selectedMaster && data && data.length > 0) {
      setSelectedMaster(data[0]);
      setSelectedPreview({
        masterId: data[0].id,
        description: data[0].description,
        imageUrl: data[0].defaultImageUrl,
      });
    }
  }, [data, selectedMaster, setSelectedMaster, setSelectedPreview]);

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
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader
          title="아바타 선택"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView title="선택 가능한 식물을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader
          title="아바타 선택"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView
          title="식물 아바타 목록을 불러오지 못했습니다."
          description="`GET /api/v1/avatars/masters`가 준비된 범위까지만 연결했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (!data || data.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader
          title="아바타 선택"
          onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
        />
        <StatusView
          title="선택 가능한 아바타가 없습니다."
          description="서버에서 마스터 식물 목록이 내려오면 이 화면에서 바로 고를 수 있습니다."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="아바타 선택"
        onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>원하는 식물 아바타를 선택해주세요.</Text>
          <Text style={styles.subtitle}>
            `GET /api/v1/avatars/masters` 응답 기준으로 목록을 보여줍니다.
          </Text>
        </View>
        <View style={styles.grid}>
          {data.map(avatar => (
            <SelectionAvatarCard
              key={avatar.id}
              avatar={avatar}
              selected={selectedMaster?.id === avatar.id}
              onPress={() => setSelectedMaster(avatar)}
            />
          ))}
        </View>
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="처음으로"
        onSecondaryPress={() => navigation.navigate("RegistrationAvatar", { entry })}
        primaryLabel="별명 정하러 가기"
        onPrimaryPress={goNext}
        primaryDisabled={!selectedMaster}
      />
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
    gap: 18,
  },
  headerBlock: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#171717",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
});

