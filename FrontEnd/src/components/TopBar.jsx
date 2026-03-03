import React from "react";

export default function TopBar({ onMenu }) {
  return (
    <div className="row" style={{ alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
      <div className="row" style={{ alignItems: "center", gap: 10 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 12,
          background: "rgba(124,92,255,.35)", border: "1px solid rgba(124,92,255,.5)",
          display:"grid", placeItems:"center", fontWeight: 800
        }}>F</div>
        <div>
          <div style={{ fontWeight: 800 }}>Finance</div>
          <div className="muted" style={{ fontSize: 12 }}>Painel pessoal</div>
        </div>
      </div>

      <button className="btn ghost" onClick={onMenu} title="Menu">
        ⋮
      </button>
    </div>
  );
}