import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { TrackingReportPayload } from "@/types/home/tracking";

const trackingImage = require("@/assets/images/tracking.webp");
const characterImage = require("@/assets/images/char.webp");

export default function HomeTrackingModal({
  visible,
  report,
  onClose,
}: {
  visible: boolean;
  report: TrackingReportPayload | null;
  onClose: () => void;
}) {
  const [liked, setLiked] = useState(true);

  useEffect(() => {
    if (visible) {
      setLiked(true);
    }
  }, [visible]);

  if (!report) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.title}>함께해요!</Text>
          {liked ? (
            <>
              <Image source={trackingImage} style={styles.trackingImage} resizeMode="contain" />
              <Text style={styles.body}>
                2주동안 {report.praiseDayCount}일 물과 햇빛을 모두 챙기셨어요!{"\n"}
                열심히 돌봐주셨군요{"\n"}
                앞으로도 같이 잘 키워봐요!
              </Text>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setLiked(false)}>
                <Text style={styles.secondaryButtonText}>좋아요</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image source={characterImage} style={styles.characterImage} resizeMode="contain" />
              <Text style={styles.body}>{report.message}</Text>
              <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                <Text style={styles.primaryButtonText}>고마워요</Text>
              </TouchableOpacity>
            </>
          )}
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
    maxWidth: 340,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: "center",
    gap: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },
  trackingImage: {
    width: 200,
    height: 150,
  },
  characterImage: {
    width: 84,
    height: 84,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    color: "#171717",
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#7DC960",
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#EEF3EA",
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#2E5134",
    fontSize: 15,
    fontWeight: "700",
  },
});
