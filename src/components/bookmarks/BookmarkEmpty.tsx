import { Bookmark } from "lucide-react";

interface BookmarkEmptyProps {
  title?: string;
  description?: string;
}

export function BookmarkEmpty({
  title = "No bookmarks yet",
  description = "Add your first bookmark using the button above, or import from Chrome.",
}: BookmarkEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-8">
      <div className="w-14 h-14 rounded-comfortable bg-warm-white border border-black/10 flex items-center justify-center mb-4">
        <Bookmark size={22} className="text-warm-gray-300" />
      </div>
      <h3 className="text-[15px] font-semibold text-black/70 mb-1">{title}</h3>
      <p className="text-[13px] text-warm-gray-300 max-w-[280px] leading-relaxed">
        {description}
      </p>
    </div>
  );
}
