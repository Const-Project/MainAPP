import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface PlaceholderScreenProps {
  title: string;
  description?: string;
}

export default function PlaceholderScreen({
  title,
  description,
}: PlaceholderScreenProps) {
  const navigation = useNavigation();

  return (
    <View className="flex-1 items-center justify-center bg-white px-4">
      <Text className="text-xl font-bold text-gray-800">{title}</Text>
      {description && (
        <Text className="mt-2 text-center text-gray-500">{description}</Text>
      )}
      <TouchableOpacity
        className="mt-6 rounded-lg bg-primary px-6 py-3"
        onPress={() => navigation.goBack()}
      >
        <Text className="font-semibold text-white">뒤로 가기</Text>
      </TouchableOpacity>
    </View>
  );
}
