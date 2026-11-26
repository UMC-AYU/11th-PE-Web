import { create } from "zustand";

type Profile = {
  nickname: string;
  email: string;
  imageUrl: string | null;
};

type ProfileChanges = Pick<Profile, "nickname" | "imageUrl">;

type ProfileStore = Profile & {
  updateProfile: (changes: ProfileChanges) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  nickname: "영화팬",
  email: "cinefan@example.com",
  imageUrl: null,
  updateProfile: (changes) => set(changes),
}));