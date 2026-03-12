import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import ImageAttachmentCard from "@/components/dailyMission/ImageAttachmentCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import {
  useWriteDiaryImageUpload,
  useWriteDiarySubmit,
} from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";

type Props = RootStackScreenProps<"DailyMissionWriteDiary">;

export default function DailyMissionWriteDiaryScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{
    imageId: number;
    imageUrl: string;
  } | null>(null);
  const uploadDiaryImage = useWriteDiaryImageUpload();
  const submitDiary = useWriteDiarySubmit();

  const goHome = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });

  const handlePickImage = async () => {
    if (!permissionRequested) {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionRequested(true);

      if (!permission.granted) {
        Alert.alert("권한 필요", "일기 이미지를 선택하려면 사진 접근 권한이 필요합니다.");
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.9,
    });

    if (result.canceled || !result.assets[0]) {
      return;
    }

    const asset = result.assets[0];
    const fileName = asset.fileName ?? `diary-${Date.now()}.jpg`;
    const fileType = asset.mimeType ?? "image/jpeg";
    const formData = new FormData();

    formData.append("file", {
      uri: asset.uri,
      name: fileName,
      type: fileType,
    } as never);

    setSelectedImageUri(asset.uri);
    setUploadedImage(null);

    try {
      const response = await uploadDiaryImage.mutateAsync(formData);
      setUploadedImage(response.result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
      Alert.alert("업로드 실패", message);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    if (!uploadedImage) {
      Alert.alert("이미지 필요", "먼저 이미지를 업로드해주세요.");
      return;
    }

    try {
      await submitDiary.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        isPublic,
        imageId: uploadedImage.imageId,
        imageUrl: uploadedImage.imageUrl,
      });

      /*
       * 한글 주석:
       * 일기 작성 완료 후 홈과 로그에서 최신 상태를 바로 보이게 하려면
       * 관련 쿼리를 함께 갱신하고 홈으로 복귀시키는 흐름이 필요하다.
       */
      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["diaries"] });
      goHome();
    } catch (error) {
      const message = error instanceof Error ? error.message : "일기 저장에 실패했습니다.";
      Alert.alert("일기 저장 실패", message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="일기 쓰기" onBack={goHome} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>오늘의 식물 이야기를 적어주세요.</Text>
          <Text style={styles.subtitle}>
            제목과 내용을 적고 이미지를 첨부한 뒤 공개 여부를 선택해 제출할 수 있습니다.
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
          imageUrl={selectedImageUri}
          onPress={() => void handlePickImage()}
          helperText={
            uploadDiaryImage.isPending
              ? "이미지를 업로드하는 중입니다. 잠시만 기다려주세요."
              : uploadedImage
                ? "이미지 업로드가 완료되었습니다."
                : undefined
          }
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
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="홈으로"
        onSecondaryPress={goHome}
        primaryLabel="제출하기"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={
          !title.trim() || !content.trim() || !uploadedImage || uploadDiaryImage.isPending || submitDiary.isPending
        }
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
});
