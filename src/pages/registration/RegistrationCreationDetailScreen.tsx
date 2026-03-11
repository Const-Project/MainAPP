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
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import AvatarPreviewCard from "@/components/registration/AvatarPreviewCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import { useUploadCreationAvatar } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationCreationDetail">;

export default function RegistrationCreationDetailScreen({ navigation }: Props) {
  const [permissionRequested, setPermissionRequested] = useState(false);
  const uploadCreationAvatar = useUploadCreationAvatar();
  const {
    creationDetail,
    updateCreationDetail,
    setMode,
    setSelectedMaster,
    setSelectedPreview,
  } = useRegistrationStore();

  const previewImageUrl =
    creationDetail.uploadedImageUrl || creationDetail.imageUri || null;
  const canProceed = Boolean(creationDetail.uploadedImageUrl);

  const handlePickImage = async () => {
    if (!permissionRequested) {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setPermissionRequested(true);

      if (!permission.granted) {
        Alert.alert("권한 필요", "생성형 아바타 이미지를 고르려면 사진 접근 권한이 필요합니다.");
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
    const fileName = asset.fileName ?? `avatar-${Date.now()}.jpg`;
    const fileType = asset.mimeType ?? "image/jpeg";
    const formData = new FormData();

    formData.append("image", {
      uri: asset.uri,
      name: fileName,
      type: fileType,
    } as never);

    updateCreationDetail({
      imageUri: asset.uri,
      uploadedImageUrl: "",
    });
    setSelectedPreview({
      masterId: null,
      imageUrl: asset.uri,
      description: "선택한 이미지를 업로드하는 중입니다.",
    });

    try {
      const response = await uploadCreationAvatar.mutateAsync(formData);

      updateCreationDetail({
        imageUri: asset.uri,
        uploadedImageUrl: response.imageUrl,
      });
      setMode("creation");
      setSelectedMaster(null);
      setSelectedPreview({
        masterId: null,
        imageUrl: response.imageUrl,
        description: "업로드가 완료되었습니다. 이 이미지를 기반으로 식물을 등록합니다.",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
      Alert.alert("업로드 실패", message);
    }
  };

  const goNext = () => {
    if (!canProceed) {
      return;
    }

    navigation.navigate("RegistrationPlantNickname");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="생성형 상세"
        onBack={() => navigation.navigate("RegistrationAvatar")}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>이미지를 업로드해주세요.</Text>
          <Text style={styles.subtitle}>
            선택한 이미지는 `POST /api/v1/register/upload`로 업로드되고, 응답 `imageUrl`이 최종 등록 단계로 이어집니다.
          </Text>
        </View>

        <AvatarPreviewCard
          imageUrl={previewImageUrl}
          title="생성형 미리보기"
          description={
            creationDetail.uploadedImageUrl
              ? "업로드가 완료된 이미지입니다."
              : creationDetail.imageUri
                ? "선택한 로컬 이미지입니다. 업로드가 완료되면 서버 imageUrl을 사용합니다."
                : "아직 선택한 이미지가 없습니다."
          }
        />

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.85}
          disabled={uploadCreationAvatar.isPending}
          onPress={() => void handlePickImage()}
        >
          <Text style={styles.actionButtonText}>
            {uploadCreationAvatar.isPending ? "업로드 중..." : creationDetail.imageUri ? "이미지 다시 선택" : "이미지 선택"}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>현재 상태</Text>
          <Text style={styles.infoText}>
            {creationDetail.uploadedImageUrl
              ? "서버 업로드가 완료되었습니다. 다음 단계에서 별명을 정한 뒤 최종 등록합니다."
              : "이미지를 선택하면 업로드를 먼저 수행합니다."}
          </Text>
          {creationDetail.uploadedImageUrl ? (
            <Text style={styles.infoUrl}>{creationDetail.uploadedImageUrl}</Text>
          ) : null}
        </View>

        {uploadCreationAvatar.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>이미지 업로드에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>
              같은 이미지를 다시 선택해서 재시도할 수 있습니다.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="처음으로"
        onSecondaryPress={() => navigation.navigate("RegistrationAvatar")}
        primaryLabel="별명 정하러 가기"
        onPrimaryPress={goNext}
        primaryDisabled={!canProceed || uploadCreationAvatar.isPending}
        primaryLoading={uploadCreationAvatar.isPending}
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
  actionButton: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#2F7D32",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  infoCard: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "#EEF3EA",
    gap: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  infoUrl: {
    fontSize: 12,
    lineHeight: 18,
    color: "#2563EB",
  },
  errorCard: {
    borderRadius: 18,
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
