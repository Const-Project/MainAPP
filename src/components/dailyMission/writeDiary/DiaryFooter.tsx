import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { CheckIcon, UnCheckIcon } from "@/assets/icons/CommonIcons";

interface DiaryFooterProps {
  isPublic: boolean;
  onVisibilityChange: (isPublic: boolean) => void;
}

export default function DiaryFooter({
  isPublic,
  onVisibilityChange,
}: DiaryFooterProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.option}
        onPress={() => onVisibilityChange(false)}
        activeOpacity={0.7}
      >
        {!isPublic ? <CheckIcon size={20} /> : <UnCheckIcon size={20} />}
        <Text style={styles.optionText}>나만 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => onVisibilityChange(true)}
        activeOpacity={0.7}
      >
        {isPublic ? <CheckIcon size={20} /> : <UnCheckIcon size={20} />}
        <Text style={styles.optionText}>공개하기</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 24,
    paddingLeft: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionText: {
    fontSize: 14,
    color: "#171717",
  },
});
