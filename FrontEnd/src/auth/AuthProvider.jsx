import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { makeSupabase } from "../app/supabaseClient";
import { getStorage } from "../app/storage";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const rememberPref = (localStorage.getItem("remember_me") ?? "true") === "true";
  const [remember, setRemember] = useState(rememberPref);

  const supabase = useMemo(() => makeSupabase(getStorage(remember)), [remember]);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  const value = {
    supabase,
    session,
    user: session?.user ?? null,
    token: session?.access_token ?? null,
    loading,
    remember,
    setRemember: (v) => {
      setRemember(v);
      localStorage.setItem("remember_me", String(v));
    }
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}