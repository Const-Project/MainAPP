import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

function StageIcon({ label }: { label: string }) {
  return (
    <View style={styles.stageIconWrap}>
      <View style={styles.stageIconPlaceholder}>
        <Text style={styles.stageIconText}>{label[0]}</Text>
      </View>
      <Text style={styles.stageLabel}>{label}</Text>
    </View>
  );
}

function StageDash() {
  return <View style={styles.stageDash} />;
}

const DAILY_SOURCES = [
  "내 식물 물 주기",
  "햇빛 주기",
  "일일 미션 - 마음 건강 체크, 일기, 퀴즈",
  "친구에게 물 주기",
  "방명록 쓰기",
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function WishTreeInfoModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.title}>{"소망 나무"}</Text>
            <Pressable hitSlop={12} onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}></Text>
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <View style={styles.stagesRow}>
              <StageIcon label={"새싹"} />
              <StageDash />
              <StageIcon label={"꽃"} />
              <StageDash />
              <StageIcon label={"열매"} />
              <StageDash />
              <StageIcon label={"나무"} />
            </View>

            <Text style={styles.description}>
              {"\uAC01 \uB2E8\uACC4\uC5D0 \uD544\uC694\uD55C \uC810\uC218\uB97C \uC5BB\uC73C\uBA74\n\uB2E4\uC74C \uB2E8\uACC4\uB85C \uB118\uC5B4\uAC00\uACE0 \uC0C8 \uD143\uBC2D\uC744 \uC5F4 \uC218 \uC788\uC5B4\uC694."}
            </Text>

            <Text style={styles.sectionTitle}>{"일일 점수 획득처"}</Text>
            {DAILY_SOURCES.map(source => (
              <Text key={source} style={styles.sourceItem}>
                {source}
              </Text>
            ))}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#171717",
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 18,
    color: "#9CA3AF",
  },
  body: {
    gap: 0,
  },
  stagesRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  stageIconWrap: {
    alignItems: "center",
    gap: 8,
  },
  stageIconPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#F0F4EC",
    alignItems: "center",
    justifyContent: "center",
  },
  stageIconText: {
    fontSize: 20,
    color: "#4CAF50",
    fontWeight: "700",
  },
  stageLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },
  stageDash: {
    width: 20,
    height: 1.5,
    backgroundColor: "#D1D5DB",
    marginBottom: 18,
    marginHorizontal: 2,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 10,
  },
  sourceItem: {
    fontSize: 14,
    lineHeight: 26,
    color: "#6B7280",
  },
});
