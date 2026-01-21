import { View, Text } from "react-native";
import type { MainTabScreenProps } from "@/navigation/types";

type Props = MainTabScreenProps<"Option">;

export default function OptionScreen({ navigation }: Props) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-gray-800">설정</Text>
      <Text className="mt-2 text-gray-500">앱 설정 및 계정 관리</Text>
    </View>
  );
}
