import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { deleteFcmToken, postFcmToken } from "@/apis/option/notificationApi";
import { debugLog } from "@/utils/debug";

const ensureNotificationPermission = async (): Promise<boolean> => {
  if (!Device.isDevice) {
    debugLog("FCM", "skipped - not a physical device");
    return false;
  }

  const { granted: existing } = await Notifications.getPermissionsAsync();

  if (existing) {
    return true;
  }

  const { granted } = await Notifications.requestPermissionsAsync();

  if (!granted) {
    debugLog("FCM", "notification permission denied");
    return false;
  }

  return true;
};

const configureAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android") {
    return;
  }

  await Notifications.setNotificationChannelAsync("default", {
    name: "나풀나풀",
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
  });
};

export const registerDeviceFcmToken = async (): Promise<boolean> => {
  try {
    const hasPermission = await ensureNotificationPermission();
    if (!hasPermission) {
      return false;
    }

    await configureAndroidNotificationChannel();

    const { data: token } = await Notifications.getDevicePushTokenAsync();
    debugLog("FCM", "device token acquired");

    await postFcmToken(token);
    debugLog("FCM", "token registered with server");
    return true;
  } catch (error) {
    debugLog("FCM", "token registration failed", { error });
    return false;
  }
};

export const unregisterDeviceFcmToken = async (): Promise<boolean> => {
  try {
    await deleteFcmToken();
    debugLog("FCM", "token removed from server");
    return true;
  } catch (error) {
    debugLog("FCM", "token removal failed", { error });
    return false;
  }
};
