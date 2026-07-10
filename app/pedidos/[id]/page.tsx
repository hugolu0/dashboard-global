"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ShoppingCart, User, Package, MapPin, Mail, Phone,
  Calendar, Clock, DollarSign, CheckCircle2, Printer, TrendingUp,
  ChevronRight, CreditCard, Hash, FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { BadgeEstado, BadgePago } from "@/components/dashboard/badges";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  getPedidoById, getClienteByCodi, getPedidosByCliente,
} from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateLong, formatNumber } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-mono">{label}</span>
      </div>
      <span className="text-sm font-semibold text-right max-w-[55%] truncate">{value}</span>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 font-semibold">{label}</p>
      <p style={{ color: "hsl(var(--chart-1))" }} className="font-bold">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function PedidoDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = Number(params.id);
  const pedido   = getPedidoById(id);

  if (!pedido) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-lg font-semibold">Pedido no encontrado</p>
          <p className="text-sm text-muted-foreground">El pedido #{id} no existe.</p>
          <Link href="/pedidos">
            <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Volver a Pedidos</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const cliente  = getClienteByCodi(pedido.cli_codi);
  const historial = getPedidosByCliente(pedido.cli_codi).filter(p => p.ped_codi !== pedido.ped_codi);
  const histTota  = historial.reduce((s, p) => s + p.ped_tota, 0);
  const estadoDisplay = pedido.ped_exp ? "Procesado" : "Pendiente";

  const chartData = [...historial, pedido]
    .sort((a, b) => a.ped_codi - b.ped_codi)
    .map((p) => ({ pedido: `#${p.ped_codi}`, ped_tota: p.ped_tota }));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/pedidos" className="hover:text-foreground">Pedidos</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">#{pedido.ped_codi}</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/pedidos")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">Pedido #{pedido.ped_codi}</h1>
                  <BadgeEstado estado={estadoDisplay as any} />
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatDateLong(pedido.ped_fech)} · {pedido.ped_hora} hs
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!pedido.ped_exp && (
                <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                  <CheckCircle2 className="h-4 w-4" /> Marcar Procesado
                </Button>
              )}
              <Button variant="outline" className="gap-2">
                <Printer className="h-4 w-4" /> Imprimir
              </Button>
            </div>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard title="ped_tota" value={formatCurrency(pedido.ped_tota)} change={0} changeLabel="" icon={DollarSign} iconColor="hsl(var(--chart-1))" />
          <StatCard title="dpe_cant (items)" value={formatNumber(pedido.cantidadItems)} change={0} changeLabel="" icon={Package} iconColor="hsl(var(--chart-3))" />
          <StatCard title="ped_fpag" value={pedido.ped_fpag_display} change={0} changeLabel="" icon={CreditCard} iconColor="hsl(var(--chart-2))" />
          <StatCard title="ped_exp" value={pedido.ped_exp ? "true → Procesado" : "false → Pendiente"} change={0} changeLabel="" icon={CheckCircle2} iconColor="hsl(var(--chart-4))" />
        </div>

        {/* 3-card layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Detalles del Pedido */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Detalles del Pedido</h3>
                <p className="text-xs text-muted-foreground">Cabecera de la orden</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              <InfoRow icon={Hash}        label="ped_codi"  value={`#${pedido.ped_codi}`} />
              <InfoRow icon={Calendar}    label="ped_fech"  value={formatDate(pedido.ped_fech)} />
              <InfoRow icon={Clock}       label="ped_hora"  value={`${pedido.ped_hora} hs`} />
              <InfoRow icon={CreditCard}  label="ped_fpag"  value={`${pedido.ped_fpag} · ${pedido.ped_fpag_display}`} />
              <InfoRow icon={Package}     label="items"     value={formatNumber(pedido.cantidadItems)} />
              <InfoRow icon={CheckCircle2} label="ped_exp" value={pedido.ped_exp ? "true (Procesado)" : "false (Pendiente)"} />
              {pedido.ped_fexp && (
                <InfoRow icon={Calendar} label="ped_fexp" value={pedido.ped_fexp.replace("T", " ")} />
              )}
            </div>
            <div className="mt-4 rounded-lg bg-primary/5 p-4">
              <p className="text-xs font-mono text-muted-foreground mb-1">ped_tota</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(pedido.ped_tota)}</p>
            </div>
          </div>

          {/* Cliente */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10" style={{ color: "hsl(var(--chart-3))", background: "hsl(var(--chart-3) / 0.1)" }}>
                <User className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Cliente</h3>
                <p className="text-xs text-muted-foreground">Datos del comprador</p>
              </div>
            </div>
            {cliente ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {cliente.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{cliente.cli_nomb}</p>
                    <p className="text-xs text-muted-foreground font-mono">cli_codi: {cliente.cli_codi}</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  <InfoRow icon={Hash}      label="cli_codi"  value={String(cliente.cli_codi)} />
                  <InfoRow icon={Mail}      label="cli_mail"  value={cliente.cli_mail} />
                  <InfoRow icon={Phone}     label="cli_tele"  value={cliente.cli_tele} />
                  <InfoRow icon={MapPin}    label="loc_nomb"  value={cliente.loc_nomb ?? "—"} />
                  <InfoRow icon={MapPin}    label="pci_nomb"  value={cliente.pci_nomb ?? "—"} />
                  <InfoRow icon={Calendar}  label="cli_falt"  value={formatDate(cliente.cli_falt)} />
                </div>
                <Link href="/clientes" className="mt-4 block">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Ver Perfil Completo <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">Sin cliente (cli_codi: {pedido.cli_codi})</p>
            )}
          </div>

          {/* Artículos (DetallePedido) */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: "hsl(var(--chart-2))", background: "hsl(var(--chart-2) / 0.1)" }}>
                <Package className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Artículos del Pedido</h3>
                <p className="text-xs text-muted-foreground">{pedido.detalles.length} líneas (DetallePedido)</p>
              </div>
            </div>
            <div className="space-y-2">
              {pedido.detalles.map((d) => (
                <div key={d.dpe_codi} className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{d.art_nomb}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">art_codi: {d.art_codi}</p>
                    </div>
                    <p className="text-sm font-bold shrink-0">{formatCurrency(d.subtotal)}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">dpe_cant:</span><span>{d.dpe_cant}</span>
                    <span>×</span>
                    <span className="font-mono">art_pfin:</span><span>{formatCurrency(d.art_pfin)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium">ped_tota</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(pedido.ped_tota)}</span>
            </div>
          </div>
        </div>

        {/* Historial cliente */}
        {chartData.length > 1 && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Historial de Pedidos del Cliente</h3>
                <p className="text-xs text-muted-foreground">
                  {historial.length} pedidos previos · {formatCurrency(histTota)} acumulado
                </p>
              </div>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="pedido" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v) => formatCurrency(v)} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="ped_tota" name="ped_tota" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#colorHist)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
