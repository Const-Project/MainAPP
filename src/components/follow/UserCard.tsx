import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "@/navigation/types";

import { XmarkIcon } from "@/assets/icons/CommonIcons";
import { deleteFollowUser } from "@/apis/follow/followApi";
import type { User } from "@/types/follow";

type Props = {
  user: User;
  onRemove?: () => void;
};

export default function UserCard({ user, onRemove }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleRemoveClick = async () => {
    try {
      await deleteFollowUser(user.userId);
      onRemove?.();
    } catch (error) {
      console.error("언팔로우 실패:", error);
      Alert.alert("오류", "언팔로우에 실패했습니다.");
    }
  };

  const handleProfilePress = () => {
    navigation.navigate("Profile", { userId: user.userId });
  };

  return (
    <View style={styles.container}>
      {/* 사용자 정보 */}
      <TouchableOpacity
        style={styles.userInfo}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        {/* 프로필 이미지 */}
        <View style={styles.profileImageWrapper}>
          {user.userImageUrl ? (
            <Image
              source={{ uri: user.userImageUrl }}
              style={styles.profileImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
        </View>

        {/* 사용자명 */}
        <Text style={styles.username}>{user.username}</Text>
      </TouchableOpacity>

      {/* 삭제 버튼 */}
      <TouchableOpacity
        onPress={handleRemoveClick}
        style={styles.removeButton}
        activeOpacity={0.7}
      >
        <XmarkIcon size={16} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImageWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E7EB",
  },
  username: {
    fontSize: 16,
    fontWeight: "500",
    color: "#171717",
  },
  removeButton: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});
