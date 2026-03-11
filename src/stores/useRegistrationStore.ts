import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AvatarMaster,
  RegistrationAvatarPreview,
  RegistrationCreationDetail,
  RegistrationMode,
} from "@/types/avatars";

type RegistrationState = {
  mode: RegistrationMode | null;
  creationDetail: RegistrationCreationDetail;
  selectedMaster: AvatarMaster | null;
  selectedPreview: RegistrationAvatarPreview | null;
  nickname: string;

  setMode: (mode: RegistrationMode | null) => void;
  updateCreationDetail: (patch: Partial<RegistrationCreationDetail>) => void;
  setSelectedMaster: (master: AvatarMaster | null) => void;
  setSelectedPreview: (preview: RegistrationAvatarPreview | null) => void;
  setNickname: (nickname: string) => void;
  reset: () => void;
};

const initialCreationDetail: RegistrationCreationDetail = {
  imageUri: "",
  uploadedImageUrl: "",
};

const initialState = {
  mode: null,
  creationDetail: initialCreationDetail,
  selectedMaster: null,
  selectedPreview: null,
  nickname: "",
};

const useRegistrationStore = create<RegistrationState>()(
  persist(
    set => ({
      ...initialState,
      setMode: mode => set(state => ({ ...state, mode })),
      updateCreationDetail: patch =>
        set(state => ({
          creationDetail: { ...state.creationDetail, ...patch },
        })),
      setSelectedMaster: master => set(() => ({ selectedMaster: master })),
      setSelectedPreview: preview => set(() => ({ selectedPreview: preview })),
      setNickname: nickname => set(() => ({ nickname })),
      reset: () => set(() => ({ ...initialState })),
    }),
    {
      name: "registration-flow",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useRegistrationStore;
