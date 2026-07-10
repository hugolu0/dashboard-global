"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, ShoppingCart, BarChart3, Settings,
  ChevronLeft, Zap, Receipt, Package, Layers, Tag, Award,
  Globe2, MapPin, Map, LogOut, Building2,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Principal",
    items: [
      { label: "Dashboard",    href: "/",               icon: LayoutDashboard },
    ],
  },
  {
    label: "Operaciones",
    items: [
      { label: "Clientes",     href: "/clientes",       icon: Users },
      { label: "Pedidos",      href: "/pedidos",        icon: ShoppingCart },
      { label: "Ventas",       href: "/ventas",         icon: Receipt },
    ],
  },
  {
    label: "Catálogo",
    items: [
      { label: "Artículos",    href: "/articulos",      icon: Package },
      { label: "Rubros",       href: "/rubros",         icon: Layers },
      { label: "Sub-rubros",   href: "/subrubros",      icon: Tag },
      { label: "Marcas",       href: "/marcas",         icon: Award },
    ],
  },
  {
    label: "Geografía",
    items: [
      { label: "Provincias",   href: "/provincias",     icon: Globe2 },
      { label: "Localidades",  href: "/localidades",    icon: MapPin },
      { label: "Zonas",        href: "/zonas",          icon: Map },
    ],
  },
  {
    label: "Sistema",
    items: [
      { label: "Reportes",     href: "/reportes",       icon: BarChart3 },
      { label: "Configuración", href: "/configuracion", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { sidebarCollapsed, setSidebarCollapsed } = useTheme();
  const { profile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside
      className={cn(
        "sidebar-transition fixed left-0 top-0 z-40 flex h-screen flex-col",
        sidebarCollapsed ? "w-[72px]" : "w-[260px]"
      )}
      style={{ background: "hsl(var(--sidebar-bg))" }}
    >
      {/* Logo + empresa */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-4 border-b border-white/5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-lg"
          style={{ background: "hsl(var(--sidebar-active-bg))" }}
        >
          <Zap className="h-5 w-5" />
        </div>
        {!sidebarCollapsed && (
          <div className="min-w-0">
            <span className="text-white font-semibold text-sm tracking-tight block truncate">
              NovaStock
            </span>
            {profile?.empresa_nomb && (
              <span className="text-white/40 text-[11px] truncate block">{profile.empresa_nomb}</span>
            )}
          </div>
        )}
      </div>

      {/* Nav groups — scrollable */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-1">
            {!sidebarCollapsed && (
              <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/30">
                {group.label}
              </p>
            )}
            {sidebarCollapsed && <div className="my-1 border-t border-white/5" />}
            {group.items.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "text-white shadow-md"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                  style={active ? { background: "hsl(var(--sidebar-active-bg))" } : undefined}
                >
                  <Icon className="h-[17px] w-[17px] shrink-0" />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom: user info + logout + collapse */}
      <div className="shrink-0 border-t border-white/5 p-3 space-y-1">
        {/* User info */}
        {profile && (
          <div className={cn(
            "flex items-center gap-2.5 rounded-lg px-2.5 py-2 mb-1",
            sidebarCollapsed ? "justify-center" : ""
          )}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/70">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-xs font-medium text-white/80 truncate">{profile.usu_nomb}</p>
                <p className="text-[10px] text-white/40 truncate">{profile.empresa_nomb}</p>
              </div>
            )}
          </div>
        )}
        {/* Logout */}
        <button
          onClick={handleSignOut}
          title={sidebarCollapsed ? "Cerrar sesión" : undefined}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!sidebarCollapsed && <span>Cerrar sesión</span>}
        </button>
        {/* Collapse */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
          {!sidebarCollapsed && <span>Contraer</span>}
        </button>
      </div>
    </aside>
  );
}
