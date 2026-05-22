"use client";

import { useState } from "react";
import { DialogShell } from "./DialogShell";
import { Button } from "@/components/ui/Button";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

export function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Delete bookmark",
  description = "This action cannot be undone.",
}: DeleteConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <DialogShell open={open} onClose={onClose} title={title} className="max-w-[400px]">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-warm-gray-500">{description}</p>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={loading}
            className="bg-warning hover:bg-warning/90"
          >
            {loading ? "Deleting…" : "Delete"}
          </Button>
        </div>
      </div>
    </DialogShell>
  );
}
