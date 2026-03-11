import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  imageUrl?: string | null;
  disabled?: boolean;
  onPress: () => void;
  helperText?: string;
};

export default function ImageAttachmentCard({
  imageUrl,
  disabled = false,
  onPress,
  helperText,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>이미지 첨부</Text>
      <TouchableOpacity
        style={[styles.card, disabled ? styles.cardDisabled : null]}
        activeOpacity={0.85}
        disabled={disabled}
        onPress={onPress}
      >
        <Text style={styles.title}>
          {imageUrl ? "업로드된 이미지가 있습니다." : "이미지를 선택하거나 업로드하세요"}
        </Text>
        <Text style={styles.description}>
          {imageUrl
            ? imageUrl
            : "현재 프로젝트에는 RN 이미지 선택 라이브러리가 없어 업로드 인터페이스만 먼저 정리했습니다."}
        </Text>
      </TouchableOpacity>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    gap: 6,
    backgroundColor: "#FFFFFF",
  },
  cardDisabled: {
    backgroundColor: "#F9FAFB",
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#92400E",
  },
});
