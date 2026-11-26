"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
  accessToken: string | null;
  sessionVersion: number;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      sessionVersion: 0,
      setAccessToken: (accessToken) => set((state) => {
        if (state.accessToken === accessToken) return state;
        return { accessToken, sessionVersion: state.sessionVersion + 1 };
      }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        accessToken: state.accessToken,
      }),
    },
  ),
);
