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
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#CCCCCC"
        multiline={multiline}
        style={[
          styles.input,
          multiline ? styles.multiline : styles.singleLine,
          label ? null : styles.titleInput,
        ]}
        textAlignVertical={multiline ? "top" : "center"}
      />
      {helperText ? <Text style={styles.helperText}>{helperText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    color: "#9CA3AF",
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  input: {
    fontSize: 15,
    color: "#171717",
    backgroundColor: "transparent",
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  titleInput: {
    fontSize: 26,
    fontWeight: "400",
    letterSpacing: -0.3,
    paddingVertical: 6,
  },
  singleLine: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E0E0E0",
  },
  multiline: {
    minHeight: 80,
    lineHeight: 24,
    fontSize: 15,
    color: "#374151",
  },
  helperText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
});