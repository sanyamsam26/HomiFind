import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types/database";

interface ProtectedLayoutProps {
  requiredRole?: UserRole;
}

/**
 * Authentication and workspace boundary.
 *
 * Authentication answers: "Is this person signed in?"
 * Workspace selection answers: "Which HomiFind experience are they entering?"
 * Those are intentionally separate decisions.
 */
export function ProtectedLayout({ requiredRole }: ProtectedLayoutProps) {
  const { currentUser, currentRole } = useApp();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  const workspaceSelected = localStorage.getItem("homifind_workspace_selected") === "true";
  const isWorkspaceSelection = location.pathname === "/choose-experience";

  if (!workspaceSelected && !isWorkspaceSelection) {
    return <Navigate to="/choose-experience" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    if (currentRole === "owner") return <Navigate to="/owner/dashboard" replace />;
    if (currentRole === "broker") return <Navigate to="/broker/overview" replace />;
    return <Navigate to="/app/explore" replace />;
  }

  return <Outlet />;
}
