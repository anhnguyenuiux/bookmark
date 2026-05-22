import type { BookmarkImport } from "@/types";

export function parseChromeBookmarks(html: string): BookmarkImport[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const results: BookmarkImport[] = [];

  function walkDL(dl: Element, path: string[]) {
    const children = Array.from(dl.children);
    for (const child of children) {
      if (child.tagName !== "DT") continue;
      const h3 = child.querySelector(":scope > H3");
      const a = child.querySelector(":scope > A");
      const nextDL = child.querySelector(":scope > DL");

      if (h3 && nextDL) {
        walkDL(nextDL, [...path, h3.textContent?.trim() || "Untitled"]);
      } else if (a) {
        const href = a.getAttribute("href") || "";
        if (!href.startsWith("http")) continue;
        const addDateAttr = a.getAttribute("add_date");
        results.push({
          url: href,
          title: a.textContent?.trim() || href,
          addDate: addDateAttr ? parseInt(addDateAttr) * 1000 : undefined,
          folderPath: path,
        });
      }
    }
  }

  const rootDL = doc.querySelector("DL");
  if (rootDL) walkDL(rootDL, []);

  return results;
}
