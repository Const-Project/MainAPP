import * as ImagePicker from "expo-image-picker";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import CheckIcon from "@/assets/icons/Check.svg";
import Check2Icon from "@/assets/icons/Check2.svg";
import ImageAttachmentCard from "@/components/dailyMission/ImageAttachmentCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import { useWriteDiaryImageUpload, useWriteDiarySubmit } from "@/hooks/mission/useMissionApi";
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

    formData.append(
      "file",
      {
        uri: asset.uri,
        name: fileName,
        type: fileType,
      } as never
    );

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
       * Invalidate related queries so home and log reflect the new diary immediately.
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

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="일기 쓰기" onBack={goHome} />

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

        <RegistrationTextField
          label=""
          value={content}
          onChangeText={setContent}
          placeholder="오늘 식물에게 있었던 일을 적어주세요"
          multiline
        />

        <View style={styles.visibilityRow}>
          <TouchableOpacity
            style={styles.visibilityOption}
            onPress={() => setIsPublic(false)}
            activeOpacity={0.7}
          >
            <View style={[styles.radioCircle, !isPublic ? styles.radioCircleSelected : null]}>
              {!isPublic ? <CheckIcon width={20} height={20} /> : <Check2Icon width={20} height={20} />}
            </View>
            <Text style={[styles.visibilityLabel, !isPublic ? styles.visibilityLabelSelected : null]}>
              {"나만 보기"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.visibilityOption}
            onPress={() => setIsPublic(true)}
            activeOpacity={0.7}
          >
            <View style={[styles.radioCircle, isPublic ? styles.radioCircleSelected : null]}>
              {isPublic ? <CheckIcon width={20} height={20} /> : <Check2Icon width={20} height={20} />}
            </View>
            <Text style={[styles.visibilityLabel, isPublic ? styles.visibilityLabelSelected : null]}>
              {"공개하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <RegistrationFooter
        primaryLabel="등록하기"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={
          !title.trim() ||
          !content.trim() ||
          !uploadedImage ||
          uploadDiaryImage.isPending ||
          submitDiary.isPending
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 20,
  },
  // 날짜 + 제목 묶음 섹션
  titleSection: {
    gap: 8,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
  dateText: {
    fontSize: 16,
    color: "#282828",
    fontWeight: "400",
  },
  // 제목 입력 필드 (박스 없이 큰 텍스트 스타일)
  titleInput: {
    fontSize: 24,
    fontWeight: "600",
    color: "#171717",
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  visibilityRow: {
    flexDirection: "row",
    gap: 24,
    paddingTop: 4,
    paddingBottom: 8,
  },
  visibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {},
  visibilityLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  visibilityLabelSelected: {
    color: "#171717",
    fontWeight: "500",
  },
});
