import { getDB } from "./index";
import type { Folder } from "@/types";

export async function getAllFolders(): Promise<Folder[]> {
  const db = await getDB();
  return db.getAll("folders");
}

export async function addFolder(folder: Folder): Promise<void> {
  const db = await getDB();
  await db.put("folders", folder);
}

export async function updateFolder(
  id: string,
  partial: Partial<Folder>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("folders", id);
  if (!existing) return;
  await db.put("folders", { ...existing, ...partial });
}

export async function deleteFolder(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("folders", id);
}

export async function getFolderByName(
  name: string,
  parentId?: string | null
): Promise<Folder | undefined> {
  const all = await getAllFolders();
  return all.find(
    (f) =>
      f.name.toLowerCase() === name.toLowerCase() &&
      (f.parentId ?? null) === (parentId ?? null)
  );
}
