import { useState, useEffect } from "react";

const BOOKMARK_KEY = "umcine-bookmarks";

export function useBookmarks() {
  // 1. LocalStorage에서 초기값 불러오기
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(BOOKMARK_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to parse bookmarks:", error);
      return [];
    }
  });

  // 2. bookmarks 상태가 변경될 때마다 LocalStorage 업데이트
  useEffect(() => {
    try {
      localStorage.setItem(BOOKMARK_KEY, JSON.stringify(bookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks:", error);
    }
  }, [bookmarks]);

  // 3. 북마크 토글 함수 (불변성 유지)
  const toggleBookmark = (movieId: number) => {
    setBookmarks(
      (prev) =>
        prev.includes(movieId)
          ? prev.filter((id) => id !== movieId) // 이미 존재하면 제거
          : [...prev, movieId], // 없으면 추가
    );
  };

  const isBookmarked = (movieId: number) => bookmarks.includes(movieId);

  return { bookmarks, toggleBookmark, isBookmarked };
}
