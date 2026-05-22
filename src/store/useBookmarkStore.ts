"use client";

import { create } from "zustand";
import {
  getAllBookmarks,
  addBookmark,
  updateBookmark,
  deleteBookmark,
  addBookmarksBatch,
} from "@/lib/db/bookmarks";
import type { Bookmark } from "@/types";

interface BookmarkStore {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
  loadAll: () => Promise<void>;
  add: (data: Omit<Bookmark, "id" | "createdAt" | "updatedAt">) => Promise<Bookmark>;
  update: (id: string, partial: Partial<Bookmark>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  importBatch: (bookmarks: Bookmark[]) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const bookmarks = await getAllBookmarks();
      bookmarks.sort((a, b) => b.createdAt - a.createdAt);
      set({ bookmarks, loading: false });
    } catch (err) {
      set({ loading: false, error: String(err) });
    }
  },

  add: async (data) => {
    const bookmark: Bookmark = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    };
    set((state) => ({ bookmarks: [bookmark, ...state.bookmarks] }));
    await addBookmark(bookmark);
    return bookmark;
  },

  update: async (id, partial) => {
    const updated = { ...partial, updatedAt: Date.now() };
    set((state) => ({
      bookmarks: state.bookmarks.map((b) =>
        b.id === id ? { ...b, ...updated } : b
      ),
    }));
    await updateBookmark(id, updated);
  },

  remove: async (id) => {
    set((state) => ({
      bookmarks: state.bookmarks.filter((b) => b.id !== id),
    }));
    await deleteBookmark(id);
  },

  importBatch: async (bookmarks) => {
    await addBookmarksBatch(bookmarks);
    const all = await getAllBookmarks();
    all.sort((a, b) => b.createdAt - a.createdAt);
    set({ bookmarks: all });
  },
}));
