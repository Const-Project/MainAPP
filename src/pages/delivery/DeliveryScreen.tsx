import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import AddressSearchModal, { type SelectedAddress } from "@/components/delivery/AddressSearchModal";
import DeliveryRequestSelector from "@/components/delivery/DeliveryRequestSelector";
import DeliveryTextField from "@/components/delivery/DeliveryTextField";
import { useCreateSeedDelivery, useUnlockGarden } from "@/hooks/delivery/useDeliveryApi";
import type { RootStackScreenProps } from "@/navigation/types";
import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";

type Props = RootStackScreenProps<"Delivery">;

export default function DeliveryScreen({ navigation, route }: Props) {
  const user = useHomeSummaryStore(state => state.user);
  const gardens = useHomeSummaryStore(state => state.gardens);
  const updateGarden = useHomeSummaryStore(state => state.updateGarden);
  const setUser = useHomeSummaryStore(state => state.setUser);
  const createSeedDelivery = useCreateSeedDelivery();
  const unlockGarden = useUnlockGarden();

  const [recipientName, setRecipientName] = useState(user?.username ?? "");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [isAddressSearchOpen, setIsAddressSearchOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const seedType = route.params?.seedType;
  const seedName = route.params?.seedName;
  const gardenId = route.params?.gardenId;
  const gardenSlotNumber = route.params?.gardenSlotNumber;
  const selectedGarden = useMemo(
    () => gardens.find(garden => garden.gardenId === gardenId) ?? null,
    [gardenId, gardens]
  );
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

    navigation.navigate("UnlockGarden", {
      gardenId,
      gardenSlotNumber,
    });
  };

  const handleSelectAddress = (selectedAddress: SelectedAddress) => {
    setPostalCode(selectedAddress.postalCode);
    setAddress(selectedAddress.address);
    setAddressDetail("");
  };

  const handleSubmit = async () => {
    if (!seedType || !isFormValid || createSeedDelivery.isPending || unlockGarden.isPending) {
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
        message: resolvedMessage || undefined,
      });

      await unlockGarden.mutateAsync();

      if (selectedGarden) {
        updateGarden(selectedGarden.gardenId, {
          isLocked: false,
          locked: false,
          isUnlockable: false,
          unlockable: false,
          avatar: null,
        });
      }

      if (user) {
        setUser({
          ...user,
          lastAccessedSlotNumber: gardenSlotNumber ?? user.lastAccessedSlotNumber,
        });
      }

      navigation.replace("DeliveryComplete", {
        seedName,
        gardenId,
        gardenSlotNumber,
      });
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("진행 실패", error.message);
      }
    }
  };

  if (!seedType) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
        <StatusView
          title="먼저 배송 받을 식물을 선택해주세요."
          actionLabel="식물 고르러 가기"
          onAction={() => navigation.replace("UnlockGarden", { gardenId, gardenSlotNumber })}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="텃밭 해금하기" onBack={handleBack} />
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: "66.66%" }]} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.headerBlock}>
          <Text style={styles.title}>배송 정보를 입력해주세요</Text>
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
          <Text style={styles.sectionTitle}>배송지 정보</Text>
          <View style={styles.addressSearchRow}>
            <View style={styles.postalCodeField}>
              <DeliveryTextField
                label="우편번호"
                value={postalCode}
                onChangeText={setPostalCode}
                placeholder="주소 검색"
                keyboardType="number-pad"
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.86}
              onPress={() => setIsAddressSearchOpen(true)}
              style={styles.addressSearchButton}
            >
              <Text style={styles.addressSearchButtonText}>검색</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.9} onPress={() => setIsAddressSearchOpen(true)}>
            <View pointerEvents="none">
              <DeliveryTextField
                label="주소"
                value={address}
                onChangeText={setAddress}
                placeholder="도로명 주소를 검색해주세요"
                editable={false}
                helperText="검색 버튼으로 도로명 주소와 우편번호를 자동 입력할 수 있습니다."
              />
            </View>
          </TouchableOpacity>
          <DeliveryTextField
            label="상세 주소"
            value={addressDetail}
            onChangeText={setAddressDetail}
            placeholder="주소를 입력해주세요"
          />
        </View>

        <DeliveryRequestSelector
          value={message}
          customValue={customMessage}
          onChange={setMessage}
          onChangeCustom={setCustomMessage}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => navigation.navigate("Main", { screen: "Home" })}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>나중에 받기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={!isFormValid || createSeedDelivery.isPending || unlockGarden.isPending}
          onPress={() => void handleSubmit()}
          style={[
            styles.primaryButton,
            !isFormValid || createSeedDelivery.isPending || unlockGarden.isPending
              ? styles.primaryButtonDisabled
              : null,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              !isFormValid || createSeedDelivery.isPending || unlockGarden.isPending
                ? styles.primaryButtonTextDisabled
                : null,
            ]}
          >
            {createSeedDelivery.isPending || unlockGarden.isPending ? "진행 중..." : "다음"}
          </Text>
        </TouchableOpacity>
      </View>

      <AddressSearchModal
        visible={isAddressSearchOpen}
        onClose={() => setIsAddressSearchOpen(false)}
        onSelect={handleSelectAddress}
      />
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
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    gap: 36,
  },
  headerBlock: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "700",
    color: "#171717",
  },
  section: {
    gap: 18,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "700",
    color: "#171717",
  },
  addressSearchRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  postalCodeField: {
    flex: 1,
  },
  addressSearchButton: {
    height: 52,
    minWidth: 82,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF9EA",
    borderWidth: 1,
    borderColor: "#BFE8B0",
  },
  addressSearchButtonText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "700",
    color: "#46C02B",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF9EA",
  },
  secondaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#46C02B",
  },
  primaryButton: {
    flex: 1,
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6FCF4A",
  },
  primaryButtonDisabled: {
    backgroundColor: "#EAEAEA",
  },
  primaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  primaryButtonTextDisabled: {
    color: "#BFBFBF",
  },
});
