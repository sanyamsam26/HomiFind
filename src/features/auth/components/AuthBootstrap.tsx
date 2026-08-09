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
      if (active) setCurrentUser(user ?? mapAuthUser(sessionUser));
    };

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      await applyUser(data.session?.user ?? null);

      if (!active || !data.session || location.pathname !== "/auth/callback" || redirecting) return;
      redirecting = true;
      try {
        const enabled = (await listWorkspaces()).filter((item) => item.is_active).map((item) => item.workspace);
        const preferred = enabled.includes("renter") ? "renter" : enabled[0];
        navigate(preferred ? workspaceHome(preferred) : "/choose-experience", { replace: true });
      } catch {
        navigate("/choose-experience", { replace: true });
      }
    };

    void bootstrap();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
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
    // setCurrentUser is a stable context action for this bootstrap lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navigate]);

  return null;
}
