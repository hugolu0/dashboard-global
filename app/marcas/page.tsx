"use client";

import React, { useState } from "react";
import { Award, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { marcas, articulos } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";

type SortKey = "mar_codi" | "mar_nomb";
type SortDir  = "asc" | "desc";

export default function MarcasPage() {
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("mar_codi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const filtered = marcas
    .filter(m => m.mar_nomb.toLowerCase().includes(search.toLowerCase()) || String(m.mar_codi).includes(search))
    .sort((a, b) => {
      const cmp = sortKey === "mar_codi" ? a.mar_codi - b.mar_codi : a.mar_nomb.localeCompare(b.mar_nomb);
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Marcas</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Marcas</h1>
          <p className="text-sm text-muted-foreground">
            Marcas de productos · campos: <span className="font-mono">mar_codi</span>, <span className="font-mono">mar_nomb</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--chart-3) / 0.15)", color: "hsl(var(--chart-3))" }}>
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Marcas</p>
              <p className="text-xl font-bold">{formatNumber(marcas.length)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--chart-1) / 0.15)", color: "hsl(var(--chart-1))" }}>
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Artículos asociados</p>
              <p className="text-xl font-bold">{formatNumber(articulos.length)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border p-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="mar_codi o mar_nomb..."
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
                    <button onClick={() => toggleSort("mar_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      mar_codi <SortIcon col="mar_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("mar_nomb")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      mar_nomb <SortIcon col="mar_nomb" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">Artículos</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => {
                  const arts = articulos.filter(a => a.mar_codi === m.mar_codi);
                  return (
                    <tr key={m.mar_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{m.mar_codi}</td>
                      <td className="px-4 py-3 font-medium">{m.mar_nomb}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{arts.length}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} de {marcas.length} marcas
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
