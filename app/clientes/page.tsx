"use client";

import React, { useState, useMemo } from "react";
import {
  Users, UserPlus, UserCheck, Search, ArrowUpDown, ArrowUp, ArrowDown,
  Download, Mail, Phone, MapPin, TrendingUp, ShoppingBag,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { clientes, nuevosClientesData } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type SortKey = "cli_nomb" | "totalPedidos" | "totalGastado" | "cli_falt";
type SortDir = "asc" | "desc";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      <p style={{ color: "hsl(var(--chart-3))" }} className="font-bold">{payload[0].value} clientes</p>
    </div>
  );
}

export default function ClientesPage() {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<"todos" | "activo" | "inactivo">("todos");
  const [sortKey, setSortKey] = useState<SortKey>("totalGastado");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = useMemo(() => {
    let result = clientes.filter((c) => {
      const matchesSearch =
        c.cli_nomb.toLowerCase().includes(search.toLowerCase()) ||
        c.cli_mail.toLowerCase().includes(search.toLowerCase()) ||
        (c.loc_nomb ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.pci_nomb ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesEstado =
        estadoFilter === "todos" ||
        (estadoFilter === "activo" ? c.cli_acti : !c.cli_acti);
      return matchesSearch && matchesEstado;
    });
    result = result.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "cli_nomb") cmp = a.cli_nomb.localeCompare(b.cli_nomb);
      else if (sortKey === "cli_falt") cmp = a.cli_falt.localeCompare(b.cli_falt);
      else cmp = (a[sortKey] as number) - (b[sortKey] as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return result;
  }, [search, estadoFilter, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  const totalGastado = clientes.reduce((s, c) => s + c.totalGastado, 0);
  const activos = clientes.filter(c => c.cli_acti).length;
  const promedioGastado = Math.round(totalGastado / clientes.length);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Clientes</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
              <p className="text-sm text-muted-foreground">Gestión y estadísticas de clientes</p>
            </div>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="h-4 w-4" /> Nuevo Cliente
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Clientes" value={formatNumber(clientes.length)} change={8.2} icon={Users} iconColor="hsl(var(--chart-3))" />
          <StatCard title="Clientes Activos" value={formatNumber(activos)} change={5.4} icon={UserCheck} iconColor="hsl(var(--chart-2))" />
          <StatCard title="Facturación Total" value={formatCurrency(totalGastado)} change={18.3} icon={TrendingUp} iconColor="hsl(var(--chart-1))" />
          <StatCard title="Gasto Promedio" value={formatCurrency(promedioGastado)} change={-3.1} icon={ShoppingBag} iconColor="hsl(var(--chart-4))" />
        </div>

        {/* Chart */}
        <ChartCard title="Nuevos Clientes por Mes" description="Adquisición mensual (cli_falt)" icon={UserPlus}>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={nuevosClientesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNuevos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cli_count" name="Nuevos clientes" stroke="hsl(var(--chart-3))" strokeWidth={2.5} fill="url(#colorNuevos)" />
              </AreaChart>
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
                placeholder="cli_nomb, cli_mail, loc_nomb..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={estadoFilter} onValueChange={(v) => setEstadoFilter(v as any)}>
                <SelectTrigger className="w-[140px] h-9 text-sm">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="activo">Activos</SelectItem>
                  <SelectItem value="inactivo">Inactivos</SelectItem>
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
                    <button onClick={() => toggleSort("cli_nomb")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      cli_nomb <SortIcon col="cli_nomb" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">cli_mail / cli_tele</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">loc_nomb / pci_nomb</th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("totalPedidos")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      Pedidos <SortIcon col="totalPedidos" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">
                    <button onClick={() => toggleSort("totalGastado")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      Facturado <SortIcon col="totalGastado" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    <button onClick={() => toggleSort("cli_falt")} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                      cli_falt <SortIcon col="cli_falt" />
                    </button>
                  </th>
                  <th className="px-4 py-3 font-medium">cli_acti</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.cli_codi} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                            {c.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{c.cli_nomb}</p>
                          <p className="text-xs text-muted-foreground">#{c.cli_codi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3 shrink-0" /> <span className="truncate max-w-[180px]">{c.cli_mail}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3 shrink-0" /> {c.cli_tele}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        <span>{c.loc_nomb}</span>
                        {c.pci_nomb && <span className="text-muted-foreground/60">· {c.pci_nomb}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold">{c.totalPedidos}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(c.totalGastado)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell text-muted-foreground">{formatDate(c.cli_falt)}</td>
                    <td className="px-4 py-3">
                      <Badge
                        className={cn(
                          c.cli_acti
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                            : "bg-muted text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {c.cli_acti ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                      No se encontraron clientes con los criterios seleccionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
            <span>Mostrando {filtered.length} de {clientes.length} clientes</span>
            <span>Página 1 de 1</span>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
