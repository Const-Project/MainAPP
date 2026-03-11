import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { GardenInfo } from "@/types/profile/profileApi.type";

type Props = {
  garden: GardenInfo;
  leftWaterCountForOthers: number;
  onWater: () => void;
  waterDisabled?: boolean;
};

export default function ProfileDetail({
  garden,
  leftWaterCountForOthers,
  onWater,
  waterDisabled = false,
}: Props) {
  const canWater = garden.isWateringAbleByMe && !waterDisabled;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>대표 정원</Text>
      <View style={styles.card}>
        <View style={styles.avatarRow}>
          <View style={styles.imageWrap}>
            {garden.avatarInfo?.avatarImageUrl ? (
              <Image
                source={{ uri: garden.avatarInfo.avatarImageUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : null}
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.avatarName}>
              {garden.avatarInfo?.avatarName ?? "등록된 식물이 없습니다."}
            </Text>
            <Text style={styles.metaText}>남은 친구 물주기 {leftWaterCountForOthers}회</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.waterButton, !canWater && styles.waterButtonDisabled]}
          onPress={onWater}
          disabled={!canWater}
          activeOpacity={0.85}
        >
          <Text style={[styles.waterButtonText, !canWater && styles.waterButtonTextDisabled]}>
            {garden.isWateringAbleByMe ? "친구 물주기" : "오늘은 이미 물을 주었습니다"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#F5F7F1",
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  avatarName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  metaText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#6B7280",
  },
  waterButton: {
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    alignItems: "center",
  },
  waterButtonDisabled: {
    backgroundColor: "#E5E7EB",
  },
  waterButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  waterButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
