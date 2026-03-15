import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useGuestbookList, useNotifications } from "@/hooks/home/useHomeApi";
import type { GuestbookEntry, NotificationItem } from "@/types/home/alerts";

type AlertTab = "GUESTBOOK" | "RECORD";

export default function HomeAlertsModal({
  visible,
  userId,
  onClose,
}: {
  visible: boolean;
  userId: number | null;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<AlertTab>("GUESTBOOK");
  const notificationsQuery = useNotifications(visible);
  const guestbookQuery = useGuestbookList(userId, visible);

  const activeState = useMemo(() => {
    if (activeTab === "GUESTBOOK") {
      return {
        isLoading: guestbookQuery.isLoading,
        isError: guestbookQuery.isError,
        items: guestbookQuery.data ?? [],
      };
    }

    return {
      isLoading: notificationsQuery.isLoading,
      isError: notificationsQuery.isError,
      items: notificationsQuery.data ?? [],
    };
  }, [
    activeTab,
    guestbookQuery.data,
    guestbookQuery.isError,
    guestbookQuery.isLoading,
    notificationsQuery.data,
    notificationsQuery.isError,
    notificationsQuery.isLoading,
  ]);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <Text style={styles.title}>받은 소식</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>닫기</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tabRow}>
            <TabButton
              label="받은 방명록"
              active={activeTab === "GUESTBOOK"}
              onPress={() => setActiveTab("GUESTBOOK")}
            />
            <TabButton
              label="기록"
              active={activeTab === "RECORD"}
              onPress={() => setActiveTab("RECORD")}
            />
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {activeState.isLoading ? (
              <Text style={styles.messageText}>불러오는 중입니다.</Text>
            ) : activeState.isError ? (
              <Text style={styles.messageText}>
                {activeTab === "GUESTBOOK"
                  ? "받은 방명록을 불러오지 못했습니다."
                  : "알림을 불러오지 못했습니다."}
              </Text>
            ) : activeState.items.length === 0 ? (
              <Text style={styles.messageText}>
                {activeTab === "GUESTBOOK"
                  ? "아직 받은 방명록이 없어요."
                  : "아직 기록이 없어요."}
              </Text>
            ) : activeTab === "GUESTBOOK" ? (
              (activeState.items as GuestbookEntry[]).map((item, index) => (
                <View key={`${item.author}-${item.createdAt}-${index}`} style={styles.listCard}>
                  <View style={styles.listHeader}>
                    <Text style={styles.primaryText}>{item.author}</Text>
                    <Text style={styles.metaText}>{formatDateTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.secondaryText}>{item.content}</Text>
                </View>
              ))
            ) : (
              (activeState.items as NotificationItem[]).map(item => (
                <View key={item.id} style={styles.listCard}>
                  <View style={styles.listHeader}>
                    <Text style={styles.primaryText}>{getNotificationLabel(item.notificationType)}</Text>
                    <Text style={styles.metaText}>{formatDateTime(item.createdAt)}</Text>
                  </View>
                  <Text style={styles.secondaryText}>{item.content}</Text>
                  {!item.isRead ? <View style={styles.unreadDot} /> : null}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.tabButton, active && styles.tabButtonActive]}
    >
      <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function getNotificationLabel(type: string) {
  switch (type) {
    case "guestbook":
      return "방명록";
    case "follow":
      return "친구";
    case "watering_by_friend":
      return "물주기";
    case "seed_delivery":
      return "씨앗 배송";
    case "diary_like":
    case "avatar_post_like":
    case "feed_like":
      return "좋아요";
    case "diary_comment":
    case "avatar_post_comment":
    case "feed_comment":
      return "댓글";
    default:
      return "알림";
  }
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
    maxHeight: "80%",
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerSpacer: {
    width: 44,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#171717",
  },
  closeButton: {
    minWidth: 44,
    alignItems: "flex-end",
  },
  closeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  tabButtonActive: {
    backgroundColor: "#7DC960",
  },
  tabButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
  },
  tabButtonTextActive: {
    color: "#FFFFFF",
  },
  content: {
    flexGrow: 0,
  },
  contentContainer: {
    gap: 10,
    paddingBottom: 6,
  },
  messageText: {
    paddingVertical: 36,
    fontSize: 14,
    lineHeight: 22,
    color: "#9CA3AF",
    textAlign: "center",
  },
  listCard: {
    borderRadius: 18,
    backgroundColor: "#F8FAF6",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 6,
    position: "relative",
  },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  primaryText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#171717",
  },
  metaText: {
    fontSize: 12,
    color: "#6B7280",
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  unreadDot: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
});
