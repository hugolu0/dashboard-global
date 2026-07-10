"use client";

import React, { useState } from "react";
import { Map, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { zonas } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";

type SortKey = "zon_codi" | "zon_nomb";
type SortDir  = "asc" | "desc";

export default function ZonasPage() {
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("zon_codi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const filtered = zonas
    .filter(z => (z.zon_nomb ?? "").toLowerCase().includes(search.toLowerCase()) || String(z.zon_codi).includes(search))
    .sort((a, b) => {
      const cmp = sortKey === "zon_codi" ? a.zon_codi - b.zon_codi : (a.zon_nomb ?? "").localeCompare(b.zon_nomb ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Zonas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Zonas</h1>
          <p className="text-sm text-muted-foreground">
            Zonas geográficas · campos: <span className="font-mono">zon_codi</span>, <span className="font-mono">zon_nomb</span>
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 w-fit">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--chart-4) / 0.15)", color: "hsl(var(--chart-4))" }}>
            <Map className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Zonas</p>
            <p className="text-xl font-bold">{formatNumber(zonas.length)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="zon_codi o zon_nomb..."
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
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("zon_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      zon_codi <SortIcon col="zon_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("zon_nomb")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      zon_nomb <SortIcon col="zon_nomb" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((z) => (
                  <tr key={z.zon_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-semibold text-primary">{z.zon_codi}</td>
                    <td className="px-4 py-3 font-medium">{z.zon_nomb ?? "—"}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={2} className="px-4 py-10 text-center text-muted-foreground">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} de {zonas.length} zonas
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
