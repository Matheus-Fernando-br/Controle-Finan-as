import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiFetch } from "../app/api";

function Section({ title, children }) {
  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}

export default function Settings() {
  const { token } = useAuth();
  const [cfg, setCfg] = useState({ categories: [], cost_centers: [], accounts: [], cards: [] });
  const [msg, setMsg] = useState("");

  async function load() {
    const data = await apiFetch("/api/configs", { token });
    setCfg(data);
  }

  useEffect(() => { load(); }, []);

  async function create(path, body) {
    setMsg("");
    await apiFetch(`/api/configs/${path}`, { token, method: "POST", body });
    setMsg("✅ Criado.");
    load();
  }

  async function remove(path, id) {
    if (!confirm("Excluir?")) return;
    setMsg("");
    await apiFetch(`/api/configs/${path}/${id}`, { token, method: "DELETE" });
    setMsg("✅ Excluído.");
    load();
  }

  return (
    <div>
      <h2>⚙️ Configurações</h2>
      {msg ? <div style={{ margin: "10px 0" }}>{msg}</div> : null}

      <Section title="Categorias">
        <AddCategory onCreate={(payload) => create("categories", payload)} />
        <List items={cfg.categories} onDelete={(id)=>remove("categories", id)} />
      </Section>

      <Section title="Centros de custo">
        <AddSimple label="Nome" onCreate={(name)=>create("cost-centers", { name })} />
        <List items={cfg.cost_centers} onDelete={(id)=>remove("cost-centers", id)} />
      </Section>

      <Section title="Contas">
        <AddAccount onCreate={(payload)=>create("accounts", payload)} />
        <List items={cfg.accounts} onDelete={(id)=>remove("accounts", id)} />
      </Section>

      <Section title="Cartões">
        <AddCard onCreate={(payload)=>create("cards", payload)} />
        <List items={cfg.cards} onDelete={(id)=>remove("cards", id)} />
      </Section>
    </div>
  );
}

function List({ items, onDelete }) {
  return (
    <table className="table" style={{ marginTop: 10 }}>
      <thead><tr><th>Nome</th><th>Ativo</th><th></th></tr></thead>
      <tbody>
        {(items || []).map(i => (
          <tr key={i.id}>
            <td>{i.name}</td>
            <td>{String(i.active)}</td>
            <td><button className="btn danger" onClick={()=>onDelete(i.id)}>Excluir</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AddSimple({ label, onCreate }) {
  const [name, setName] = useState("");
  return (
    <div className="row">
      <div style={{ flex: 1 }}>
        <label>{label}</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
      <div style={{ display:"grid", alignItems:"end" }}>
        <button className="btn primary" onClick={()=>{ if(!name) return; onCreate(name); setName(""); }}>Adicionar</button>
      </div>
    </div>
  );
}

function AddCategory({ onCreate }) {
  const [name, setName] = useState("");
  const [nature, setNature] = useState("EXPENSE");
  const [kind, setKind] = useState("VARIABLE");

  return (
    <div className="grid">
      <div className="col-6">
        <label>Nome</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
      <div className="col-3">
        <label>Natureza</label>
        <select className="input" value={nature} onChange={(e)=>setNature(e.target.value)}>
          <option value="EXPENSE">Saída</option>
          <option value="INCOME">Entrada</option>
        </select>
      </div>
      <div className="col-3">
        <label>Tipo</label>
        <select className="input" value={kind} onChange={(e)=>setKind(e.target.value)}>
          <option value="FIXED">Fixo</option>
          <option value="VARIABLE">Variável</option>
        </select>
      </div>
      <div className="col-12">
        <button className="btn primary" onClick={()=>{ if(!name) return; onCreate({ name, nature, kind }); setName(""); }}>
          Adicionar categoria
        </button>
      </div>
    </div>
  );
}

function AddAccount({ onCreate }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("BANK");
  return (
    <div className="row">
      <div style={{ flex: 2 }}>
        <label>Nome</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
      <div style={{ flex: 1 }}>
        <label>Tipo</label>
        <select className="input" value={type} onChange={(e)=>setType(e.target.value)}>
          <option value="CASH">Dinheiro</option>
          <option value="BANK">Banco/Pix</option>
          <option value="CARD">Cartão</option>
        </select>
      </div>
      <div style={{ display:"grid", alignItems:"end" }}>
        <button className="btn primary" onClick={()=>{ if(!name) return; onCreate({ name, type }); setName(""); }}>
          Adicionar
        </button>
      </div>
    </div>
  );
}

function AddCard({ onCreate }) {
  const [name, setName] = useState("");
  const [limit_amount, setLimit] = useState("0");
  const [closing_day, setClose] = useState("10");
  const [due_day, setDue] = useState("17");

  return (
    <div className="grid">
      <div className="col-4">
        <label>Nome</label>
        <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
      </div>
      <div className="col-3">
        <label>Limite</label>
        <input className="input" value={limit_amount} onChange={(e)=>setLimit(e.target.value)} />
      </div>
      <div className="col-2">
        <label>Fechamento</label>
        <input className="input" value={closing_day} onChange={(e)=>setClose(e.target.value)} />
      </div>
      <div className="col-2">
        <label>Vencimento</label>
        <input className="input" value={due_day} onChange={(e)=>setDue(e.target.value)} />
      </div>
      <div className="col-12">
        <button className="btn primary" onClick={()=>{
          if(!name) return;
          onCreate({
            name,
            limit_amount: Number(String(limit_amount).replace(",", ".")) || 0,
            closing_day: Number(closing_day) || 10,
            due_day: Number(due_day) || 17
          });
          setName("");
        }}>
          Adicionar cartão
        </button>
      </div>
    </div>
  );
}