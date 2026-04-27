import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const mapImages = [
  require("@/assets/images/map/map1.png"),
  require("@/assets/images/map/map2.png"),
  require("@/assets/images/map/map3.png"),
  require("@/assets/images/map/map4.png"),
] as const;

export default function HomeMapModal({
  visible,
  slotNumber,
  onClose,
}: {
  visible: boolean;
  slotNumber: number;
  onClose: () => void;
}) {
  const imageSource = mapImages[Math.max(0, Math.min(mapImages.length - 1, slotNumber - 1))];

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>텃밭 지도</Text>
          <TouchableOpacity activeOpacity={0.9} onPress={onClose}>
            <Image source={imageSource} style={styles.mapImage} resizeMode="contain" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  mapImage: {
    width: 320,
    height: 320,
    borderRadius: 18,
  },
});
