import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "@/components/common/ScreenHeader";
import type { RootStackScreenProps } from "@/navigation/types";
import useRegistrationStore from "@/stores/useRegistrationStore";

type Props = RootStackScreenProps<"RegistrationAvatar">;

type EntryMode = "initial" | "garden";

const selectionImage = require("@/assets/images/creationAvatar/SelectionDefultImg.png");
const creationImage = require("@/assets/images/creationAvatar/CreationDefultImg.png");

export default function RegistrationAvatarScreen({ navigation, route }: Props) {
  const { setMode } = useRegistrationStore();
  const entry: EntryMode = route.params?.entry ?? "initial";
  const isGardenEntry = entry === "garden";

  const goSelection = () => {
    setMode("selection");
    navigation.navigate("RegistrationSelectionDetail", { entry });
  };

  const goCreation = () => {
    setMode("creation");
    navigation.navigate("RegistrationCreationDetail", { entry });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScreenHeader
        title="식물 데려오기"
        onBack={isGardenEntry ? undefined : () => navigation.navigate("Main", { screen: "Home" })}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.copyWrap}>
            <Text style={styles.cardTitle}>아바타 선택</Text>
            <Text style={styles.cardDescription}>00종의 아바타 중에서{"\n"}선택할 수 있어요</Text>
            <TouchableOpacity style={styles.cardActionButton} activeOpacity={0.88} onPress={goSelection}>
              <Text style={styles.cardActionLabel}>선택하러 가기</Text>
            </TouchableOpacity>
          </View>
          <Image source={selectionImage} resizeMode="contain" style={styles.cardImage} />
        </View>

        <View style={styles.divider} />

        <View style={styles.card}>
          <View style={styles.copyWrap}>
            <Text style={styles.cardTitle}>나만의 아바타</Text>
            <Text style={styles.cardDescription}>내 식물의 생김새를{"\n"}반영한 나만의 아바타를{"\n"}만들 수 있어요</Text>
            <TouchableOpacity style={styles.cardActionButton} activeOpacity={0.88} onPress={goCreation}>
              <Text style={styles.cardActionLabel}>만들러 가기</Text>
            </TouchableOpacity>
          </View>
          <Image source={creationImage} resizeMode="contain" style={styles.cardImage} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, isGardenEntry ? styles.footerButtonDisabled : styles.footerButtonSecondary]}
          disabled={isGardenEntry}
          activeOpacity={0.88}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "Main", params: { screen: "Home" } }],
            })
          }
        >
          <Text style={[styles.footerLabel, isGardenEntry ? styles.footerLabelDisabled : styles.footerLabelSecondary]}>
            {isGardenEntry ? "다음" : "나중에 만들기"}
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
    paddingTop: 18,
    paddingBottom: 24,
  },
  card: {
    minHeight: 300,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#EFEFEF",
  },
  copyWrap: {
    flex: 1,
    gap: 12,
  },
  cardTitle: {
    fontSize: 40 / 2,
    lineHeight: 56 / 2,
    fontWeight: "700",
    color: "#171717",
  },
  cardDescription: {
    fontSize: 16,
    lineHeight: 40 / 2,
    color: "#171717",
  },
  cardActionButton: {
    marginTop: 8,
    alignSelf: "flex-start",
    minWidth: 146,
    minHeight: 44,
    borderRadius: 8,
    backgroundColor: "#6FCF4A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  cardActionLabel: {
    fontSize: 32 / 2,
    lineHeight: 54 / 2,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  cardImage: {
    width: 184,
    height: 184,
    opacity: 0.95,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  footerButton: {
    minHeight: 56,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footerButtonSecondary: {
    backgroundColor: "#EFF9EA",
  },
  footerButtonDisabled: {
    backgroundColor: "#EAEAEA",
  },
  footerLabel: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
  },
  footerLabelSecondary: {
    color: "#46C02B",
  },
  footerLabelDisabled: {
    color: "#BFBFBF",
  },
});
