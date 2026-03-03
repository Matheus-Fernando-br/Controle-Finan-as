import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const nav = useNavigate();
  const { supabase, setRemember, remember } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      nav("/app/dashboard", { replace: true });
    } catch (e2) {
      setErr(e2.message || "Falha no login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ minHeight: "100vh", display:"grid", placeItems:"center" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* logo */}
        <div style={{ display:"grid", placeItems:"center", marginBottom: 14 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: "rgba(124,92,255,.35)", border: "1px solid rgba(124,92,255,.55)",
            display:"grid", placeItems:"center", fontWeight: 900, fontSize: 26
          }}>F</div>
          <div style={{ fontWeight: 900, marginTop: 10, fontSize: 20 }}>Finance Panel</div>
          <div className="muted" style={{ fontSize: 12 }}>Controle pessoal • lançamentos • cartões • metas</div>
        </div>

        {/* login */}
        <div className="card">
          <h2 style={{ marginBottom: 10 }}>Acesse sua conta</h2>

          <form onSubmit={handleLogin} className="grid">
            <div className="col-12">
              <label>Email</label>
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@..." />
            </div>

            <div className="col-12">
              <label>Senha</label>
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>

            <div className="col-12 row" style={{ alignItems: "center", justifyContent:"space-between" }}>
              <label style={{ display:"flex", alignItems:"center", gap:8 }}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Manter logado (localStorage)
              </label>

              <button className="btn primary" disabled={loading}>
                {loading ? "Entrando..." : "Login"}
              </button>
            </div>

            {err ? <div className="col-12" style={{ color: "var(--danger)" }}>{err}</div> : null}
          </form>
        </div>

        {/* preview */}
        <div style={{ marginTop: 12 }} className="card">
          <div style={{ fontWeight: 800 }}>👀 Ver prévia do sistema</div>
          <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>
            Acesse um modo de demonstração com dados fictícios e campos desativados.
          </div>
          <div style={{ marginTop: 10 }}>
            <button className="btn" onClick={() => nav("/preview")}>Abrir Preview</button>
          </div>
        </div>
      </div>
    </div>
  );
}