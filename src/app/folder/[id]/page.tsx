"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useFolderStore } from "@/store/useFolderStore";
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

export default function FolderPage() {
  const { id } = useParams<{ id: string }>();
  const { bookmarks, loading } = useBookmarkStore();
  const folders = useFolderStore((s) => s.folders);
  const { viewMode, sort } = useUIStore();

  const folder = folders.find((f) => f.id === id);
  const filtered = useMemo(
    () => bookmarks.filter((b) => b.folderId === id),
    [bookmarks, id]
  );
  const sorted = useMemo(() => sortBookmarks(filtered, sort), [filtered, sort]);

  if (loading) {
    return (
      <div className="flex flex-col flex-1 overflow-y-auto">
        <TopBar title={folder?.name} />
        <div className="flex justify-center py-24">
          <Spinner className="w-7 h-7" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <TopBar title={folder?.name ?? "Folder"} />
      <div className="flex-1">
        {viewMode === "grid" ? (
          <BookmarkGrid
            bookmarks={sorted}
            emptyTitle="No bookmarks in this folder"
            emptyDescription="Add bookmarks to this folder using the Add button."
          />
        ) : (
          <BookmarkList
            bookmarks={sorted}
            emptyTitle="No bookmarks in this folder"
            emptyDescription="Add bookmarks to this folder using the Add button."
          />
        )}
      </div>
    </div>
  );
}
