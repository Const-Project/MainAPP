import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";

import type { RootStackParamList } from "@/navigation/types";
import { useUserProfile } from "@/hooks/profile/useProfileApi";
import { postFollowUser } from "@/apis/follow/followApi";
import { FollowStatus } from "@/types/profile/profileApi.type";
import { LeftIcon } from "@/assets/icons/CommonIcons";
import ProfileDetail from "@/components/profile/ProfileDetail";

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, "Profile">>();
  const { userId } = route.params;

  const { data, isLoading, error, refetch } = useUserProfile(userId);

  const handleWaterSuccess = () => {
    refetch();
  };

  const handleFollowClick = async () => {
    if (!userId) return;
    try {
      await postFollowUser(userId);
      refetch();
    } catch {
      // 팔로우 실패
    }
  };

  const renderFollowButton = (followStatus: FollowStatus) => {
    switch (followStatus) {
      case FollowStatus.NOT_FOLLOWING:
        return (
          <TouchableOpacity onPress={handleFollowClick}>
            <Text style={styles.followText}>친구 추가</Text>
          </TouchableOpacity>
        );
      case FollowStatus.FOLLOWING:
        return <Text style={styles.followingText}>팔로잉</Text>;
      case FollowStatus.FOLLOW_BACK_POSSIBLE:
        return (
          <TouchableOpacity onPress={handleFollowClick}>
            <Text style={styles.followText}>맞팔로우</Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#7DC960" />
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>프로필을 불러올 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <LeftIcon size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>프로필</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* 사용자 정보 */}
      <View style={styles.userInfo}>
        <View style={styles.userLeft}>
          {data.profileImageUrl ? (
            <Image source={{ uri: data.profileImageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.profilePlaceholder} />
          )}
          <Text style={styles.nickname}>{data.userNickname}</Text>
        </View>
        {renderFollowButton(data.followStatus)}
      </View>

      {/* 메인 컨텐츠 */}
      <View style={styles.content}>
        {data.userGardens.length > 0 ? (
          <ProfileDetail
            garden={data.userGardens[0]}
            leftWaterCountForOthers={data.leftWaterCountForOthers}
            onWaterSuccess={handleWaterSuccess}
          />
        ) : (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>정원이 없습니다.</Text>
          </View>
        )}
      </View>

      {/* 방명록 작성 버튼 */}
      <View style={styles.guestbookContainer}>
        <TouchableOpacity style={styles.guestbookButton} activeOpacity={0.7}>
          <Text style={styles.guestbookText}>방명록 작성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    zIndex: 30,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#171717",
  },
  headerSpacer: {
    width: 40,
  },
  userInfo: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    zIndex: 20,
  },
  userLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#9CA3AF",
  },
  nickname: {
    fontSize: 16,
    fontWeight: "600",
    color: "#171717",
  },
  followText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7DC960",
  },
  followingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  content: {
    flex: 1,
    zIndex: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
  },
  guestbookContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 40,
  },
  guestbookButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#7DC960",
    borderRadius: 8,
    alignItems: "center",
  },
  guestbookText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#7DC960",
  },
});
