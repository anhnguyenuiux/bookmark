"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronRight, Folder, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarItem } from "./SidebarItem";
import type { FolderNode } from "@/types";

interface TreeNodeProps {
  node: FolderNode;
  depth?: number;
}

function TreeNode({ node, depth = 0 }: TreeNodeProps) {
  const pathname = usePathname();
  const isActive = pathname === `/folder/${node.id}`;
  const [expanded, setExpanded] = useState(false);
  const hasChildren = node.children.length > 0;

  return (
    <div>
      <div className="flex items-center gap-0.5" style={{ paddingLeft: `${depth * 12}px` }}>
        {hasChildren ? (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="p-0.5 rounded text-warm-gray-300 hover:text-warm-gray-500 transition-colors shrink-0"
          >
            <ChevronRight
              size={12}
              className={cn("transition-transform", expanded && "rotate-90")}
            />
          </button>
        ) : (
          <span className="w-5 shrink-0" />
        )}
        <SidebarItem
          href={`/folder/${node.id}`}
          icon={isActive || expanded ? <FolderOpen size={14} /> : <Folder size={14} />}
          label={node.name}
          active={isActive}
        />
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function SidebarFolderTree({ nodes }: { nodes: FolderNode[] }) {
  if (nodes.length === 0) {
    return (
      <p className="px-3 py-1 text-[12px] text-warm-gray-300 italic">
        No folders yet
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-0.5">
      {nodes.map((node) => (
        <TreeNode key={node.id} node={node} />
      ))}
    </div>
  );
}
