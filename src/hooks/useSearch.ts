"use client";

import { useEffect, useRef } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useSearchStore } from "@/store/useSearchStore";
import { searchBookmarks } from "@/lib/search/searchService";

export function useSearch(query: string) {
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const setResults = useSearchStore((s) => s.setResults);
  const setSearching = useSearchStore((s) => s.setSearching);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!query.trim()) {
      setResults([]);
      return;
    }

    setSearching(true);
    timerRef.current = setTimeout(() => {
      const results = searchBookmarks(bookmarks, query);
      setResults(results);
    }, 200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, bookmarks]);
}
