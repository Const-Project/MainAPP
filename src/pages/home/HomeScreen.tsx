import { View, Text } from "react-native";
import type { MainTabScreenProps } from "@/navigation/types";

type Props = MainTabScreenProps<"Home">;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">홈</Text>
      <Text className="mt-2 text-gray-500">나풀나풀 메인 화면</Text>
    </View>
  );
}
