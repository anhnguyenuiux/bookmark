"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ViewMode, SortOptions } from "@/types";

interface UIStore {
  viewMode: ViewMode;
  sidebarOpen: boolean;
  sort: SortOptions;
  setViewMode: (mode: ViewMode) => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setSort: (sort: SortOptions) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      viewMode: "grid",
      sidebarOpen: true,
      sort: { field: "createdAt", direction: "desc" },
      setViewMode: (viewMode) => set({ viewMode }),
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSort: (sort) => set({ sort }),
    }),
    { name: "bookmark-ui" }
  )
);
