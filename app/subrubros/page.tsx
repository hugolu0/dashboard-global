"use client";

import React, { useState } from "react";
import { Tag, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { subrubros, rubros, articulos } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortKey = "sru_codi" | "sru_nomb" | "rub_codi";
type SortDir  = "asc" | "desc";

export default function SubRubrosPage() {
  const [search, setSearch]   = useState("");
  const [rubroFil, setRubro]  = useState("todos");
  const [sortKey, setSortKey] = useState<SortKey>("sru_codi");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const filtered = subrubros
    .filter((s) => {
      const rub = rubros.find(r => r.rub_codi === s.rub_codi);
      const q = search.toLowerCase();
      return (
        s.sru_nomb.toLowerCase().includes(q) ||
        String(s.sru_codi).includes(q) ||
        (rub?.rub_nomb ?? "").toLowerCase().includes(q)
      ) && (rubroFil === "todos" || String(s.rub_codi) === rubroFil);
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "sru_codi") cmp = a.sru_codi - b.sru_codi;
      else if (sortKey === "sru_nomb") cmp = a.sru_nomb.localeCompare(b.sru_nomb);
      else cmp = a.rub_codi - b.rub_codi;
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Sub-rubros</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Sub-rubros</h1>
          <p className="text-sm text-muted-foreground">
            Sub-categorías de productos · campos: <span className="font-mono">sru_codi</span>, <span className="font-mono">sru_nomb</span>, <span className="font-mono">rub_codi</span> (FK → Rubro)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            { label: "Total Sub-rubros", value: subrubros.length, color: "hsl(var(--chart-2))" },
            { label: "Rubros padre",     value: rubros.length,     color: "hsl(var(--chart-1))" },
            { label: "Artículos ligados", value: articulos.filter(a => a.sru_codi !== null).length, color: "hsl(var(--chart-3))" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${s.color}15`, color: s.color }}>
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold">{formatNumber(s.value)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="sru_codi, sru_nomb o rub_nomb..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none focus:border-ring focus:bg-background"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
              <button onClick={() => setRubro("todos")} className={cn("rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors", rubroFil === "todos" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                Todos
              </button>
              {rubros.map(r => (
                <button key={r.rub_codi} onClick={() => setRubro(String(r.rub_codi))} className={cn("rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors", rubroFil === String(r.rub_codi) ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  {r.rub_nomb}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/20">
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("sru_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      sru_codi <SortIcon col="sru_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("sru_nomb")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      sru_nomb <SortIcon col="sru_nomb" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("rub_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      rub_codi <SortIcon col="rub_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">rub_nomb</th>
                  <th className="px-4 py-3 font-medium">Artículos</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const rub  = rubros.find(r => r.rub_codi === s.rub_codi);
                  const arts = articulos.filter(a => a.sru_codi === s.sru_codi);
                  return (
                    <tr key={s.sru_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{s.sru_codi}</td>
                      <td className="px-4 py-3 font-medium">{s.sru_nomb}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{s.rub_codi}</td>
                      <td className="px-4 py-3 text-muted-foreground">{rub?.rub_nomb ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{arts.length}</span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Sin resultados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            {filtered.length} de {subrubros.length} sub-rubros
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
