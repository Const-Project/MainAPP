import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

import type { GardenInfo } from "@/types/profile/profileApi.type";
import { postFriendWater } from "@/apis/profile/profileApi";
import Toast from "@/components/common/Toast";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const BackgroundImg = require("@/assets/images/background/background2.png");
const WateringImg = require("@/assets/images/background/watering.png");
const CharacterImg = require("@/assets/images/char2.png");
const PlantImg = require("@/assets/images/plant.png");
const DropImg = require("@/assets/images/profile/drop.png");
const LetterBoxImg = require("@/assets/images/profile/letterbox.png");

function WaterIcon({ size = 64, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" opacity={opacity}>
      <Circle cx={32} cy={32} r={32} fill="rgba(255,255,255,0.3)" />
      <Path
        d="M32 18C32 18 22 30 22 38C22 43.5228 26.4772 48 32 48C37.5228 48 42 43.5228 42 38C42 30 32 18 32 18Z"
        stroke="#4FA8DE"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#4FA8DE"
        fillOpacity={0.3}
      />
    </Svg>
  );
}

interface ProfileDetailProps {
  garden: GardenInfo;
  leftWaterCountForOthers: number;
  onWaterSuccess?: () => void;
}

export default function ProfileDetail({
  garden,
  leftWaterCountForOthers,
  onWaterSuccess,
}: ProfileDetailProps) {
  const [isWater, setIsWater] = useState(false);
  const [isAbleWater, setIsAbleWater] = useState(garden.isWateringAbleByMe);
  const [showToast, setShowToast] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wateringOpacity = useRef(new Animated.Value(0)).current;

  const handleWater = async () => {
    if (isWater) return;
    if (!isAbleWater) {
      setShowToast(true);
      return;
    }

    try {
      await postFriendWater(garden.gardenId);
      setIsAbleWater(false);
      setIsWater(true);

      Animated.timing(wateringOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      onWaterSuccess?.();

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        Animated.timing(wateringOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setIsWater(false);
        });
        timerRef.current = null;
      }, 1000);
    } catch {
      // 물주기 실패
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const avatarSource = garden.avatarInfo?.avatarImageUrl
    ? { uri: garden.avatarInfo.avatarImageUrl }
    : PlantImg;

  return (
    <ImageBackground source={BackgroundImg} style={styles.container} resizeMode="cover">
      {/* 상단 정보 */}
      <View style={styles.topBar}>
        <View style={styles.topSpacer} />
        <Text style={styles.avatarName}>
          {garden.avatarInfo?.avatarName ?? ""}
        </Text>
        <View style={styles.waterCountContainer}>
          <Image source={DropImg} style={styles.dropIcon} />
          <Text style={styles.waterCountText}>
            {leftWaterCountForOthers}/3
          </Text>
        </View>
      </View>

      {/* 중앙 아바타 */}
      <View style={styles.avatarArea}>
        <Image source={avatarSource} style={styles.avatarImage} resizeMode="contain" />

        {/* 물주기 애니메이션 */}
        <Animated.Image
          source={WateringImg}
          style={[styles.wateringImage, { opacity: wateringOpacity }]}
          resizeMode="contain"
        />
      </View>

      {/* 캐릭터 */}
      <Image source={CharacterImg} style={styles.characterImage} resizeMode="contain" />

      {/* 편지함 */}
      <Image source={LetterBoxImg} style={styles.letterBoxImage} resizeMode="contain" />

      {/* 물주기 버튼 */}
      <View style={styles.waterButtonContainer}>
        <TouchableOpacity
          onPress={handleWater}
          disabled={isWater}
          activeOpacity={0.7}
        >
          <WaterIcon size={64} opacity={isWater ? 0.5 : 1} />
        </TouchableOpacity>
      </View>

      {/* 토스트 */}
      {showToast && (
        <Toast
          message="물 주기(오전 12시) 햇빛 주기(오전 6시)에 초기화 됩니다."
          onClose={() => setShowToast(false)}
        />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  topBar: {
    position: "absolute",
    top: 24,
    left: 28,
    right: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  topSpacer: {
    width: 60,
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  waterCountContainer: {
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  dropIcon: {
    width: 24,
    height: 24,
  },
  waterCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  avatarArea: {
    position: "absolute",
    bottom: "16%",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  avatarImage: {
    width: SCREEN_WIDTH * 0.6,
    height: SCREEN_WIDTH * 0.7,
  },
  wateringImage: {
    position: "absolute",
    bottom: "40%",
    left: "20%",
    width: 120,
    height: 80,
  },
  characterImage: {
    position: "absolute",
    bottom: "14%",
    left: "12%",
    width: 88,
    height: 88,
  },
  letterBoxImage: {
    position: "absolute",
    bottom: "14%",
    right: "12%",
    width: 96,
    height: 96,
  },
  waterButtonContainer: {
    position: "absolute",
    bottom: "30%",
    right: 12,
    zIndex: 40,
    alignItems: "center",
  },
});
