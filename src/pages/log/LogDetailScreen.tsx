import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import CommentComposer from "@/components/common/CommentComposer";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import MyDiaryDetail from "@/components/log/MyDiaryDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useDiaryDetail } from "@/hooks/log/useDiaryDetailApi";

type Props = RootStackScreenProps<"LogDetail">;

export default function LogDetailScreen({ navigation, route }: Props) {
  const diaryId = Number(route.params.id);
  const isValidId = Number.isFinite(diaryId) && diaryId > 0;
  const {
    data,
    error,
    isLoading,
    refetch,
  } = useDiaryDetail(isValidId ? diaryId : 0);
  const [content, setContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => refetch());

  const handleBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate("Main", { screen: "Log" });
  };

  const handleSend = async () => {
    if (!isValidId || !content.trim()) return;

    try {
      await mutateAsync({ content, targetId: diaryId, targetType: "DIARY" });
      setContent("");
    } catch (commentError) {
      console.error("[LogDetailScreen] Failed to post comment:", commentError);
    }
  };

  let body;

  if (!isValidId) {
    body = (
      <StatusView
        title="잘못된 일기입니다."
        description="로그 목록에서 다시 선택해주세요."
        actionLabel="목록으로"
        onAction={handleBack}
      />
    );
  } else if (isLoading) {
    body = <StatusView title="일기 상세를 불러오는 중입니다." loading />;
  } else if (error) {
    body = (
      <StatusView
        title="일기 상세를 불러오지 못했습니다."
        description="현재 API 응답을 다시 확인해야 합니다."
        actionLabel="다시 시도"
        onAction={() => void refetch()}
      />
    );
  } else if (!data) {
    body = (
      <StatusView
        title="일기 정보가 없습니다."
        description="현재 API에서 반환된 상세 데이터가 비어 있습니다."
        actionLabel="목록으로"
        onAction={handleBack}
      />
    );
  } else {
    body = (
      <>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <MyDiaryDetail detail={data} />
        </ScrollView>
        <CommentComposer
          value={content}
          onChangeText={setContent}
          onSubmit={() => void handleSend()}
          disabled={isPending}
        />
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScreenHeader title="나의 일기" onBack={handleBack} />
        {body}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
