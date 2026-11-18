const BOOKMARK_STORAGE_KEY = "umcine-bookmark-store";

export function readBookmarkIds(): number[] {
    try {
        const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
        if (!storedValue) return [];

        const parsedValue: unknown = JSON.parse(storedValue);
        if (!Array.isArray(parsedValue)) return [];

        return [...new Set(parsedValue.filter(
            (movieId): movieId is number =>
                typeof movieId === "number" &&
                Number.isInteger(movieId) &&
                movieId > 0,
        ))];
    } catch {
        return [];
    }
}

export function saveBookmarkIds(movieIds: number[]): void {
    try {
        localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(movieIds));
    } catch {
        // Keep the in-memory bookmark state usable when storage is unavailable.
    }
}
