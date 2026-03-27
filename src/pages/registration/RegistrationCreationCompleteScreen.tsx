import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import type { RootStackScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";

type Props = RootStackScreenProps<"RegistrationCreationComplete">;

export default function RegistrationCreationCompleteScreen({ navigation, route }: Props) {
  const username = useHomeSummaryStore(state => state.user?.username) ?? "";
  const { imageUrl } = route.params;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="식물 데려오기" />

      <View style={styles.content}>
        <Text style={styles.title}>{username || "OO"}님만의{"\n"}아바타가 완성되었어요!</Text>

        <View style={styles.previewCard}>
          <Image source={{ uri: imageUrl }} resizeMode="cover" style={styles.previewImage} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.88}
          onPress={() => navigation.replace("RegistrationPlantNickname")}
        >
          <Text style={styles.nextLabel}>다음</Text>
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
    paddingHorizontal: 25,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
  },
  previewCard: {
    width: 258,
    height: 292,
    marginTop: 66,
    marginLeft: 43,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#72D14E",
    backgroundColor: "#EEF9EA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 19,
    paddingVertical: 16,
  },
  previewImage: {
    width: 220,
    height: 261,
    borderRadius: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  nextButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: "#72D14E",
    alignItems: "center",
    justifyContent: "center",
  },
  nextLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

