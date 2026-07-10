"use client";

import React, { useState } from "react";
import { Layers, Tag, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { rubros, subrubros, articulos } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortDir = "asc" | "desc";

export default function RubrosPage() {
  const [search, setSearch] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = rubros
    .filter((r) => r.rub_nomb.toLowerCase().includes(search.toLowerCase()) || String(r.rub_codi).includes(search))
    .sort((a, b) => sortDir === "asc" ? a.rub_nomb.localeCompare(b.rub_nomb) : b.rub_nomb.localeCompare(a.rub_nomb));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Rubros</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Rubros</h1>
          <p className="text-sm text-muted-foreground">
            Categorías principales de productos · campos: <span className="font-mono">rub_codi</span>, <span className="font-mono">rub_nomb</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Rubros",    value: rubros.length,     color: "hsl(var(--chart-1))", icon: Layers },
            { label: "Sub-rubros",      value: subrubros.length,  color: "hsl(var(--chart-2))", icon: Tag },
            { label: "Artículos",       value: articulos.length,  color: "hsl(var(--chart-3))", icon: Tag },
          ].map((s) => (
            <div key={s.label} className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:shadow-md transition-all">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${s.color}15`, color: s.color }}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{formatNumber(s.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between gap-3 border-b border-border p-4">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="rub_codi o rub_nomb..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none focus:border-ring focus:bg-background"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/20">
                  <th className="px-4 py-3 font-mono font-medium">rub_codi</th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      rub_nomb {sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Sub-rubros</th>
                  <th className="px-4 py-3 font-medium">Artículos</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const subs = subrubros.filter(s => s.rub_codi === r.rub_codi);
                  const arts = articulos.filter(a => a.rub_codi === r.rub_codi);
                  return (
                    <tr key={r.rub_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{r.rub_codi}</td>
                      <td className="px-4 py-3 font-medium">{r.rub_nomb}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{subs.length}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{arts.length}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} de {rubros.length} rubros
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
