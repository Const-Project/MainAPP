import { useEffect, useRef } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import PendingCharacter from "@/assets/images/creationAvatar/PendingImage.svg";
import { useUploadCreationAvatar } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";
import type { UploadCreationAvatarResponse } from "@/types/avatars";

type Props = RootStackScreenProps<"RegistrationCreationPending">;

const uploadPromises = new Map<string, Promise<UploadCreationAvatarResponse>>();

export default function RegistrationCreationPendingScreen({ navigation, route }: Props) {
  const uploadCreationAvatar = useUploadCreationAvatar();
  const hasStartedRef = useRef(false);
  const { entry, imageUri, fileName, fileType } = route.params;
  const {
    updateCreationDetail,
    setMode,
    setSelectedMaster,
    setSelectedPreview,
  } = useRegistrationStore();

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }
    hasStartedRef.current = true;

    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      name: fileName,
      type: fileType,
    } as never);

    const uploadKey = `${imageUri}:${fileName}`;
    let uploadPromise = uploadPromises.get(uploadKey);

    if (!uploadPromise) {
      uploadPromise = uploadCreationAvatar
        .mutateAsync(formData)
        .finally(() => uploadPromises.delete(uploadKey));
      uploadPromises.set(uploadKey, uploadPromise);
    }

    void uploadPromise
      .then(response => {
        updateCreationDetail({
          imageUri,
          uploadedImageUrl: response.imageUrl,
        });
        setMode("creation");
        setSelectedMaster(null);
        setSelectedPreview({
          masterId: null,
          imageUrl: response.imageUrl,
          description: "업로드가 완료되었습니다. 이 이미지를 기반으로 식물을 등록합니다.",
        });

        navigation.replace("RegistrationCreationComplete", {
          entry,
          imageUrl: response.imageUrl,
        });
      })
      .catch(error => {
        const message = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
        Alert.alert("업로드 실패", message, [
          {
            text: "다시 선택",
            onPress: () => navigation.replace("RegistrationCreationDetail", { entry }),
          },
        ]);
      });
  }, [
    entry,
    fileName,
    fileType,
    imageUri,
    navigation,
    setMode,
    setSelectedMaster,
    setSelectedPreview,
    updateCreationDetail,
    uploadCreationAvatar,
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="식물 데려오기" />
      <View style={styles.content}>
        <View style={styles.group}>
          <PendingCharacter width={80} height={100} />
          <View style={styles.messageWrap}>
            <Text style={styles.message}>아바타를 만들고 있어요</Text>
            <Text style={styles.message}>잠시만 기다려주세요...</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -38,
  },
  group: {
    width: 165,
    minHeight: 174,
    alignItems: "center",
    gap: 16,
  },
  messageWrap: {
    width: 165,
    alignItems: "center",
  },
  message: {
    fontSize: 18,
    lineHeight: 29,
    fontWeight: "600",
    color: "#7C7C7C",
    textAlign: "center",
  },
});
