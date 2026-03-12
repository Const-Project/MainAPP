import { useState } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
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
  nickname?: string;
};

const REDIRECT_TIMEOUT_MS = 120000;
const DISMISS_REDIRECT_GRACE_MS = 15000;

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

function getOAuthRedirectUri() {
  if (!Linking.hasCustomScheme()) {
    return Linking.createURL("auth/callback");
  }

  return Linking.createURL("auth/callback", {
    scheme: "haniumapp",
  });
}

export const useSupabaseOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: backendLogin } = useBackendLogin();

  const redirectUri = getOAuthRedirectUri();
  const isExpoGo = !Linking.hasCustomScheme();

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
    debugLog("SupabaseOAuth", "Sending access token to backend");
    const backendRes = await backendLogin(accessToken);

    if (!backendRes.isSuccess) {
      console.error("[SupabaseOAuth] Backend login failed with message:", backendRes.message);
      throw new Error(backendRes.message);
    }

    debugLog("SupabaseOAuth", "Backend login complete", {
      isNewUser: backendRes.result?.newUser,
      nickname: backendRes.result?.nickname,
    });
    return {
      success: true,
      isNewUser: backendRes.result?.newUser,
      nickname: backendRes.result?.nickname,
    };
  };

  const waitForRedirect = (expectedRedirectUri: string) =>
    new Promise<string>((resolve, reject) => {
      let settled = false;

      const cleanup = () => {
        urlSubscription.remove();
        appStateSubscription.remove();
        clearTimeout(timeoutId);
      };

      const resolveIfMatches = async (candidateUrl: string | null | undefined, source: string) => {
        if (settled || !candidateUrl) {
          return;
        }

        debugLog("SupabaseOAuth", "Redirect candidate detected", {
          source,
          url: candidateUrl,
        });

        if (!candidateUrl.startsWith(expectedRedirectUri)) {
          debugLog("SupabaseOAuth", "Ignoring unrelated redirect URL", {
            expectedRedirectUri,
            actualUrl: candidateUrl,
            source,
          });
          return;
        }

        settled = true;
        cleanup();
        void WebBrowser.dismissBrowser();
        debugLog("SupabaseOAuth", "Redirect matched expected URI", { source });
        resolve(candidateUrl);
      };

      const urlSubscription = Linking.addEventListener("url", event => {
        void resolveIfMatches(event.url, "url_event");
      });

      const appStateSubscription = AppState.addEventListener("change", (state: AppStateStatus) => {
        if (state !== "active" || settled) {
          return;
        }

        debugLog("SupabaseOAuth", "App became active while waiting for redirect");

        void Linking.getInitialURL()
          .then(url => resolveIfMatches(url, "app_active_initial_url"))
          .catch(error => {
            debugLog("SupabaseOAuth", "Failed to read initial URL on app resume", {
              error: error instanceof Error ? error.message : String(error),
            });
          });
      });

      void Linking.getInitialURL()
        .then(url => resolveIfMatches(url, "initial_url"))
        .catch(error => {
          debugLog("SupabaseOAuth", "Failed to read initial URL before auth", {
            error: error instanceof Error ? error.message : String(error),
          });
        });

      const timeoutId = setTimeout(() => {
        if (settled) {
          return;
        }

        settled = true;
        cleanup();
        debugLog("SupabaseOAuth", "Redirect wait timed out", { expectedRedirectUri });
        reject(new Error("OAuth redirect timed out"));
      }, REDIRECT_TIMEOUT_MS);
    });

  const performOAuth = async (provider: OAuthProvider): Promise<OAuthResult> => {
    setIsLoading(true);
    debugLog("SupabaseOAuth", "performOAuth started", { provider, redirectUri });

    try {
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

      const redirectPromise = waitForRedirect(redirectUri);
      const browserPromise = WebBrowser.openAuthSessionAsync(data.url, redirectUri);

      const raceResult = await Promise.race([
        redirectPromise.then(url => ({ type: "redirect" as const, url })),
        browserPromise.then(result => ({ type: "browser" as const, result })),
      ]);

      if (raceResult.type === "redirect") {
        debugLog("SupabaseOAuth", "Redirect event won race", { url: raceResult.url });
        const result = await completeLogin(raceResult.url);
        debugLog("SupabaseOAuth", "OAuth flow completed", result);
        return result;
      }

      debugLog("SupabaseOAuth", "Browser result received", {
        type: raceResult.result.type,
        url: "url" in raceResult.result ? raceResult.result.url : undefined,
      });

      if (raceResult.result.type === "success") {
        const result = await completeLogin(raceResult.result.url);
        debugLog("SupabaseOAuth", "OAuth flow completed", result);
        return result;
      }

      if (raceResult.result.type === "dismiss") {
        debugLog("SupabaseOAuth", "Browser dismissed before redirect, waiting for grace period", {
          graceMs: DISMISS_REDIRECT_GRACE_MS,
        });

        const delayedRedirect = await Promise.race([
          redirectPromise.then(url => ({ type: "redirect" as const, url })),
          new Promise<{ type: "grace_timeout" }>(resolve => {
            setTimeout(() => resolve({ type: "grace_timeout" }), DISMISS_REDIRECT_GRACE_MS);
          }),
        ]);

        if (delayedRedirect.type === "redirect") {
          debugLog("SupabaseOAuth", "Redirect received during dismiss grace period", {
            url: delayedRedirect.url,
          });
          const result = await completeLogin(delayedRedirect.url);
          debugLog("SupabaseOAuth", "OAuth flow completed", result);
          return result;
        }
      }

      console.warn(`[SupabaseOAuth] Browser closed or cancelled. Result type: ${raceResult.result.type}`);
      debugLog("SupabaseOAuth", "OAuth flow cancelled", { type: raceResult.result.type });
      return { success: false, cancelled: true };
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
