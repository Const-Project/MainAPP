import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";

import { ANSWER_COPY } from "@/components/home/HomeEmotionModal";
import type { SurveyAnswerKind } from "@/types/missions";

const wateringImage = require("@/assets/images/background/watering.png");
const birdImage = require("@/assets/images/bird.webp");
const characterImage = require("@/assets/images/char2.webp");
const plantFallback = require("@/assets/images/plant.png");

export default function HomeAvatarStage({
  avatarImageUrl,
  isWatering,
  isEmotionAnswered,
  answeredKind,
  unreadNotificationCount = 0,
  onPressEmotion,
  onPressBird,
}: {
  avatarImageUrl?: string | null;
  isWatering: boolean;
  isEmotionAnswered: boolean;
  answeredKind: SurveyAnswerKind | null;
  unreadNotificationCount?: number;
  onPressEmotion: () => void;
  onPressBird: () => void;
}) {
  const [showAnsweredBubble, setShowAnsweredBubble] = useState(false);
  const answerMessage = answeredKind ? ANSWER_COPY[answeredKind] : "좋은 기분으로 오늘 하루 계속 이어가요!";

  useEffect(() => {
    if (!isEmotionAnswered) {
      setShowAnsweredBubble(false);
    }
  }, [isEmotionAnswered]);

  const handlePressMascot = () => {
    if (isEmotionAnswered) {
      setShowAnsweredBubble(prev => !prev);
      return;
    }

    onPressEmotion();
  };

  return (
    <View style={styles.stage}>
      <View style={styles.avatarCluster}>
        <Image
          source={avatarImageUrl ? { uri: avatarImageUrl } : plantFallback}
          defaultSource={plantFallback}
          style={styles.avatarImage}
          resizeMode="contain"
        />
        <Image
          source={wateringImage}
          style={[styles.wateringImage, !isWatering && styles.wateringImageHidden]}
          resizeMode="contain"
        />

        <View style={styles.leftCompanion}>
          {!isEmotionAnswered ? (
            <View style={styles.balloonWrap}>
              <View style={styles.balloon}>
                <Text style={styles.balloonText}>
                  오늘도 만나서 정말 반가워요!{"\n"}괜찮으시다면 오늘 하루는 어떠셨는지{"\n"}살짝 알려주시겠어요?
                </Text>
                <TouchableOpacity style={styles.checkButton} onPress={onPressEmotion}>
                  <Text style={styles.checkButtonText}>마음 건강 체크</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.balloonTail} />
            </View>
          ) : showAnsweredBubble ? (
            <View style={styles.balloonWrap}>
              <View style={styles.answeredBalloon}>
                <Text style={styles.answeredBalloonText}>{answerMessage}</Text>
              </View>
              <View style={styles.balloonTail} />
            </View>
          ) : null}

          <Pressable onPress={handlePressMascot} style={styles.mascotButton}>
            <Image source={characterImage} style={styles.characterImage} resizeMode="contain" />
          </Pressable>
        </View>

        <Pressable onPress={onPressBird} style={styles.birdButton}>
          {unreadNotificationCount > 0 ? (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadNotificationCount > 99 ? "99+" : unreadNotificationCount}
              </Text>
            </View>
          ) : null}
          <Image source={birdImage} style={styles.birdImage} resizeMode="contain" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCluster: {
    width: "100%",
    minHeight: 400,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingBottom: 18,
  },
  avatarImage: {
    width: 320,
    height: 320,

    /*
     * 한글 주석:
     * 화분 밑단을 더 아래로 내리기 위해 하단 여백을 줄였다.
     * 주변 오브젝트도 같은 기준선에서 함께 내려오도록 절대 위치 값도 맞춘다.
     */
    marginBottom: -96,
  },
  wateringImage: {
    position: "absolute",

    /*
     * 한글 주석:
     * 물뿌리개와 물방울 연출은 식물 중앙이 아니라
     * 식물의 왼쪽 70% 높이 부근에서 시작하도록 고정 위치를 옮긴다.
     */
    left: "18%",
    bottom: 168,
    width: 118,
    height: 118,
  },
  wateringImageHidden: {
    opacity: 0,
  },
  leftCompanion: {
    position: "absolute",
    left: 26,
    bottom: 4,
    alignItems: "center",
    width: 154,
  },
  balloonWrap: {
    alignItems: "center",
    marginBottom: 2,
  },
  balloon: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    width: 210,
  },
  answeredBalloon: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 18,
    paddingVertical: 14,
    width: 200,
  },
  balloonTail: {
    width: 18,
    height: 18,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "45deg" }],
    marginTop: -9,
    marginLeft: -60,
  },
  balloonText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#171717",
    textAlign: "center",
  },
  answeredBalloonText: {
    fontSize: 13,
    lineHeight: 18,
    color: "#171717",
    textAlign: "center",
  },
  checkButton: {
    marginTop: 12,
    borderRadius: 14,
    backgroundColor: "#7DC960",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  mascotButton: {
    marginTop: -10,
  },
  characterImage: {
    width: 82,
    height: 82,
  },
  birdButton: {
    position: "absolute",
    right: 48,
    bottom: 18,
  },
  notificationBadge: {
    position: "absolute",
    right: 2,
    top: -4,
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    paddingHorizontal: 6,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  notificationBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  birdImage: {
    width: 84,
    height: 84,
  },
});
