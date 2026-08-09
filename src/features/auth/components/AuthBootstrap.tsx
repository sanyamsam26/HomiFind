import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { getSessionUser, mapAuthUser } from "../../../services/auth-service";
import { supabase } from "../../../lib/supabase";
import { listWorkspaces, workspaceHome } from "../../../services/workspace-service";

export function AuthBootstrap() {
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user ?? null;

      if (!sessionUser) {
        if (active) setCurrentUser(null);
        return;
      }

      const user = await getSessionUser();
      if (!active) return;

      setCurrentUser(user ?? mapAuthUser(sessionUser));

      if (window.location.pathname !== "/auth/callback") return;

      try {
        const enabled = (await listWorkspaces())
          .filter((item) => item.is_active)
          .map((item) => item.workspace);
        if (!active) return;

        const preferred = enabled.includes("renter") ? "renter" : enabled[0];
        navigate(preferred ? workspaceHome(preferred) : "/choose-experience", { replace: true });
      } catch {
        if (active) navigate("/choose-experience", { replace: true });
      }
    };

    void bootstrap();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;

      if (event === "SIGNED_OUT") {
        setCurrentUser(null);
        return;
      }

      // Login/signup flows already synchronize the backend profile. Do not call
      // /auth/sync again for every auth-state event or route change.
      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && session?.user) {
        setCurrentUser(mapAuthUser(session.user));
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
    // This is a single application-level auth bootstrap lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
