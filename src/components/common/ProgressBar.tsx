import React from "react";
import { View, StyleSheet } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            index < currentStep ? styles.active : styles.inactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    borderRadius: 2,
  },
  active: {
    backgroundColor: "#7DC960",
  },
  inactive: {
    backgroundColor: "#E5E7EB",
  },
});
