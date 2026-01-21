import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TokenStore {
  accessToken: string;
  refreshToken: string;
  userId: string;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUserId: (id: string) => void;
  clearTokens: () => void;
  hasHydrated: boolean;
}

const useTokenStore = create<TokenStore>()(
  persist(
    set => ({
      accessToken: "",
      refreshToken: "",
      userId: "",
      setAccessToken: token => set({ accessToken: token }),
      setRefreshToken: token => set({ refreshToken: token }),
      setUserId: id => set({ userId: id }),
      clearTokens: () => set({ accessToken: "", refreshToken: "" }),
      hasHydrated: false,
    }),
    {
      name: "napulnapul-token",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => state => {
        if (state) state.hasHydrated = true;
      },
    }
  )
);

export default useTokenStore;
