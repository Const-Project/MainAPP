import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LeftIcon } from "@/assets/icons/CommonIcons";

type Props = {
  title: string;
  onBack?: () => void;
};

export default function ScreenHeader({ title, onBack }: Props) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={styles.sideButton}
      >
        <LeftIcon size={24} color="#171717" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.sideButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  sideButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
});
