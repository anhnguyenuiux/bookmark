"use client";

import { useState } from "react";
import { DialogShell } from "./DialogShell";
import { BookmarkForm } from "@/components/forms/BookmarkForm";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import type { Bookmark } from "@/types";

interface BookmarkDialogProps {
  open: boolean;
  onClose: () => void;
  bookmark?: Bookmark;
}

export function BookmarkDialog({ open, onClose, bookmark }: BookmarkDialogProps) {
  const [loading, setLoading] = useState(false);
  const add = useBookmarkStore((s) => s.add);
  const update = useBookmarkStore((s) => s.update);

  async function handleSubmit(
    data: Omit<Bookmark, "id" | "createdAt" | "updatedAt">
  ) {
    setLoading(true);
    try {
      if (bookmark) {
        await update(bookmark.id, data);
      } else {
        await add(data);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={bookmark ? "Edit Bookmark" : "Add Bookmark"}
    >
      <BookmarkForm
        initial={bookmark}
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </DialogShell>
  );
}
