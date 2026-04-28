import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import CheckIcon from "@/assets/icons/Check.svg";
import Check2Icon from "@/assets/icons/Check2.svg";
import ImageAttachmentCard from "@/components/dailyMission/ImageAttachmentCard";
import {
  useTodayKeyword,
  useWriteDiaryImageUpload,
  useWriteDiarySubmit,
} from "@/hooks/mission/useMissionApi";
import type { RootStackScreenProps } from "@/navigation/types";
import { prepareUploadImage } from "@/utils/images/prepareUploadImage";

type Props = RootStackScreenProps<"DailyMissionWriteDiary">;

export default function DailyMissionWriteDiaryScreen({ navigation }: Props) {
  const queryClient = useQueryClient();
  const { data: todayKeyword } = useTodayKeyword();
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

  // 홈 화면으로 초기화 이동
  const goHome = () =>
    navigation.reset({
      index: 0,
      routes: [{ name: "Main", params: { screen: "Home" } }],
    });

  // 갤러리에서 이미지 선택 후 서버 업로드
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
    const preparedImage = await prepareUploadImage(asset, "diary");
    const formData = new FormData();

    formData.append(
      "file",
      {
        uri: preparedImage.uri,
        name: preparedImage.fileName,
        type: preparedImage.mimeType,
      } as never
    );

    setSelectedImageUri(preparedImage.uri);
    setUploadedImage(null);

    try {
      const response = await uploadDiaryImage.mutateAsync(formData);
      setUploadedImage(response.result);
    } catch (error) {
      const message = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
      Alert.alert("업로드 실패", message);
    }
  };

  // 일기 저장 후 관련 쿼리 무효화 및 홈 이동
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

      await queryClient.invalidateQueries({ queryKey: ["home-summary"] });
      await queryClient.invalidateQueries({ queryKey: ["calendar"] });
      await queryClient.invalidateQueries({ queryKey: ["diaries"] });
      goHome();
    } catch (error) {
      const message = error instanceof Error ? error.message : "일기 저장에 실패했습니다.";
      Alert.alert("일기 저장 실패", message);
    }
  };

  const isSubmitDisabled =
    !title.trim() ||
    !content.trim() ||
    !uploadedImage ||
    uploadDiaryImage.isPending ||
    submitDiary.isPending;

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const keyword = todayKeyword?.keyword.trim();
  const contentPlaceholder =
    keyword && !keyword.includes("없습니다") && !keyword.includes("실패")
      ? `${keyword}에 대해 이야기 해보는 건 어때요?`
      : "오늘 식물에게 있었던 일을 적어주세요";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* 헤더: X 닫기 + 완료 제출 버튼 */}
      <ScreenHeader
        title="일기 쓰기"
        onBack={goHome}
        onRightAction={() => void handleSubmit()}
        rightActionDisabled={isSubmitDisabled}
      />

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* 날짜 + 제목 섹션 (하단 구분선으로 묶음) */}
        <View style={styles.titleSection}>
          <Text style={styles.dateText}>{today}</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
            placeholderTextColor="#BFBFBF"
            style={styles.titleInput}
          />
        </View>

        {/* 이미지 첨부 카드 */}
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

        {/* 본문 입력 필드 */}
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={contentPlaceholder}
          placeholderTextColor="#BFBFBF"
          multiline
          textAlignVertical="top"
          style={styles.contentInput}
        />

        {/* 공개 여부 선택 */}
        <View style={styles.visibilityRow}>
          <TouchableOpacity
            style={styles.visibilityOption}
            onPress={() => setIsPublic(false)}
            activeOpacity={0.7}
          >
            {!isPublic ? <CheckIcon width={24} height={24} /> : <Check2Icon width={24} height={24} />}
            <Text style={styles.visibilityLabel}>나만 보기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.visibilityOption}
            onPress={() => setIsPublic(true)}
            activeOpacity={0.7}
          >
            {isPublic ? <CheckIcon width={24} height={24} /> : <Check2Icon width={24} height={24} />}
            <Text style={styles.visibilityLabel}>공개하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 전체 배경 흰색
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 24,
  },
  // 날짜 + 제목 묶음 섹션
  titleSection: {
    gap: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  // 날짜 텍스트
  dateText: {
    fontSize: 16,
    color: "#282828",
    fontWeight: "400",
    lineHeight: 16 * 1.6,
  },
  // 제목 입력 (박스 없이 큰 텍스트)
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    color: "#171717",
    lineHeight: 24 * 1.35,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  // 본문 입력 (플레인 멀티라인)
  contentInput: {
    fontSize: 16,
    fontWeight: "400",
    color: "#171717",
    lineHeight: 16 * 1.6,
    minHeight: 80,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  // 공개 여부 선택 행
  visibilityRow: {
    flexDirection: "row",
    gap: 16,
    paddingBottom: 8,
  },
  visibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // 공개 여부 텍스트 (선택 여부 무관 검정)
  visibilityLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: "#171717",
    lineHeight: 14 * 1.6,
  },
});
