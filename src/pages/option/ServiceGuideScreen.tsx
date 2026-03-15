import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";

type Props = RootStackScreenProps<"ServiceGuide">;

export default function ServiceGuideScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerCard}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.headerSideButton}
        >
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서비스 안내</Text>
        <View style={styles.headerSideButton} />
      </View>

      <View style={styles.carouselWrap}>
        {/* 한글 주석:
            서비스 안내는 별도 API 없이 온보딩의 4장 소개 슬라이드를 그대로 재사용하되,
            설정 화면 진입 문맥에 맞게 상단 헤더만 박스형으로 따로 얹는다. */}
        <OnboardingCarousel paginationBottom={28} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerCard: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.96)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  headerSideButton: {
    width: 56,
    minHeight: 44,
    justifyContent: "center",
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  carouselWrap: {
    flex: 1,
  },
});
