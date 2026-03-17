import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { usePolicy } from "@/hooks/option/usePolicyApi";

type Props = RootStackScreenProps<"Policy">;

const POLICY_TEXT = `제1조 (목적)
이 약관은 나풀나풀이가 제공하는 반려식물 아바타 키우기 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

제2조 (정의)
"회원"이라 함은 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
"아바타 식물"이라 함은 회원이 앱 내에서 돌보고 성장시키는 가상의 식물을 의미합니다.
"콘텐츠"라 함은 서비스 내에서 제공되는 이미지, 텍스트, 데이터 등을 말합니다.

제3조 (약관의 효력 및 변경)
본 약관은 회원이 동의함과 동시에 효력이 발생합니다.
회사는 필요 시 관련 법령을 위배하지 않는 범위 내에서 약관을 변경할 수 있습니다.`;

export default function PolicyScreen({ navigation }: Props) {
  const { data } = usePolicy();
  const policyText = data?.trim() ? data : POLICY_TEXT;

  const handleBack = () => {
    navigation.goBack();
  };

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
          <Text style={styles.body}>{policyText}</Text>
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
