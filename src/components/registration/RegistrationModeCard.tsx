import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { RegistrationMode } from "@/types/avatars";

type Props = {
  mode: RegistrationMode;
  title: string;
  description: string;
  previewLabel: string;
  selected: boolean;
  onPress: () => void;
};

export default function RegistrationModeCard({
  title,
  description,
  previewLabel,
  selected,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, selected ? styles.cardSelected : null]}
      onPress={onPress}
      activeOpacity={0.86}
    >
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={[styles.preview, selected ? styles.previewSelected : null]}>
        <Text style={styles.previewText}>{previewLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 14,
  },
  cardSelected: {
    borderColor: "#2F7D32",
    backgroundColor: "#F2FAF1",
  },
  copy: {
    gap: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  preview: {
    minHeight: 116,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  previewSelected: {
    backgroundColor: "#DDF3DE",
  },
  previewText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "700",
    color: "#1F5C27",
    textAlign: "center",
  },
});
