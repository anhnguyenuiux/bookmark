"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { useTagStore } from "@/store/useTagStore";
import { makeTagSlug } from "@/store/useTagStore";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label?: string;
}

export function TagInput({ value, onChange, label = "Tags" }: TagInputProps) {
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const tags = useTagStore((s) => s.tags);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = input.trim()
    ? tags
        .filter(
          (t) =>
            t.slug.includes(makeTagSlug(input)) && !value.includes(t.slug)
        )
        .slice(0, 6)
    : [];

  function addTag(slug: string) {
    if (!slug || value.includes(slug)) return;
    onChange([...value, slug]);
    setInput("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  }

  function removeTag(slug: string) {
    onChange(value.filter((t) => t !== slug));
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Enter" || e.key === ",") && input.trim()) {
      e.preventDefault();
      addTag(makeTagSlug(input.trim()));
    }
    if (e.key === "Backspace" && !input && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
    if (e.key === "Escape") setShowSuggestions(false);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-black/80 leading-none">
          {label}
        </label>
      )}
      <div className="relative">
        <div
          className={cn(
            "flex flex-wrap gap-1 items-center min-h-[34px] bg-white border border-[#dddddd] rounded-micro px-2 py-1",
            "focus-within:border-focus-blue focus-within:ring-1 focus-within:ring-focus-blue/30 cursor-text"
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((slug) => (
            <span
              key={slug}
              className="inline-flex items-center gap-1 bg-badge-bg text-badge-text text-[11px] font-semibold px-2 py-0.5 rounded-pill"
            >
              {slug}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(slug);
                }}
                className="hover:text-notion-blue-active"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => input && setShowSuggestions(true)}
            placeholder={value.length === 0 ? "Add tags..." : ""}
            className="flex-1 min-w-[80px] text-sm text-black/90 placeholder:text-warm-gray-300 outline-none bg-transparent"
          />
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-black/10 rounded-standard shadow-card z-10">
            {suggestions.map((tag) => (
              <button
                key={tag.slug}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addTag(tag.slug);
                }}
                className="w-full text-left px-3 py-1.5 text-sm text-black/80 hover:bg-warm-white transition-colors"
              >
                {tag.label}
                <span className="ml-2 text-xs text-warm-gray-300">
                  {tag.count}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="text-[11px] text-warm-gray-300">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
