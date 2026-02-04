import React, { useEffect, useState } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

import { useHomeSummaryStore } from "@/stores/useHomeSummaryStore";
import Toast from "@/components/common/Toast";
import HomeModal from "./HomeModal";
import BirdModal from "./BirdModal";

const WateringImg = require("@/assets/images/background/watering.png");
const BirdImg = require("@/assets/images/bird.png");
const Char2Img = require("@/assets/images/char2.png");

interface HomeAvatarProps {
  isWater: boolean;
  avatarUri: string;
  setIsModalOpen: (open: boolean) => void;
  isModalOpen: boolean;
}

const CHAR_W = 80;
const CHAR_H = 100;

const BALLOON_W = 260;
const BALLOON_MIN_H = 140;

const GAP = 12; // 캐릭터-말풍선 간격

export default function HomeAvatar({
  isWater,
  avatarUri,
  setIsModalOpen,
  isModalOpen,
}: HomeAvatarProps) {
  const { missions } = useHomeSummaryStore();

  const [isChecked, setIsChecked] = useState(0);
  const [isOpenBird, setIsOpenBird] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isAnswered, setIsAnswered] = useState(
    missions.length > 2 ? missions[2].completed : false,
  );

  useEffect(() => {
    if (isChecked >= 1 && isChecked <= 3) {
      const timer = setTimeout(() => {
        setIsAnswered(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isChecked]);

  const handleAvatarPress = () => {
    if (!isAnswered) setToastMessage("마음 체크를 먼저 완료해주세요!");
  };

  const handleBirdPress = () => {
    if (!isAnswered) {
      setToastMessage("마음 체크를 먼저 완료해주세요!");
    } else {
      setIsOpenBird(true);
    }
  };

  const getBalloonText = () => {
    if (isChecked === 1) return "좋은 기분으로 오늘 하루 계속 이어가요!";
    if (isChecked === 2) return "제가 푸른 활력을 선물해 드릴게요.";
    if (isChecked === 3) return "기운을 내볼까요? 제가 곁에 있을게요.";
    return null;
  };

  return (
    <View style={styles.container}>
      {/*  아바타: 고정 레이어 */}
      <TouchableOpacity
        style={styles.avatarLayer}
        onPress={handleAvatarPress}
        activeOpacity={1}
      >
        <Image
          source={{ uri: avatarUri }}
          style={styles.avatarImage}
          resizeMode="contain"
        />

        <Image
          source={WateringImg}
          style={[styles.wateringImage, { opacity: isWater ? 1 : 0 }]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* 새: 고정 레이어 */}
      <TouchableOpacity
        style={styles.birdContainer}
        onPress={handleBirdPress}
        activeOpacity={0.7}
      >
        <Image source={BirdImg} style={styles.birdImage} resizeMode="contain" />
      </TouchableOpacity>

      {/* 캐릭터 기준 앵커:
          - charAnchor 위치만 고정하면
          - 말풍선은 항상 캐릭터 위로 뜸
      */}
      <View style={styles.charAnchor} pointerEvents="box-none">
        {/* 말풍선: 캐릭터 위 */}
        <View style={styles.balloonWrapper} pointerEvents="box-none">
          {!isAnswered && isChecked === 0 && (
            <View style={styles.balloon}>
              <Text style={styles.balloonText}>
                오늘도 만나서 정말 반가워요!{"\n"}괜찮으시다면 오늘 하루는
                어떠셨는지{"\n"}살짝 알려주시겠어요?
              </Text>
              <TouchableOpacity
                style={styles.checkButton}
                onPress={() => setIsModalOpen(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.checkButtonText}>마음 건강 체크</Text>
              </TouchableOpacity>
            </View>
          )}

          {isChecked > 0 && !isAnswered && (
            <View style={styles.balloon}>
              <Text style={styles.balloonText}>{getBalloonText()}</Text>
            </View>
          )}
        </View>

        {/* 캐릭터: 아래(고정) */}
        <TouchableOpacity
          style={styles.charTouchable}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.85}
        >
          <Image
            source={Char2Img}
            style={styles.charImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* 모달들 */}
      {isOpenBird && <BirdModal onClose={() => setIsOpenBird(false)} />}
      {isModalOpen && (
        <HomeModal
          onClose={() => setIsModalOpen(false)}
          setIsChecked={setIsChecked}
          isAnswered={isAnswered}
          setIsAnswered={setIsAnswered}
        />
      )}

      {/* 토스트 */}
      {toastMessage !== "" && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
    position: "relative",
  },

  avatarLayer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: 160,
  },
  avatarImage: {
    width: 256,
    height: 256,
  },
  wateringImage: {
    width: 120,
    height: 120,
    position: "absolute",
    top: -40,
    left: "25%",
  },

  // ✅ 새 위치 고정
  birdContainer: {
    position: "absolute",
    bottom: 160,
    right: 80,
  },
  birdImage: {
    width: 96,
    height: 96,
  },

  charAnchor: {
    position: "absolute",
    bottom: 160,
    left: 0,
    width: Math.max(BALLOON_W, CHAR_W),
    alignItems: "center",
  },

  balloonWrapper: {
    position: "absolute",
    bottom: CHAR_H + GAP,
    width: BALLOON_W,
    alignItems: "center",
  },
  balloon: {
    width: BALLOON_W,
    minHeight: BALLOON_MIN_H,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balloonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171717",
    textAlign: "center",
    lineHeight: 20,
  },
  checkButton: {
    backgroundColor: "#7DC960",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  charTouchable: {
    // 필요하면 터치 영역만 키우기:
    // padding: 4,
  },
  charImage: {
    width: CHAR_W,
    height: CHAR_H,
  },
});
