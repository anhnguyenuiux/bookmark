"use client";

import { create } from "zustand";
import { getAllTags } from "@/lib/db/tags";
import type { Tag, Bookmark } from "@/types";
import { slugify } from "@/lib/utils";

interface TagStore {
  tags: Tag[];
  loading: boolean;
  loadAll: () => Promise<void>;
  syncFromBookmarks: (bookmarks: Bookmark[]) => void;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  loading: false,

  loadAll: async () => {
    set({ loading: true });
    const tags = await getAllTags();
    set({ tags, loading: false });
  },

  syncFromBookmarks: (bookmarks) => {
    const counts = new Map<string, number>();
    for (const b of bookmarks) {
      for (const slug of b.tags) {
        counts.set(slug, (counts.get(slug) ?? 0) + 1);
      }
    }
    const tags: Tag[] = Array.from(counts.entries())
      .map(([slug, count]) => ({ slug, label: slug, count }))
      .sort((a, b) => b.count - a.count);
    set({ tags });
  },
}));

export function makeTagSlug(label: string): string {
  return slugify(label) || label.toLowerCase();
}
