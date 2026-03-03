import React from "react";

export default function StatCard({ title, value, hint }) {
  return (
    <div className="card">
      <div className="muted" style={{ fontSize: 12 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: 900, marginTop: 6 }}>{value}</div>
      {hint ? <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>{hint}</div> : null}
    </div>
  );
}