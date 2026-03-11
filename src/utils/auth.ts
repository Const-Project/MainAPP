import { supabase } from "@/apis/supabase";
import useTokenStore from "@/stores/useTokenStore";

export const logout = async () => {
  useTokenStore.getState().clearTokens();

  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.error("[auth] Failed to clear Supabase session:", error);
  }
};
