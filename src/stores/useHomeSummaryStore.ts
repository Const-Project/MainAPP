import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type {
  HomeSummaryPayload,
  GardenSummary,
  TodayMission,
  UserInfo,
} from "@/types/home/garden";

type HomeSummaryState = {
  user: UserInfo | null;
  gardens: GardenSummary[];
  missions: TodayMission[];
  todayDiaryId: number | null;

  hydrate: (payload: HomeSummaryPayload) => void;
  updateGarden: (gardenId: number, patch: Partial<GardenSummary>) => void;
  setGardens: (gardens: GardenSummary[]) => void;
  setUser: (user: UserInfo) => void;
  updateMissions: (missions: TodayMission[]) => void;
  reset: () => void;
};

const initialState: Omit<
  HomeSummaryState,
  | "hydrate"
  | "updateGarden"
  | "setGardens"
  | "setUser"
  | "updateMissions"
  | "reset"
> = {
  user: null,
  gardens: [],
  missions: [],
  todayDiaryId: null,
};

export const useHomeSummaryStore = create<HomeSummaryState>()(
  persist(
    set => ({
      ...initialState,

      hydrate: payload =>
        set(() => ({
          user: payload.userInfo,
          gardens: payload.gardenSummaries,
          missions: payload.todayMissions,
          todayDiaryId: payload.todayDiaryId ?? null,
        })),

      updateGarden: (gardenId, patch) =>
        set(state => ({
          gardens: state.gardens.map(g =>
            g.gardenId === gardenId ? { ...g, ...patch } : g
          ),
        })),

      setGardens: gardens => set(s => ({ ...s, gardens })),

      setUser: user => set(s => ({ ...s, user })),

      updateMissions: missions => set(s => ({ ...s, missions })),

      reset: () => set(() => ({ ...initialState })),
    }),
    {
      name: "home-summary",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        user: state.user,
        gardens: state.gardens,
        missions: state.missions,
        todayDiaryId: state.todayDiaryId,
      }),
    }
  )
);
