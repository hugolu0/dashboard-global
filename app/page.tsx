"use client";

import React, { useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, ScatterChart, Scatter, Treemap,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ZAxis,
} from "recharts";
import {
  ShoppingCart, Users, DollarSign, Receipt, TrendingUp, Activity,
  PieChart as PieIcon, Award, ArrowRight, Clock, Radar as RadarIcon,
  MapPin, Zap, Target, Layers, GripVertical, Maximize2, Minimize2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { BadgeEstado } from "@/components/dashboard/badges";
import {
  dashboardStats, ventasMensuales, ventasSemanales, formaPagoData,
  estadoPedidosData, topClientesData, pedidos, categoriaVentasData,
  radarData, actividadReciente, ventasPorCiudad, scatterData,
} from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatCompact, formatDate } from "@/lib/format";

type CardId = "revenue" | "payment" | "weekly" | "status" | "topClients" | "recentOrders" | "radar" | "activity" | "scatter" | "treemap";

interface DashboardCard {
  id: CardId;
  title: string;
  description: string;
  icon: any;
  span: "full" | "half" | "third";
  render: () => React.ReactNode;
}

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <p className="mb-1 font-semibold">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color || entry.fill }} className="flex items-center gap-2">
          <span className="font-medium">{entry.name}:</span>
          <span className="font-bold">{formatter ? formatter(entry.value) : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

function LegendRow({ items }: { items: { name: string; value: string; color: string }[] }) {
  return (
    <div className="space-y-2 px-5 pb-2">
      {items.map((item) => (
        <div key={item.name} className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
            <span className="text-muted-foreground">{item.name}</span>
          </div>
          <span className="font-semibold">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function ActivityIcon({ type }: { type: string }) {
  const icons: Record<string, any> = {
    shopping: ShoppingCart, user: Users, alert: Clock,
    check: Activity, dollar: DollarSign,
  };
  const colors: Record<string, string> = {
    shopping: "hsl(var(--chart-1))", user: "hsl(var(--chart-3))",
    alert: "hsl(var(--chart-4))", check: "hsl(var(--chart-2))", dollar: "hsl(var(--chart-1))",
  };
  const Icon = icons[type] || Activity;
  const color = colors[type] || "hsl(var(--chart-1))";
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: `${color}15`, color }}>
      <Icon className="h-3.5 w-3.5" />
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const { profile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [cardSpans, setCardSpans] = useState<Record<CardId, "full" | "half" | "third">>({
    revenue: "full", payment: "third", weekly: "half", status: "third",
    topClients: "third", recentOrders: "half", radar: "third",
    activity: "third", scatter: "third", treemap: "third",
  });
  const [order, setOrder] = useState<CardId[]>([
    "revenue", "payment", "weekly", "status", "topClients", "recentOrders",
    "radar", "activity", "scatter", "treemap",
  ]);
  const [draggedId, setDraggedId] = useState<CardId | null>(null);
  const [dragOverId, setDragOverId] = useState<CardId | null>(null);

  const toggleSpan = (id: CardId) => {
    setCardSpans(prev => ({
      ...prev,
      [id]: prev[id] === "third" ? "half" : prev[id] === "half" ? "full" : "third",
    }));
  };

  const handleDragStart = (id: CardId) => setDraggedId(id);
  const handleDragOver = (e: React.DragEvent, id: CardId) => {
    e.preventDefault();
    setDragOverId(id);
  };
  const handleDrop = (id: CardId) => {
    if (!draggedId || draggedId === id) return;
    const newOrder = [...order];
    const fromIdx = newOrder.indexOf(draggedId);
    const toIdx = newOrder.indexOf(id);
    newOrder.splice(fromIdx, 1);
    newOrder.splice(toIdx, 0, draggedId);
    setOrder(newOrder);
    setDraggedId(null);
    setDragOverId(null);
  };

  const spanClass = (span: string) => {
    if (span === "full") return "lg:col-span-3";
    if (span === "half") return "lg:col-span-2";
    return "lg:col-span-1";
  };

  const recentPedidos = pedidos.slice(0, 6);

  const cards: Record<CardId, DashboardCard> = {
    revenue: {
      id: "revenue", title: "Ingresos y Pedidos Mensuales", description: "Evolución de los últimos 7 meses",
      icon: TrendingUp, span: "full",
      render: () => (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ventasMensuales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={formatCurrency} />} />
              <Area type="monotone" dataKey="ven_total" name="Ingresos" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#colorIngresos)" />
              <Area type="monotone" dataKey="ped_count" name="Pedidos" stroke="hsl(var(--chart-2))" strokeWidth={2.5} fill="url(#colorPedidos)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    payment: {
      id: "payment", title: "Forma de Pago", description: "Distribución de pagos",
      icon: PieIcon, span: "third",
      render: () => (
        <>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={formaPagoData} cx="50%" cy="45%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {formaPagoData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="hsl(var(--card))" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip formatter={(v: number) => `${v}%`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <LegendRow items={formaPagoData.map(d => ({ name: d.name, value: `${d.value}%`, color: d.color }))} />
        </>
      ),
    },
    weekly: {
      id: "weekly", title: "Pedidos por Día", description: "Volumen semanal",
      icon: Activity, span: "half",
      render: () => (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ventasSemanales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              <Bar dataKey="ped_count" name="Pedidos" radius={[6, 6, 0, 0]} fill="hsl(var(--chart-1))" maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    status: {
      id: "status", title: "Estado de Pedidos", description: "Procesados vs Pendientes",
      icon: Activity, span: "third",
      render: () => (
        <>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="90%" barSize={18} data={estadoPedidosData} startAngle={90} endAngle={-270}>
                <RadialBar dataKey="value" cornerRadius={9} background={{ fill: "hsl(var(--muted))" }} />
                <Tooltip content={<CustomTooltip formatter={(v: number) => `${v}%`} />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          <LegendRow items={estadoPedidosData.map(d => ({ name: d.name, value: `${d.value}%`, color: d.fill }))} />
        </>
      ),
    },
    topClients: {
      id: "topClients", title: "Top Clientes por Facturación", description: "Frecuencia y monto (en miles)",
      icon: Award, span: "third",
      render: () => (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topClientesData} layout="vertical" margin={{ top: 0, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="cli_nomb" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v * 1000)} />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }} />
              <Bar dataKey="ven_total" name="Facturación" radius={[0, 6, 6, 0]} fill="hsl(var(--chart-3))" maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    recentOrders: {
      id: "recentOrders", title: "Pedidos Recientes", description: "Últimos pedidos registrados",
      icon: ShoppingCart, span: "half",
      render: () => (
        <div className="overflow-x-auto px-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-3 font-medium">Pedido</th>
                <th className="pb-2 pr-3 font-medium">Cliente</th>
                <th className="pb-2 pr-3 font-medium hidden sm:table-cell">Fecha</th>
                <th className="pb-2 pr-3 font-medium">Total</th>
                <th className="pb-2 pr-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentPedidos.map((p) => (
                <tr
                  key={p.ped_codi}
                  onClick={() => router.push(`/pedidos/${p.ped_codi}`)}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <td className="py-2.5 pr-3 font-semibold text-primary">#{p.ped_codi}</td>
                  <td className="py-2.5 pr-3 max-w-[160px] truncate text-muted-foreground">{p.cli_nomb}</td>
                  <td className="py-2.5 pr-3 hidden sm:table-cell text-muted-foreground">{formatDate(p.ped_fech)}</td>
                  <td className="py-2.5 pr-3 font-semibold">{formatCurrency(p.ped_tota)}</td>
                  <td className="py-2.5 pr-3"><BadgeEstado estado={p.ped_exp ? "Procesado" : "Pendiente"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    radar: {
      id: "radar", title: "Rendimiento por Métrica", description: "Actual vs Objetivo",
      icon: RadarIcon, span: "third",
      render: () => (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="72%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
              <PolarRadiusAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} />
              <Radar name="Actual" dataKey="actual" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="Objetivo" dataKey="objetivo" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    activity: {
      id: "activity", title: "Actividad Reciente", description: "Eventos del sistema",
      icon: Zap, span: "third",
      render: () => (
        <div className="space-y-1 px-3 pb-2 max-h-[280px] overflow-y-auto">
          {actividadReciente.map((a, idx) => (
            <div key={a.id} className="flex items-start gap-3 rounded-lg p-2 hover:bg-muted/30 transition-colors">
              <ActivityIcon type={a.icon} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium leading-tight">{a.titulo}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.desc}</p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{a.tiempo}</p>
              </div>
            </div>
          ))}
          {actividadReciente.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Sin actividad reciente</p>
          )}
        </div>
      ),
    },
    scatter: {
      id: "scatter", title: "Precio vs Ventas", description: "Relación precio-cantidad",
      icon: Target, span: "third",
      render: () => (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" dataKey="x" name="Stock" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <YAxis type="number" dataKey="y" name="Precio" tickFormatter={(v) => formatCompact(v)} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={50} />
              <ZAxis type="number" dataKey="z" range={[40, 400]} />
              <Tooltip content={<CustomTooltip formatter={(v: number) => formatCurrency(v)} />} />
              <Scatter data={scatterData} fill="hsl(var(--chart-1))" fillOpacity={0.6} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      ),
    },
    treemap: {
      id: "treemap", title: "Ventas por Categoría", description: "Distribución treemap",
      icon: Layers, span: "third",
      render: () => (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={categoriaVentasData}
              dataKey="ventas"
              nameKey="categoria"
              stroke="hsl(var(--card))"
              fill="hsl(var(--chart-1))"
              content={<TreemapContent />}
            >
              <Tooltip content={<CustomTooltip formatter={(v: number) => `${v} ventas`} />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      ),
    },
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-3">
              <p className="text-sm text-muted-foreground">
                Resumen general de estadísticas
              </p>
              {profile && (
                <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-0.5 text-xs font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                  {profile.empresa_nomb}
                </div>
              )}
            </div>
            {profile?.api_url && (
              <p className="text-[11px] font-mono text-muted-foreground/60">api_url: {profile.api_url}</p>
            )}
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              editMode
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {editMode ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            {editMode ? "Listo" : "Personalizar"}
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Pedidos" value={formatNumber(dashboardStats.totalPedidos)} change={dashboardStats.crecimientoPedidos} icon={ShoppingCart} iconColor="hsl(var(--chart-1))" />
          <StatCard title="Ingresos Totales" value={formatCurrency(dashboardStats.ingresosTotales)} change={dashboardStats.crecimientoIngresos} icon={DollarSign} iconColor="hsl(var(--chart-2))" />
          <StatCard title="Clientes Activos" value={formatNumber(dashboardStats.clientesActivos)} change={dashboardStats.crecimientoClientes} icon={Users} iconColor="hsl(var(--chart-3))" />
          <StatCard title="Ticket Promedio" value={formatCurrency(dashboardStats.ticketPromedio)} change={dashboardStats.crecimientoTicket} icon={Receipt} iconColor="hsl(var(--chart-4))" />
        </div>

        {/* Edit mode hint */}
        {editMode && (
          <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-foreground">Modo edición: arrastrá las tarjetas para reordenarlas. Usá el ícono de tamaño para cambiar el ancho (1/3, 1/2, completo).</span>
          </div>
        )}

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {order.map((cardId) => {
            const card = cards[cardId];
            const span = cardSpans[cardId];
            const isDragOver = dragOverId === cardId;
            return (
              <div
                key={cardId}
                draggable={editMode}
                onDragStart={() => handleDragStart(cardId)}
                onDragOver={(e) => handleDragOver(e, cardId)}
                onDrop={() => handleDrop(cardId)}
                onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
                className={cn(
                  "group relative rounded-xl border bg-card transition-all",
                  editMode ? "cursor-move" : "",
                  isDragOver ? "border-primary ring-2 ring-primary/20" : "border-border",
                  spanClass(span)
                )}
              >
                {/* Card header */}
                <div className="flex items-start justify-between p-5 pb-3">
                  <div className="flex items-start gap-2.5">
                    {editMode && (
                      <GripVertical className="mt-0.5 h-4 w-4 text-muted-foreground/50" />
                    )}
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <card.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold leading-tight">{card.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{card.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {editMode && (
                      <button
                        onClick={() => toggleSpan(cardId)}
                        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title="Cambiar tamaño"
                      >
                        <Maximize2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {cardId === "recentOrders" && !editMode && (
                      <Link href="/pedidos" className="flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                        Ver todos <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
                {/* Card content */}
                <div className="px-3 pb-4">{card.render()}</div>

                {/* Drag overlay */}
                {editMode && draggedId === cardId && (
                  <div className="absolute inset-0 rounded-xl bg-primary/5 border-2 border-primary border-dashed" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

function TreemapContent(props: any) {
  const { root, depth, x, y, width, height, index, payload, colors, name, value } = props;
  if (depth === 0) return <g></g>;
  const chartColors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
  const fill = chartColors[index % chartColors.length];
  return (
    <g>
      <rect
        x={x} y={y} width={width} height={height}
        style={{ fill, fillOpacity: 0.75, stroke: "hsl(var(--card))", strokeWidth: 2 }}
        rx={6} ry={6}
      />
      {width > 80 && height > 40 && (
        <>
          <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={13} fontWeight={600}>
            {name}
          </text>
          <text x={x + width / 2} y={y + height / 2 + 12} textAnchor="middle" fill="#fff" fontSize={11} opacity={0.8}>
            {value} ventas
          </text>
        </>
      )}
    </g>
  );
}
