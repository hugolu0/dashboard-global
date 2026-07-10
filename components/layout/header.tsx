"use client";

import React from "react";
import { Search, Bell, Sun, Moon, Monitor, Settings2, Menu, ChevronDown } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { mode, setMode, setCustomizeOpen, resolvedMode } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      {onMenuClick && (
        <button onClick={onMenuClick} className="md:hidden text-muted-foreground hover:text-foreground">
          <Menu className="h-5 w-5" />
        </button>
      )}

      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar clientes, pedidos..."
          className="w-full rounded-lg border border-input bg-muted/40 pl-9 pr-4 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:bg-background"
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:gap-2">
        {/* Theme toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              {resolvedMode === "dark" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Apariencia</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setMode("light")} className="gap-2 cursor-pointer">
              <Sun className="h-4 w-4" /> Claro
              {mode === "light" && <span className="ml-auto text-xs">●</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("dark")} className="gap-2 cursor-pointer">
              <Moon className="h-4 w-4" /> Oscuro
              {mode === "dark" && <span className="ml-auto text-xs">●</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setMode("system")} className="gap-2 cursor-pointer">
              <Monitor className="h-4 w-4" /> Sistema
              {mode === "system" && <span className="ml-auto text-xs">●</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Customize */}
        <button
          onClick={() => setCustomizeOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
        >
          <Settings2 className="h-[18px] w-[18px]" />
        </button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="text-sm font-semibold">Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="p-3 space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm font-medium leading-tight">Nuevo pedido #2048</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hace 5 minutos</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm font-medium leading-tight">Cliente registrado</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hace 1 hora</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500" />
                <div>
                  <p className="text-sm font-medium leading-tight">Stock bajo: Monitor LG 27"</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Hace 3 horas</p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="h-6 w-px bg-border mx-1 hidden md:block" />

        {/* User */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-accent transition-colors">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  AD
                </AvatarFallback>
              </Avatar>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold leading-tight">Admin</p>
                <p className="text-[11px] text-muted-foreground">Administrador</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="text-xs text-muted-foreground normal-case font-normal">
              admin@novastock.com
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm">Mi Perfil</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-sm">Configuración</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-sm text-destructive">Cerrar Sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
