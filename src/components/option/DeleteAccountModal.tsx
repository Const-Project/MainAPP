import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";
import { useState } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { deleteUserAccount } from "@/apis/user/userApi";
import useTokenStore from "@/stores/useTokenStore";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function DeleteAccountModal({
  visible,
  onClose,
}: DeleteAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const clearTokens = useTokenStore(state => state.clearTokens);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const response = await deleteUserAccount();
      if (response.isSuccess) {
        // 토큰 초기화
        clearTokens();
        onClose();
        // 온보딩 화면으로 이동
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Onboarding" }],
          })
        );
      } else {
        Alert.alert("오류", response.message || "회원 탈퇴에 실패했습니다.");
      }
    } catch (error) {
      Alert.alert("오류", "회원 탈퇴에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>회원 탈퇴</Text>
          <Text style={styles.message}>
            정말 탈퇴하시겠습니까?{"\n"}모든 데이터가 삭제됩니다.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.deleteButtonText}>
                {isLoading ? "처리 중..." : "탈퇴"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: "100%",
    maxWidth: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#EF4444",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
