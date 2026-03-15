import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import CommentComposer from "@/components/common/CommentComposer";
import { useCreateGuestbook, useGuestbookList } from "@/hooks/profile/useGuestbookApi";
import type { RootStackScreenProps } from "@/navigation/types";
import type { GuestbookEntry } from "@/types/profile/guestbookApi.type";


type Props = RootStackScreenProps<"Guestbook">;

export default function GuestbookScreen({ navigation, route }: Props) {
  const { userId, userNickname } = route.params;
  const [content, setContent] = useState("");
  const { data, error, isLoading, refetch } = useGuestbookList(userId);
  const createMutation = useCreateGuestbook(userId);

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Home" });
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      return;
    }

    try {
      await createMutation.mutateAsync({ content: content.trim() });
      setContent("");
    } catch (guestbookError) {
      console.error("[GuestbookScreen] Failed to create guestbook:", guestbookError);
    }
  };

  const renderItem = ({ item }: { item: GuestbookEntry }) => (
    <View style={styles.entryCard}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryAuthor}>{item.author}</Text>
        <Text style={styles.entryDate}>{formatDateTime(item.createdAt)}</Text>
      </View>
      <Text style={styles.entryContent}>{item.content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title={`${userNickname ?? "프로필"} 방명록`} onBack={handleBack} />

        {isLoading ? (
          <StatusView title="방명록을 불러오는 중입니다." loading />
        ) : error ? (
          <StatusView
            title="방명록을 불러오지 못했습니다."
            description="현재 방명록 API 응답을 다시 확인해야 합니다."
            actionLabel="다시 시도"
            onAction={() => void refetch()}
          />
        ) : (
          <FlatList
            data={data ?? []}
            keyExtractor={(item, index) => `${item.author}-${item.createdAt}-${index}`}
            renderItem={renderItem}
            contentContainerStyle={[
              styles.listContent,
              (data?.length ?? 0) === 0 ? styles.listContentEmpty : null,
            ]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Text style={styles.emptyTitle}>아직 작성된 방명록이 없습니다.</Text>
                <Text style={styles.emptyDescription}>
                  가장 먼저 인사를 남겨보세요.
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.composerWrap}>
          {/* 한글 주석:
              방명록 페이지는 댓글처럼 목록은 위에서 스크롤되고,
              입력창은 전체 화면 하단에 고정해 언제든 바로 작성할 수 있게 한다. */}
          <CommentComposer
            value={content}
            onChangeText={setContent}
            onSubmit={() => void handleSubmit()}
            disabled={createMutation.isPending}
            placeholder="방명록을 남겨보세요."
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function formatDateTime(iso: string) {
  const date = new Date(iso);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
    gap: 12,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  entryCard: {
    borderRadius: 18,
    backgroundColor: "#F8FAF6",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  entryAuthor: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#171717",
  },
  entryDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    color: "#374151",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
    textAlign: "center",
  },
  composerWrap: {
    backgroundColor: "#FFFFFF",
  },
});
