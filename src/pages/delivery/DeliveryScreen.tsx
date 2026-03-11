import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import DeliveryRequestSelector from "@/components/delivery/DeliveryRequestSelector";
import DeliveryTextField from "@/components/delivery/DeliveryTextField";
import { useCreateSeedDelivery } from "@/hooks/delivery/useDeliveryApi";
import type { RootStackScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";

type Props = RootStackScreenProps<"Delivery">;

export default function DeliveryScreen({ navigation, route }: Props) {
  const user = useHomeSummaryStore(state => state.user);
  const createSeedDelivery = useCreateSeedDelivery();

  const [recipientName, setRecipientName] = useState(user?.username ?? "");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [message, setMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const seedType = route.params?.seedType;
  const seedName = route.params?.seedName;
  const resolvedMessage = message === "직접 입력" ? customMessage.trim() : message;

  const isFormValid = useMemo(
    () =>
      Boolean(
        seedType &&
          recipientName.trim() &&
          recipientPhone.trim() &&
          postalCode.trim() &&
          address.trim() &&
          addressDetail.trim()
      ),
    [address, addressDetail, postalCode, recipientName, recipientPhone, seedType]
  );

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("UnlockGarden");
  };

  const handleSubmit = async () => {
    if (!seedType || !isFormValid || createSeedDelivery.isPending) {
      return;
    }

    try {
      await createSeedDelivery.mutateAsync({
        seedType,
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        postalCode: postalCode.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        message: resolvedMessage,
      });

      navigation.replace("DeliveryComplete", {
        seedName,
        gardenId: route.params?.gardenId,
      });
    } catch {
      // Error state is rendered below through mutation state.
    }
  };

  if (!seedType) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="배송 정보 입력" onBack={handleBack} />
        <StatusView
          title="먼저 배송 받을 식물을 선택해주세요."
          description="이번 플로우에서는 `UnlockGarden` 화면에서 식물 선택 후 배송 화면으로 진입하도록 정리했습니다."
          actionLabel="식물 고르러 가기"
          onAction={() => navigation.replace("UnlockGarden")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="배송 정보 입력" onBack={handleBack} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Step 2 / 3</Text>
          <Text style={styles.heroTitle}>배송 받을 정보를 입력해주세요.</Text>
          <Text style={styles.heroDescription}>
            선택한 식물: {seedName ?? `씨앗 타입 #${seedType}`}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>받는 분 정보</Text>
          <DeliveryTextField
            label="성함"
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder="성함을 입력해주세요"
          />
          <DeliveryTextField
            label="전화번호"
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            placeholder="전화번호를 입력해주세요"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>주소 정보</Text>
          <DeliveryTextField
            label="우편번호"
            value={postalCode}
            onChangeText={setPostalCode}
            placeholder="우편번호를 입력해주세요"
            keyboardType="number-pad"
            helperText="웹의 주소 검색 UI는 RN에 아직 이식하지 않았습니다. 현재는 직접 입력만 지원합니다."
          />
          <DeliveryTextField
            label="주소"
            value={address}
            onChangeText={setAddress}
            placeholder="기본 주소를 입력해주세요"
          />
          <DeliveryTextField
            label="상세 주소"
            value={addressDetail}
            onChangeText={setAddressDetail}
            placeholder="상세 주소를 입력해주세요"
          />
        </View>

        <DeliveryRequestSelector
          value={message}
          customValue={customMessage}
          onChange={setMessage}
          onChangeCustom={setCustomMessage}
        />

        {createSeedDelivery.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>배송 요청을 완료하지 못했습니다.</Text>
            <Text style={styles.errorDescription}>
              `POST /api/v1/deliveries/seeds` 호출에 실패했습니다. 요청 필드 계약과 서버 상태를 다시 확인해야 합니다.
            </Text>
          </View>
        ) : null}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>현재 연결된 범위</Text>
          <Text style={styles.infoDescription}>
            배송 신청은 MainFE에서 확인된 payload 구조만 사용합니다. 주소 검색, 배송 조회, 수정 기능은 이번 단계 범위 밖입니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={handleBack}
        >
          <Text style={styles.secondaryButtonText}>이전</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !isFormValid || createSeedDelivery.isPending
              ? styles.primaryButtonDisabled
              : null,
          ]}
          activeOpacity={0.85}
          disabled={!isFormValid || createSeedDelivery.isPending}
          onPress={() => void handleSubmit()}
        >
          <Text style={styles.primaryButtonText}>
            {createSeedDelivery.isPending ? "전송 중..." : "배송 요청 완료"}
          </Text>
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
    padding: 20,
    gap: 20,
  },
  heroCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#255137",
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  errorCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#FEF2F2",
    gap: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7F1D1D",
  },
  infoCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#EEF3EA",
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  infoDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#2F7D32",
  },
  primaryButtonDisabled: {
    backgroundColor: "#A7D4A5",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
