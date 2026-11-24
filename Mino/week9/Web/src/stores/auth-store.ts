import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { browserStorage } from "./browser-storage";

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
    }),
    {
      name: "umcine-auth-store",
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      partialize: ({ accessToken }) => ({ accessToken }),
    },
  ),
);

// sub는 평점 조회 경로에만 사용하고, 인증은 서버가 Bearer 토큰으로 검증해요.
export function getMemberId(accessToken: string | null): number | null {
  if (!accessToken) return null;
  try {
    const payload = accessToken.split(".")[1].replaceAll("-", "+").replaceAll("_", "/");
    const { sub } = JSON.parse(atob(payload));
    const memberId = Number(sub);
    return Number.isSafeInteger(memberId) && memberId > 0 ? memberId : null;
  } catch {
    return null;
  }
}
