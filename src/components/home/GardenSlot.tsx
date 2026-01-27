import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import type { RootStackParamList } from "@/navigation/types";
import type { GardenSummary } from "@/types/home/garden";
import axios from "@/apis/instance";

import MapButton from "./MapButton";
import HomeAvatar from "./HomeAvatar";
import LockView from "./LockView";
import Toast from "@/components/common/Toast";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SunLightImg = require("@/assets/images/background/sunlight.png");
const PlantImg = require("@/assets/images/plant.png");
const NullImg = require("@/assets/images/null.webp");

const backgroundImages: Record<number, any> = {
  1: require("@/assets/images/background/background1.png"),
  2: require("@/assets/images/background/background2.png"),
  3: require("@/assets/images/background/background3.png"),
  4: require("@/assets/images/background/background4.png"),
};

// SVG 아이콘 (Sun, Water)
import Svg, { Circle, Path } from "react-native-svg";

function SunIcon({ size = 64, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" opacity={opacity}>
      <Circle cx="32" cy="32" r="16" fill="#FFD700" />
      <Path d="M32 4V12" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M32 52V60" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M4 32H12" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M52 32H60" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M12.2 12.2L17.8 17.8" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M46.2 46.2L51.8 51.8" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M12.2 51.8L17.8 46.2" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
      <Path d="M46.2 17.8L51.8 12.2" stroke="#FFD700" strokeWidth={3} strokeLinecap="round" />
    </Svg>
  );
}

function WaterIcon({ size = 64, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" opacity={opacity}>
      <Path
        d="M32 8C32 8 12 30 12 42C12 53.05 20.95 62 32 62C43.05 62 52 53.05 52 42C52 30 32 8 32 8Z"
        fill="#4FC3F7"
        stroke="#29B6F6"
        strokeWidth={2}
      />
    </Svg>
  );
}

interface GardenSlotProps {
  garden: GardenSummary | null;
  slotNumber: number;
  isFirst: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

export default function GardenSlot({
  garden,
  slotNumber,
  isFirst,
  isModalOpen,
  setIsModalOpen,
}: GardenSlotProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [isSunLight, setIsSunLight] = useState(false);
  const [isWater, setIsWater] = useState(false);
  const [isAbleSunLight, setIsAbleSunLight] = useState(
    garden?.ownerSunlightAble || false
  );
  const [isAbleWater, setIsAbleWater] = useState(
    garden?.ownerWateringAble || false
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const lockStatus = !garden?.locked
    ? "clear"
    : garden?.unlockable
      ? "unlock"
      : "lock";

  const handleSunLight = async () => {
    if (isSunLight) return;
    if (!isAbleSunLight) {
      setToastMsg("햇빛 주기는 오전 6시에 초기화 됩니다");
      return;
    }
    try {
      const res = await axios.post(
        `/api/v1/gardens/${garden?.gardenId}/sunlight`
      );
      if (res.status === 202) {
        setToastMsg("햇빛 주기는 오전 6시에 초기화 됩니다");
        return;
      }
      setIsSunLight(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsSunLight(false);
        timerRef.current = null;
      }, 1000);
      setIsAbleSunLight(false);
    } catch {
      setToastMsg("오류가 발생했습니다");
    }
  };

  const handleWater = async () => {
    if (isWater) return;
    if (!isAbleWater) {
      setToastMsg("물 주기는 오전 12시에 초기화 됩니다");
      return;
    }
    try {
      const res = await axios.post(
        `/api/v1/gardens/${garden?.gardenId}/mywater`
      );
      if (res.status === 202) {
        setToastMsg("물 주기는 오전 12시에 초기화 됩니다");
        return;
      }
      setIsAbleWater(false);
      setIsWater(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setIsWater(false);
        timerRef.current = null;
      }, 1000);
    } catch {
      setToastMsg("오류가 발생했습니다");
    }
  };

  const handleUnlock = async () => {
    try {
      const response = await axios.post("/api/v1/gardens/unlock");
      if (response.status === 200) {
        navigation.navigate("UnlockGarden");
      }
    } catch {
      Alert.alert("오류", "정원 해금에 실패했습니다.");
    }
  };

  const bgImage = backgroundImages[slotNumber] || backgroundImages[1];

  // 잠김 상태
  if (lockStatus !== "clear") {
    return (
      <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
        <LockView isUnlockable={lockStatus === "unlock"} onUnlock={handleUnlock} />
      </ImageBackground>
    );
  }

  // 해제됨 + 아바타 없음 → 식물 등록 유도
  if (!garden?.avatar?.avatarName) {
    return (
      <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
        <TouchableOpacity
          style={styles.emptyContainer}
          onPress={() => navigation.navigate("RegistrationAvatar")}
          activeOpacity={0.8}
        >
          <View style={styles.emptyBalloon}>
            <Text style={styles.emptyText}>
              새로운 식물을{"\n"}심어볼까요?
            </Text>
            <Text style={styles.plusIcon}>+</Text>
          </View>
          <Image source={NullImg} style={styles.nullImage} resizeMode="contain" />
        </TouchableOpacity>
      </ImageBackground>
    );
  }

  // 해제됨 + 아바타 있음 → 메인 정원 뷰
  return (
    <ImageBackground source={bgImage} style={styles.container} resizeMode="cover">
      {/* 햇빛 오버레이 */}
      {isSunLight && (
        <Image
          source={SunLightImg}
          style={[StyleSheet.absoluteFill, { opacity: 0.8 }]}
          resizeMode="cover"
        />
      )}

      <View style={styles.contentContainer}>
        {/* 헤더 */}
        <View style={styles.header}>
          <MapButton slotNumber={slotNumber} />
          <Text style={styles.avatarName}>
            {garden.avatar.avatarName}
          </Text>
          <View style={{ width: 48 }} />
        </View>

        {/* 햇빛/물 버튼 */}
        <View style={styles.toolButtons}>
          <TouchableOpacity onPress={handleSunLight} disabled={isSunLight}>
            <SunIcon opacity={isSunLight ? 0.5 : 1} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWater} disabled={isWater}>
            <WaterIcon opacity={isWater ? 0.5 : 1} />
          </TouchableOpacity>
        </View>

        {/* 아바타 */}
        <HomeAvatar
          isWater={isWater}
          avatarUri={garden.avatar.avatarImageUrl || Image.resolveAssetSource(PlantImg).uri}
          setIsModalOpen={setIsModalOpen}
          isModalOpen={isModalOpen}
        />
      </View>

      {toastMsg !== "" && (
        <Toast message={toastMsg} onClose={() => setToastMsg("")} />
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  avatarName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  toolButtons: {
    position: "absolute",
    right: 12,
    bottom: 180,
    zIndex: 40,
    gap: 8,
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyBalloon: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    textAlign: "center",
  },
  plusIcon: {
    fontSize: 32,
    color: "#7DC960",
    fontWeight: "700",
  },
  nullImage: {
    width: 320,
    height: 200,
  },
});
