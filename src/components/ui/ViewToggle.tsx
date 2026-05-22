"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/types";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center border border-black/10 rounded-micro overflow-hidden">
      <button
        onClick={() => onChange("grid")}
        className={cn(
          "p-1.5 transition-colors",
          mode === "grid"
            ? "bg-notion-blue text-white"
            : "bg-white text-warm-gray-500 hover:bg-black/5"
        )}
        title="Grid view"
      >
        <LayoutGrid size={15} />
      </button>
      <button
        onClick={() => onChange("list")}
        className={cn(
          "p-1.5 transition-colors",
          mode === "list"
            ? "bg-notion-blue text-white"
            : "bg-white text-warm-gray-500 hover:bg-black/5"
        )}
        title="List view"
      >
        <List size={15} />
      </button>
    </div>
  );
}
