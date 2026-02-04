import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { LeftIcon } from "@/assets/icons/CommonIcons";

type Props = RootStackScreenProps<"Terms">;

const TERMS_CONTENT = `제1조 (목적)
이 약관은 [서비스명] 나풀나풀이(가) 제공하는 반려식물 아바타 키우기 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "회원"이라 함은 본 약관에 동의하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.
2. "아바타 식물"이라 함은 회원이 앱 내에서 돌보고 성장시키는 가상의 식물을 의미합니다.
3. "콘텐츠"라 함은 서비스 내에서 제공되는 이미지, 텍스트, 데이터 등을 말합니다.

제3조 (약관의 효력 및 변경)
1. 본 약관은 회원이 동의함과 동시에 효력이 발생합니다.
2. 회사는 필요 시 관련 법령을 위배하지 않는 범위 내에서 약관을 변경할 수 있습니다.`;

export default function TermsScreen({ navigation }: Props) {
  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>이용약관</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 약관 내용 */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.termsText}>{TERMS_CONTENT}</Text>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>확인</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  confirmButton: {
    backgroundColor: "#7DC960",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
