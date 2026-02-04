import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

const TrackingImg = require("@/assets/images/tracking.webp");
const CharImg = require("@/assets/images/char.png");

interface TrackingModalProps {
  onClose: () => void;
}

export default function TrackingModal({ onClose }: TrackingModalProps) {
  const [isLiked, setIsLiked] = useState(true);

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Text style={styles.title}>함께해요!</Text>

          {isLiked ? (
            <View style={styles.content}>
              <Image
                source={TrackingImg}
                style={styles.trackingImage}
                resizeMode="contain"
              />
              <Text style={styles.description}>
                2주동안 12일 식물을 키우셨습니다!{"\n"}열심히 노력하셨군요{"\n"}
                앞으로도 같이 열심히 키워봐요!
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setIsLiked(false)}
              >
                <Text style={styles.primaryButtonText}>좋아요 !</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.content}>
              <Image
                source={CharImg}
                style={styles.charImage}
                resizeMode="contain"
              />
              <Text style={styles.description}>
                힘든 순간도 결국 지나갑니다.{"\n"}마음도 한결 가벼워질 날이 올
                거에요!{"\n"}그때까지 제가 함께하겠습니다.
              </Text>
              <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                <Text style={styles.primaryButtonText}>고마워요 !</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "80%",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  content: {
    width: "100%",
    alignItems: "center",
    gap: 24,
  },
  trackingImage: {
    width: 200,
    height: 200,
  },
  charImage: {
    width: 80,
    height: 80,
  },
  description: {
    fontSize: 14,
    color: "#171717",
    textAlign: "center",
    lineHeight: 20,
  },
  primaryButton: {
    width: "100%",
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#7DC960",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
