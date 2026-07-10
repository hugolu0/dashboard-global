"use client";

import React from "react";
import {
  BarChart3, FileText, Download, TrendingUp, Users, ShoppingCart,
} from "lucide-react";
import {
  BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
  ComposedChart, Line, Legend,
} from "recharts";
import { AppLayout } from "@/components/layout/app-layout";
import { ChartCard } from "@/components/dashboard/chart-card";
import { StatCard } from "@/components/dashboard/stat-card";
import { ventasMensuales, topClientesData } from "@/lib/mock-data";
import { formatCurrency, formatCompact } from "@/lib/format";
import { Button } from "@/components/ui/button";

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }} className="font-medium">
          {e.name}: <span className="font-bold">{formatCompact(e.value)}</span>
        </p>
      ))}
    </div>
  );
}

export default function ReportesPage() {
  const reportes = [
    { titulo: "Reporte de Ventas Mensual", desc: "Resumen de ingresos y pedidos por mes", icon: TrendingUp, color: "hsl(var(--chart-1))" },
    { titulo: "Reporte de Clientes", desc: "Actividad y facturación de clientes", icon: Users, color: "hsl(var(--chart-3))" },
    { titulo: "Reporte de Pedidos", desc: "Detalle completo de pedidos por estado", icon: ShoppingCart, color: "hsl(var(--chart-2))" },
    { titulo: "Reporte de Cobranzas", desc: "Pagos por forma de pago y período", icon: FileText, color: "hsl(var(--chart-4))" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Reportes</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
          <p className="text-sm text-muted-foreground">Informes y análisis estadísticos</p>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Comparativa Pedidos vs Ingresos" description="Volumen y facturación mensual" icon={BarChart3}>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={ventasMensuales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar yAxisId="left" dataKey="ingresos" name="Ingresos" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  <Line yAxisId="right" type="monotone" dataKey="pedidos" name="Pedidos" stroke="hsl(var(--chart-2))" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard title="Top Clientes por Pedidos" description="Volumen de pedidos por cliente" icon={Users}>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topClientesData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="cliente" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
                  <Bar dataKey="pedidos" name="Pedidos" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-3))" maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Available reports */}
        <div>
          <h3 className="mb-3 text-sm font-semibold">Reportes Disponibles</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {reportes.map((r, i) => (
              <div key={i} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-lg hover:shadow-black/[0.03] hover:border-muted-foreground/20">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                  style={{ background: `${r.color}15`, color: r.color }}>
                  <r.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{r.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 shrink-0">
                  <Download className="h-4 w-4" /> PDF
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
