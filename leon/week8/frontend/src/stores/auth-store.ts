import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthStore {
    accessToken: string | null;
    memberId: number | null;
    setSession: (accessToken: string, memberId?: number | null) => void;
    clearSession: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            accessToken: null,
            memberId: null,
            setSession: (accessToken, memberId = null) => set({ accessToken, memberId }),
            clearSession: () => set({ accessToken: null, memberId: null }),
        }),
        {
            name: "umcine-auth-store",
            storage: createJSONStorage(() => localStorage),
            partialize: ({ accessToken, memberId }) => ({ accessToken, memberId }),
        },
    ),
);

export function memberIdFromToken(token: string): number | null {
    try {
        const payload = token.split(".")[1];
        if (!payload) return null;
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))) as { sub?: string };
        const id = Number(decoded.sub);
        return Number.isSafeInteger(id) && id > 0 ? id : null;
    } catch {
        return null;
    }
}
