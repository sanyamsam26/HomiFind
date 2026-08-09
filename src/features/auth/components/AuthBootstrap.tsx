import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { mapAuthUser } from "../../../services/auth-service";
import { supabase } from "../../../lib/supabase";
import { listWorkspaces, workspaceHome } from "../../../services/workspace-service";

export function AuthBootstrap() {
  const { setCurrentUser, currentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectingRef = useRef(false);

  // AuthBootstrap is only responsible for reflecting Supabase auth state in
  // AppContext. It must NOT call getSessionUser()/auth-sync here because
  // AppContext already performs the backend profile sync during hydration.
  useEffect(() => {
    let active = true;

    const applySession = (sessionUser: Parameters<typeof mapAuthUser>[0] | null) => {
      if (!active) return;
      setCurrentUser(sessionUser ? mapAuthUser(sessionUser) : null);
    };

    void supabase.auth.getSession().then(({ data }) => {
      applySession(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        applySession(null);
        return;
      }
      applySession(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [setCurrentUser]);

  // Handle OAuth callback navigation exactly once. Do not re-run auth sync
  // when the route changes; the workspace selection page owns workspace setup.
  useEffect(() => {
    if (location.pathname !== "/auth/callback" || !currentUser || redirectingRef.current) return;

    redirectingRef.current = true;
    let active = true;

    void listWorkspaces()
      .then((records) => {
        if (!active) return;
        const enabled = records.filter((item) => item.is_active).map((item) => item.workspace);
        const preferred = enabled.includes("renter") ? "renter" : enabled[0];
        navigate(preferred ? workspaceHome(preferred) : "/choose-experience", { replace: true });
      })
      .catch(() => {
        if (active) navigate("/choose-experience", { replace: true });
      });

    return () => {
      active = false;
    };
  }, [currentUser, location.pathname, navigate]);

  return null;
}
