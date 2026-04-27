import "./global.css";
import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootNavigator } from "@/navigation";
import QueryProvider from "@/providers/QueryProvider";
import StatusView from "@/components/common/StatusView";
import {
  SUPABASE_CONFIG_ERROR_MESSAGE,
  isSupabaseConfigured,
} from "@/apis/supabase";
import { useNotificationSettings } from "@/hooks/option/useNotificationApi";
import { debugLog } from "@/utils/debug";
import useTokenStore from "@/stores/useTokenStore";
import { registerDeviceFcmToken, unregisterDeviceFcmToken } from "@/utils/fcm";

function NotificationTokenSync() {
  const { accessToken } = useTokenStore();
  const { data: notificationSettings } = useNotificationSettings();
  const lastSyncedStateRef = useRef<string | null>(null);

  useEffect(() => {
    if (!accessToken || !notificationSettings) {
      lastSyncedStateRef.current = null;
      return;
    }

    const syncKey = `${accessToken}:${notificationSettings.notificationEnabled}`;
    if (lastSyncedStateRef.current === syncKey) {
      return;
    }

    lastSyncedStateRef.current = syncKey;

    if (notificationSettings.notificationEnabled) {
      void registerDeviceFcmToken();
      return;
    }

    void unregisterDeviceFcmToken();
  }, [accessToken, notificationSettings]);

  return null;
}

export default function App() {
  const navigationRef = useNavigationContainerRef();
  const currentRouteNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    debugLog("App", "App mounted", { isSupabaseConfigured });
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
          <StatusView
            title="앱 시작 설정이 누락되었습니다."
            description={SUPABASE_CONFIG_ERROR_MESSAGE ?? "Supabase 설정을 확인해주세요."}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryProvider>
          <NotificationTokenSync />
          <BottomSheetModalProvider>
            <NavigationContainer
              ref={navigationRef}
              onReady={() => {
                const routeName = navigationRef.getCurrentRoute()?.name;
                currentRouteNameRef.current = routeName;
                debugLog("Navigation", "ready", { routeName });
              }}
              onStateChange={() => {
                const previousRouteName = currentRouteNameRef.current;
                const nextRouteName = navigationRef.getCurrentRoute()?.name;

                if (previousRouteName !== nextRouteName) {
                  debugLog("Navigation", "route changed", {
                    from: previousRouteName,
                    to: nextRouteName,
                  });
                }

                currentRouteNameRef.current = nextRouteName;
              }}
            >
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </BottomSheetModalProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
