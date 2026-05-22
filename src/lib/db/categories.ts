import { getDB } from "./index";
import type { Category } from "@/types";

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return db.getAll("categories");
}

export async function addCategory(category: Category): Promise<void> {
  const db = await getDB();
  await db.put("categories", category);
}

export async function updateCategory(
  id: string,
  partial: Partial<Category>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get("categories", id);
  if (!existing) return;
  await db.put("categories", { ...existing, ...partial });
}

export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("categories", id);
}
