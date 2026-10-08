import { create } from "zustand";
import { readBookmarkIds, saveBookmarkIds } from "../utils/bookmark-storage";

interface BookmarkStore {
    bookmarkedMovieIds: number[];
    toggleBookmark: (movieId: number) => void;
}

export const useBookmarkStore = create<BookmarkStore>((set) => ({
    bookmarkedMovieIds: readBookmarkIds(),
    toggleBookmark: (movieId) =>
        set((state) => {
            const bookmarkedMovieIds = state.bookmarkedMovieIds.includes(movieId)
                ? state.bookmarkedMovieIds.filter((id) => id !== movieId)
                : [...state.bookmarkedMovieIds, movieId];

            saveBookmarkIds(bookmarkedMovieIds);
            return { bookmarkedMovieIds };
        }),
}));
