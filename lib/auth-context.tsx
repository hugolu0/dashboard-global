"use client";

import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export interface EmpresaProfile {
  empresa_id:   string;
  empresa_nomb: string;
  api_url:      string;
  api_key:      string | null;
  usu_nomb:     string;
  usu_desc:     string | null;
}

interface AuthContextValue {
  session:  Session | null;
  profile:  EmpresaProfile | null;
  loading:  boolean;
  signIn:   (usu_nomb: string, password: string) => Promise<string | null>;
  signOut:  () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null, profile: null, loading: true,
  signIn: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession]   = useState<Session | null>(null);
  const [profile, setProfile]   = useState<EmpresaProfile | null>(null);
  const [loading, setLoading]   = useState(true);

  const loadProfile = useCallback(async (uid: string) => {
    const { data, error } = await supabase
      .from("usuarios")
      .select(`
        usu_nomb,
        usu_desc,
        empresa_id,
        empresas ( empresa_nomb, api_url, api_key )
      `)
      .eq("auth_uid", uid)
      .maybeSingle();

    if (error || !data) { setProfile(null); return; }
    const emp = data.empresas as any;
    setProfile({
      empresa_id:   data.empresa_id,
      empresa_nomb: emp?.empresa_nomb ?? "",
      api_url:      emp?.api_url ?? "",
      api_key:      emp?.api_key ?? null,
      usu_nomb:     data.usu_nomb,
      usu_desc:     data.usu_desc ?? null,
    });
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        (async () => {
          await loadProfile(session.user.id);
          setLoading(false);
        })();
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        (async () => {
          if (newSession) {
            await loadProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        })();
      }
    );
    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const signIn = async (usu_nomb: string, password: string): Promise<string | null> => {
    // usu_nomb is used as the email in Supabase Auth (we store it as email@novastock.local)
    const email = `${usu_nomb.trim().toLowerCase()}@novastock.local`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;
    if (data.session) await loadProfile(data.session.user.id);
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
