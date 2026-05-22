"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { DataLoader } from "./DataLoader";
import { Sidebar } from "./Sidebar";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <DataLoader />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative z-30 md:z-auto",
          "w-64 h-full shrink-0",
          "bg-warm-white border-r border-black/10",
          "transition-transform duration-200",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0 md:w-0 md:border-0 md:overflow-hidden"
        )}
      >
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
