import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { User } from "@/types/follow";

type Props = {
  user: User;
  actionLabel?: string;
  actionDisabled?: boolean;
  onPress?: () => void;
  onActionPress?: () => void;
};

export default function UserCard({
  user,
  actionLabel,
  actionDisabled = false,
  onPress,
  onActionPress,
}: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.userInfo}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.avatarWrap}>
          {user.userImageUrl ? (
            <Image
              source={{ uri: user.userImageUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
          ) : null}
        </View>
        <Text style={styles.username}>{user.username}</Text>
      </TouchableOpacity>

      {actionLabel ? (
        <TouchableOpacity
          onPress={onActionPress}
          disabled={actionDisabled}
          activeOpacity={0.8}
          style={[styles.actionButton, actionDisabled && styles.actionButtonDisabled]}
        >
          <Text
            style={[
              styles.actionButtonText,
              actionDisabled && styles.actionButtonTextDisabled,
            ]}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#E5E7EB",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  username: {
    fontSize: 15,
    fontWeight: "500",
    color: "#171717",
  },
  actionButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  actionButtonTextDisabled: {
    color: "#9CA3AF",
  },
});
