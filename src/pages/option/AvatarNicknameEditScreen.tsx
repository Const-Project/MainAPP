import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationFooter from "@/components/registration/RegistrationFooter";
import RegistrationTextField from "@/components/registration/RegistrationTextField";
import StatusView from "@/components/common/StatusView";
import useHomeApi from "@/hooks/home/useHomeApi";
import { useUpdateAvatarNickname } from "@/hooks/option/useAvatarNicknameApi";
import type { GardenSummary } from "@/types/home/garden";

type Props = RootStackScreenProps<"AvatarNicknameEdit">;

type SelectableAvatar = {
  gardenId: number;
  gardenSlotNumber: number;
  avatarId: number;
  avatarName: string;
  avatarImageUrl: string;
};

export default function AvatarNicknameEditScreen({ navigation }: Props) {
  const { data, isLoading, error, refetch } = useHomeApi();
  const updateAvatarNickname = useUpdateAvatarNickname();
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [draftNickname, setDraftNickname] = useState("");

  const avatars = useMemo<SelectableAvatar[]>(() => {
    if (!data?.gardenSummaries) {
      return [];
    }

    return data.gardenSummaries
      .filter((garden: GardenSummary) => Boolean(garden.avatar?.avatarId))
      .map((garden: GardenSummary) => ({
        gardenId: garden.gardenId,
        gardenSlotNumber: garden.gardenSlotNumber,
        avatarId: garden.avatar!.avatarId,
        avatarName: garden.avatar!.avatarName,
        avatarImageUrl: garden.avatar!.avatarImageUrl,
      }));
  }, [data]);

  const selectedAvatar =
    avatars.find(avatar => avatar.avatarId === selectedAvatarId) ?? avatars[0] ?? null;

  const nickname = draftNickname || selectedAvatar?.avatarName || "";
  const trimmedNickname = nickname.trim();
  const isValidNickname = trimmedNickname.length >= 1 && trimmedNickname.length <= 6;
  const isChanged = trimmedNickname.length > 0 && trimmedNickname !== (selectedAvatar?.avatarName ?? "");

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectAvatar = (avatarId: number, avatarName: string) => {
    setSelectedAvatarId(avatarId);
    setDraftNickname(avatarName);
  };

  const handleSubmit = async () => {
    if (!selectedAvatar || !isValidNickname || !isChanged || updateAvatarNickname.isPending) {
      return;
    }

    try {
      await updateAvatarNickname.mutateAsync({
        avatarId: selectedAvatar.avatarId,
        newAvatarName: trimmedNickname,
      });
      navigation.goBack();
    } catch {
      Alert.alert("아바타 닉네임 변경에 실패했습니다", "잠시 후 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView title="아바타 정보를 불러오는 중입니다." loading />
      </SafeAreaView>
    );
  }

  if (error || !data) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="아바타 정보를 불러오지 못했습니다."
          actionLabel="다시 시도"
          onAction={() => void refetch()}
        />
      </SafeAreaView>
    );
  }

  if (avatars.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <StatusView
          title="변경할 아바타가 없습니다."
          description="먼저 식물을 등록한 뒤 다시 시도해주세요."
          actionLabel="뒤로가기"
          onAction={handleBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.sideButton}>
          <Text style={styles.backText}>뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>아바타 닉네임 변경</Text>
        <View style={styles.sideButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>설정</Text>
          <Text style={styles.heroTitle}>식물별 이름을 수정합니다.</Text>
          <Text style={styles.heroDescription}>
            {/* 한글 주석:
                유저 닉네임과 달리 아바타 닉네임은 식물별로 따로 가지므로,
                먼저 변경할 식물을 선택한 뒤 1개 대상만 수정하도록 분리한다. */}
            홈과 프로필에 보이는 식물 이름을 선택해서 바꿀 수 있습니다.
          </Text>
        </View>

        <View style={styles.avatarList}>
          {avatars.map(avatar => {
            const selected = avatar.avatarId === (selectedAvatar?.avatarId ?? null);
            return (
              <TouchableOpacity
                key={avatar.avatarId}
                activeOpacity={0.8}
                style={[styles.avatarCard, selected && styles.avatarCardSelected]}
                onPress={() => handleSelectAvatar(avatar.avatarId, avatar.avatarName)}
              >
                <Image source={{ uri: avatar.avatarImageUrl }} style={styles.avatarImage} resizeMode="contain" />
                <View style={styles.avatarTextWrap}>
                  <Text style={styles.avatarCardTitle}>{avatar.avatarName}</Text>
                  <Text style={styles.avatarCardCaption}>텃밭 {avatar.gardenSlotNumber}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <RegistrationTextField
          label="아바타 닉네임"
          value={nickname}
          onChangeText={setDraftNickname}
          placeholder="아바타 닉네임을 입력해주세요"
          helperText={
            trimmedNickname.length > 6
              ? "아바타 닉네임은 6자 이하로 입력해주세요."
              : "선택한 식물에만 반영됩니다."
          }
        />
      </ScrollView>

      <RegistrationFooter
        primaryLabel="저장"
        onPrimaryPress={() => void handleSubmit()}
        primaryDisabled={!selectedAvatar || !isValidNickname || !isChanged || updateAvatarNickname.isPending}
        primaryLoading={updateAvatarNickname.isPending}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
  },
  sideButton: {
    width: 56,
    height: 44,
    justifyContent: "center",
  },
  backText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#171717",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  heroCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#234A2F",
    gap: 8,
  },
  eyebrow: {
    fontSize: 12,
    color: "#D7E9D8",
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  heroDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#E5F4E5",
  },
  avatarList: {
    gap: 10,
  },
  avatarCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatarCardSelected: {
    borderColor: "#2F7D32",
    backgroundColor: "#F1FBF1",
  },
  avatarImage: {
    width: 52,
    height: 52,
  },
  avatarTextWrap: {
    flex: 1,
    gap: 4,
  },
  avatarCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#171717",
  },
  avatarCardCaption: {
    fontSize: 13,
    color: "#6B7280",
  },
});
