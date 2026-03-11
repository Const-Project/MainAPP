import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import StatusView from "@/components/common/StatusView";
import ImageAttachmentCard from "@/components/dailyMission/ImageAttachmentCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import { useWriteDiarySubmit } from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";

type Props = RootStackScreenProps<"DailyMissionWriteDiary">;

export default function DailyMissionWriteDiaryScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [imageNoticeVisible, setImageNoticeVisible] = useState(false);
  const submitDiary = useWriteDiarySubmit();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    // Image picker dependency is not available in the current app.
    // Keep the API interface wired but block the actual submit until an image upload path exists.
    setImageNoticeVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="일기 쓰기"
        onBack={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Main", params: { screen: "Home" } }],
          })
        }
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>오늘의 식물 이야기를 적어주세요.</Text>
          <Text style={styles.subtitle}>
            텍스트 입력과 공개 여부 구조는 구현했고, 이미지 선택은 라이브러리 확정 후 연결합니다.
          </Text>
        </View>

        <RegistrationTextField
          label="제목"
          value={title}
          onChangeText={setTitle}
          placeholder="제목을 입력하세요"
        />
        <RegistrationTextField
          label="내용"
          value={content}
          onChangeText={setContent}
          placeholder="오늘 식물에게 있었던 일을 적어주세요"
          multiline
        />

        <ImageAttachmentCard
          onPress={() => setImageNoticeVisible(true)}
          helperText="`POST /api/v1/diaries/images` 인터페이스는 추가했지만, 현재 프로젝트에는 이미지 선택 라이브러리가 없습니다."
        />

        <View style={styles.visibilityCard}>
          <Text style={styles.visibilityTitle}>공개 설정</Text>
          <View style={styles.visibilityButtons}>
            <TouchableOpacity
              style={[
                styles.visibilityButton,
                !isPublic ? styles.visibilityButtonActive : null,
              ]}
              onPress={() => setIsPublic(false)}
            >
              <Text
                style={[
                  styles.visibilityButtonText,
                  !isPublic ? styles.visibilityButtonTextActive : null,
                ]}
              >
                비공개
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.visibilityButton,
                isPublic ? styles.visibilityButtonActive : null,
              ]}
              onPress={() => setIsPublic(true)}
            >
              <Text
                style={[
                  styles.visibilityButtonText,
                  isPublic ? styles.visibilityButtonTextActive : null,
                ]}
              >
                공개
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {imageNoticeVisible ? (
          <StatusView
            title="이미지 선택 경로가 아직 없습니다."
            description="RN 이미지 선택 라이브러리 또는 카메라 연동이 추가되면 `/api/v1/diaries/images` 업로드와 `/api/v1/diaries` 제출을 바로 연결할 수 있습니다."
          />
        ) : null}

        {submitDiary.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>일기 저장에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>
              현재는 이미지 업로드 경로가 없어 실제 제출까지 이어지지 않습니다.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="홈으로"
        onSecondaryPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Main", params: { screen: "Home" } }],
          })
        }
        primaryLabel="제출하기"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={!title.trim() || !content.trim() || submitDiary.isPending}
        primaryLoading={submitDiary.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  headerBlock: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#171717",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6B7280",
  },
  visibilityCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FFFFFF",
    gap: 12,
  },
  visibilityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#171717",
  },
  visibilityButtons: {
    flexDirection: "row",
    gap: 10,
  },
  visibilityButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  visibilityButtonActive: {
    borderColor: "#2F7D32",
    backgroundColor: "#EDF7ED",
  },
  visibilityButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
  },
  visibilityButtonTextActive: {
    color: "#1F5C27",
  },
  errorCard: {
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#FEF2F2",
    gap: 6,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#B91C1C",
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#7F1D1D",
  },
});
