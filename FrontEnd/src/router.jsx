import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Preview from "./pages/Preview";
import Dashboard from "./pages/Dashboard";
import Launch from "./pages/Launch";
import History from "./pages/History";
import Cards from "./pages/Cards";
import Investments from "./pages/Investments";
import Settings from "./pages/Settings";
import RequireAuth from "./auth/RequireAuth";
import AppShell from "./components/AppShell";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/preview", element: <Preview /> },

  {
    path: "/app",
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { path: "dashboard", element: <Dashboard /> },
      { path: "launch", element: <Launch /> },
      { path: "history", element: <History /> },
      { path: "cards", element: <Cards /> },
      { path: "investments", element: <Investments /> },
      { path: "settings", element: <Settings /> }
    ]
  }
]);