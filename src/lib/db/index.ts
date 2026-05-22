import { openDB, type IDBPDatabase } from "idb";
import type { Bookmark, Folder, Category, Tag } from "@/types";

interface BookmarkDB {
  bookmarks: {
    key: string;
    value: Bookmark;
    indexes: {
      "by-folder": string;
      "by-category": string;
      "by-tag": string;
      "by-created": number;
      "by-updated": number;
    };
  };
  folders: {
    key: string;
    value: Folder;
    indexes: { "by-parent": string };
  };
  categories: {
    key: string;
    value: Category;
    indexes: { "by-slug": string };
  };
  tags: {
    key: string;
    value: Tag;
  };
}

let dbInstance: IDBPDatabase<BookmarkDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<BookmarkDB>> {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB is not available on the server");
  }

  if (!dbInstance) {
    dbInstance = await openDB<BookmarkDB>("bookmark-manager", 1, {
      upgrade(db) {
        const bookmarkStore = db.createObjectStore("bookmarks", {
          keyPath: "id",
        });
        bookmarkStore.createIndex("by-folder", "folderId");
        bookmarkStore.createIndex("by-category", "categoryId");
        bookmarkStore.createIndex("by-tag", "tags", { multiEntry: true });
        bookmarkStore.createIndex("by-created", "createdAt");
        bookmarkStore.createIndex("by-updated", "updatedAt");

        const folderStore = db.createObjectStore("folders", { keyPath: "id" });
        folderStore.createIndex("by-parent", "parentId");

        const categoryStore = db.createObjectStore("categories", {
          keyPath: "id",
        });
        categoryStore.createIndex("by-slug", "slug", { unique: true });

        db.createObjectStore("tags", { keyPath: "slug" });
      },
    });
  }

  return dbInstance;
}
