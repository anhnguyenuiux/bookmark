"use client";

import { usePathname } from "next/navigation";
import { Bookmark, Hash, Tag, FolderPlus, Plus } from "lucide-react";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useFolderStore } from "@/store/useFolderStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTagStore } from "@/store/useTagStore";
import { SidebarSection } from "./SidebarSection";
import { SidebarItem } from "./SidebarItem";
import { SidebarFolderTree } from "./SidebarFolderTree";
import { FolderDialog } from "@/components/dialogs/FolderDialog";
import { CategoryDialog } from "@/components/dialogs/CategoryDialog";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const folders = useFolderStore((s) => s.getTree)();
  const categories = useCategoryStore((s) => s.categories);
  const tags = useTagStore((s) => s.tags);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  return (
    <>
      <nav className="flex flex-col gap-4 py-4 px-3 overflow-y-auto h-full">
        {/* All Bookmarks */}
        <SidebarItem
          href="/"
          icon={<Bookmark size={14} />}
          label="All Bookmarks"
          count={bookmarks.length}
          active={pathname === "/"}
        />

        {/* Folders */}
        <SidebarSection
          title="Folders"
          action={
            <button
              onClick={() => setFolderDialogOpen(true)}
              className="p-0.5 rounded text-warm-gray-300 hover:text-warm-gray-500 transition-colors"
              title="New folder"
            >
              <FolderPlus size={13} />
            </button>
          }
        >
          <SidebarFolderTree nodes={folders} />
        </SidebarSection>

        {/* Categories */}
        <SidebarSection
          title="Categories"
          action={
            <button
              onClick={() => setCategoryDialogOpen(true)}
              className="p-0.5 rounded text-warm-gray-300 hover:text-warm-gray-500 transition-colors"
              title="New category"
            >
              <Plus size={13} />
            </button>
          }
        >
          {categories.map((cat) => (
            <SidebarItem
              key={cat.id}
              href={`/category/${cat.slug}`}
              icon={<Hash size={13} />}
              label={cat.name}
              count={bookmarks.filter((b) => b.categoryId === cat.id).length}
              active={pathname === `/category/${cat.slug}`}
            />
          ))}
        </SidebarSection>

        {/* Tags */}
        {tags.length > 0 && (
          <SidebarSection title="Tags">
            {tags.slice(0, 20).map((tag) => (
              <SidebarItem
                key={tag.slug}
                href={`/tag/${tag.slug}`}
                icon={<Tag size={13} />}
                label={tag.label}
                count={tag.count}
                active={pathname === `/tag/${tag.slug}`}
              />
            ))}
          </SidebarSection>
        )}
      </nav>

      <FolderDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
      />
      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
      />
    </>
  );
}
