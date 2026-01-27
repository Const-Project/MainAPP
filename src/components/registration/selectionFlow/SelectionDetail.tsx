import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";

import { AvatarType } from "@/types/avatars/masters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ITEM_WIDTH = SCREEN_WIDTH * 0.65;
const ITEM_SPACING = 16;

interface SelectionDetailProps {
  avatars: AvatarType[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function SelectionDetail({
  avatars,
  selectedId,
  onSelect,
}: SelectionDetailProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const selectedIndex = avatars.findIndex(avatar => avatar.id === selectedId);
  const selectedAvatar = selectedIndex > -1 ? avatars[selectedIndex] : null;

  useEffect(() => {
    if (scrollViewRef.current && selectedIndex > -1) {
      const offsetX = selectedIndex * (ITEM_WIDTH + ITEM_SPACING);
      scrollViewRef.current.scrollTo({ x: offsetX, animated: false });
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + ITEM_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {avatars.map(avatar => (
          <TouchableOpacity
            key={avatar.id}
            style={[
              styles.avatarCard,
              selectedId === avatar.id && styles.selectedCard,
            ]}
            onPress={() => onSelect(avatar.id)}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.avatarImageContainer,
                selectedId === avatar.id && styles.selectedImageContainer,
                selectedId !== avatar.id && styles.unselectedImageContainer,
              ]}
            >
              <Image
                source={{ uri: avatar.defaultImageUrl }}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.description}>
        {selectedAvatar?.description || " "}
      </Text>

      <View style={styles.pagination}>
        {avatars.map(avatar => (
          <View
            key={avatar.id}
            style={[
              styles.paginationDot,
              selectedId === avatar.id && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
  },
  avatarCard: {
    width: ITEM_WIDTH,
    height: 303,
    marginRight: ITEM_SPACING,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedCard: {
    backgroundColor: "#E8F5E3",
  },
  avatarImageContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#7DC960",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  selectedImageContainer: {
    opacity: 1,
  },
  unselectedImageContainer: {
    opacity: 0.5,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  description: {
    marginTop: 24,
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
  },
  pagination: {
    marginTop: 24,
    flexDirection: "row",
    gap: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  paginationDotActive: {
    backgroundColor: "#7DC960",
  },
});
