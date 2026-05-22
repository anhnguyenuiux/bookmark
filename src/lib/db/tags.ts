import { getDB } from "./index";
import type { Tag } from "@/types";

export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB();
  return db.getAll("tags");
}

export async function putTag(tag: Tag): Promise<void> {
  const db = await getDB();
  await db.put("tags", tag);
}

export async function deleteTag(slug: string): Promise<void> {
  const db = await getDB();
  await db.delete("tags", slug);
}

export async function syncTags(tagSlugs: string[]): Promise<void> {
  const db = await getDB();
  const all = await db.getAll("tags");
  const existing = new Map(all.map((t) => [t.slug, t]));
  const tx = db.transaction("tags", "readwrite");
  const counts = new Map<string, number>();
  for (const slug of tagSlugs) {
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  await Promise.all([
    ...Array.from(counts.entries()).map(([slug, count]) => {
      const label = existing.get(slug)?.label ?? slug;
      return tx.store.put({ slug, label, count });
    }),
    tx.done,
  ]);
}
