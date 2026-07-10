"use client";

import React from "react";
import { CheckCircle2, Clock, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface BadgeEstadoProps {
  estado: "Pendiente" | "Procesado";
  className?: string;
}

export function BadgeEstado({ estado, className }: BadgeEstadoProps) {
  const isPendiente = estado === "Pendiente";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
        isPendiente
          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        className
      )}
    >
      {isPendiente ? (
        <Clock className="h-3 w-3" />
      ) : (
        <CheckCircle2 className="h-3 w-3" />
      )}
      {estado}
    </span>
  );
}

interface BadgePagoProps {
  forma: string;
  className?: string;
}

export function BadgePago({ forma, className }: BadgePagoProps) {
  const styles: Record<string, string> = {
    "Contado":          "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    "Cuenta Corriente": "bg-violet-500/10 text-violet-600 dark:text-violet-400",
    "Cheque":           "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "Transferencia":    "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium", styles[forma] || "bg-muted text-muted-foreground", className)}>
      {forma}
    </span>
  );
}
