import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { AvatarMaster } from "@/types/avatars";

type Props = {
  avatar: AvatarMaster;
  selected: boolean;
  onPress: () => void;
};

export default function SelectionAvatarCard({
  avatar,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.cardSelected : null]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Image source={{ uri: avatar.defaultImageUrl }} style={styles.image} />
      <Text style={styles.description}>{avatar.description}</Text>
      <View style={[styles.badge, selected ? styles.badgeSelected : null]}>
        <Text style={[styles.badgeText, selected ? styles.badgeTextSelected : null]}>
          {selected ? "선택됨" : "선택하기"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    borderRadius: 18,
    padding: 12,
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
    aspectRatio: 1,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#171717",
    fontWeight: "600",
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeSelected: {
    backgroundColor: "#DDF3DE",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  badgeTextSelected: {
    color: "#1F5C27",
  },
});
