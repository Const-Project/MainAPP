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
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationCreationDetail">;

export default function RegistrationCreationDetailScreen({ navigation, route }: Props) {
  const entry = route.params?.entry;
  const [permissionRequested, setPermissionRequested] = useState(false);
  const {
    creationDetail,
    updateCreationDetail,
    setSelectedPreview,
  } = useRegistrationStore();

  const previewImageUrl = creationDetail.imageUri || null;

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

    updateCreationDetail({
      imageUri: asset.uri,
      uploadedImageUrl: "",
    });
    setSelectedPreview({
      masterId: null,
      imageUrl: asset.uri,
      description: "선택한 이미지를 업로드합니다.",
    });

    navigation.navigate("RegistrationCreationPending", {
      entry,
      imageUri: asset.uri,
      fileName,
      fileType,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader
        title="식물 데려오기"
        onBack={() => navigation.navigate("RegistrationAvatar", { entry })}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>사진을 선택해주세요</Text>
          <Text style={styles.subtitle}>사진 업로드 후 아바타 생성이 시작됩니다.</Text>
        </View>

        <AvatarPreviewCard
          imageUrl={previewImageUrl}
          title="사진 미리보기"
          description="식물 사진을 선택하면 생성형 아바타를 제작합니다."
        />

        <TouchableOpacity style={styles.actionButton} activeOpacity={0.85} onPress={() => void handlePickImage()}>
          <Text style={styles.actionButtonText}>
            {creationDetail.imageUri ? "이미지 다시 선택" : "이미지 선택"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <RegistrationFooter
        primaryLabel="나중에 만들기"
        onPrimaryPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: "Main", params: { screen: "Home" } }],
          })
        }
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
});
