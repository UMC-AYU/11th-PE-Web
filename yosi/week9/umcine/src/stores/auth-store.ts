import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthState = {
  accessToken: string | null;
  setAccessToken: (accessToken: string) => void;
  clearAccessToken: () => void;
};

// 로그인 토큰을 앱 전체에서 함께 쓰는 저장소예요.
// persist로 localStorage에 저장해서 새로고침해도 로그인이 유지돼요.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: "umcine-auth",
      storage: createJSONStorage(() => localStorage),
      // Next.js는 페이지를 서버에서도 그리는데, 서버에는 localStorage가 없어요.
      // 그래서 저장소를 만들 때 바로 읽지 않고, 브라우저에서 첫 화면을 그린 뒤
      // Providers가 rehydrate()를 불러 읽게 해요. (서버 화면과 첫 화면이 같아져 hydration 오류가 없어요)
      skipHydration: true,
    },
  ),
);

// localStorage에서 토큰을 다 읽었는지 알려줘요.
// 서버와 브라우저의 첫 렌더에서는 항상 false라서 두 화면이 같아요.
export function useAuthHydrated() {
  return useSyncExternalStore(
    (onChange) => useAuthStore.persist.onFinishHydration(onChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );
}
