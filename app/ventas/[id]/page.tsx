"use client";

import React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Package, User, Receipt, Calendar, Clock, DollarSign,
  ChevronRight, Hash, CreditCard, FileText, CheckCircle2, Mail,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { BadgePago } from "@/components/dashboard/badges";
import { getVentaById, getClienteByCodi, getVentasByCliente } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatDateLong, formatNumber } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export default function VentaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id     = Number(params.id);
  const venta  = getVentaById(id);

  if (!venta) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-lg font-semibold">Venta no encontrada</p>
          <Link href="/ventas">
            <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Volver a Ventas</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const cliente = getClienteByCodi(venta.cli_codi);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Inicio</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/ventas" className="hover:text-foreground">Ventas</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">#{venta.ven_codi}</span>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => router.push("/ventas")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl font-bold tracking-tight">Venta #{venta.ven_codi}</h1>
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" /> Facturada
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {formatDateLong(venta.ven_fech)} · {venta.ven_hora} hs
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2">
              <Receipt className="h-4 w-4" /> Ver Comprobante
            </Button>
          </div>
        </div>

        {/* 3-card layout */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Detalles Venta */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Datos de la Venta</h3>
                <p className="text-xs text-muted-foreground">Cabecera del comprobante</p>
              </div>
            </div>
            <div className="divide-y divide-border">
              <InfoRow icon={Hash}       label="ven_codi"  value={`#${venta.ven_codi}`} />
              <InfoRow icon={FileText}   label="ven_ncmp"  value={venta.ven_ncmp} />
              <InfoRow icon={Calendar}   label="ven_fech"  value={formatDate(venta.ven_fech)} />
              <InfoRow icon={Clock}      label="ven_hora"  value={`${venta.ven_hora} hs`} />
              <InfoRow icon={CreditCard} label="ven_fpag"  value={`${venta.ven_fpag} · ${venta.ven_fpag_display}`} />
              <InfoRow icon={Package}    label="items"     value={formatNumber(venta.cantidadItems)} />
            </div>
            <div className="mt-4 rounded-lg bg-primary/5 p-4">
              <p className="text-xs font-mono text-muted-foreground mb-1">ven_tota</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(venta.ven_tota)}</p>
            </div>
          </div>

          {/* Cliente */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: "hsl(var(--chart-3))", background: "hsl(var(--chart-3) / 0.1)" }}>
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
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{cliente.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{cliente.cli_nomb}</p>
                    <p className="text-xs text-muted-foreground font-mono">cli_codi: {cliente.cli_codi}</p>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  <InfoRow icon={Hash}     label="cli_codi" value={String(cliente.cli_codi)} />
                  <InfoRow icon={Mail}     label="cli_mail" value={cliente.cli_mail} />
                  <InfoRow icon={Receipt}  label="loc_nomb" value={cliente.loc_nomb ?? "—"} />
                  <InfoRow icon={ChevronRight} label="pci_nomb" value={cliente.pci_nomb ?? "—"} />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-8 text-center">cli_codi: {venta.cli_codi}</p>
            )}
          </div>

          {/* Artículos (DetalleVenta) */}
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ color: "hsl(var(--chart-2))", background: "hsl(var(--chart-2) / 0.1)" }}>
                <Package className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Artículos Vendidos</h3>
                <p className="text-xs text-muted-foreground">{venta.detalles.length} líneas (DetalleVenta)</p>
              </div>
            </div>
            <div className="space-y-2">
              {venta.detalles.map((d) => (
                <div key={d.dva_codi} className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-tight">{d.art_nomb}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5">art_codi: {d.art_codi}</p>
                    </div>
                    <p className="text-sm font-bold shrink-0">{formatCurrency(d.subtotal)}</p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-mono">dva_cant:</span><span>{d.dva_cant}</span>
                    <span>×</span>
                    <span className="font-mono">art_pfin:</span><span>{formatCurrency(d.art_pfin)}</span>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between px-1">
              <span className="text-sm font-medium">ven_tota</span>
              <span className="text-lg font-bold text-primary">{formatCurrency(venta.ven_tota)}</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
