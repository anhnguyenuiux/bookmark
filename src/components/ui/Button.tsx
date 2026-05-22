"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "pill";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          size === "sm" && "text-[13px] px-2.5 py-1",
          size === "md" && "text-[15px] px-4 py-2",
          variant === "primary" && [
            "bg-notion-blue text-white rounded-micro border border-transparent",
            "hover:bg-notion-blue-active active:scale-95",
          ],
          variant === "secondary" && [
            "bg-black/5 text-black rounded-micro border border-transparent",
            "hover:bg-black/10 active:scale-95",
          ],
          variant === "ghost" && [
            "bg-transparent text-black/80 rounded-subtle",
            "hover:bg-black/5 active:scale-95",
          ],
          variant === "pill" && [
            "bg-badge-bg text-badge-text rounded-pill text-xs font-semibold px-3 py-1",
            "hover:bg-badge-text/10 active:scale-95",
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
