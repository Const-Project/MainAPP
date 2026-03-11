import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  getGardenLocked,
  getGardenUnlockable,
  type GardenSummary,
} from "@/types/home/garden";

type Props = {
  garden: GardenSummary;
  selected: boolean;
  onPress: () => void;
};

export default function GardenSlotCard({ garden, selected, onPress }: Props) {
  const isUnlockable = getGardenUnlockable(garden);
  const isLocked = getGardenLocked(garden);
  const statusText = isUnlockable ? "해금 가능" : isLocked ? "아직 잠금 상태" : "사용 가능";

  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.cardSelected : null]}
      onPress={onPress}
      activeOpacity={0.86}
      disabled={!isUnlockable}
    >
      <View style={styles.row}>
        <Text style={styles.title}>정원 슬롯 {garden.gardenSlotNumber}</Text>
        <Text
          style={[
            styles.badge,
            isUnlockable ? styles.badgeReady : styles.badgeLocked,
          ]}
        >
          {statusText}
        </Text>
      </View>
      <Text style={styles.description}>
        {garden.avatar?.avatarName
          ? `${garden.avatar.avatarName}와 연결된 슬롯`
          : "새 식물을 받을 수 있는 잠금 슬롯"}
      </Text>
      <Text style={styles.caption}>
        해금 버튼을 누르면 `POST /api/v1/gardens/unlock`를 body 없이 호출합니다.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    padding: 16,
    gap: 8,
  },
  cardSelected: {
    borderColor: "#2F7D32",
    backgroundColor: "#F2FAF1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  badge: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    overflow: "hidden",
  },
  badgeReady: {
    color: "#1F5C27",
    backgroundColor: "#DDF3DE",
  },
  badgeLocked: {
    color: "#92400E",
    backgroundColor: "#FEF3C7",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
});
