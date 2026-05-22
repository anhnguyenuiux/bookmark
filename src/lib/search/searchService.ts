import type { Bookmark } from "@/types";
import { getDomain } from "@/lib/utils";

function score(bookmark: Bookmark, tokens: string[]): number {
  if (tokens.length === 0) return 0;

  const titleLower = bookmark.title.toLowerCase();
  const urlLower = bookmark.url.toLowerCase();
  const domainLower = getDomain(bookmark.url).toLowerCase();
  const descLower = (bookmark.description ?? "").toLowerCase();
  const tagsLower = bookmark.tags.join(" ").toLowerCase();

  let total = 0;
  const fullQuery = tokens.join(" ");

  if (titleLower.includes(fullQuery)) total += 10;
  if (urlLower.includes(fullQuery)) total += 5;

  for (const token of tokens) {
    if (titleLower.includes(token)) total += 3;
    if (domainLower.includes(token)) total += 2;
    if (urlLower.includes(token)) total += 2;
    if (tagsLower.includes(token)) total += 2;
    if (descLower.includes(token)) total += 1;
  }

  return total;
}

export function searchBookmarks(bookmarks: Bookmark[], query: string): Bookmark[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const tokens = q.split(/\s+/).filter(Boolean);

  return bookmarks
    .map((b) => ({ bookmark: b, score: score(b, tokens) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 100)
    .map((r) => r.bookmark);
}
