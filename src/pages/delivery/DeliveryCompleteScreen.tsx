import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import DeliveryHeader from "@/components/delivery/DeliveryHeader";
import ProgressBar from "@/components/common/ProgressBar";

const DeliveryCompleteImg = require("@/assets/images/deilveryComplete.png");

export default function DeliveryCompleteScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const goHome = () => {
    navigation.reset({ index: 0, routes: [{ name: "Main" }] });
  };

  return (
    <View style={styles.screen}>
      <DeliveryHeader title="텃밭 해금하기" />

      <View style={styles.progressBarContainer}>
        <ProgressBar currentStep={3} totalSteps={3} />
      </View>

      <View style={styles.content}>
        <Text style={styles.heading}>배송 요청이 완료되었어요!</Text>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            3~7일 이내 자택으로 배송될 예정이에요.
          </Text>
          <Text style={styles.description}>
            이제 텃밭을 열고,{"\n"}새로운 식물을 키울 수 있어요.
          </Text>
        </View>
        <Image
          source={DeliveryCompleteImg}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={goHome}
          activeOpacity={0.7}
        >
          <Text style={styles.primaryButtonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  progressBarContainer: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 8,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
    marginTop: 16,
  },
  descriptionContainer: {
    gap: 8,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  image: {
    width: "100%",
    height: 300,
    marginTop: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#7DC960",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
