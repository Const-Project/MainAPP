import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import type { RootStackParamList } from "@/navigation/types";
import { getDiaries } from "@/apis/log/diariesApi";
import LogCalendar from "@/components/log/LogCalendar";
import MyDiary from "@/components/log/MyDiary";

type Tab = "mission" | "diary";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LogScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("mission");
  const navigation = useNavigation<NavigationProp>();
  const queryClient = useQueryClient();

  useEffect(() => {
    /*
     * 한글 주석:
     * 로그 화면 진입 시 현재 탭과 무관하게 일기 데이터를 미리 가져온다.
     * 탭 전환 즉시 데이터가 준비돼 있어 로딩 지연이 없다.
     */
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    void queryClient.prefetchQuery({
      queryKey: ["diaries", year, month],
      queryFn: () => getDiaries(year, month),
    });
  }, [queryClient]);

  const handleDiarySelect = (diaryId: number) => {
    navigation.navigate("LogDetail", { id: diaryId });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* 헤더 */}
      <Text style={styles.header}>키움 일지</Text>

      {/* 탭 토글 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "mission" && styles.tabActive]}
          onPress={() => setActiveTab("mission")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "mission" && styles.tabTextActive,
            ]}
          >
            미션
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "diary" && styles.tabActive]}
          onPress={() => setActiveTab("diary")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "diary" && styles.tabTextActive,
            ]}
          >
            일기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 콘텐츠 */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "mission" ? (
          <LogCalendar onSelectDate={() => {}} />
        ) : (
          <MyDiary onSelectDiary={handleDiarySelect} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    paddingVertical: 16,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingBottom: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: "#4CAF50",
  },
  tabText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  tabTextActive: {
    color: "#000000",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
});
