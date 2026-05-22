"use client";

import { useState, useCallback } from "react";
import { parseChromeBookmarks } from "@/lib/import/chromeParser";
import { importBookmarks } from "@/lib/import/importService";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useFolderStore } from "@/store/useFolderStore";
import type { BookmarkImport, ImportResult } from "@/types";

export type ImportStep = "idle" | "preview" | "importing" | "done" | "error";

export function useImport() {
  const [step, setStep] = useState<ImportStep>("idle");
  const [items, setItems] = useState<BookmarkImport[]>([]);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reloadBookmarks = useBookmarkStore((s) => s.loadAll);
  const reloadFolders = useFolderStore((s) => s.loadAll);

  const loadFile = useCallback(async (file: File) => {
    try {
      const html = await file.text();
      const parsed = parseChromeBookmarks(html);
      setItems(parsed);
      setStep("preview");
    } catch {
      setError("Failed to parse bookmark file");
      setStep("error");
    }
  }, []);

  const startImport = useCallback(async () => {
    setStep("importing");
    setProgress(0);
    try {
      const result = await importBookmarks(items, (done, total) => {
        setProgress(Math.round((done / total) * 100));
      });
      setResult(result);
      setStep("done");
      await Promise.all([reloadBookmarks(), reloadFolders()]);
    } catch (err) {
      setError(String(err));
      setStep("error");
    }
  }, [items]);

  const reset = useCallback(() => {
    setStep("idle");
    setItems([]);
    setProgress(0);
    setResult(null);
    setError(null);
  }, []);

  return { step, items, progress, result, error, loadFile, startImport, reset };
}
