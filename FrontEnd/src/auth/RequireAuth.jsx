import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div style={{ padding: 24 }}>Carregando…</div>;
  if (!user) return <Navigate to="/" replace state={{ from: loc.pathname }} />;
  return children;
}