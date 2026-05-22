import Link from "next/link";
import { cn } from "@/lib/utils";

interface TagBadgeProps {
  slug: string;
  className?: string;
  asLink?: boolean;
}

export function TagBadge({ slug, className, asLink = true }: TagBadgeProps) {
  const cls = cn(
    "inline-flex items-center bg-badge-bg text-badge-text text-[11px] font-semibold px-2 py-0.5 rounded-pill leading-none",
    className
  );

  if (asLink) {
    return (
      <Link href={`/tag/${slug}`} className={cn(cls, "hover:bg-badge-text/10 transition-colors")}>
        {slug}
      </Link>
    );
  }

  return <span className={cls}>{slug}</span>;
}
