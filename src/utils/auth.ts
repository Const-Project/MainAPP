import { supabase } from "@/apis/supabase";
import useTokenStore from "@/stores/useTokenStore";

export const logout = async () => {
  const { accessToken } = useTokenStore.getState();

  if (accessToken) {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL || "https://api.napulnapul.com";

    try {
      await fetch(`${apiUrl}/api/v1/notifications/token`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error("[auth] Failed to delete notification token during logout:", error);
    }
  }

  useTokenStore.getState().clearTokens();

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[auth] Failed to clear Supabase session:", error);
  }
};
