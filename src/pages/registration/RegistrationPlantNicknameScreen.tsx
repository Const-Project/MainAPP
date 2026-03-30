import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import { useFinalChoiceAvatar } from "@/hooks/avatars/useAvatarApi";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

const MAX_NICKNAME_LENGTH = 6;

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
  const isTooLong = trimmedNickname.length > MAX_NICKNAME_LENGTH;
  const isEmpty = trimmedNickname.length === 0;
  const isInvalid = isEmpty || isTooLong;
  const canSubmitToApi =
    (mode === "selection" && Boolean(selectedMaster?.id && selectedMaster.defaultImageUrl)) ||
    (mode === "creation" && Boolean(creationDetail.uploadedImageUrl));

  const previewImageUrl =
    selectedPreview?.imageUrl ?? creationDetail.uploadedImageUrl ?? selectedMaster?.defaultImageUrl ?? null;

  const completeFlow = async () => {
    if (isInvalid || !canSubmitToApi || finalChoiceAvatar.isPending) {
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
      // Keep same visual state and allow retry.
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
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader title="식물 데려오기" onBack={goBackTarget} />

      <View style={styles.content}>
        <Text style={styles.title}>식물의 별명을 지어주세요</Text>

        <View style={styles.previewCard}>
          {previewImageUrl ? (
            <Image source={{ uri: previewImageUrl }} resizeMode="contain" style={styles.previewImage} />
          ) : null}
        </View>

        <View
          style={[
            styles.inputWrap,
            isTooLong ? styles.inputWrapError : null,
            !isEmpty && !isTooLong ? styles.inputWrapActive : null,
          ]}
        >
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="별명을 지어주세요"
            placeholderTextColor="#BFBFBF"
            style={styles.input}
          />
          {isEmpty ? <Text style={styles.maxCount}>최대 6자</Text> : null}
        </View>

        {isTooLong ? <Text style={styles.errorText}>최대 6자 입력해주세요.</Text> : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.88}
          disabled={isInvalid || !canSubmitToApi || finalChoiceAvatar.isPending}
          onPress={() => void completeFlow()}
          style={[
            styles.primaryButton,
            isInvalid || !canSubmitToApi || finalChoiceAvatar.isPending ? styles.primaryButtonDisabled : null,
          ]}
        >
          <Text
            style={[
              styles.primaryButtonText,
              isInvalid || !canSubmitToApi || finalChoiceAvatar.isPending
                ? styles.primaryButtonTextDisabled
                : null,
            ]}
          >
            내 텃밭으로 가기
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: "center",
  },
  title: {
    width: "100%",
    paddingHorizontal: 5,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: "600",
    color: "#171717",
    marginBottom: 73,
  },
  previewCard: {
    width: 258,
    height: 292,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#72D14E",
    backgroundColor: "#EEF9EA",
    marginBottom: 16,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  previewImage: {
    width: 234,
    height: 268,
  },
  inputWrap: {
    width: 353,
    height: 60,
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderRadius: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  inputWrapActive: {
    borderColor: "#171717",
  },
  inputWrapError: {
    borderColor: "#F76868",
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 26,
    color: "#171717",
    paddingVertical: 0,
  },
  maxCount: {
    fontSize: 14,
    lineHeight: 22,
    color: "#7C7C7C",
    marginLeft: 8,
  },
  errorText: {
    width: "100%",
    paddingLeft: 17,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: "#7C7C7C",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 8,
    backgroundColor: "#72D14E",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#EFEFEF",
  },
  primaryButtonText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  primaryButtonTextDisabled: {
    color: "#BFBFBF",
  },
});

