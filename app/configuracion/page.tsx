"use client";

import React from "react";
import { Settings, Palette, Database, Bell, Shield, Globe } from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

const COLOR_PRESETS = [
  { name: "orange", label: "Naranja", color: "#f97316" },
  { name: "blue",   label: "Azul",    color: "#3b82f6" },
  { name: "green",  label: "Verde",   color: "#22c55e" },
  { name: "rose",   label: "Rosa",    color: "#f43f5e" },
  { name: "slate",  label: "Pizarra", color: "#475569" },
] as const;

function Section({ icon: Icon, title, desc, children }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Row({ label, desc, children }: any) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export default function ConfiguracionPage() {
  const { mode, setMode, color, setColor } = useTheme();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Inicio</span><span>/</span><span className="text-foreground font-medium">Configuración</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
          <p className="text-sm text-muted-foreground">Ajustes generales del sistema</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Apariencia */}
          <Section icon={Palette} title="Apariencia" desc="Tema y colores de la interfaz">
            <div className="space-y-1">
              <Row label="Modo oscuro" desc="Cambia entre tema claro y oscuro">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMode("light")}
                    className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === "light" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}
                  >Claro</button>
                  <button
                    onClick={() => setMode("dark")}
                    className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === "dark" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}
                  >Oscuro</button>
                  <button
                    onClick={() => setMode("system")}
                    className={cn("rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                      mode === "system" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70")}
                  >Auto</button>
                </div>
              </Row>
              <Separator />
              <Row label="Color principal" desc="Color de acento del sistema">
                <div className="flex items-center gap-2">
                  {COLOR_PRESETS.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => setColor(p.name as any)}
                      className={cn("h-7 w-7 rounded-full border-2 transition-all", color === p.name ? "scale-110 border-foreground/30" : "border-transparent hover:scale-105")}
                      style={{ background: p.color }}
                      title={p.label}
                    />
                  ))}
                </div>
              </Row>
            </div>
          </Section>

          {/* Notificaciones */}
          <Section icon={Bell} title="Notificaciones" desc="Alertas y avisos del sistema">
            <div className="space-y-1">
              <Row label="Notificaciones push" desc="Recibir alertas en tiempo real"><Switch defaultChecked /></Row>
              <Separator />
              <Row label="Email de resumen diario" desc="Reporte diario a las 8:00 hs"><Switch defaultChecked /></Row>
              <Separator />
              <Row label="Alertas de stock bajo" desc="Avisar cuando el stock sea crítico"><Switch /></Row>
              <Separator />
              <Row label="Nuevos pedidos" desc="Notificar al ingresar un pedido"><Switch defaultChecked /></Row>
            </div>
          </Section>

          {/* API GeneXus */}
          <Section icon={Database} title="Integración GeneXus" desc="Conexión con API externa">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">URL de la API</label>
                <input
                  type="text"
                  defaultValue="https://api.genexus.com/v1"
                  className="mt-1 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm outline-none focus:border-ring focus:bg-background"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Token de Autenticación</label>
                <input
                  type="password"
                  defaultValue="••••••••••••••••"
                  className="mt-1 w-full rounded-lg border border-input bg-muted/40 px-3 py-2 text-sm outline-none focus:border-ring focus:bg-background"
                />
              </div>
              <div className="flex items-center justify-between">
                <Row label="Sincronización automática" desc="Actualizar datos cada 5 minutos"><Switch defaultChecked /></Row>
              </div>
              <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">Guardar Conexión</Button>
            </div>
          </Section>

          {/* Seguridad */}
          <Section icon={Shield} title="Seguridad" desc="Autenticación y permisos">
            <div className="space-y-1">
              <Row label="Autenticación de dos factores" desc="Capa extra de seguridad"><Switch /></Row>
              <Separator />
              <Row label="Cerrar sesión automática" desc="Tras 30 minutos de inactividad"><Switch defaultChecked /></Row>
              <Separator />
              <Row label="Registro de auditoría" desc="Registrar cambios en el sistema"><Switch defaultChecked /></Row>
            </div>
          </Section>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Settings className="h-3.5 w-3.5" />
          <span>NovaStock Dashboard v1.0 — Datos conectados a API GeneXus</span>
        </div>
      </div>
    </AppLayout>
  );
}
