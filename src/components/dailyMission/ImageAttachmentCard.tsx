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
      <TouchableOpacity
        style={[styles.imageArea, disabled ? styles.imageAreaDisabled : null]}
        activeOpacity={0.9}
        disabled={disabled}
        onPress={onPress}
      >
        {imageUrl ? (
          // 선택된 이미지 미리보기
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          // 이미지 미선택 안내 플레이스홀더
          <View style={styles.placeholderBox}>
            <Text style={styles.cameraIcon}>📷</Text>
            <View style={styles.placeholderTextGroup}>
              <Text style={styles.placeholderText}>화분을 예쁘게 가꾸고</Text>
              <Text style={styles.placeholderText}>친구들에게 멋진 식물을 자랑해보아요!</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  imageArea: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#EDEDED",
  },
  imageAreaDisabled: {
    opacity: 0.6,
  },
  // 이미지 높이 353px (피그마 기준)
  previewImage: {
    width: "100%",
    height: 353,
  },
  placeholderBox: {
    height: 353,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  cameraIcon: {
    fontSize: 32,
    opacity: 0.45,
  },
  // 플레이스홀더 텍스트 묶음
  placeholderTextGroup: {
    alignItems: "center",
    gap: 0,
  },
  // 플레이스홀더 텍스트: 14px #7C7C7C
  placeholderText: {
    fontSize: 14,
    color: "#7C7C7C",
    lineHeight: 14 * 1.6,
    textAlign: "center",
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#92400E",
    paddingHorizontal: 4,
  },
});
