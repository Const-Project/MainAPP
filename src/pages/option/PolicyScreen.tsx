import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import StatusView from "@/components/common/StatusView";
import { usePolicy } from "@/hooks/option/usePolicyApi";

type Props = RootStackScreenProps<"Policy">;

export default function PolicyScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch } = usePolicy();

  const handleBack = () => {
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView title="이용 약관을 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="이용 약관을 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.sideButton}>
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이용 약관</Text>
        <View style={styles.sideButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.body}>
            {/* 한글 주석:
                약관 API는 현재 문자열 본문 하나를 내려주기 때문에,
                프론트에서는 스크롤 가능한 읽기 화면으로만 단순하게 구성한다. */}
            {data}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  sideButton: {
    width: 56,
    height: 44,
    justifyContent: "center",
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },
  content: {
    padding: 20,
  },
  card: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  body: {
    fontSize: 14,
    lineHeight: 24,
    color: "#374151",
  },
});
