import { useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import { LeftIcon } from "@/assets/icons/CommonIcons";

const { width } = Dimensions.get("window");

const serviceInfoData = [
  {
    id: 1,
    image: require("@/assets/images/onboarding/onboarding1.png"),
    title: "나만의 식물을\n화면 속에서 만나보세요.",
    subtitle: "물과 햇빛을 주며\n직접 키울 수 있어요.",
  },
  {
    id: 2,
    image: require("@/assets/images/onboarding/onboarding2.png"),
    title: "실제 식물을\n배송받아 키워보세요.",
    subtitle: "식물 아바타에 해당하는\n실제 식물을 키울 수 있어요.",
  },
  {
    id: 3,
    image: require("@/assets/images/onboarding/onboarding3.png"),
    title: "미션으로 나무 레벨을 올리고\n새로운 식물을 키울 수 있어요.",
    subtitle: "미션을 수행한 기록은\n키움일지에 기록돼요.",
  },
  {
    id: 4,
    image: require("@/assets/images/onboarding/onboarding4.png"),
    title: "햇빛과 물을 줘서\n식물을 성장시켜요.",
    subtitle: "매일 햇빛과 물을 주면\n식물 아바타가 성장해요.",
  },
  {
    id: 5,
    image: require("@/assets/images/onboarding/onboarding5.png"),
    title: "다른 친구들의 이야기를\n들을 수 있어요.",
    subtitle: "둘러보기로 친구를 만들고\n방명록을 남겨보세요.",
  },
];

type Props = RootStackScreenProps<"ServiceInfo">;

export default function ServiceInfoScreen({ navigation }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>서비스 안내</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 슬라이드 */}
      <FlatList
        ref={flatListRef}
        data={serviceInfoData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {serviceInfoData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              currentIndex === index ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  headerSpacer: {
    width: 32,
  },
  slide: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 48,
  },
  image: {
    width: 256,
    height: 256,
  },
  textContainer: {
    alignItems: "center",
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: "#4CAF50",
  },
  dotInactive: {
    backgroundColor: "#D1D5DB",
  },
});
