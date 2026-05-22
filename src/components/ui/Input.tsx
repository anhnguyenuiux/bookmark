"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-black/80 leading-none"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full bg-white text-black/90 border border-[#dddddd] rounded-micro px-3 py-1.5 text-sm",
            "placeholder:text-warm-gray-300 focus:outline-none focus:border-focus-blue focus:ring-1 focus:ring-focus-blue/30",
            "transition-colors",
            error && "border-warning focus:border-warning focus:ring-warning/20",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-warning">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
