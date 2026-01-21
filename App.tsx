import "./global.css";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "@/navigation";
import QueryProvider from "@/providers/QueryProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </QueryProvider>
    </SafeAreaProvider>
  );
}
