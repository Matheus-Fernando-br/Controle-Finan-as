import React, { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../app/api";

const brl = (v) => (Number(v || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Dashboard() {
  const { token } = useAuth();
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [from, setFrom] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0,10));
  const [to, setTo] = useState(() => new Date().toISOString().slice(0,10));

  useEffect(() => {
    async function load() {
      setLoading(true); setErr("");
      try {
        const data = await apiFetch(`/api/transactions?from=${from}&to=${to}`, { token });
        setTx(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token, from, to]);

  const stats = useMemo(() => {
    let income = 0, expense = 0, fixed = 0, variable = 0, credit = 0;
    for (const t of tx) {
      const amt = Number(t.amount || 0);
      if (t.nature === "INCOME") income += amt;
      else expense += amt;

      const kind = t.categories?.kind; // FIXED / VARIABLE
      if (t.nature === "EXPENSE" && kind === "FIXED") fixed += amt;
      if (t.nature === "EXPENSE" && kind === "VARIABLE") variable += amt;

      if (t.nature === "EXPENSE" && t.cards?.id) credit += amt;
    }
    const saldo = income - expense;
    const economiaPct = income > 0 ? (saldo / income) * 100 : 0;
    const compromet = income > 0 ? (fixed / income) * 100 : 0;
    return { income, expense, saldo, economiaPct, fixed, variable, credit, compromet };
  }, [tx]);

  return (
    <div className="grid">
      <div className="col-12 card">
        <h2>Dashboard</h2>
        <div className="muted">Filtre o período</div>

        <div className="row" style={{ marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <label>De</label>
            <input className="input" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label>Até</label>
            <input className="input" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>

        {err ? <div style={{ color: "var(--danger)", marginTop: 10 }}>{err}</div> : null}
        {loading ? <div style={{ marginTop: 10 }}>Carregando…</div> : null}
      </div>

      <div className="col-3"><StatCard title="Receita" value={brl(stats.income)} hint="no período" /></div>
      <div className="col-3"><StatCard title="Despesa" value={brl(stats.expense)} hint="no período" /></div>
      <div className="col-3"><StatCard title="Saldo" value={brl(stats.saldo)} hint={`Economia: ${stats.economiaPct.toFixed(1)}%`} /></div>
      <div className="col-3"><StatCard title="Crédito" value={brl(stats.credit)} hint={`Fixos: ${stats.compromet.toFixed(1)}% da receita`} /></div>

      <div className="col-12 card">
        <h3>Resumo rápido</h3>
        <div className="row">
          <span className="badge">Fixos: {brl(stats.fixed)}</span>
          <span className="badge">Variáveis: {brl(stats.variable)}</span>
          <span className="badge">Comprometimento: {stats.compromet.toFixed(1)}%</span>
        </div>
        <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
          (Gráficos você pode evoluir depois — aqui deixei a base de KPIs pronta e confiável.)
        </div>
      </div>
    </div>
  );
}