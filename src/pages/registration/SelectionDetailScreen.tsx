import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { RootStackScreenProps } from "@/navigation/types";
import RegistrationHeader from "@/components/registration/common/RegistrationHeader";
import SelectionDetail from "@/components/registration/selectionFlow/SelectionDetail";
import { useGetSelectAvatar } from "@/hooks/avatars/useGetSelectAvatarApi";
import { useAvatarCreationStore } from "@/stores/avatarCreationStore";
import { AvatarType } from "@/types/avatars/masters";

type Props = RootStackScreenProps<"RegistrationSelectionDetail">;

export default function SelectionDetailScreen({ navigation }: Props) {
  const { actions } = useAvatarCreationStore();
  const { data, isLoading, isError } = useGetSelectAvatar();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (data?.result && data.result.length > 0 && selectedId === null) {
      setSelectedId(data.result[0].id);
    }
  }, [data, selectedId]);

  const handleNextPress = () => {
    if (selectedId === null || !data?.result) return;

    const selectedAvatar = data.result.find(
      (avatar: AvatarType) => avatar.id === selectedId
    );

    if (selectedAvatar) {
      actions.setPickSelectionAvatar({
        id: selectedAvatar.id,
        description: selectedAvatar.description,
        img: selectedAvatar.defaultImageUrl,
      });
      actions.setPickAvatar({
        id: selectedAvatar.id,
        description: selectedAvatar.description,
        img: selectedAvatar.defaultImageUrl,
      });
      actions.setActiveOption("selection");
      actions.completeSelection();

      navigation.navigate("RegistrationAvatar");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <RegistrationHeader />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7DC960" />
          <Text style={styles.loadingText}>아바타 불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <RegistrationHeader />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>아바타를 불러오는데 실패했습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <RegistrationHeader showBackButton={true} />

      <Text style={styles.title}>원하는 아바타를 선택해주세요.</Text>

      <View style={styles.content}>
        {data?.result && selectedId !== null && (
          <SelectionDetail
            avatars={data.result}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleNextPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>다음</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#EF4444",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#171717",
    paddingTop: 32,
    paddingLeft: 25,
  },
  content: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 35,
  },
  button: {
    width: "100%",
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7DC960",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
