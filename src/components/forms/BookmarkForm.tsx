"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { TagInput } from "./TagInput";
import { FolderPicker } from "./FolderPicker";
import { Button } from "@/components/ui/Button";
import { useCategoryStore } from "@/store/useCategoryStore";
import { cn } from "@/lib/utils";
import type { Bookmark } from "@/types";

interface BookmarkFormProps {
  initial?: Partial<Bookmark>;
  onSubmit: (data: Omit<Bookmark, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function BookmarkForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: BookmarkFormProps) {
  const [url, setUrl] = useState(initial?.url ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [folderId, setFolderId] = useState<string | null>(
    initial?.folderId ?? null
  );
  const [categoryId, setCategoryId] = useState<string | null>(
    initial?.categoryId ?? null
  );
  const [urlError, setUrlError] = useState("");
  const [fetchingMeta, setFetchingMeta] = useState(false);

  const categories = useCategoryStore((s) => s.categories);

  async function handleUrlBlur() {
    if (!url.trim()) return;
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      setUrlError("Invalid URL");
      return;
    }

    if (title && description) return;

    setFetchingMeta(true);
    let fetchedTitle: string | null = null;
    try {
      const res = await fetch(`/api/metadata?url=${encodeURIComponent(parsed.toString())}`);
      if (res.ok) {
        const data = await res.json();
        if (!title && data.title) {
          setTitle(data.title);
          fetchedTitle = data.title;
        }
        if (!description && data.description) setDescription(data.description);
      }
    } catch {
      // silently fail — user can type manually
    } finally {
      setFetchingMeta(false);
      if (!title && !fetchedTitle) {
        setTitle(parsed.hostname.replace(/^www\./, ""));
      }
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setUrlError("URL is required");
      return;
    }
    try {
      new URL(url);
    } catch {
      setUrlError("Please enter a valid URL");
      return;
    }
    onSubmit({
      url: url.trim(),
      title: title.trim() || url,
      description: description.trim() || undefined,
      tags,
      folderId,
      categoryId,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="relative">
        <Input
          id="url"
          label="URL"
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setUrlError("");
          }}
          onBlur={handleUrlBlur}
          placeholder="https://example.com"
          error={urlError}
          required
          autoFocus={!initial}
        />
        {fetchingMeta && (
          <div className="absolute right-3 bottom-2 text-warm-gray-300">
            <Loader2 size={13} className="animate-spin" />
          </div>
        )}
      </div>

      <Input
        id="title"
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Page title"
      />

      <Textarea
        id="description"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Optional note..."
        rows={3}
      />

      <FolderPicker value={folderId} onChange={setFolderId} />

      {categories.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-black/80 leading-none">
            Category
          </label>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value || null)}
            className={cn(
              "w-full bg-white text-black/90 border border-[#dddddd] rounded-micro px-3 py-1.5 text-sm",
              "focus:outline-none focus:border-focus-blue focus:ring-1 focus:ring-focus-blue/30 transition-colors"
            )}
          >
            <option value="">None</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <TagInput value={tags} onChange={setTags} />

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/10">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? "Saving…" : initial?.id ? "Save changes" : "Add bookmark"}
        </Button>
      </div>
    </form>
  );
}
