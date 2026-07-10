"use client";

import React, { useState, useMemo } from "react";
import {
  Package, Tag, Search, ArrowUpDown, ArrowUp, ArrowDown,
  Download, TrendingUp, Layers, ShoppingBag,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { articulos, marcas, rubros, subrubros, categoriaVentasData } from "@/lib/mock-data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

type SortKey = "art_codi" | "art_nomb" | "art_pfin" | "art_stk";
type SortDir  = "asc" | "desc";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      <p style={{ color: payload[0].color }} className="font-bold">{payload[0].value} ventas</p>
    </div>
  );
}

export default function ArticulosPage() {
  const [search, setSearch]       = useState("");
  const [rubroFilter, setRubro]   = useState("todos");
  const [marcaFilter, setMarca]   = useState("todas");
  const [sortKey, setSortKey]     = useState<SortKey>("art_codi");
  const [sortDir, setSortDir]     = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let result = articulos.filter((a) => {
      const matchesSearch =
        a.art_nomb.toLowerCase().includes(search.toLowerCase()) ||
        (a.art_sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
        String(a.art_codi).includes(search);
      const matchesRubro = rubroFilter === "todos" || String(a.rub_codi) === rubroFilter;
      const matchesMarca = marcaFilter === "todas" || String(a.mar_codi) === marcaFilter;
      return matchesSearch && matchesRubro && matchesMarca;
    });
    result = result.sort((a, b) => {
      let cmp = 0;
      if      (sortKey === "art_codi") cmp = a.art_codi - b.art_codi;
      else if (sortKey === "art_nomb") cmp = a.art_nomb.localeCompare(b.art_nomb);
      else if (sortKey === "art_pfin") cmp = a.art_pfin - b.art_pfin;
      else                             cmp = a.art_stk - b.art_stk;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, rubroFilter, marcaFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const activos    = articulos.filter(a => a.art_acti).length;
  const lowStock   = articulos.filter(a => a.art_stk < 10).length;
  const avgPrice   = Math.round(articulos.reduce((s, a) => s + a.art_pfin, 0) / articulos.length);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Artículos</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Artículos</h1>
            <p className="text-sm text-muted-foreground">
              Catálogo de productos · campos: art_codi, art_nomb, art_pfin, art_stk, mar_codi, sru_codi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Artículos" value={formatNumber(articulos.length)} change={4.2} icon={Package} iconColor="hsl(var(--chart-1))" />
          <StatCard title="art_acti = true" value={formatNumber(activos)} change={2.1} icon={Tag} iconColor="hsl(var(--chart-2))" />
          <StatCard title="Stock bajo (< 10)" value={formatNumber(lowStock)} change={0} icon={ShoppingBag} iconColor="hsl(var(--chart-4))" />
          <StatCard title="art_pfin promedio" value={formatCurrency(avgPrice)} change={5.8} icon={TrendingUp} iconColor="hsl(var(--chart-3))" />
        </div>

        {/* Ventas por rubro */}
        <ChartCard title="Ventas por Rubro (rub_nomb)" description="Distribución de volumen de ventas" icon={Layers}>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriaVentasData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="categoria" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar dataKey="ventas" name="Ventas" radius={[6,6,0,0]} fill="hsl(var(--chart-1))" maxBarSize={64} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between flex-wrap">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="art_codi, art_nomb, art_sku..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={rubroFilter} onValueChange={setRubro}>
                <SelectTrigger className="w-[150px] h-9 text-sm">
                  <SelectValue placeholder="Rubro (rub_codi)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los rubros</SelectItem>
                  {rubros.map(r => (
                    <SelectItem key={r.rub_codi} value={String(r.rub_codi)}>{r.rub_nomb}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={marcaFilter} onValueChange={setMarca}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Marca (mar_codi)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las marcas</SelectItem>
                  {marcas.map(m => (
                    <SelectItem key={m.mar_codi} value={String(m.mar_codi)}>{m.mar_nomb}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5 h-9">
                <Download className="h-4 w-4" /> Exportar
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/20">
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("art_codi")} className="flex items-center gap-1.5 hover:text-foreground">
                      art_codi <SortIcon col="art_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("art_nomb")} className="flex items-center gap-1.5 hover:text-foreground">
                      art_nomb <SortIcon col="art_nomb" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">art_sku / art_cn</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">mar_nomb</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">rub_nomb / sru_nomb</th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("art_pfin")} className="flex items-center gap-1.5 hover:text-foreground">
                      art_pfin <SortIcon col="art_pfin" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    <button onClick={() => toggleSort("art_stk")} className="flex items-center gap-1.5 hover:text-foreground">
                      art_stk <SortIcon col="art_stk" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">art_acti</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a.art_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-semibold text-primary">#{a.art_codi}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium max-w-[200px] truncate">{a.art_nomb}</p>
                      {a.art_desc && <p className="text-xs text-muted-foreground truncate max-w-[200px]">{a.art_desc}</p>}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-0.5">
                        {a.art_sku && <p className="font-mono text-xs bg-muted rounded px-1.5 py-0.5 inline-block">{a.art_sku}</p>}
                        {a.art_cn && <p className="font-mono text-xs text-muted-foreground">{a.art_cn}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">{a.mar_nomb}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div>
                        <p className="text-xs text-muted-foreground">{a.rub_nomb}</p>
                        <p className="text-xs font-medium">{a.sru_nomb}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(a.art_pfin)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={cn(
                        "font-semibold",
                        a.art_stk < 10 ? "text-destructive" : a.art_stk < 20 ? "text-amber-600 dark:text-amber-400" : "text-foreground"
                      )}>
                        {a.art_stk}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn(
                        a.art_acti
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                          : "bg-muted text-muted-foreground hover:bg-muted"
                      )}>
                        {a.art_acti ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron artículos con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Mostrando {filtered.length} de {articulos.length} artículos</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
