import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

import { CheckIcon, UnCheckIcon } from "@/assets/icons/CommonIcons";

const deliveryOptions = [
  "문 앞에 놔주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전에 연락 주세요",
  "직접 입력",
];

interface DeliveryRequestFormProps {
  message: string;
  setMessage: (v: string) => void;
  optionMessage: string;
  setOptionMessage: (v: string) => void;
}

export default function DeliveryRequestForm({
  message,
  setMessage,
  optionMessage,
  setOptionMessage,
}: DeliveryRequestFormProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>배송 요청사항(선택)</Text>
      <View>
        {deliveryOptions.map(option => (
          <TouchableOpacity
            key={option}
            style={styles.optionRow}
            onPress={() => setMessage(option)}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>{option}</Text>
            {message === option ? (
              <CheckIcon size={20} color="#7DC960" />
            ) : (
              <UnCheckIcon size={20} color="#9CA3AF" />
            )}
          </TouchableOpacity>
        ))}
        {message === "직접 입력" && (
          <TextInput
            style={styles.customInput}
            value={optionMessage}
            onChangeText={setOptionMessage}
            placeholder="요청사항을 입력해주세요"
            placeholderTextColor="#9CA3AF"
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  customInput: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    paddingVertical: 12,
    fontSize: 14,
    color: "#6B7280",
  },
});
