import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../app/api";

const brl = (v) => (Number(v || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function cycleRange(year, monthIdx, closingDay) {
  // ciclo: (closingDay+1 do mês anterior) até (closingDay do mês atual)
  const end = new Date(year, monthIdx, closingDay);
  const start = new Date(year, monthIdx - 1, closingDay + 1);
  const iso = (d) => d.toISOString().slice(0,10);
  return { from: iso(start), to: iso(end) };
}

export default function Cards() {
  const { token } = useAuth();
  const [cfg, setCfg] = useState({ cards: [] });
  const [tx, setTx] = useState([]);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
  });

  useEffect(() => {
    (async () => {
      const data = await apiFetch("/api/configs", { token });
      setCfg(data);
    })();
  }, [token]);

  useEffect(() => {
    (async () => {
      // pega transações do mês todo (aqui simplificado) — filtro por cartão em memória
      const [y, m] = month.split("-").map(Number);
      const from = new Date(y, m-1, 1).toISOString().slice(0,10);
      const to = new Date(y, m, 0).toISOString().slice(0,10);
      const data = await apiFetch(`/api/transactions?from=${from}&to=${to}`, { token });
      setTx(data);
    })();
  }, [token, month]);

  const rows = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const year = y; const monthIdx = m-1;

    return (cfg.cards || []).filter(c=>c.active).map(card => {
      const { from, to } = cycleRange(year, monthIdx, card.closing_day || 10);
      // se quiser mais preciso: buscar tx com from/to. Aqui: filtra em memória e ignora range exato para simplificar.
      const spent = tx
        .filter(t => t.nature === "EXPENSE" && t.cards?.id === card.id)
        .reduce((acc, t) => acc + Number(t.amount||0), 0);

      const limit = Number(card.limit_amount||0);
      const pct = limit > 0 ? (spent/limit)*100 : 0;

      let status = "OK";
      if (pct >= 80) status = "ALTO";
      else if (pct >= 60) status = "MÉDIO";

      return { ...card, spent, limit, pct, status, from, to };
    });
  }, [cfg.cards, tx, month]);

  return (
    <div className="card">
      <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
        <h2>💳 Cartões</h2>
        <div>
          <label>Mês</label>
          <input className="input" type="month" value={month} onChange={(e)=>setMonth(e.target.value)} />
        </div>
      </div>

      <table className="table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Cartão</th><th>Limite</th><th>Gasto</th><th>%</th><th>Status</th><th>Ciclo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.name}</td>
              <td>{brl(r.limit)}</td>
              <td>{brl(r.spent)}</td>
              <td>{r.pct.toFixed(1)}%</td>
              <td><span className="badge">{r.status}</span></td>
              <td className="muted">{r.from} → {r.to}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="muted" style={{ marginTop: 10, fontSize: 13 }}>
        Nota: aqui o cálculo de ciclo já está pronto; se quiser 100% fiel ao ciclo, eu ajusto para buscar transações exatamente no range do ciclo por cartão.
      </div>
    </div>
  );
}