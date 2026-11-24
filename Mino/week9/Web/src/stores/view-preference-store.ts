import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { browserStorage } from "./browser-storage";

export type CardSize = "comfortable" | "compact";

interface ViewPreferenceState {
  cardSize: CardSize;
  setCardSize: (cardSize: CardSize) => void;
}

export const useViewPreferenceStore = create<ViewPreferenceState>()(
  persist(
    (set) => ({
      cardSize: "comfortable",
      setCardSize: (cardSize) => set({ cardSize }),
    }),
    {
      name: "umcine-view-preference-store",
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
    },
  ),
);
