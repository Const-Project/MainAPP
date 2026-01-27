import { create } from "zustand";

interface Avatar {
  id: number | null;
  description: string | null;
  img: string | null;
}

interface AvatarCreationState {
  pickCreation: boolean;
  pickSelection: boolean;
  pickSelectionAvatar: Avatar;
  pickCreationAvatar: Avatar;
  pickAvatar: Avatar;
  avatarName: string;
  activeOption: "selection" | "creation" | "none";
  actions: {
    completeCreation: () => void;
    completeSelection: () => void;
    setPickSelectionAvatar: (avatar: Avatar) => void;
    setPickCreationAvatar: (avatar: Avatar) => void;
    setPickAvatar: (avatar: Avatar) => void;
    setAvatarName: (name: string) => void;
    setActiveOption: (option: "selection" | "creation" | "none") => void;
    reset: () => void;
  };
}

const initialState: Omit<AvatarCreationState, "actions"> = {
  pickCreation: false,
  pickSelection: false,
  pickSelectionAvatar: {
    id: null,
    description: null,
    img: null,
  },
  pickCreationAvatar: {
    id: null,
    description: null,
    img: null,
  },
  pickAvatar: {
    id: null,
    description: null,
    img: null,
  },
  avatarName: "",
  activeOption: "none",
};

export const useAvatarCreationStore = create<AvatarCreationState>()(set => ({
  ...initialState,
  actions: {
    completeCreation: () => set({ pickCreation: true }),
    completeSelection: () => set({ pickSelection: true }),
    setPickSelectionAvatar: (avatar: Avatar) =>
      set({ pickSelectionAvatar: avatar }),
    setPickCreationAvatar: (avatar: Avatar) =>
      set({ pickCreationAvatar: avatar }),
    setPickAvatar: (avatar: Avatar) => set({ pickAvatar: avatar }),
    setAvatarName: (name: string) => set({ avatarName: name }),
    setActiveOption: option => set({ activeOption: option }),
    reset: () => set(initialState),
  },
}));
