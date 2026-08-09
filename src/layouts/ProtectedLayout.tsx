import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types/database";
import { listWorkspaces } from "../services/workspace-service";
import { LoadingPage } from "../pages/system/LoadingPage";

interface ProtectedLayoutProps {
  requiredRole?: UserRole;
}

/** Authentication and workspace boundary. Workspace state comes from the backend, not localStorage. */
export function ProtectedLayout({ requiredRole }: ProtectedLayoutProps) {
  const { currentUser, currentRole } = useApp();
  const location = useLocation();
  const [workspaceState, setWorkspaceState] = useState<{ loading: boolean; enabled: UserRole[] }>({ loading: true, enabled: [] });

  useEffect(() => {
    let active = true;
    if (!currentUser) {
      setWorkspaceState({ loading: false, enabled: [] });
      return () => { active = false; };
    }

    setWorkspaceState((previous) => ({ ...previous, loading: true }));
    void listWorkspaces()
      .then((records) => {
        if (active) setWorkspaceState({ loading: false, enabled: records.filter((record) => record.is_active).map((record) => record.workspace) });
      })
      .catch(() => {
        if (active) setWorkspaceState({ loading: false, enabled: [] });
      });

    return () => { active = false; };
  }, [currentUser?.id]);

  if (!currentUser) {
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (workspaceState.loading) return <LoadingPage />;

  const isWorkspaceSelection = location.pathname === "/choose-experience";
  const hasWorkspace = workspaceState.enabled.length > 0;

  if (!hasWorkspace && !isWorkspaceSelection) {
    return <Navigate to="/choose-experience" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && !workspaceState.enabled.includes(requiredRole)) {
    return <Navigate to="/choose-experience" replace />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    return <Navigate to="/choose-experience" replace />;
  }

  return <Outlet />;
}
