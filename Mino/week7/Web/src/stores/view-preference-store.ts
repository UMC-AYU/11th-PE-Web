import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
