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
          <Image
            source={{ uri: imageUrl }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.placeholderText}>화분을 예쁘게 가꾸고</Text>
            <Text style={styles.placeholderText}>
              친구들에게 멋진 식물을 자랑해보아요!
            </Text>
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
  previewImage: {
    width: "100%",
    height: 260,
  },
  placeholderBox: {
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cameraIcon: {
    fontSize: 32,
    marginBottom: 4,
    opacity: 0.45,
  },
  placeholderText: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 20,
    textAlign: "center",
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#92400E",
    paddingHorizontal: 4,
  },
});