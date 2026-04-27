import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  confirmDestructive?: boolean;
  confirmDisabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmModal({
  visible,
  title,
  description,
  cancelLabel = "취소",
  confirmLabel,
  confirmDestructive = false,
  confirmDisabled = false,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
        <View style={styles.card}>
          <View style={styles.copyGroup}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.88} onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelLabel}>{cancelLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onConfirm}
              disabled={confirmDisabled}
              style={[
                styles.confirmButton,
                confirmDestructive ? styles.confirmButtonDanger : styles.confirmButtonPrimary,
                confirmDisabled ? styles.confirmButtonDisabled : null,
              ]}
            >
              <Text style={styles.confirmLabel}>{confirmLabel}</Text>
            </TouchableOpacity>
          </View>
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
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 355,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    gap: 32,
  },
  copyGroup: {
    width: "100%",
    gap: 8,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    color: "#171717",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    height: 57,
    borderRadius: 8,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#171717",
  },
  confirmButton: {
    flex: 1,
    height: 57,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonPrimary: {
    backgroundColor: "#72D14E",
  },
  confirmButtonDanger: {
    backgroundColor: "#F76868",
  },
  confirmButtonDisabled: {
    opacity: 0.55,
  },
  confirmLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
