import React from "react";

export default function MenuDrawer({ open, onClose, onNavigate, onLogout }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: open ? "rgba(0,0,0,.45)" : "transparent",
        pointerEvents: open ? "auto" : "none",
        transition: "200ms",
        zIndex: 50
      }}
      onClick={onClose}
    >
      <div
        className="card"
        style={{
          width: 320, height: "100%",
          position: "absolute", right: 0, top: 0,
          transform: open ? "translateX(0)" : "translateX(110%)",
          transition: "200ms",
          borderRadius: 0
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Menu</h3>
        <div className="muted" style={{ marginBottom: 12 }}>Navegação</div>

        <div className="row" style={{ flexDirection: "column" }}>
          <button className="btn" onClick={() => onNavigate("/app/dashboard")}>📊 Dashboard</button>
          <button className="btn" onClick={() => onNavigate("/app/launch")}>➕ Lançar</button>
          <button className="btn" onClick={() => onNavigate("/app/history")}>🧾 Histórico</button>
          <button className="btn" onClick={() => onNavigate("/app/cards")}>💳 Cartões</button>
          <button className="btn" onClick={() => onNavigate("/app/investments")}>📈 Investimentos</button>
          <button className="btn" onClick={() => onNavigate("/app/settings")}>⚙️ Configurações</button>

          <div style={{ height: 10 }} />
          <button className="btn danger" onClick={onLogout}>🚪 Sair</button>
        </div>
      </div>
    </div>
  );
}