import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import type { RootStackScreenProps } from "@/navigation/types";

type Props = RootStackScreenProps<"DeliveryComplete">;

export default function DeliveryCompleteScreen({ navigation, route }: Props) {
  const handleDone = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="배송 요청 완료" onBack={handleDone} />
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Step 3 / 3</Text>
        </View>
        <Text style={styles.title}>배송 요청이 완료되었어요.</Text>
        <Text style={styles.description}>
          {route.params?.seedName
            ? `${route.params.seedName} 배송 요청이 접수되었습니다.`
            : "선택한 식물의 배송 요청이 접수되었습니다."}
        </Text>
        <Text style={styles.description}>
          웹 기준 메시지처럼 3~7일 내 배송 안내를 노출했고, 이후 홈으로 돌아가서 정원 확장 흐름을 이어갈 수 있게 구성했습니다.
        </Text>

        <View style={styles.messageCard}>
          <Text style={styles.cardTitle}>다음에 이어질 흐름</Text>
          <Text style={styles.cardText}>
            정원 unlock 완료 처리와 배송 상태 추적은 서버 계약 확인 후 다음 단계에서 보강할 수 있습니다.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleDone}
        >
          <Text style={styles.primaryButtonText}>홈으로 돌아가기</Text>
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
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 18,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#DDF3DE",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F5C27",
  },
  title: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: "#4B5563",
  },
  messageCard: {
    borderRadius: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 54,
    borderRadius: 16,
    backgroundColor: "#2F7D32",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
