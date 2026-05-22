"use client";

import { useSearchStore } from "@/store/useSearchStore";
import { SearchBar } from "@/components/search/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { TopBar } from "@/components/layout/TopBar";

export default function SearchPage() {
  const { query, results, isSearching } = useSearchStore();

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <TopBar />
      <div className="px-6 py-4 border-b border-black/10">
        <SearchBar autoFocus className="max-w-[600px]" />
      </div>
      <div className="flex-1">
        <SearchResults query={query} results={results} isSearching={isSearching} />
      </div>
    </div>
  );
}
