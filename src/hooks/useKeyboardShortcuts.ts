"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface ShortcutOptions {
  onNewBookmark?: () => void;
  onImport?: () => void;
}

export function useKeyboardShortcuts({ onNewBookmark, onImport }: ShortcutOptions = {}) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/search");
        return;
      }

      if (!inInput && e.key === "n" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onNewBookmark?.();
        return;
      }

      if (!inInput && e.key === "i" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onImport?.();
        return;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [router, onNewBookmark, onImport]);
}
