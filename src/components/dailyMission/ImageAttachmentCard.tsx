import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderPlus}>+</Text>
          </View>
        )}
        <View style={styles.textBlock}>
          <Text style={styles.title}>{imageUrl ? "선택한 이미지" : "이미지를 선택해주세요"}</Text>
          <Text style={styles.description}>
            {imageUrl
              ? "다시 누르면 다른 이미지로 바꿀 수 있습니다."
              : "사진첩에서 일기에 첨부할 이미지를 고를 수 있습니다."}
          </Text>
        </View>
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 16,
    gap: 14,
    backgroundColor: "#FFFFFF",
  },
  cardDisabled: {
    backgroundColor: "#F9FAFB",
  },
  previewImage: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
  },
  placeholderBox: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderPlus: {
    fontSize: 34,
    lineHeight: 36,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  textBlock: {
    gap: 6,
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
