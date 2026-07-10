"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Clock, CheckCircle2, DollarSign, Search, ArrowUpDown,
  ArrowUp, ArrowDown, Download, ChevronRight,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { BadgeEstado, BadgePago } from "@/components/dashboard/badges";
import { pedidos, getClienteByCodi, type Pedido } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type SortKey = "ped_codi" | "ped_fech" | "ped_tota" | "cantidadItems";
type SortDir = "asc" | "desc";

function MiniSpark({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 80, h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline fill="none" stroke={color} strokeWidth={1.5} points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PedidosPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"todos" | "Pendiente" | "Procesado">("todos");
  const [pagoFilter, setPagoFilter] = useState<string>("todos");
  const [sortKey, setSortKey] = useState<SortKey>("ped_codi");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sparkData = pedidos.slice(0, 6).map(p => p.ped_tota);

  const filtered = useMemo(() => {
    let result = pedidos.filter((p) => {
      const estadoDisplay = p.ped_exp ? "Procesado" : "Pendiente";
      const matchesSearch =
        p.cli_nomb.toLowerCase().includes(search.toLowerCase()) ||
        String(p.ped_codi).includes(search);
      const matchesEstado = tab === "todos" || estadoDisplay === tab;
      const matchesPago = pagoFilter === "todos" || p.ped_fpag_display === pagoFilter;
      return matchesSearch && matchesEstado && matchesPago;
    });
    result = result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "ped_codi") cmp = a.ped_codi - b.ped_codi;
      else if (sortKey === "ped_fech") cmp = a.ped_fech.localeCompare(b.ped_fech);
      else if (sortKey === "ped_tota") cmp = a.ped_tota - b.ped_tota;
      else cmp = a.cantidadItems - b.cantidadItems;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, tab, pagoFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const totalIngresos = pedidos.reduce((s, p) => s + p.ped_tota, 0);
  const pendientes  = pedidos.filter(p => !p.ped_exp).length;
  const procesados  = pedidos.filter(p => p.ped_exp).length;
  const ticketProm  = Math.round(totalIngresos / pedidos.length);

  const tabs = [
    { key: "todos" as const,     label: "Todos",      count: pedidos.length },
    { key: "Pendiente" as const, label: "Pendientes", count: pendientes },
    { key: "Procesado" as const, label: "Procesados", count: procesados },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Pedidos</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
            <p className="text-sm text-muted-foreground">Gestión de pedidos · campos: ped_codi, ped_fech, ped_tota, ped_fpag, ped_exp</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Pedidos" value={formatNumber(pedidos.length)} change={12.5} icon={ShoppingCart} iconColor="hsl(var(--chart-1))" />
          <StatCard title="Pendientes (ped_exp=false)" value={formatNumber(pendientes)} change={-4.2} icon={Clock} iconColor="hsl(var(--chart-4))" />
          <StatCard title="Procesados (ped_exp=true)" value={formatNumber(procesados)} change={15.8} icon={CheckCircle2} iconColor="hsl(var(--chart-2))" />
          <StatCard title="Facturación (ped_tota)" value={formatCurrency(totalIngresos)} change={18.3} icon={DollarSign} iconColor="hsl(var(--chart-3))" />
        </div>

        <div className="rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                    tab === t.key
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {t.label}
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    tab === t.key ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="ped_codi o cli_nomb..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/30 p-0.5">
                  {["todos", "Contado", "Cuenta Corriente", "Cheque", "Transferencia"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setPagoFilter(opt)}
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
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-muted-foreground bg-muted/20">
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("ped_codi")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      ped_codi <SortIcon col="ped_codi" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">cli_nomb</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    <button onClick={() => toggleSort("ped_fech")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      ped_fech <SortIcon col="ped_fech" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">ped_fpag</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    <button onClick={() => toggleSort("cantidadItems")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      Items <SortIcon col="cantidadItems" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Tendencia</th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("ped_tota")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      ped_tota <SortIcon col="ped_tota" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">ped_exp</th>
                  <th className="px-4 py-3 font-medium text-right"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const cliente = getClienteByCodi(p.cli_codi);
                  const estadoDisplay = p.ped_exp ? "Procesado" : "Pendiente";
                  return (
                    <tr
                      key={p.ped_codi}
                      onClick={() => router.push(`/pedidos/${p.ped_codi}`)}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer group"
                    >
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary">#{p.ped_codi}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                              {cliente?.avatar ?? "??"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[160px]">{p.cli_nomb}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[160px]">{cliente?.cli_mail}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{formatDate(p.ped_fech)}</td>
                      <td className="px-4 py-3 hidden lg:table-cell"><BadgePago forma={p.ped_fpag_display} /></td>
                      <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{p.cantidadItems}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <MiniSpark data={sparkData} color="hsl(var(--chart-2))" />
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatCurrency(p.ped_tota)}</td>
                      <td className="px-4 py-3"><BadgeEstado estado={estadoDisplay as any} /></td>
                      <td className="px-4 py-3 text-right">
                        <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron pedidos con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Mostrando {filtered.length} de {pedidos.length} pedidos</span>
            <span>Ticket promedio: <span className="font-semibold text-foreground">{formatCurrency(ticketProm)}</span></span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
