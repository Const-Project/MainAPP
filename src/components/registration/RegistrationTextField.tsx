import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  helperText?: string;
};

export default function RegistrationTextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  helperText,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        style={[styles.input, multiline ? styles.multiline : null]}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#171717",
    backgroundColor: "#FFFFFF",
  },
  multiline: {
    minHeight: 110,
    paddingTop: 14,
    paddingBottom: 14,
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
});
