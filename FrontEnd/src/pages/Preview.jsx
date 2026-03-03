import React from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";

export default function Preview() {
  const nav = useNavigate();

  return (
    <div className="container">
      <div className="row" style={{ alignItems:"center", justifyContent:"space-between" }}>
        <h2>Preview (Demonstração)</h2>
        <button className="btn" onClick={() => nav("/")}>⬅ Voltar</button>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <div className="col-3"><StatCard title="Receita" value="R$ 6.200,00" hint="últimos 30 dias" /></div>
        <div className="col-3"><StatCard title="Despesa" value="R$ 4.150,00" hint="últimos 30 dias" /></div>
        <div className="col-3"><StatCard title="Saldo" value="R$ 2.050,00" hint="% economia: 33%" /></div>
        <div className="col-3"><StatCard title="Cartão" value="R$ 1.240,00" hint="56% do limite" /></div>

        <div className="col-12 card">
          <h3>Lançar (desativado)</h3>
          <div className="grid">
            <div className="col-3">
              <label>Data</label>
              <input className="input" disabled value="2026-03-03" />
            </div>
            <div className="col-6">
              <label>Descrição</label>
              <input className="input" disabled value="Mercado (exemplo)" />
            </div>
            <div className="col-3">
              <label>Valor</label>
              <input className="input" disabled value="150,90" />
            </div>

            <div className="col-3">
              <label>Natureza</label>
              <select disabled className="input"><option>Saída</option></select>
            </div>
            <div className="col-3">
              <label>Conta</label>
              <select disabled className="input"><option>Crédito</option></select>
            </div>
            <div className="col-3">
              <label>Cartão</label>
              <select disabled className="input"><option>Nubank</option></select>
            </div>
            <div className="col-3">
              <label>Categoria</label>
              <select disabled className="input"><option>Alimentação</option></select>
            </div>

            <div className="col-6">
              <label>Centro de Custo</label>
              <select disabled className="input"><option>Casa</option></select>
            </div>
            <div className="col-6">
              <label>Observação</label>
              <input className="input" disabled value="Campos desativados no preview" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}