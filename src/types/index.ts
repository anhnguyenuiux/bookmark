export interface Bookmark {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  folderId?: string | null;
  categoryId?: string | null;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  importedAt?: number;
  position?: number;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
  position: number;
}

export interface FolderNode extends Folder {
  children: FolderNode[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color?: string;
  description?: string;
  createdAt: number;
}

export interface Tag {
  slug: string;
  label: string;
  color?: string;
  count: number;
}

export interface BookmarkImport {
  url: string;
  title: string;
  addDate?: number;
  folderPath: string[];
  tags?: string[];
}

export type ViewMode = "grid" | "list";
export type SortField = "createdAt" | "updatedAt" | "title";
export type SortDirection = "asc" | "desc";

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  total: number;
}
