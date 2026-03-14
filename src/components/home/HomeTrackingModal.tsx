import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { TrackingPromptStatusPayload } from "@/types/home/tracking";

const trackingImage = require("@/assets/images/tracking.webp");

export default function HomeTrackingModal({
  visible,
  report,
  isConfirming,
  onConfirm,
}: {
  visible: boolean;
  report: TrackingPromptStatusPayload | null;
  isConfirming: boolean;
  onConfirm: () => void;
}) {
  if (!report) {
    return null;
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onConfirm}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onConfirm}
          disabled={isConfirming}
        />
        <View style={styles.card}>
          <Text style={styles.title}>2주 리포트가 도착했어요</Text>
          <Image source={trackingImage} style={styles.trackingImage} resizeMode="contain" />
          <Text style={styles.body}>
            최근 14일 동안 {report.perfectDayCount}일을 완벽하게 돌봤어요.{"\n"}
            {report.message}
          </Text>
          <TouchableOpacity
            style={[styles.primaryButton, isConfirming && styles.primaryButtonDisabled]}
            onPress={onConfirm}
            disabled={isConfirming}
          >
            <Text style={styles.primaryButtonText}>
              {isConfirming ? "확인 중..." : "리포트 확인했어요"}
            </Text>
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
    textAlign: "center",
  },
  trackingImage: {
    width: 200,
    height: 150,
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
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
