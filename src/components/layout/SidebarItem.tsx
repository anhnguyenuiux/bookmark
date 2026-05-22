"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarItemProps {
  href: string;
  icon?: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  depth?: number;
}

export function SidebarItem({
  href,
  icon,
  label,
  count,
  active,
  depth = 0,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-subtle text-[13px] font-medium transition-colors group",
        depth > 0 && `ml-${Math.min(depth * 3, 9)}`,
        active
          ? "bg-notion-blue/10 text-notion-blue"
          : "text-warm-gray-500 hover:bg-black/5 hover:text-black/80"
      )}
      style={{ paddingLeft: depth > 0 ? `${8 + depth * 12}px` : undefined }}
    >
      {icon && (
        <span className="shrink-0 text-current opacity-70">{icon}</span>
      )}
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            "text-[11px] font-normal tabular-nums",
            active ? "text-notion-blue/70" : "text-warm-gray-300"
          )}
        >
          {count}
        </span>
      )}
    </Link>
  );
}
