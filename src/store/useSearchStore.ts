"use client";

import { create } from "zustand";
import type { Bookmark } from "@/types";

interface SearchStore {
  query: string;
  results: Bookmark[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  setResults: (results: Bookmark[]) => void;
  setSearching: (isSearching: boolean) => void;
  clear: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  query: "",
  results: [],
  isSearching: false,
  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results, isSearching: false }),
  setSearching: (isSearching) => set({ isSearching }),
  clear: () => set({ query: "", results: [], isSearching: false }),
}));
