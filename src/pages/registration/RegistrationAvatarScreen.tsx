import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationModeCard from "@/components/registration/RegistrationModeCard";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationAvatar">;

export default function RegistrationAvatarScreen({ navigation }: Props) {
  const { mode, selectedMaster, selectedPreview, setMode } = useRegistrationStore();

  const goNext = () => {
    if (mode === "selection") {
      navigation.navigate("RegistrationSelectionDetail");
      return;
    }

    if (mode === "creation") {
      navigation.navigate("RegistrationCreationDetail");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="식물 데려오기"
        onBack={() => navigation.navigate("Main", { screen: "Home" })}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>등록 플로우 시작</Text>
          <Text style={styles.heroTitle}>어떤 방식으로 식물을 데려올지 선택하세요.</Text>
          <Text style={styles.heroDescription}>
            선택형은 제공된 아바타를 고르는 방식이고, 생성형은 이미지를 업로드한 뒤 별명을 붙이는 방식입니다.
          </Text>
        </View>

        <RegistrationModeCard
          mode="selection"
          title="아바타 선택"
          description="제공된 식물 아바타 목록 중 하나를 고른 뒤 별명을 붙입니다."
          previewLabel={selectedMaster?.description ?? "선택 가능한 식물 목록 보기"}
          selected={mode === "selection"}
          onPress={() => setMode("selection")}
        />

        <RegistrationModeCard
          mode="creation"
          title="나만의 아바타"
          description="이미지를 업로드하고, 업로드된 imageUrl로 최종 아바타 등록을 진행합니다."
          previewLabel={selectedPreview?.description ?? "이미지를 골라 나만의 식물 등록하기"}
          selected={mode === "creation"}
          onPress={() => setMode("creation")}
        />
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="나중에 하기"
        onSecondaryPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Main", params: { screen: "Home" } }],
          })
        }
        primaryLabel="다음"
        onPrimaryPress={goNext}
        primaryDisabled={!mode}
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
    gap: 16,
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
});
