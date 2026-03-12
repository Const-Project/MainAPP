import { AppState } from "react-native";
import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { debugLog } from "@/utils/debug";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const getSupabaseConfigErrorMessage = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return "Supabase 환경변수가 비어 있습니다. .env에 EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY를 채워주세요.";
  }

  if (
    supabaseUrl === "YOUR_SUPABASE_URL" ||
    supabaseAnonKey === "YOUR_SUPABASE_ANON_KEY"
  ) {
    return "Supabase 환경변수가 placeholder 상태입니다. 실제 프로젝트 값을 입력해주세요.";
  }

  return null;
};

export const SUPABASE_CONFIG_ERROR_MESSAGE = getSupabaseConfigErrorMessage();
export const isSupabaseConfigured = !SUPABASE_CONFIG_ERROR_MESSAGE;

if (isSupabaseConfigured) {
  debugLog("Supabase", "Initializing client", { url: supabaseUrl });
} else {
  debugLog("Supabase", "Configuration missing", {
    error: SUPABASE_CONFIG_ERROR_MESSAGE,
  });
}

export const supabase = (isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null) as SupabaseClient;

if (isSupabaseConfigured) {
  AppState.addEventListener("change", state => {
    if (state === "active") {
      debugLog("Supabase", "App active -> startAutoRefresh");
      supabase.auth.startAutoRefresh();
    } else {
      debugLog("Supabase", "App background -> stopAutoRefresh");
      supabase.auth.stopAutoRefresh();
    }
  });
}
