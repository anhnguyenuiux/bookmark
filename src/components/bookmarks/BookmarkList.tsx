import { BookmarkRow } from "./BookmarkRow";
import { BookmarkEmpty } from "./BookmarkEmpty";
import type { Bookmark } from "@/types";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BookmarkList({
  bookmarks,
  emptyTitle,
  emptyDescription,
}: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return <BookmarkEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="flex flex-col">
      {/* List header */}
      <div className="flex items-center gap-3 px-4 py-2 border-b border-black/10 bg-warm-white text-[11px] font-semibold uppercase tracking-wider text-warm-gray-300">
        <span className="w-4 shrink-0" />
        <span className="flex-1">Title</span>
        <span className="hidden md:block w-24 shrink-0">Tags</span>
        <span className="hidden sm:block w-16 shrink-0 text-right">Added</span>
        <span className="w-6 shrink-0" />
      </div>
      {bookmarks.map((b) => (
        <BookmarkRow key={b.id} bookmark={b} />
      ))}
    </div>
  );
}
