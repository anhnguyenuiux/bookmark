"use client";

import { FaviconImage } from "@/components/bookmarks/FaviconImage";
import { TagBadge } from "@/components/bookmarks/TagBadge";
import { SearchHighlight } from "./SearchHighlight";
import { BookmarkMenu } from "@/components/bookmarks/BookmarkMenu";
import { getDomain } from "@/lib/utils";
import { Spinner } from "@/components/ui/Spinner";
import type { Bookmark } from "@/types";

interface SearchResultsProps {
  query: string;
  results: Bookmark[];
  isSearching: boolean;
}

export function SearchResults({ query, results, isSearching }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="w-6 h-6" />
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div className="flex flex-col items-center py-20 text-center px-8">
        <p className="text-[14px] text-warm-gray-300">
          Type to search your bookmarks
        </p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center px-8">
        <p className="text-[15px] font-semibold text-black/70 mb-1">
          No results found
        </p>
        <p className="text-[13px] text-warm-gray-300">
          Try a different search term
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-black/5">
      <p className="px-6 py-3 text-[12px] text-warm-gray-300">
        {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
      </p>
      {results.map((b) => (
        <div key={b.id} className="group flex items-center gap-3 px-6 py-3 hover:bg-warm-white transition-colors">
          <FaviconImage url={b.url} size={18} />
          <div className="flex-1 min-w-0">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <p className="text-[14px] font-medium text-black/90 hover:text-notion-blue truncate transition-colors">
                <SearchHighlight text={b.title} query={query} />
              </p>
              <p className="text-[12px] text-warm-gray-300 truncate">
                {getDomain(b.url)}
              </p>
            </a>
          </div>
          {b.tags.length > 0 && (
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              {b.tags.slice(0, 2).map((slug) => (
                <TagBadge key={slug} slug={slug} />
              ))}
            </div>
          )}
          <div className="shrink-0">
            <BookmarkMenu bookmark={b} />
          </div>
        </div>
      ))}
    </div>
  );
}
