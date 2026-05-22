"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useSearch } from "@/hooks/useSearch";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({ className, autoFocus }: SearchBarProps) {
  const { query, setQuery, clear } = useSearchStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useSearch(query);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 bg-white border border-black/15 rounded-standard px-3 py-2",
        "focus-within:border-notion-blue focus-within:ring-2 focus-within:ring-notion-blue/15 transition-all",
        className
      )}
    >
      <Search size={16} className="text-warm-gray-300 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search bookmarks…"
        className="flex-1 text-sm text-black/90 placeholder:text-warm-gray-300 outline-none bg-transparent"
      />
      {query && (
        <button
          onClick={clear}
          className="p-0.5 rounded text-warm-gray-300 hover:text-warm-gray-500 transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
