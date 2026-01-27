import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { XmarkIcon } from "@/assets/icons/CommonIcons";

interface MissionHeaderProps {
  onSubmit?: () => void;
  showSubmit?: boolean;
  context: string;
}

export default function MissionHeader({
  onSubmit,
  showSubmit,
  context,
}: MissionHeaderProps) {
  const navigation = useNavigation();

  const handleGoHome = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleGoHome} activeOpacity={0.7}>
        <XmarkIcon size={14} color="#171717" />
      </TouchableOpacity>
      <Text style={styles.title}>{context}</Text>
      {showSubmit ? (
        <TouchableOpacity onPress={onSubmit} activeOpacity={0.7}>
          <Text style={styles.submitText}>완료</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  submitText: {
    fontSize: 14,
    color: "#171717",
  },
  spacer: {
    width: 36,
  },
});
