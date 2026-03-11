import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeliveryTextField from "@/components/delivery/DeliveryTextField";

export const DELIVERY_REQUEST_OPTIONS = [
  "문 앞에 놔주세요",
  "경비실에 맡겨주세요",
  "택배함에 넣어주세요",
  "배송 전에 연락 주세요",
  "직접 입력",
] as const;

type Props = {
  value: string;
  customValue: string;
  onChange: (value: string) => void;
  onChangeCustom: (value: string) => void;
};

export default function DeliveryRequestSelector({
  value,
  customValue,
  onChange,
  onChangeCustom,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>배송 요청사항</Text>
      <Text style={styles.subtitle}>
        현재 확인된 계약 기준으로 요청 문구만 서버에 전송합니다.
      </Text>
      <View style={styles.options}>
        {DELIVERY_REQUEST_OPTIONS.map(option => {
          const selected = value === option;

          return (
            <TouchableOpacity
              key={option}
              style={[styles.option, selected ? styles.optionSelected : null]}
              activeOpacity={0.85}
              onPress={() => onChange(option)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected ? styles.optionTextSelected : null,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {value === "직접 입력" ? (
        <DeliveryTextField
          label="직접 입력"
          value={customValue}
          onChangeText={onChangeCustom}
          placeholder="요청사항을 입력해주세요"
          multiline
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  options: {
    gap: 10,
  },
  option: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },
  optionSelected: {
    borderColor: "#2F7D32",
    backgroundColor: "#EDF7ED",
  },
  optionText: {
    fontSize: 14,
    color: "#374151",
  },
  optionTextSelected: {
    color: "#1F5C27",
    fontWeight: "700",
  },
});
