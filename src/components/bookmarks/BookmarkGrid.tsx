import { BookmarkCard } from "./BookmarkCard";
import { BookmarkEmpty } from "./BookmarkEmpty";
import type { Bookmark } from "@/types";

interface BookmarkGridProps {
  bookmarks: Bookmark[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BookmarkGrid({
  bookmarks,
  emptyTitle,
  emptyDescription,
}: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return <BookmarkEmpty title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
      {bookmarks.map((b) => (
        <BookmarkCard key={b.id} bookmark={b} />
      ))}
    </div>
  );
}
