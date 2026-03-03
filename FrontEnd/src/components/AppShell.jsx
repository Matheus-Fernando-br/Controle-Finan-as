import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import MenuDrawer from "./MenuDrawer";
import { useAuth } from "../auth/AuthProvider";

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { supabase } = useAuth();

  async function logout() {
    await supabase.auth.signOut();
    nav("/", { replace: true });
  }

  return (
    <div className="container">
      <TopBar onMenu={() => setOpen(true)} />
      <MenuDrawer
        open={open}
        onClose={() => setOpen(false)}
        onNavigate={(path) => { setOpen(false); nav(path); }}
        onLogout={logout}
      />
      <Outlet />
    </div>
  );
}