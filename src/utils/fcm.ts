import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { postFcmToken } from "@/apis/option/notificationApi";
import { debugLog } from "@/utils/debug";

export const registerDeviceFcmToken = async (): Promise<void> => {
  // 실제 기기에서만 동작 (에뮬레이터 건너뜀)
  if (!Device.isDevice) {
    debugLog("FCM", "skipped — not a physical device");
    return;
  }

  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      debugLog("FCM", "notification permission denied");
      return;
    }

    // Android 알림 채널 설정
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "나풀나풀",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    // 네이티브 FCM 토큰 획득 (Expo 푸시 토큰이 아닌 실제 FCM 토큰)
    const { data: token } = await Notifications.getDevicePushTokenAsync();
    debugLog("FCM", "device token acquired");

    await postFcmToken(token);
    debugLog("FCM", "token registered with server");
  } catch (error) {
    // 토큰 등록 실패는 앱 동작을 막지 않음
    debugLog("FCM", "token registration failed", { error });
  }
};
