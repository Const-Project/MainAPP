import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { SurveyAnswerKind } from "@/types/missions";
import { ANSWER_COPY } from "@/components/home/HomeEmotionModal";

const wateringImage = require("@/assets/images/background/watering.png");
const birdImage = require("@/assets/images/bird.webp");
const characterImage = require("@/assets/images/char2.webp");
const plantFallback = require("@/assets/images/plant.png");

export default function HomeAvatarStage({
  avatarImageUrl,
  isWatering,
  isEmotionAnswered,
  answeredKind,
  onPressEmotion,
  onPressBird,
}: {
  avatarImageUrl?: string | null;
  isWatering: boolean;
  isEmotionAnswered: boolean;
  answeredKind: SurveyAnswerKind | null;
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
    minHeight: 390,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    paddingBottom: 36,
  },
  avatarImage: {
    width: 320,
    height: 320,
    marginBottom: 34,
  },
  wateringImage: {
    position: "absolute",
    left: "36%",
    bottom: 160,
    width: 118,
    height: 118,
  },
  wateringImageHidden: {
    opacity: 0,
  },
  leftCompanion: {
    position: "absolute",
    left: 22,
    bottom: 18,
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
    marginTop: -4,
  },
  characterImage: {
    width: 82,
    height: 82,
  },
  birdButton: {
    position: "absolute",
    right: 42,
    bottom: 42,
  },
  birdImage: {
    width: 84,
    height: 84,
  },
});
