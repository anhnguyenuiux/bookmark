"use client";

import { useCallback } from "react";
import { DialogShell } from "./DialogShell";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useImport } from "@/hooks/useImport";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";

interface ImportDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ImportDialog({ open, onClose }: ImportDialogProps) {
  const { step, items, progress, result, error, loadFile, startImport, reset } =
    useImport();

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }

  return (
    <DialogShell
      open={open}
      onClose={handleClose}
      title="Import Chrome Bookmarks"
      description="Export your bookmarks from Chrome, then upload the HTML file here."
    >
      {step === "idle" && (
        <div
          className="border-2 border-dashed border-black/15 rounded-comfortable p-10 text-center cursor-pointer hover:border-notion-blue/40 hover:bg-warm-white transition-colors"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => document.getElementById("bookmark-file-input")?.click()}
        >
          <Upload size={28} className="mx-auto mb-3 text-warm-gray-300" />
          <p className="text-sm font-medium text-black/70">
            Drop your bookmarks HTML file here
          </p>
          <p className="text-xs text-warm-gray-300 mt-1">
            or click to browse
          </p>
          <input
            id="bookmark-file-input"
            type="file"
            accept=".html,.htm"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {step === "preview" && (
        <div className="flex flex-col gap-4">
          <div className="bg-warm-white rounded-standard p-4 border border-black/10">
            <p className="text-sm font-semibold text-black/80 mb-1">
              Found {items.length} bookmarks
            </p>
            <p className="text-xs text-warm-gray-500">
              Duplicates will be skipped automatically.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
            <Button variant="ghost" onClick={reset}>
              Back
            </Button>
            <Button variant="primary" onClick={startImport}>
              Import {items.length} bookmarks
            </Button>
          </div>
        </div>
      )}

      {step === "importing" && (
        <div className="flex flex-col items-center gap-4 py-6">
          <Spinner className="w-8 h-8" />
          <p className="text-sm text-warm-gray-500">
            Importing… {progress}%
          </p>
          <div className="w-full bg-black/5 rounded-pill h-1.5">
            <div
              className="bg-notion-blue h-1.5 rounded-pill transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {step === "done" && result && (
        <div className="flex flex-col items-center gap-4 py-4">
          <CheckCircle size={36} className="text-success" />
          <div className="text-center">
            <p className="text-base font-semibold text-black/80">
              Import complete!
            </p>
            <p className="text-sm text-warm-gray-500 mt-1">
              {result.imported} imported · {result.skipped} skipped (duplicates)
            </p>
          </div>
          <Button variant="primary" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}

      {step === "error" && (
        <div className="flex flex-col items-center gap-4 py-4">
          <AlertCircle size={36} className="text-warning" />
          <div className="text-center">
            <p className="text-base font-semibold text-black/80">
              Import failed
            </p>
            <p className="text-xs text-warm-gray-300 mt-1">{error}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={reset}>
              Try again
            </Button>
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </DialogShell>
  );
}
