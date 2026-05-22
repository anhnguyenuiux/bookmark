"use client";

import { useFolderStore } from "@/store/useFolderStore";
import { cn } from "@/lib/utils";

interface FolderPickerProps {
  value: string | null;
  onChange: (folderId: string | null) => void;
  label?: string;
}

export function FolderPicker({ value, onChange, label = "Folder" }: FolderPickerProps) {
  const folders = useFolderStore((s) => s.folders);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-black/80 leading-none">
        {label}
      </label>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className={cn(
          "w-full bg-white text-black/90 border border-[#dddddd] rounded-micro px-3 py-1.5 text-sm",
          "focus:outline-none focus:border-focus-blue focus:ring-1 focus:ring-focus-blue/30 transition-colors"
        )}
      >
        <option value="">None</option>
        {folders.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
    </div>
  );
}
