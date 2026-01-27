import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface DeliveryAddressFormProps {
  zipcode: string;
  setZipcode: (v: string) => void;
  address: string;
  setAddress: (v: string) => void;
  detailAddress: string;
  setDetailAddress: (v: string) => void;
}

export default function DeliveryAddressForm({
  zipcode,
  setZipcode,
  address,
  setAddress,
  detailAddress,
  setDetailAddress,
}: DeliveryAddressFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>배송지 정보</Text>

      <View style={[styles.fieldContainer, zipcode ? styles.fieldActive : styles.fieldInactive]}>
        <Text style={styles.label}>우편번호</Text>
        <TextInput
          style={styles.input}
          value={zipcode}
          onChangeText={setZipcode}
          placeholder="우편번호를 입력해주세요"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
        />
      </View>

      <View style={[styles.fieldContainer, address ? styles.fieldActive : styles.fieldInactive]}>
        <Text style={styles.label}>주소</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="주소를 입력해주세요"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={[styles.fieldContainer, detailAddress ? styles.fieldActive : styles.fieldInactive]}>
        <Text style={styles.label}>상세 주소</Text>
        <TextInput
          style={styles.input}
          value={detailAddress}
          onChangeText={setDetailAddress}
          placeholder="상세 주소를 입력해주세요"
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  fieldContainer: {
    borderBottomWidth: 1,
    paddingVertical: 8,
    gap: 4,
  },
  fieldActive: {
    borderBottomColor: "#7DC960",
  },
  fieldInactive: {
    borderBottomColor: "#D1D5DB",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
  },
  input: {
    fontSize: 14,
    color: "#171717",
    padding: 0,
  },
});
