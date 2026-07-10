"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Zap, User, Lock, AlertCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [usu_nomb, setUsuNomb] = useState("");
  const [usu_clav, setUsuClav] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usu_nomb.trim() || !usu_clav.trim()) {
      setError("Ingresá tu usuario y contraseña.");
      return;
    }
    setLoading(true);
    setError(null);
    const err = await signIn(usu_nomb.trim(), usu_clav.trim());
    if (err) {
      setError("Usuario o contraseña incorrectos.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Background decorative blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "hsl(var(--chart-1))" }}
        />
        <div
          className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "hsl(var(--chart-2))" }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-card shadow-2xl shadow-black/10 overflow-hidden">
          {/* Header stripe */}
          <div
            className="px-8 py-8 text-white"
            style={{ background: "hsl(var(--sidebar-bg))" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: "hsl(var(--sidebar-active-bg))" }}
              >
                <Zap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">NovaStock</span>
            </div>
            <h1 className="text-2xl font-bold mb-1">Iniciar sesión</h1>
            <p className="text-white/60 text-sm">
              Ingresá con tu usuario y contraseña para acceder a tu empresa.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* usu_nomb */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="h-3.5 w-3.5" /> usu_nomb
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoComplete="username"
                  placeholder="Nombre de usuario"
                  value={usu_nomb}
                  onChange={(e) => setUsuNomb(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-input bg-muted/40 px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* usu_clav */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <Lock className="h-3.5 w-3.5" /> usu_clav
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Contraseña"
                  value={usu_clav}
                  onChange={(e) => setUsuClav(e.target.value)}
                  disabled={loading}
                  className="w-full rounded-xl border border-input bg-muted/40 px-4 py-3 pr-12 text-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-ring focus:bg-background focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60 hover:opacity-90 active:scale-[0.98]"
              style={{ background: "hsl(var(--sidebar-bg))" }}
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Ingresando...</>
              ) : (
                "Ingresar"
              )}
            </button>

            <p className="text-center text-xs text-muted-foreground pt-1">
              Cada empresa accede con sus propias credenciales y datos.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
