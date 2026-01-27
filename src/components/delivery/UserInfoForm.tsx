import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface UserInfoFormProps {
  name: string;
  setName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
}

export default function UserInfoForm({ name, setName, phone, setPhone }: UserInfoFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>받는 분 정보</Text>

      <View style={[styles.fieldContainer, name ? styles.fieldActive : styles.fieldInactive]}>
        <Text style={styles.label}>성함</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="성함을 입력해주세요"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View style={[styles.fieldContainer, phone ? styles.fieldActive : styles.fieldInactive]}>
        <Text style={styles.label}>전화번호</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="전화번호를 입력해주세요"
          placeholderTextColor="#9CA3AF"
          keyboardType="phone-pad"
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
