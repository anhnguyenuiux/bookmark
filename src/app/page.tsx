"use client";

import { useMemo } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useUIStore } from "@/store/useUIStore";
import { BookmarkGrid } from "@/components/bookmarks/BookmarkGrid";
import { BookmarkList } from "@/components/bookmarks/BookmarkList";
import { TopBar } from "@/components/layout/TopBar";
import { Spinner } from "@/components/ui/Spinner";
import type { Bookmark, SortOptions } from "@/types";

function sortBookmarks(bookmarks: Bookmark[], sort: SortOptions): Bookmark[] {
  return [...bookmarks].sort((a, b) => {
    const aVal = a[sort.field] ?? 0;
    const bVal = b[sort.field] ?? 0;
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sort.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return sort.direction === "asc"
      ? (aVal as number) - (bVal as number)
      : (bVal as number) - (aVal as number);
  });
}

export default function HomePage() {
  const { bookmarks, loading } = useBookmarkStore();
  const { viewMode, sort } = useUIStore();

  const sorted = useMemo(() => sortBookmarks(bookmarks, sort), [bookmarks, sort]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto">
        <TopBar />
        <div className="flex justify-center py-24">
          <Spinner className="w-7 h-7" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <TopBar />
      <div className="flex-1">
        {viewMode === "grid" ? (
          <BookmarkGrid bookmarks={sorted} />
        ) : (
          <BookmarkList bookmarks={sorted} />
        )}
      </div>
    </div>
  );
}
