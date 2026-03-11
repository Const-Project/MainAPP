import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { DeliverablePlant } from "@/types/delivery";

type Props = {
  plant: DeliverablePlant;
  selected: boolean;
  onPress: () => void;
};

export default function PlantOptionCard({ plant, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.cardSelected : null]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {plant.imageUrl ? (
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imageFallback]}>
          <Text style={styles.fallbackText}>이미지 없음</Text>
        </View>
      )}
      <Text style={styles.name}>{plant.name}</Text>
      <Text style={styles.caption}>씨앗 타입 #{plant.seedType}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 180,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    gap: 10,
  },
  cardSelected: {
    borderColor: "#2F7D32",
    backgroundColor: "#F2FAF1",
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  imageFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  fallbackText: {
    fontSize: 13,
    color: "#6B7280",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  caption: {
    fontSize: 12,
    color: "#6B7280",
  },
});
