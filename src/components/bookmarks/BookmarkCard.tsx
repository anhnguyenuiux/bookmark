"use client";

import { getDomain } from "@/lib/utils";
import { FaviconImage } from "./FaviconImage";
import { TagBadge } from "./TagBadge";
import { BookmarkMenu } from "./BookmarkMenu";
import type { Bookmark } from "@/types";

interface BookmarkCardProps {
  bookmark: Bookmark;
}

export function BookmarkCard({ bookmark }: BookmarkCardProps) {
  return (
    <article className="group relative flex flex-col bg-white border border-black/10 rounded-comfortable shadow-card hover:shadow-hover transition-shadow p-4 gap-3">
      {/* Header: favicon + domain + menu */}
      <div className="flex items-center gap-2">
        <FaviconImage url={bookmark.url} size={18} />
        <span className="text-[12px] text-warm-gray-300 truncate flex-1">
          {getDomain(bookmark.url)}
        </span>
        <div className="shrink-0">
          <BookmarkMenu bookmark={bookmark} />
        </div>
      </div>

      {/* Title */}
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group/title"
      >
        <h3 className="text-[15px] font-semibold text-black/90 leading-snug line-clamp-2 group-hover/title:text-notion-blue transition-colors">
          {bookmark.title}
        </h3>
      </a>

      {/* Description */}
      {bookmark.description && (
        <p className="text-[13px] text-warm-gray-500 leading-relaxed line-clamp-2">
          {bookmark.description}
        </p>
      )}

      {/* Tags */}
      {bookmark.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {bookmark.tags.slice(0, 4).map((slug) => (
            <TagBadge key={slug} slug={slug} />
          ))}
          {bookmark.tags.length > 4 && (
            <span className="text-[11px] text-warm-gray-300 self-center">
              +{bookmark.tags.length - 4}
            </span>
          )}
        </div>
      )}
    </article>
  );
}
