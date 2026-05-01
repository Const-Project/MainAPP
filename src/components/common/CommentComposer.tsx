import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { SendIcon } from "@/assets/icons/CommonIcons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function CommentComposer({
  value,
  onChangeText,
  onSubmit,
  disabled = false,
  placeholder = "댓글을 입력해주세요.",
}: Props) {
  const canSubmit = !disabled && value.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <BottomSheetTextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="send"
          editable={!disabled}
        />
        <TouchableOpacity
          onPress={onSubmit}
          disabled={!canSubmit}
          activeOpacity={0.7}
          style={!canSubmit ? styles.sendDisabled : undefined}
        >
          <SendIcon size={32} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 20,
    fontSize: 14,
    color: "#171717",
  },
  sendDisabled: {
    opacity: 0.45,
  },
});
