"use client";

import { getDomain, formatRelativeDate } from "@/lib/utils";
import { FaviconImage } from "./FaviconImage";
import { TagBadge } from "./TagBadge";
import { BookmarkMenu } from "./BookmarkMenu";
import type { Bookmark } from "@/types";

interface BookmarkRowProps {
  bookmark: Bookmark;
}

export function BookmarkRow({ bookmark }: BookmarkRowProps) {
  return (
    <div className="group flex items-center gap-3 px-4 py-2.5 border-b border-black/5 hover:bg-warm-white transition-colors">
      <FaviconImage url={bookmark.url} size={16} />

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 min-w-0"
      >
        <div className="flex items-baseline gap-2">
          <span className="text-[14px] font-medium text-black/90 truncate hover:text-notion-blue transition-colors">
            {bookmark.title}
          </span>
          <span className="text-[12px] text-warm-gray-300 truncate shrink-0 hidden sm:block">
            {getDomain(bookmark.url)}
          </span>
        </div>
      </a>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1 shrink-0">
        {bookmark.tags.slice(0, 2).map((slug) => (
          <TagBadge key={slug} slug={slug} />
        ))}
      </div>

      <span className="text-[11px] text-warm-gray-300 tabular-nums shrink-0 hidden sm:block">
        {formatRelativeDate(bookmark.createdAt)}
      </span>

      <div className="shrink-0">
        <BookmarkMenu bookmark={bookmark} />
      </div>
    </div>
  );
}
