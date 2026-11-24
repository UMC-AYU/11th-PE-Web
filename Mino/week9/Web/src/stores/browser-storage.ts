import type { StateStorage } from "zustand/middleware";

// persist의 rehydrate는 Providers의 useEffect에서 실행해요.
export const browserStorage: StateStorage = {
  getItem: (name) => window.localStorage.getItem(name),
  setItem: (name, value) => window.localStorage.setItem(name, value),
  removeItem: (name) => window.localStorage.removeItem(name),
};
