import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { LeftIcon, RightIcon } from "@/assets/icons/CommonIcons";
import { useDiaries } from "@/hooks/log/useDiariesApi";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width / 3;

type Props = {
  onSelectDiary?: (diaryId: number) => void;
};

export default function MyDiary({ onSelectDiary }: Props) {
  const [activeStartDate, setActiveStartDate] = useState(new Date());

  const { data: diaries } = useDiaries(
    activeStartDate.getFullYear(),
    activeStartDate.getMonth() + 1
  );

  const canGoToNextMonth = () => {
    const currentMonth = new Date();
    const nextMonth = new Date(activeStartDate);
    nextMonth.setMonth(activeStartDate.getMonth() + 1);

    return (
      nextMonth.getFullYear() < currentMonth.getFullYear() ||
      (nextMonth.getFullYear() === currentMonth.getFullYear() &&
        nextMonth.getMonth() <= currentMonth.getMonth())
    );
  };

  const goMonth = (diff: number) => {
    if (diff > 0 && !canGoToNextMonth()) {
      return;
    }

    const next = new Date(activeStartDate);
    next.setMonth(activeStartDate.getMonth() + diff);
    setActiveStartDate(next);
  };

  return (
    <View style={styles.container}>
      {/* 월 네비게이션 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goMonth(-1)} style={styles.navButton}>
          <LeftIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {activeStartDate.getFullYear()}년 {activeStartDate.getMonth() + 1}월
        </Text>
        <TouchableOpacity
          onPress={() => goMonth(1)}
          style={[styles.navButton, !canGoToNextMonth() && styles.navButtonDisabled]}
          disabled={!canGoToNextMonth()}
        >
          <RightIcon size={24} color={canGoToNextMonth() ? "#171717" : "#D1D5DB"} />
        </TouchableOpacity>
      </View>

      {/* 일기 그리드 */}
      {diaries && diaries.length > 0 ? (
        <FlatList
          data={diaries}
          numColumns={3}
          keyExtractor={(item) => item.diaryId.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.diaryItem}
              onPress={() => onSelectDiary?.(item.diaryId)}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.diaryImage}
                defaultSource={require("@/assets/images/char.png")}
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>작성된 일기가 없습니다</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    gap: 48,
  },
  navButton: {
    padding: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    minWidth: 100,
    textAlign: "center",
  },
  diaryItem: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: "#F3F4F6",
  },
  diaryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
  },
});
