import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useMemo, useRef, useState } from "react";

import type { GardenSummary } from "@/types/home/garden";
import { LeftIcon } from "@/assets/icons/CommonIcons";
import type { RootStackScreenProps } from "@/navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import StatusView from "@/components/common/StatusView";
import useHomeApi from "@/hooks/home/useHomeApi";

type Props = RootStackScreenProps<"AvatarNicknameEdit">;

type SelectableAvatar = {
  avatarId: number;
  avatarName: string;
  avatarImageUrl: string;
};

// 캐러셀 아이템 너비 및 아이템 간 간격
const ITEM_WIDTH = 258;
const ITEM_GAP = 16;

export default function AvatarNicknameEditScreen({ navigation }: Props) {
  const { width: screenWidth } = useWindowDimensions();
  const { data, isLoading, error, refetch } = useHomeApi();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // 캐러셀 아이템이 화면 중앙에 오도록 좌우 패딩 계산
  const sidePadding = (screenWidth - ITEM_WIDTH) / 2;

  // 아바타가 있는 정원 목록만 필터링
  const avatars = useMemo<SelectableAvatar[]>(() => {
    if (!data?.gardenSummaries) return [];
    return data.gardenSummaries
      .filter((g: GardenSummary) => Boolean(g.avatar?.avatarId))
      .map((g: GardenSummary) => ({
        avatarId: g.avatar!.avatarId,
        avatarName: g.avatar!.avatarName,
        avatarImageUrl: g.avatar!.avatarImageUrl,
      }));
  }, [data]);

  const selectedAvatar = avatars[currentIndex] ?? null;
  const isButtonEnabled = selectedAvatar !== null;

  const handleBack = () => navigation.goBack();

  // 선택한 아바타 정보를 다음 단계(닉네임 입력)로 전달
  const handleNext = () => {
    if (!selectedAvatar) return;
    navigation.navigate("AvatarNicknameEditStep2", {
      avatarId: selectedAvatar.avatarId,
      avatarName: selectedAvatar.avatarName,
      avatarImageUrl: selectedAvatar.avatarImageUrl,
    });
  };

  // --- 로딩 / 에러 / 빈 상태 처리 ---
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView title="아바타 정보를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="아바타 정보를 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (avatars.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="변경할 아바타가 없습니다."
          description="먼저 식물을 등록한 뒤 다시 시도해주세요."
          actionLabel="뒤로가기"
          onAction={handleBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.backButton}>
          <LeftIcon size={24} color="#171717" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아바타 닉네임 변경</Text>
        <View style={styles.backButton} />
      </View>

      <Text style={styles.title}>변경할 식물을 선택해주세요</Text>

      {/* 아바타 캐러셀 + 이름 + 페이지 점 */}
      <View style={styles.carouselWrapper}>
        <FlatList
          ref={flatListRef}
          data={avatars}
          keyExtractor={item => String(item.avatarId)}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={ITEM_WIDTH + ITEM_GAP}
          decelerationRate="fast"
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
          ItemSeparatorComponent={() => <View style={{ width: ITEM_GAP }} />}
          onMomentumScrollEnd={e => {
            // 스크롤 위치로 현재 선택 인덱스 갱신
            const index = Math.round(e.nativeEvent.contentOffset.x / (ITEM_WIDTH + ITEM_GAP));
            setCurrentIndex(Math.max(0, Math.min(index, avatars.length - 1)));
          }}
          renderItem={({ item, index }) => {
            const isSelected = index === currentIndex;
            return (
              <View style={[styles.carouselItem, isSelected && styles.carouselItemSelected, !isSelected && styles.carouselItemDimmed]}>
                <Image
                  source={{ uri: item.avatarImageUrl }}
                  style={styles.carouselImage}
                  resizeMode="contain"
                />
              </View>
            );
          }}
        />
        {/* 선택된 아바타 이름 */}
        <Text style={styles.carouselName}>{selectedAvatar?.avatarName ?? ""}</Text>
        {/* 페이지 인디케이터 점 */}
        <View style={styles.dotRow}>
          {avatars.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* 하단 다음 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, isButtonEnabled ? styles.buttonActive : styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!isButtonEnabled}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  // 상단 헤더 영역
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  // 안내 타이틀
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#171717",
    marginTop: 32,
    marginLeft: 25,
  },
  // 캐러셀 + 이름 + 점 묶음 영역
  // paddingTop으로 이미지 상단 여백 조정 (수동 조정 가능)
  carouselWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 16,
    paddingTop: 160,
  },
  // 개별 아바타 카드
  carouselItem: {
    width: ITEM_WIDTH,
    height: 292,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#72D14E",
    overflow: "hidden",
  },
  carouselItemSelected: {
    backgroundColor: "#EEF9EA",
    opacity: 1,
  },
  carouselItemDimmed: {
    opacity: 0.5,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  // 아바타 이름 텍스트
  carouselName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
    textAlign: "center",
  },
  // 페이지 인디케이터 점 행
  dotRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 100,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#BFBFBF",
  },
  dotActive: {
    backgroundColor: "#171717",
  },
  // 하단 버튼 영역
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonActive: {
    backgroundColor: "#72D14E",
  },
  buttonDisabled: {
    backgroundColor: "#7C7C7C",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
