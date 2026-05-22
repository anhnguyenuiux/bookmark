"use client";

import { useState, type FormEvent } from "react";
import { DialogShell } from "./DialogShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCategoryStore } from "@/store/useCategoryStore";

interface CategoryDialogProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryDialog({ open, onClose }: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const createCategory = useCategoryStore((s) => s.create);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCategory(name.trim());
      onClose();
      setName("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogShell open={open} onClose={onClose} title="New Category">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="category-name"
          label="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Design Tools"
          autoFocus
        />
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !name.trim()}
          >
            Create category
          </Button>
        </div>
      </form>
    </DialogShell>
  );
}
