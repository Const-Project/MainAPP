import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Alert, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";

import MissionHeader from "@/components/dailyMission/common/MissionHeader";
import DiaryEditor from "@/components/dailyMission/writeDiary/DiaryEditor";
import DiaryFooter from "@/components/dailyMission/writeDiary/DiaryFooter";
import {
  useWriteDiaryImageUploadApi,
  useWriteDiarySubmitApi,
} from "@/hooks/mission/useWriteDiaryApi";

type Props = RootStackScreenProps<"DailyMissionWriteDiary">;

export default function WriteDiaryScreen({ navigation }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);

  const imageUploadMutation = useWriteDiaryImageUploadApi();
  const submitDiaryMutation = useWriteDiarySubmitApi();

  const [uploadedImage, setUploadedImage] = useState<{
    imageId: number;
    imageUrl: string;
  } | null>(null);

  const handleImageSelected = async (uri: string) => {
    setImageUri(uri);

    // FormData 생성
    const formData = new FormData();
    const filename = uri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("file", {
      uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      name: filename,
      type,
    } as unknown as Blob);

    imageUploadMutation.mutate(
      { formData },
      {
        onSuccess: res => {
          setUploadedImage(res.result);
        },
        onError: () => {
          Alert.alert("오류", "이미지 업로드에 실패했습니다.");
        },
      }
    );
  };

  const handleVisibilityChange = (value: boolean) => {
    setIsPublic(value);
  };

  const handleSubmit = () => {
    if (!uploadedImage) {
      Alert.alert("알림", "먼저 이미지를 업로드하세요!");
      return;
    }

    if (!title.trim()) {
      Alert.alert("알림", "제목을 입력해주세요.");
      return;
    }

    submitDiaryMutation.mutate(
      {
        title,
        content,
        isPublic,
        imageId: uploadedImage.imageId,
        imageUrl: uploadedImage.imageUrl,
      },
      {
        onSuccess: () => {
          navigation.goBack();
        },
        onError: () => {
          Alert.alert("오류", "일기 작성에 실패했습니다.");
        },
      }
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <MissionHeader
        onSubmit={handleSubmit}
        showSubmit={true}
        context="일기 쓰기"
      />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <DiaryEditor
          title={title}
          content={content}
          onTitleChange={setTitle}
          onContentChange={setContent}
          imageUri={imageUri}
          onImageSelected={handleImageSelected}
        />
      </ScrollView>
      <View style={styles.footer}>
        <DiaryFooter
          isPublic={isPublic}
          onVisibilityChange={handleVisibilityChange}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
  },
});
