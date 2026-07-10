"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Receipt, TrendingUp, DollarSign, CheckCircle2, Search, ArrowUpDown,
  ArrowUp, ArrowDown, Download, ChevronRight, FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { BadgePago } from "@/components/dashboard/badges";
import { ventas, getClienteByCodi, type Venta, ventasMensuales } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatDate, formatCompact } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";

type SortKey = "ven_codi" | "ven_fech" | "ven_tota" | "cantidadItems";
type SortDir  = "asc" | "desc";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }} className="font-bold">{e.name}: {formatCompact(e.value)}</p>
      ))}
    </div>
  );
}

export default function VentasPage() {
  const router = useRouter();
  const [search, setSearch]     = useState("");
  const [pagoFilter, setPago]   = useState("todos");
  const [sortKey, setSortKey]   = useState<SortKey>("ven_codi");
  const [sortDir, setSortDir]   = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = ventas.filter((v) => {
      const matchesSearch =
        v.cli_nomb.toLowerCase().includes(search.toLowerCase()) ||
        String(v.ven_codi).includes(search) ||
        v.ven_ncmp.toLowerCase().includes(search.toLowerCase());
      const matchesPago = pagoFilter === "todos" || v.ven_fpag_display === pagoFilter;
      return matchesSearch && matchesPago;
    });
    result = result.sort((a, b) => {
      let cmp = 0;
      if      (sortKey === "ven_codi")  cmp = a.ven_codi - b.ven_codi;
      else if (sortKey === "ven_fech")  cmp = a.ven_fech.localeCompare(b.ven_fech);
      else if (sortKey === "ven_tota")  cmp = a.ven_tota - b.ven_tota;
      else                              cmp = a.cantidadItems - b.cantidadItems;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, pagoFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const totalFact  = ventas.reduce((s, v) => s + v.ven_tota, 0);
  const ticketProm = Math.round(totalFact / ventas.length);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Ventas</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Ventas</h1>
              <p className="text-sm text-muted-foreground">
                Facturación confirmada · campos: ven_codi, ven_fech, ven_tota, ven_fpag, ven_ncmp
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Ventas" value={formatNumber(ventas.length)} change={15.6} icon={Receipt} iconColor="hsl(var(--chart-1))" />
          <StatCard title="ven_tota acumulado" value={formatCurrency(totalFact)} change={18.3} icon={DollarSign} iconColor="hsl(var(--chart-2))" />
          <StatCard title="Ticket Promedio" value={formatCurrency(ticketProm)} change={-2.4} icon={TrendingUp} iconColor="hsl(var(--chart-3))" />
          <StatCard title="Comprobantes" value={formatNumber(ventas.length)} change={12.1} icon={FileText} iconColor="hsl(var(--chart-4))" />
        </div>

        {/* Chart ventas vs pedidos */}
        <ChartCard title="Ventas vs Pedidos Mensuales" description="ven_count vs ped_count" icon={TrendingUp}>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ventasMensuales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                <Bar dataKey="ven_count" name="Ventas"  radius={[6,6,0,0]} fill="hsl(var(--chart-1))" maxBarSize={32} />
                <Bar dataKey="ped_count" name="Pedidos" radius={[6,6,0,0]} fill="hsl(var(--chart-2))" maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="ven_codi, cli_nomb, ven_ncmp..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
                {["todos","Contado","Cuenta Corriente","Cheque","Transferencia"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setPago(opt)}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                      pagoFilter === opt ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt === "todos" ? "Todos" : opt}
                  </button>
                ))}
              </div>
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
                    <button onClick={() => toggleSort("ven_codi")} className="flex items-center gap-1.5 hover:text-foreground">
                      ven_codi <SortIcon col="ven_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">ven_ncmp</th>
                  <th className="px-4 py-3 font-medium">cli_nomb</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    <button onClick={() => toggleSort("ven_fech")} className="flex items-center gap-1.5 hover:text-foreground">
                      ven_fech <SortIcon col="ven_fech" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">ven_fpag</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    <button onClick={() => toggleSort("cantidadItems")} className="flex items-center gap-1.5 hover:text-foreground">
                      Items <SortIcon col="cantidadItems" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("ven_tota")} className="flex items-center gap-1.5 hover:text-foreground">
                      ven_tota <SortIcon col="ven_tota" />
                    </button>
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((v) => {
                  const cliente = getClienteByCodi(v.cli_codi);
                  return (
                    <tr key={v.ven_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => router.push(`/ventas/${v.ven_codi}`)}>
                      <td className="px-4 py-3 font-semibold text-primary">#{v.ven_codi}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs bg-muted rounded px-1.5 py-0.5">{v.ven_ncmp}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                              {cliente?.avatar ?? "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[150px]">{v.cli_nomb}</p>
                            <p className="text-xs text-muted-foreground">{cliente?.cli_mail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{formatDate(v.ven_fech)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell"><BadgePago forma={v.ven_fpag_display} /></td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{v.cantidadItems}</td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(v.ven_tota)}</td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-all" />
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron ventas con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Mostrando {filtered.length} de {ventas.length} ventas</span>
            <span>Ticket promedio: <span className="font-semibold text-foreground">{formatCurrency(ticketProm)}</span></span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
