"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { ThemeCustomizer } from "@/components/layout/theme-customizer";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn("sidebar-transition", sidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]")}>
        <Header />
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </div>
      <ThemeCustomizer />
    </div>
  );
}
