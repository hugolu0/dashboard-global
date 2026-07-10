"use client";

import React from "react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function ChartCard({
  title, description, icon: Icon, action, className, children,
}: ChartCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>
      <div className="flex items-start justify-between p-5 pb-3">
        <div className="flex items-start gap-2.5">
          {Icon && (
            <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold leading-tight">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
          </div>
        </div>
        {action}
      </div>
      <div className="px-3 pb-4">{children}</div>
    </div>
  );
}
