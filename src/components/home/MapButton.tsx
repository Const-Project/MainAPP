import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

const mapImages: Record<number, any> = {
  1: require("@/assets/images/map/map1.png"),
  2: require("@/assets/images/map/map2.png"),
  3: require("@/assets/images/map/map3.png"),
  4: require("@/assets/images/map/map4.png"),
};

interface MapButtonProps {
  slotNumber: number;
}

export default function MapButton({ slotNumber }: MapButtonProps) {
  const [isVisible, setIsVisible] = useState(false);
  const mapImage = mapImages[slotNumber] || mapImages[1];

  return (
    <>
      <TouchableOpacity onPress={() => setIsVisible(true)} style={styles.button}>
        <Image source={require("@/assets/images/map.webp")} style={styles.icon} />
      </TouchableOpacity>

      <Modal visible={isVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image source={mapImage} style={styles.mapImage} resizeMode="contain" />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 32,
    height: 32,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    width: "85%",
  },
  mapImage: {
    width: "100%",
    height: 300,
  },
});
