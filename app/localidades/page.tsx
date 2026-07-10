"use client";

import React, { useState } from "react";
import { MapPin, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { localidades, provincias } from "@/lib/mock-data";
import { formatNumber } from "@/lib/format";

type SortKey = "loc_codi" | "loc_nomb" | "pci_codi" | "loc_cpos";
type SortDir  = "asc" | "desc";

export default function LocalidadesPage() {
  const [search, setSearch]     = useState("");
  const [provFil, setProvFil]   = useState("todas");
  const [sortKey, setSortKey]   = useState<SortKey>("loc_codi");
  const [sortDir, setSortDir]   = useState<SortDir>("asc");

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const filtered = localidades
    .filter((l) => {
      const prov = provincias.find(p => p.pci_codi === l.pci_codi);
      const q = search.toLowerCase();
      return (
        l.loc_nomb.toLowerCase().includes(q) ||
        String(l.loc_codi).includes(q) ||
        (l.loc_cpos ?? "").includes(q) ||
        (prov?.pci_nomb ?? "").toLowerCase().includes(q)
      ) && (provFil === "todas" || String(l.pci_codi) === provFil);
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "loc_codi") cmp = a.loc_codi - b.loc_codi;
      else if (sortKey === "loc_nomb") cmp = a.loc_nomb.localeCompare(b.loc_nomb);
      else if (sortKey === "pci_codi") cmp = a.pci_codi - b.pci_codi;
      else cmp = (a.loc_cpos ?? "").localeCompare(b.loc_cpos ?? "");
      return sortDir === "asc" ? cmp : -cmp;
    });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Localidades</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Localidades</h1>
          <p className="text-sm text-muted-foreground">
            Ciudades/Localidades · campos: <span className="font-mono">loc_codi</span>, <span className="font-mono">loc_nomb</span>, <span className="font-mono">loc_cpos</span>, <span className="font-mono">pci_codi</span> (FK → Provincia)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--chart-3) / 0.15)", color: "hsl(var(--chart-3))" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Localidades</p>
              <p className="text-xl font-bold">{formatNumber(localidades.length)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "hsl(var(--chart-2) / 0.15)", color: "hsl(var(--chart-2))" }}>
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Provincias cubiertas</p>
              <p className="text-xl font-bold">{formatNumber(new Set(localidades.map(l => l.pci_codi)).size)}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="loc_codi, loc_nomb, loc_cpos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none focus:border-ring focus:bg-background"
              />
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5 overflow-x-auto">
              <button onClick={() => setProvFil("todas")} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${provFil === "todas" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                Todas
              </button>
              {provincias.map(p => (
                <button key={p.pci_codi} onClick={() => setProvFil(String(p.pci_codi))} className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${provFil === String(p.pci_codi) ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  {p.pci_nomb}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/20">
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("loc_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      loc_codi <SortIcon col="loc_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("loc_nomb")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      loc_nomb <SortIcon col="loc_nomb" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("loc_cpos")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      loc_cpos <SortIcon col="loc_cpos" />
                    </button>
                  </th>
                  <th className="px-4 py-3">
                    <button onClick={() => toggleSort("pci_codi")} className="flex items-center gap-1.5 hover:text-foreground font-mono">
                      pci_codi <SortIcon col="pci_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">pci_nomb</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => {
                  const prov = provincias.find(p => p.pci_codi === l.pci_codi);
                  return (
                    <tr key={l.loc_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-semibold text-primary">{l.loc_codi}</td>
                      <td className="px-4 py-3 font-medium">{l.loc_nomb}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{l.loc_cpos ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-muted-foreground">{l.pci_codi}</td>
                      <td className="px-4 py-3 text-muted-foreground">{prov?.pci_nomb ?? "—"}</td>
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
            {filtered.length} de {localidades.length} localidades
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
