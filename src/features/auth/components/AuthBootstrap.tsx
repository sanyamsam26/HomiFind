import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { getSessionUser, mapAuthUser } from "../../../services/auth-service";
import { supabase } from "../../../lib/supabase";
import { listWorkspaces, workspaceHome } from "../../../services/workspace-service";

export function AuthBootstrap() {
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let active = true;
    let redirecting = false;

    const applyUser = async (sessionUser: Parameters<typeof mapAuthUser>[0] | null) => {
      if (!sessionUser) {
        if (active) setCurrentUser(null);
        return;
      }

      const user = await getSessionUser();
      if (!active) return;
      setCurrentUser(user ?? mapAuthUser(sessionUser));
    };

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      await applyUser(data.session?.user ?? null);

      if (!active || !data.session || location.pathname !== "/auth/callback" || redirecting) return;
      redirecting = true;

      try {
        const workspaces = await listWorkspaces();
        const enabled = workspaces.filter((item) => item.is_active).map((item) => item.workspace);
        if (enabled.length === 0) {
          navigate("/choose-experience", { replace: true });
        } else {
          const preferred = enabled.includes("renter") ? "renter" : enabled[0];
          navigate(workspaceHome(preferred), { replace: true });
        }
      } catch {
        navigate("/choose-experience", { replace: true });
      }
    };

    void bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      // Supabase can emit INITIAL_SESSION before bootstrap finishes; don't navigate twice.
      if (event === "SIGNED_OUT") {
        if (active) setCurrentUser(null);
        return;
      }
      void applyUser(session?.user ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [location.pathname, navigate, setCurrentUser]);

  return null;
}
