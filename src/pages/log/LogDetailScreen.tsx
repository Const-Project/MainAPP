import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import CommentComposer from "@/components/common/CommentComposer";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import MyDiaryDetail from "@/components/log/MyDiaryDetail";
import usePostComment from "@/hooks/comments/useCommentApi";
import { useDiaryDetail, useUpdateDiaryDetail } from "@/hooks/log/useDiaryDetailApi";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const { mutateAsync, isPending } = usePostComment(() => refetch());
  const updateDiary = useUpdateDiaryDetail(diaryId);

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

  const startEdit = () => {
    if (!data) {
      return;
    }

    setEditTitle(data.title);
    setEditContent(data.content);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!data || !editTitle.trim() || !editContent.trim() || updateDiary.isPending) {
      return;
    }

    try {
      await updateDiary.mutateAsync({
        title: editTitle.trim(),
        content: editContent.trim(),
        isPublic: data.isPublic,
      });
      setIsEditing(false);
      void refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : "일기 수정에 실패했습니다.";
      Alert.alert("수정 실패", message);
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
    body = isEditing ? (
      <ScrollView contentContainerStyle={styles.editContent} keyboardShouldPersistTaps="handled">
        <Text style={styles.editLabel}>제목</Text>
        <TextInput
          value={editTitle}
          onChangeText={setEditTitle}
          placeholder="제목을 입력하세요"
          placeholderTextColor="#BFBFBF"
          style={styles.titleInput}
        />
        <Text style={styles.editLabel}>본문</Text>
        <TextInput
          value={editContent}
          onChangeText={setEditContent}
          placeholder="내용을 입력하세요"
          placeholderTextColor="#BFBFBF"
          multiline
          textAlignVertical="top"
          style={styles.bodyInput}
        />
        <View style={styles.editActions}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setIsEditing(false)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => void handleSaveEdit()}
            disabled={!editTitle.trim() || !editContent.trim() || updateDiary.isPending}
            style={[
              styles.primaryButton,
              (!editTitle.trim() || !editContent.trim() || updateDiary.isPending) &&
                styles.primaryButtonDisabled,
            ]}
          >
            <Text style={styles.primaryButtonText}>
              {updateDiary.isPending ? "저장 중..." : "저장"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    ) : (
      <>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <MyDiaryDetail detail={data} onEdit={startEdit} />
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
        <ScreenHeader title={isEditing ? "일기 수정" : "나의 일기"} onBack={isEditing ? () => setIsEditing(false) : handleBack} />
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
  editContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 14,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },
  titleInput: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: "#171717",
    backgroundColor: "#FFFFFF",
  },
  bodyInput: {
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    lineHeight: 24,
    color: "#171717",
    backgroundColor: "#FFFFFF",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF9EA",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#46C02B",
  },
  primaryButton: {
    flex: 1,
    minHeight: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6FCF4A",
  },
  primaryButtonDisabled: {
    backgroundColor: "#EAEAEA",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
