import type { BookmarkImport, Bookmark, ImportResult } from "@/types";
import { getAllBookmarks, addBookmarksBatch } from "@/lib/db/bookmarks";
import { getFolderByName, addFolder } from "@/lib/db/folders";
import type { Folder } from "@/types";

async function resolveFolder(path: string[]): Promise<string | null> {
  if (path.length === 0) return null;

  let parentId: string | null = null;
  for (const segment of path) {
    const existing = await getFolderByName(segment, parentId);
    if (existing) {
      parentId = existing.id;
    } else {
      const folder: Folder = {
        id: crypto.randomUUID(),
        name: segment,
        parentId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        position: 0,
      };
      await addFolder(folder);
      parentId = folder.id;
    }
  }
  return parentId;
}

export async function importBookmarks(
  items: BookmarkImport[],
  onProgress?: (done: number, total: number) => void
): Promise<ImportResult> {
  const existing = await getAllBookmarks();
  const existingUrls = new Set(existing.map((b) => b.url));

  const toImport = items.filter((item) => !existingUrls.has(item.url));
  const skipped = items.length - toImport.length;
  const total = items.length;

  const CHUNK = 50;
  const imported: Bookmark[] = [];

  for (let i = 0; i < toImport.length; i += CHUNK) {
    const chunk = toImport.slice(i, i + CHUNK);

    for (const item of chunk) {
      const folderId = await resolveFolder(item.folderPath);
      const bookmark: Bookmark = {
        id: crypto.randomUUID(),
        url: item.url,
        title: item.title,
        tags: item.tags ?? [],
        folderId,
        createdAt: item.addDate ?? Date.now(),
        updatedAt: Date.now(),
        importedAt: Date.now(),
      };
      imported.push(bookmark);
    }

    await addBookmarksBatch(imported.slice(i, i + CHUNK));
    onProgress?.(Math.min(i + CHUNK, toImport.length), toImport.length);

    await new Promise<void>((resolve) =>
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(() => resolve())
        : setTimeout(resolve, 0)
    );
  }

  return { imported: imported.length, skipped, total };
}
