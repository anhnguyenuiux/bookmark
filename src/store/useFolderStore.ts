"use client";

import { create } from "zustand";
import { getAllFolders, addFolder, updateFolder, deleteFolder } from "@/lib/db/folders";
import type { Folder, FolderNode } from "@/types";

interface FolderStore {
  folders: Folder[];
  selectedFolderId: string | null;
  loading: boolean;
  loadAll: () => Promise<void>;
  create: (name: string, parentId?: string | null) => Promise<Folder>;
  rename: (id: string, name: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setSelected: (id: string | null) => void;
  getTree: () => FolderNode[];
}

function buildTree(folders: Folder[], parentId: string | null = null): FolderNode[] {
  return folders
    .filter((f) => (f.parentId ?? null) === parentId)
    .sort((a, b) => a.position - b.position)
    .map((f) => ({ ...f, children: buildTree(folders, f.id) }));
}

export const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  selectedFolderId: null,
  loading: false,

  loadAll: async () => {
    set({ loading: true });
    const folders = await getAllFolders();
    set({ folders, loading: false });
  },

  create: async (name, parentId = null) => {
    const siblings = get().folders.filter((f) => (f.parentId ?? null) === parentId);
    const folder: Folder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      position: siblings.length,
    };
    set((state) => ({ folders: [...state.folders, folder] }));
    await addFolder(folder);
    return folder;
  },

  rename: async (id, name) => {
    set((state) => ({
      folders: state.folders.map((f) =>
        f.id === id ? { ...f, name, updatedAt: Date.now() } : f
      ),
    }));
    await updateFolder(id, { name, updatedAt: Date.now() });
  },

  remove: async (id) => {
    set((state) => ({
      folders: state.folders.filter((f) => f.id !== id),
    }));
    await deleteFolder(id);
  },

  setSelected: (id) => set({ selectedFolderId: id }),

  getTree: () => buildTree(get().folders),
}));
