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
  const answerMessage = answeredKind ? ANSWER_COPY[answeredKind] : null;

  return (
    <View style={styles.stage}>
      <View style={styles.characterBlock}>
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
            <Image source={characterImage} style={styles.characterImage} resizeMode="contain" />
          </View>
        ) : answerMessage ? (
          <View style={styles.answeredBalloon}>
            <Text style={styles.answeredBalloonText}>{answerMessage}</Text>
          </View>
        ) : null}
      </View>

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
    paddingBottom: 12,
  },
  characterBlock: {
    width: "100%",
    alignItems: "center",
    minHeight: 166,
  },
  balloonWrap: {
    alignItems: "center",
  },
  balloon: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 18,
    alignItems: "center",
    maxWidth: 290,
  },
  balloonText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#171717",
    textAlign: "center",
  },
  checkButton: {
    marginTop: 14,
    borderRadius: 14,
    backgroundColor: "#7DC960",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  checkButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  characterImage: {
    width: 78,
    height: 78,
    marginTop: -2,
  },
  answeredBalloon: {
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.94)",
    paddingHorizontal: 22,
    paddingVertical: 16,
    maxWidth: 280,
  },
  answeredBalloonText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#171717",
    textAlign: "center",
  },
  avatarCluster: {
    width: "100%",
    minHeight: 320,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  avatarImage: {
    width: 290,
    height: 290,
  },
  wateringImage: {
    position: "absolute",
    left: "32%",
    bottom: 110,
    width: 126,
    height: 126,
  },
  wateringImageHidden: {
    opacity: 0,
  },
  birdButton: {
    position: "absolute",
    right: 48,
    bottom: 28,
  },
  birdImage: {
    width: 86,
    height: 86,
  },
});
