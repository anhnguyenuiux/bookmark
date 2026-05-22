import type { Bookmark, Folder } from "@/types";

interface FolderNode {
  folder: Folder;
  children: FolderNode[];
  bookmarks: Bookmark[];
}

function buildTree(
  folders: Folder[],
  bookmarks: Bookmark[],
  parentId: string | null = null
): FolderNode[] {
  return folders
    .filter((f) => (f.parentId ?? null) === parentId)
    .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
    .map((folder) => ({
      folder,
      children: buildTree(folders, bookmarks, folder.id),
      bookmarks: bookmarks.filter((b) => b.folderId === folder.id),
    }));
}

function escapeName(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderBookmark(bookmark: Bookmark): string {
  const addDate = Math.floor(bookmark.createdAt / 1000);
  return `        <DT><A HREF="${escapeName(bookmark.url)}" ADD_DATE="${addDate}">${escapeName(bookmark.title)}</A>`;
}

function renderFolder(node: FolderNode, indent = 2): string {
  const pad = " ".repeat(indent * 4);
  const lines: string[] = [
    `${pad}<DT><H3>${escapeName(node.folder.name)}</H3>`,
    `${pad}<DL><p>`,
  ];
  for (const bookmark of node.bookmarks) {
    lines.push(`${pad}    <DT><A HREF="${escapeName(bookmark.url)}" ADD_DATE="${Math.floor(bookmark.createdAt / 1000)}">${escapeName(bookmark.title)}</A>`);
  }
  for (const child of node.children) {
    lines.push(renderFolder(child, indent + 1));
  }
  lines.push(`${pad}</DL><p>`);
  return lines.join("\n");
}

export function exportToNetscapeHTML(
  bookmarks: Bookmark[],
  folders: Folder[]
): string {
  const rootBookmarks = bookmarks.filter((b) => !b.folderId);
  const tree = buildTree(folders, bookmarks);

  const lines: string[] = [
    "<!DOCTYPE NETSCAPE-Bookmark-file-1>",
    "<!-- This is an automatically generated file.",
    "     It will be read and overwritten.",
    "     DO NOT EDIT! -->",
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    "<TITLE>Bookmarks</TITLE>",
    "<H1>Bookmarks</H1>",
    "<DL><p>",
  ];

  for (const bookmark of rootBookmarks) {
    lines.push(renderBookmark(bookmark));
  }

  for (const node of tree) {
    lines.push(renderFolder(node));
  }

  lines.push("</DL><p>");
  return lines.join("\n");
}

export function downloadHTML(content: string, filename = "bookmarks.html"): void {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
