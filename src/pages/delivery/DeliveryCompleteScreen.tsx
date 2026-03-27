import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import type { RootStackScreenProps } from "@/navigation/types";

type Props = RootStackScreenProps<"DeliveryComplete">;

const packagePlantImage = require("@/assets/images/plant.png");

export default function DeliveryCompleteScreen({ navigation }: Props) {
  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="텃밭 해금하기" onBack={handleDone} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: "100%" }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>배송 요청이 완료되었어요!</Text>
          <Text style={styles.description}>3~7일 이내 자택으로 배송될 예정이에요.</Text>
          <Text style={styles.description}>이제 텃밭을 열고, 새로운 식물을 키울 수 있어요.</Text>
        </View>

        <View style={styles.imageWrap}>
          <Image source={packagePlantImage} resizeMode="contain" style={styles.image} />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.88} onPress={handleDone}>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    justifyContent: "space-between",
  },
  headerBlock: {
    gap: 10,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#171717",
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 48,
  },
  image: {
    width: 260,
    height: 260,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6FCF4A",
  },
  primaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
