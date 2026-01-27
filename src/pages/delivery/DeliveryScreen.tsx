import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import type { RootStackParamList } from "@/navigation/types";
import { postDeliverySeedApi } from "@/apis/delivery/deliveryApi";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import ProgressBar from "@/components/common/ProgressBar";
import UserInfoForm from "@/components/delivery/UserInfoForm";
import DeliveryAddressForm from "@/components/delivery/DeliveryAddressForm";
import DeliveryRequestForm from "@/components/delivery/DeliveryRequestForm";

export default function DeliveryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [message, setMessage] = useState("");
  const [optionMessage, setOptionMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isFormValid =
    name.trim() !== "" &&
    phone.trim() !== "" &&
    zipcode.trim() !== "" &&
    detailAddress.trim() !== "" &&
    (message.trim() !== "" || optionMessage.trim() !== "");

  const handleSubmit = async () => {
    if (!isFormValid || submitting) return;
    try {
      setSubmitting(true);
      const raw = await AsyncStorage.getItem("selectedId");
      const seedType = raw ? parseInt(raw, 10) : 1;

      await postDeliverySeedApi({
        seedType,
        recipientName: name,
        recipientPhone: phone,
        postalCode: zipcode,
        address,
        addressDetail: detailAddress,
        message: message === "직접 입력" ? optionMessage : message,
      });
      navigation.navigate("DeliveryComplete");
    } catch {
      Alert.alert("오류", "배송 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.screen}>
      <DeliveryHeader title="텃밭 해금하기" />

      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={2} totalSteps={3} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.formContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>배송 정보를 입력해주세요</Text>

          <UserInfoForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
          />

          <DeliveryAddressForm
            zipcode={zipcode}
            setZipcode={setZipcode}
            address={address}
            setAddress={setAddress}
            detailAddress={detailAddress}
            setDetailAddress={setDetailAddress}
          />

          <DeliveryRequestForm
            message={message}
            setMessage={setMessage}
            optionMessage={optionMessage}
            setOptionMessage={setOptionMessage}
          />
        </ScrollView>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate("DeliveryComplete")}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>나중에 받기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              !isFormValid && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid || submitting}
            activeOpacity={0.7}
          >
            <Text style={styles.primaryButtonText}>다음</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  flex: {
    flex: 1,
  },
  progressBarContainer: {
    padding: 16,
  },
  formContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    marginTop: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    justifyContent: "center",
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#7DC960",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
});
