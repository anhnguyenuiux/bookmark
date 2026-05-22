import { getDB } from "./index";
import type { Bookmark } from "@/types";

export async function getAllBookmarks(): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAll("bookmarks");
}

export async function getBookmarkById(id: string): Promise<Bookmark | undefined> {
  const db = await getDB();
  return db.get("bookmarks", id);
}

export async function addBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  await db.put("bookmarks", bookmark);
}

export async function updateBookmark(
  id: string,
  partial: Partial<Bookmark>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("bookmarks", id);
  if (!existing) return;
  await db.put("bookmarks", { ...existing, ...partial });
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("bookmarks", id);
}

export async function addBookmarksBatch(bookmarks: Bookmark[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction("bookmarks", "readwrite");
  await Promise.all([
    ...bookmarks.map((b) => tx.store.put(b)),
    tx.done,
  ]);
}

export async function getBookmarksByFolder(folderId: string): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAllFromIndex("bookmarks", "by-folder", folderId);
}

export async function bookmarkExistsByUrl(url: string): Promise<boolean> {
  const all = await getAllBookmarks();
  return all.some((b) => b.url === url);
}
