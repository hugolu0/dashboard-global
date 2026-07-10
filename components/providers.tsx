"use client";

import React from "react";
import { ThemeProvider } from "@/lib/theme-context";
import { AuthProvider } from "@/lib/auth-context";
import { AuthGuard } from "@/components/auth/auth-guard";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AuthGuard>{children}</AuthGuard>
      </ThemeProvider>
    </AuthProvider>
  );
}
