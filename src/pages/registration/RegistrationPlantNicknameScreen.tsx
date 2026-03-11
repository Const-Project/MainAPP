import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import AvatarPreviewCard from "@/components/registration/AvatarPreviewCard";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import { useFinalChoiceAvatar } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationPlantNickname">;

export default function RegistrationPlantNicknameScreen({ navigation }: Props) {
  const {
    mode,
    nickname,
    selectedMaster,
    selectedPreview,
    creationDetail,
    setNickname,
    reset,
  } = useRegistrationStore();
  const finalChoiceAvatar = useFinalChoiceAvatar();

  const trimmedNickname = nickname.trim();
  const isInvalid = trimmedNickname.length === 0 || trimmedNickname.length > 6;
  const canSubmitToApi =
    (mode === "selection" && Boolean(selectedMaster?.id && selectedMaster.defaultImageUrl)) ||
    (mode === "creation" && Boolean(creationDetail.uploadedImageUrl));

  const helperText =
    mode === "selection"
      ? "선택형은 imageUrl과 masterId를 함께 보내 최종 등록합니다."
      : "생성형은 업로드된 imageUrl과 masterId:null로 최종 등록합니다.";

  const completeFlow = async () => {
    if (isInvalid || !canSubmitToApi) {
      return;
    }

    const payload =
      mode === "selection" && selectedMaster
        ? {
            nickname: trimmedNickname,
            imageUrl: selectedMaster.defaultImageUrl,
            masterId: selectedMaster.id,
          }
        : {
            nickname: trimmedNickname,
            imageUrl: creationDetail.uploadedImageUrl,
            masterId: null,
          };

    try {
      await finalChoiceAvatar.mutateAsync(payload);
      reset();
      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { screen: "Home" } }],
      });
    } catch {
      // Error card below handles the failure case.
    }
  };

  const goBackTarget = () => {
    if (mode === "selection") {
      navigation.navigate("RegistrationSelectionDetail");
      return;
    }

    navigation.navigate("RegistrationCreationDetail");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScreenHeader title="식물 별명" onBack={goBackTarget} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>식물의 별명을 지어주세요.</Text>
          <Text style={styles.subtitle}>
            별명과 imageUrl을 함께 보내 최종 아바타 등록을 완료합니다.
          </Text>
        </View>

        <AvatarPreviewCard
          imageUrl={selectedPreview?.imageUrl ?? creationDetail.uploadedImageUrl ?? undefined}
          title={trimmedNickname || "내 식물"}
          description={selectedPreview?.description}
        />

        <RegistrationTextField
          label="식물 별명"
          value={nickname}
          onChangeText={setNickname}
          placeholder="별명을 입력해주세요"
          helperText={helperText}
        />

        <View style={styles.captionRow}>
          <Text style={[styles.caption, isInvalid ? styles.captionError : null]}>
            {trimmedNickname.length > 6
              ? "최대 6자까지 입력할 수 있습니다."
              : "공백을 제외한 별명을 입력해주세요."}
          </Text>
          {!canSubmitToApi ? (
            <Text style={[styles.caption, styles.captionError]}>
              {mode === "creation"
                ? "생성형 이미지를 먼저 업로드해야 합니다."
                : "선택한 아바타 정보를 다시 확인해주세요."}
            </Text>
          ) : null}
        </View>

        {finalChoiceAvatar.isError ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>최종 등록에 실패했습니다.</Text>
            <Text style={styles.errorDescription}>
              `POST /api/v1/avatars` 호출에 실패했습니다. 같은 정보로 다시 시도할 수 있습니다.
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <RegistrationFooter
        secondaryLabel="이전"
        onSecondaryPress={goBackTarget}
        primaryLabel="내 텃밭으로 가기"
        onPrimaryPress={() => void completeFlow()}
        primaryDisabled={isInvalid || !canSubmitToApi || finalChoiceAvatar.isPending}
        primaryLoading={finalChoiceAvatar.isPending}
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
  captionRow: {
    gap: 8,
  },
  caption: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6B7280",
  },
  captionError: {
    color: "#B91C1C",
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
