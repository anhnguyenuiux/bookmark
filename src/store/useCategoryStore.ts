"use client";

import { create } from "zustand";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/db/categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryStore {
  categories: Category[];
  selectedCategoryId: string | null;
  loading: boolean;
  loadAll: () => Promise<void>;
  create: (name: string, color?: string) => Promise<Category>;
  update: (id: string, partial: Partial<Category>) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setSelected: (id: string | null) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  selectedCategoryId: null,
  loading: false,

  loadAll: async () => {
    set({ loading: true });
    const categories = await getAllCategories();
    set({ categories, loading: false });
  },

  create: async (name, color) => {
    const category: Category = {
      id: crypto.randomUUID(),
      name,
      slug: slugify(name),
      color,
      createdAt: Date.now(),
    };
    set((state) => ({ categories: [...state.categories, category] }));
    await addCategory(category);
    return category;
  },

  update: async (id, partial) => {
    const updates = {
      ...partial,
      ...(partial.name ? { slug: slugify(partial.name) } : {}),
    };
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
    await updateCategory(id, updates);
  },

  remove: async (id) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    }));
    await deleteCategory(id);
  },

  setSelected: (id) => set({ selectedCategoryId: id }),
}));
