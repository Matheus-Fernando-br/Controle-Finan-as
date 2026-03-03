import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../app/api";

export default function Launch() {
  const { token } = useAuth();
  const [cfg, setCfg] = useState({ categories: [], cost_centers: [], accounts: [], cards: [] });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0,10),
    description: "",
    nature: "EXPENSE",
    amount: "",
    account_id: "",
    card_id: "",
    category_id: "",
    cost_center_id: "",
    notes: ""
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await apiFetch("/api/configs", { token });
      setCfg(data);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
  }, [token]);

  const isCredit = (() => {
    const acc = cfg.accounts.find(a => a.id === form.account_id);
    return acc?.type === "CARD";
  })();

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const payload = {
        ...form,
        amount: Number(String(form.amount).replace(",", ".")) || 0,
        card_id: isCredit ? form.card_id : null
      };
      await apiFetch("/api/transactions", { token, method: "POST", body: payload });
      setMsg("✅ Lançamento criado.");
      setForm((p) => ({ ...p, description: "", amount: "", notes: "" }));
    } catch (e2) {
      setMsg("❌ " + e2.message);
    }
  }

  if (loading) return <div className="card">Carregando…</div>;

  return (
    <div className="card">
      <h2>➕ Lançar</h2>
      <div className="muted">Lançamento por compra</div>

      <form onSubmit={submit} className="grid" style={{ marginTop: 12 }}>
        <div className="col-3">
          <label>Data</label>
          <input className="input" type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} />
        </div>

        <div className="col-6">
          <label>Descrição</label>
          <input className="input" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} placeholder="Ex: Mercado, Uber..." />
        </div>

        <div className="col-3">
          <label>Valor (R$)</label>
          <input className="input" value={form.amount} onChange={(e)=>setForm({...form, amount:e.target.value})} placeholder="Ex: 150,90" />
        </div>

        <div className="col-3">
          <label>Natureza</label>
          <select className="input" value={form.nature} onChange={(e)=>setForm({...form, nature:e.target.value})}>
            <option value="EXPENSE">Saída</option>
            <option value="INCOME">Entrada</option>
          </select>
        </div>

        <div className="col-3">
          <label>Conta</label>
          <select className="input" value={form.account_id} onChange={(e)=>setForm({...form, account_id:e.target.value, card_id:""})}>
            <option value="">Selecione</option>
            {cfg.accounts.filter(a=>a.active).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div className="col-3">
          <label>Cartão</label>
          <select className="input" value={form.card_id} onChange={(e)=>setForm({...form, card_id:e.target.value})} disabled={!isCredit}>
            <option value="">{isCredit ? "Selecione" : "Somente se Conta=Cartão"}</option>
            {cfg.cards.filter(c=>c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="col-3">
          <label>Categoria</label>
          <select className="input" value={form.category_id} onChange={(e)=>setForm({...form, category_id:e.target.value})}>
            <option value="">Selecione</option>
            {cfg.categories.filter(c=>c.active).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="col-6">
          <label>Centro de custo</label>
          <select className="input" value={form.cost_center_id} onChange={(e)=>setForm({...form, cost_center_id:e.target.value})}>
            <option value="">Selecione</option>
            {cfg.cost_centers.filter(cc=>cc.active).map(cc => <option key={cc.id} value={cc.id}>{cc.name}</option>)}
          </select>
        </div>

        <div className="col-6">
          <label>Obs</label>
          <input className="input" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})} placeholder="Opcional" />
        </div>

        <div className="col-12 row" style={{ justifyContent:"space-between", alignItems:"center" }}>
          <button className="btn primary">Salvar</button>
          {msg ? <div>{msg}</div> : null}
        </div>
      </form>
    </div>
  );
}