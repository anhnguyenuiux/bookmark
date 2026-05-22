"use client";

import { useEffect } from "react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useFolderStore } from "@/store/useFolderStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTagStore } from "@/store/useTagStore";

export function DataLoader() {
  const loadBookmarks = useBookmarkStore((s) => s.loadAll);
  const loadFolders = useFolderStore((s) => s.loadAll);
  const loadCategories = useCategoryStore((s) => s.loadAll);
  const loadTags = useTagStore((s) => s.loadAll);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const syncTags = useTagStore((s) => s.syncFromBookmarks);

  useEffect(() => {
    Promise.all([loadBookmarks(), loadFolders(), loadCategories(), loadTags()]);
  }, []);

  useEffect(() => {
    syncTags(bookmarks);
  }, [bookmarks]);

  return null;
}
