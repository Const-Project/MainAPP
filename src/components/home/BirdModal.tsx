import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";

const BirdImg = require("@/assets/images/bird.webp");

interface BirdModalProps {
  onClose: () => void;
}

export default function BirdModal({ onClose }: BirdModalProps) {
  const [isRecord, setIsRecord] = useState(true);

  return (
    <Modal visible transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.modal} onStartShouldSetResponder={() => true}>
          <Image source={BirdImg} style={styles.birdImage} resizeMode="contain" />

          <Text style={styles.title}>알림</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, isRecord && styles.activeTab]}
              onPress={() => setIsRecord(true)}
            >
              <Text style={[styles.tabText, isRecord && styles.activeTabText]}>
                방명록
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, !isRecord && styles.activeTab]}
              onPress={() => setIsRecord(false)}
            >
              <Text style={[styles.tabText, !isRecord && styles.activeTabText]}>
                기록
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.emptyText}>
            {isRecord
              ? "아직 방문한 친구들이 없어요!"
              : "아직 기록이 없어요!"}
          </Text>
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
    width: "85%",
    alignItems: "center",
    gap: 16,
  },
  birdImage: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  tabContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    alignItems: "center",
  },
  activeTab: {
    borderBottomColor: "#7DC960",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#171717",
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 16,
  },
});
