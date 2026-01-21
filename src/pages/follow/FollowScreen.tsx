import { View, Text } from "react-native";
import type { MainTabScreenProps } from "@/navigation/types";

type Props = MainTabScreenProps<"Follow">;

export default function FollowScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">팔로우</Text>
      <Text className="mt-2 text-gray-500">친구들의 정원 둘러보기</Text>
    </View>
  );
}
