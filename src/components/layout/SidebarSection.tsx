"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  action?: ReactNode;
}

export function SidebarSection({
  title,
  children,
  defaultOpen = true,
  action,
}: SidebarSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <div className="flex items-center gap-1 px-2 mb-0.5">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-1 flex-1 text-[11px] font-semibold uppercase tracking-wider text-warm-gray-300 hover:text-warm-gray-500 transition-colors py-1"
        >
          <ChevronRight
            size={11}
            className={cn(
              "transition-transform duration-150",
              open && "rotate-90"
            )}
          />
          {title}
        </button>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {open && <div className="flex flex-col gap-0.5">{children}</div>}
    </div>
  );
}
