import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../app/api";

const brl = (v) => (Number(v || 0)).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function History() {
  const { token } = useAuth();
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true); setErr("");
    try {
      const data = await apiFetch("/api/transactions", { token });
      setRows(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm("Excluir lançamento?")) return;
    await apiFetch(`/api/transactions/${id}`, { token, method: "DELETE" });
    load();
  }

  return (
    <div className="card">
      <div className="row" style={{ justifyContent:"space-between", alignItems:"center" }}>
        <h2>🧾 Histórico</h2>
        <button className="btn" onClick={load}>Atualizar</button>
      </div>
      {err ? <div style={{ color:"var(--danger)" }}>{err}</div> : null}
      {loading ? <div>Carregando…</div> : null}

      <table className="table" style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Data</th><th>Descrição</th><th>Categoria</th><th>Conta</th><th>Valor</th><th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.date}</td>
              <td>{r.description}</td>
              <td>{r.categories?.name ?? "-"}</td>
              <td>{r.accounts?.name ?? "-"}</td>
              <td>{r.nature === "INCOME" ? "＋" : "−"} {brl(r.amount)}</td>
              <td><button className="btn danger" onClick={()=>remove(r.id)}>Excluir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}