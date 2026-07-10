"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ColorPreset = "orange" | "blue" | "green" | "rose" | "slate";
type ThemeMode = "light" | "dark" | "system";
type Density = "compact" | "default" | "comfortable";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  color: ColorPreset;
  setColor: (c: ColorPreset) => void;
  density: Density;
  setDensity: (d: Density) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  customizeOpen: boolean;
  setCustomizeOpen: (v: boolean) => void;
  resolvedMode: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

const COLOR_VARS: Record<ColorPreset, { primary: string; ring: string }> = {
  orange: { primary: "24 95% 48%", ring: "24 95% 48%" },
  blue:   { primary: "217 91% 52%", ring: "217 91% 52%" },
  green:  { primary: "142 71% 38%", ring: "142 71% 38%" },
  rose:   { primary: "346 87% 53%", ring: "346 87% 53%" },
  slate:  { primary: "215 25% 35%", ring: "215 25% 35%" },
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("light");
  const [color, setColorState] = useState<ColorPreset>("orange");
  const [density, setDensityState] = useState<Density>("default");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [customizeOpen, setCustomizeOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mql.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const resolvedMode: "light" | "dark" =
    mode === "system" ? (systemDark ? "dark" : "light") : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [resolvedMode]);

  useEffect(() => {
    const root = document.documentElement;
    const vars = COLOR_VARS[color];
    root.style.setProperty("--primary", vars.primary);
    root.style.setProperty("--ring", vars.ring);
    root.style.setProperty("--sidebar-active-bg", vars.primary);
    root.style.setProperty("--chart-1", vars.primary);
  }, [color]);

  const setMode = (m: ThemeMode) => setModeState(m);
  const setColor = (c: ColorPreset) => setColorState(c);
  const setDensity = (d: Density) => setDensityState(d);

  return (
    <ThemeContext.Provider
      value={{
        mode, setMode,
        color, setColor,
        density, setDensity,
        sidebarCollapsed, setSidebarCollapsed,
        customizeOpen, setCustomizeOpen,
        resolvedMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
