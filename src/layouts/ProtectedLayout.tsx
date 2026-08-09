import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { UserRole } from "../types/database";

interface ProtectedLayoutProps {
  requiredRole?: UserRole;
}

export function ProtectedLayout({ requiredRole }: ProtectedLayoutProps) {
  const { currentUser, currentRole } = useApp();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login with return path
    return <Navigate to={`/auth/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // If a specific role is required for this route segment, check permissions
  if (requiredRole && currentRole !== requiredRole) {
    // Fallback redirect to appropriate default route for user's role
    if (currentRole === "owner") return <Navigate to="/owner/dashboard" replace />;
    if (currentRole === "broker") return <Navigate to="/broker/overview" replace />;
    return <Navigate to="/app/explore" replace />;
  }

  return <Outlet />;
}
