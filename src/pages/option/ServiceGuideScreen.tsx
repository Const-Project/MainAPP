import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeftIcon from "@/assets/icons/common/left.svg";
import type { RootStackScreenProps } from "@/navigation/types";
import OnboardingCarousel from "@/components/onboarding/OnboardingCarousel";

type Props = RootStackScreenProps<"ServiceGuide">;

export default function ServiceGuideScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          style={styles.headerSideButton}
        >
          <LeftIcon width={24} height={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서비스 안내</Text>
        <View style={styles.headerSideButton} />
      </View>

      <View style={styles.carouselWrap}>
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
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  headerSideButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#171717",
  },
  carouselWrap: {
    flex: 1,
  },
});
