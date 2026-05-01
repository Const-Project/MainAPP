import { useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import Constants from "expo-constants";
import type { KakaoOAuthToken } from "@react-native-seoul/kakao-login";
import { supabase } from "@/apis/supabase";
import { useBackendLogin } from "./useBackendLogin";
import { debugLog } from "@/utils/debug";

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = "google" | "kakao";

type OAuthResult = {
  success: boolean;
  cancelled?: boolean;
  error?: unknown;
  isNewUser?: boolean;
  requiresNicknameSetup?: boolean;
  nickname?: string;
};

type KakaoLoginModule = {
  login: () => Promise<KakaoOAuthToken>;
};

function extractSessionTokens(url: string) {
  const urlObj = new URL(url);
  const fragment = urlObj.hash.startsWith("#") ? urlObj.hash.substring(1) : urlObj.hash;
  const fragmentParams = new URLSearchParams(fragment);

  let accessToken = fragmentParams.get("access_token");
  let refreshToken = fragmentParams.get("refresh_token");

  if (!accessToken) {
    accessToken = urlObj.searchParams.get("access_token");
    refreshToken = urlObj.searchParams.get("refresh_token");
  }

  return {
    accessToken,
    refreshToken,
  };
}

function getOAuthRedirectUri(isExpoGo: boolean) {
  if (isExpoGo) {
    return Linking.createURL("auth/callback");
  }

  return Linking.createURL("auth/callback", {
    scheme: "haniumapp",
  });
}

export const useSupabaseOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: backendLogin } = useBackendLogin();

  const isExpoGo = Constants.appOwnership === "expo";
  const redirectUri = getOAuthRedirectUri(isExpoGo);

  const completeSupabaseLogin = async (accessToken: string): Promise<OAuthResult> => {
    debugLog("SupabaseOAuth", "Sending access token to backend");
    const backendRes = await backendLogin(accessToken);

    if (!backendRes.isSuccess) {
      console.error("[SupabaseOAuth] Backend login failed with message:", backendRes.message);
      throw new Error(backendRes.message);
    }

    debugLog("SupabaseOAuth", "Backend login complete", {
      isNewUser: backendRes.result?.newUser,
      requiresNicknameSetup: backendRes.result?.requiresNicknameSetup,
      nickname: backendRes.result?.nickname,
    });
    return {
      success: true,
      isNewUser: backendRes.result?.newUser,
      requiresNicknameSetup: backendRes.result?.requiresNicknameSetup,
      nickname: backendRes.result?.nickname,
    };
  };

  const completeLogin = async (url: string): Promise<OAuthResult> => {
    debugLog("SupabaseOAuth", "Callback received", { url });

    const { accessToken, refreshToken } = extractSessionTokens(url);

    if (!accessToken) {
      console.warn("[SupabaseOAuth] No access token found in callback URL.", { url });
      throw new Error("No access_token found in URL");
    }

    debugLog("SupabaseOAuth", "Tokens parsed", {
      hasAccessToken: Boolean(accessToken),
      hasRefreshToken: Boolean(refreshToken),
    });
    debugLog("SupabaseOAuth", "Setting Supabase session");
    await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || "",
    });

    debugLog("SupabaseOAuth", "Supabase session stored");
    return completeSupabaseLogin(accessToken);
  };

  const getKakaoLoginModule = (): KakaoLoginModule => {
    try {
      return require("@react-native-seoul/kakao-login") as KakaoLoginModule;
    } catch {
      throw new Error("Kakao Native SDK가 현재 development build에 포함되어 있지 않습니다.");
    }
  };

  const performKakaoNativeOAuth = async (): Promise<OAuthResult> => {
    debugLog("SupabaseOAuth", "Kakao native login started");

    const kakaoLogin = getKakaoLoginModule();
    const kakaoToken = await kakaoLogin.login();

    debugLog("SupabaseOAuth", "Kakao native token received", {
      hasAccessToken: Boolean(kakaoToken.accessToken),
      hasIdToken: Boolean(kakaoToken.idToken),
      scopes: kakaoToken.scopes,
    });

    if (!kakaoToken.idToken) {
      throw new Error("Kakao idToken이 없습니다. Kakao OpenID Connect 설정을 확인해주세요.");
    }

    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "kakao",
      token: kakaoToken.idToken,
    });

    if (error) {
      console.error("[SupabaseOAuth] signInWithIdToken error:", error);
      throw error;
    }

    const accessToken = data.session?.access_token;

    if (!accessToken) {
      throw new Error("Supabase access_token 발급에 실패했습니다.");
    }

    return completeSupabaseLogin(accessToken);
  };

  const performOAuth = async (provider: OAuthProvider): Promise<OAuthResult> => {
    setIsLoading(true);
    debugLog("SupabaseOAuth", "performOAuth started", { provider, redirectUri });

    try {
      if (provider === "kakao" && !isExpoGo) {
        const result = await performKakaoNativeOAuth();
        debugLog("SupabaseOAuth", "Kakao native flow completed", result);
        return result;
      }

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("[SupabaseOAuth] signInWithOAuth error:", error);
        throw error;
      }

      if (!data?.url) {
        console.error("[SupabaseOAuth] No URL returned from signInWithOAuth");
        throw new Error("No URL returned");
      }

      debugLog("SupabaseOAuth", "Opening auth browser", { url: data.url });

      const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      debugLog("SupabaseOAuth", "Browser result received", {
        type: browserResult.type,
        url: "url" in browserResult ? browserResult.url : undefined,
      });

      if (browserResult.type !== "success" || !("url" in browserResult)) {
        return { success: false, cancelled: true };
      }

      const redirectedUrl = browserResult.url;
      debugLog("SupabaseOAuth", "Redirect event resolved", { url: redirectedUrl });
      const result = await completeLogin(redirectedUrl);
      debugLog("SupabaseOAuth", "OAuth flow completed", result);
      return result;
    } catch (err) {
      console.error("[SupabaseOAuth] Exception during performOAuth:", err);
      debugLog("SupabaseOAuth", "OAuth flow failed", {
        error: err instanceof Error ? err.message : String(err),
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
      debugLog("SupabaseOAuth", "performOAuth finished");
    }
  };

  return { performOAuth, isLoading, redirectUri, isExpoGo };
};
