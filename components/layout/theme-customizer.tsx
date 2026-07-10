"use client";

import React from "react";
import { X, Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const COLOR_PRESETS = [
  { name: "orange", label: "Naranja", color: "#f97316" },
  { name: "blue",   label: "Azul",    color: "#3b82f6" },
  { name: "green",  label: "Verde",   color: "#22c55e" },
  { name: "rose",   label: "Rosa",    color: "#f43f5e" },
  { name: "slate",  label: "Pizarra", color: "#475569" },
] as const;

export function ThemeCustomizer() {
  const {
    customizeOpen, setCustomizeOpen,
    mode, setMode,
    color, setColor,
    resolvedMode,
  } = useTheme();

  return (
    <Sheet open={customizeOpen} onOpenChange={setCustomizeOpen}>
      <SheetContent className="w-[320px] sm:w-[360px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-lg">Personalizar Tema</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 px-1 pt-6">
          {/* Appearance */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Apariencia</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { v: "light", label: "Claro", Icon: Sun },
                { v: "dark", label: "Oscuro", Icon: Moon },
                { v: "system", label: "Sistema", Icon: Monitor },
              ].map((m) => (
                <button
                  key={m.v}
                  onClick={() => setMode(m.v as any)}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-all",
                    mode === m.v
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/40"
                  )}
                >
                  <m.Icon className={cn("h-4 w-4", mode === m.v ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-xs", mode === m.v ? "font-semibold text-primary" : "text-muted-foreground")}>
                    {m.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Color preset */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Color Principal</h4>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setColor(p.name as any)}
                  className={cn(
                    "relative flex h-11 items-center justify-center rounded-lg border-2 transition-all",
                    color === p.name ? "border-foreground/30 scale-105" : "border-transparent hover:scale-105"
                  )}
                  style={{ background: `${p.color}20` }}
                  title={p.label}
                >
                  <div className="h-6 w-6 rounded-full" style={{ background: p.color }} />
                  {color === p.name && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Preview card */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Vista Previa</h4>
            <div className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Modo actual</span>
                <span className="text-xs font-semibold capitalize">{resolvedMode === "dark" ? "Oscuro" : "Claro"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Color</span>
                <span className="text-xs font-semibold capitalize">
                  {COLOR_PRESETS.find((p) => p.name === color)?.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Botón principal</span>
                <span className="rounded-md px-3 py-1 text-xs font-medium text-white" style={{ background: "hsl(var(--primary))" }}>
                  Ejemplo
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
