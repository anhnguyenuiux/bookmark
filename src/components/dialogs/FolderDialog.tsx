"use client";

import { useState, type FormEvent } from "react";
import { DialogShell } from "./DialogShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useFolderStore } from "@/store/useFolderStore";

interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  parentId?: string | null;
  folderId?: string;
  initialName?: string;
}

export function FolderDialog({
  open,
  onClose,
  parentId = null,
  folderId,
  initialName = "",
}: FolderDialogProps) {
  const [name, setName] = useState(initialName);
  const [loading, setLoading] = useState(false);
  const createFolder = useFolderStore((s) => s.create);
  const renameFolder = useFolderStore((s) => s.rename);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (folderId) {
        await renameFolder(folderId, name.trim());
      } else {
        await createFolder(name.trim(), parentId);
      }
      onClose();
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={folderId ? "Rename Folder" : "New Folder"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="folder-name"
          label="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My folder"
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
            {folderId ? "Rename" : "Create folder"}
          </Button>
        </div>
      </form>
    </DialogShell>
  );
}
