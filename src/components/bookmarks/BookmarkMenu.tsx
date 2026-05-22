"use client";

import { useState } from "react";
import { MoreHorizontal, Edit2, Trash2, FolderInput } from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BookmarkDialog } from "@/components/dialogs/BookmarkDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import type { Bookmark } from "@/types";

interface BookmarkMenuProps {
  bookmark: Bookmark;
}

export function BookmarkMenu({ bookmark }: BookmarkMenuProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const remove = useBookmarkStore((s) => s.remove);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="p-1 rounded-subtle text-warm-gray-300 hover:text-warm-gray-500 hover:bg-black/5 transition-colors opacity-0 group-hover:opacity-100"
            onClick={(e) => e.preventDefault()}
          >
            <MoreHorizontal size={15} />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={4}
            className="z-50 bg-white border border-black/10 rounded-standard shadow-card min-w-[160px] py-1"
          >
            <DropdownMenu.Item
              onSelect={() => setEditOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-black/80 cursor-pointer hover:bg-warm-white outline-none"
            >
              <Edit2 size={13} />
              Edit
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-black/10" />
            <DropdownMenu.Item
              onSelect={() => setDeleteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-warning cursor-pointer hover:bg-warm-white outline-none"
            >
              <Trash2 size={13} />
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <BookmarkDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        bookmark={bookmark}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => remove(bookmark.id)}
        title="Delete bookmark"
        description={`"${bookmark.title}" will be permanently deleted.`}
      />
    </>
  );
}
