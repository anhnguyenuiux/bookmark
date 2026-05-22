"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Upload, Download, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ViewToggle } from "@/components/ui/ViewToggle";
import { BookmarkDialog } from "@/components/dialogs/BookmarkDialog";
import { ImportDialog } from "@/components/dialogs/ImportDialog";
import { useUIStore } from "@/store/useUIStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useFolderStore } from "@/store/useFolderStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { exportToNetscapeHTML, downloadHTML } from "@/lib/export/exportService";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { SortField } from "@/types";

const SORT_OPTIONS: { label: string; field: SortField; direction: "asc" | "desc" }[] = [
  { label: "Newest first", field: "createdAt", direction: "desc" },
  { label: "Oldest first", field: "createdAt", direction: "asc" },
  { label: "Title A–Z", field: "title", direction: "asc" },
  { label: "Title Z–A", field: "title", direction: "desc" },
  { label: "Recently updated", field: "updatedAt", direction: "desc" },
];

export function TopBar({ title }: { title?: string }) {
  const router = useRouter();
  const { viewMode, sort, setViewMode, setSort, toggleSidebar } = useUIStore();
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const folders = useFolderStore((s) => s.folders);
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  function handleExport() {
    const html = exportToNetscapeHTML(bookmarks, folders);
    downloadHTML(html);
  }

  useKeyboardShortcuts({
    onNewBookmark: () => setAddOpen(true),
    onImport: () => setImportOpen(true),
  });

  const currentSortLabel =
    SORT_OPTIONS.find(
      (o) => o.field === sort.field && o.direction === sort.direction
    )?.label ?? "Sort";

  return (
    <>
      <header className="sticky top-0 z-10 flex items-center gap-3 px-6 py-3 bg-white border-b border-black/10">
        {/* Mobile sidebar toggle */}
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 rounded-subtle text-warm-gray-500 hover:bg-black/5 transition-colors"
        >
          <Menu size={18} />
        </button>

        {/* Page title */}
        {title && (
          <h1 className="text-[17px] font-bold text-black/90 mr-auto">{title}</h1>
        )}

        {/* Search bar */}
        <button
          onClick={() => router.push("/search")}
          className="flex items-center gap-2 flex-1 max-w-[320px] px-3 py-1.5 bg-warm-white border border-black/10 rounded-standard text-sm text-warm-gray-300 hover:border-black/20 transition-colors"
        >
          <Search size={14} />
          <span>Search bookmarks…</span>
          <kbd className="ml-auto hidden sm:inline-flex items-center gap-1 text-[10px] text-warm-gray-300 border border-black/10 rounded px-1 py-0.5">
            ⌘K
          </kbd>
        </button>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <ViewToggle mode={viewMode} onChange={setViewMode} />

          {/* Sort dropdown */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="hidden sm:flex items-center gap-1 text-[13px] text-warm-gray-500 hover:text-black/80 transition-colors px-2 py-1 rounded-subtle hover:bg-black/5">
                {currentSortLabel}
                <ChevronDown size={13} />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={4}
                className="z-50 bg-white border border-black/10 rounded-standard shadow-card min-w-[180px] py-1"
              >
                {SORT_OPTIONS.map((opt) => (
                  <DropdownMenu.Item
                    key={`${opt.field}-${opt.direction}`}
                    onSelect={() =>
                      setSort({ field: opt.field, direction: opt.direction })
                    }
                    className="flex items-center gap-2 px-3 py-1.5 text-[13px] text-black/80 cursor-pointer hover:bg-warm-white outline-none"
                  >
                    {opt.label}
                    {sort.field === opt.field &&
                      sort.direction === opt.direction && (
                        <span className="ml-auto text-notion-blue">✓</span>
                      )}
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setImportOpen(true)}
            className="hidden sm:flex"
          >
            <Upload size={14} />
            Import
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            className="hidden sm:flex"
            disabled={bookmarks.length === 0}
          >
            <Download size={14} />
            Export
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddOpen(true)}
          >
            <Plus size={14} />
            Add
          </Button>
        </div>
      </header>

      <BookmarkDialog open={addOpen} onClose={() => setAddOpen(false)} />
      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
