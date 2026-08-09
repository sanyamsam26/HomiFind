import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { mapAuthUser } from "../../../services/auth-service";
import { syncBackendProfile } from "../../../services/backend-api";
import { supabase } from "../../../lib/supabase";

export function AuthBootstrap() {
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    const applySession = async (sessionUser: Parameters<typeof mapAuthUser>[0] | null) => {
      if (!sessionUser) {
        if (active) setCurrentUser(null);
        return;
      }
      if (active) setCurrentUser(mapAuthUser(sessionUser));
      try { await syncBackendProfile(); }
      catch (error) { console.warn("HomiFind backend profile sync unavailable", error); }
    };

    supabase.auth.getUser().then(({ data }) => { void applySession(data.user); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { void applySession(session?.user ?? null); });
    if (window.location.pathname === "/auth/callback") navigate("/choose-experience", { replace: true });

    return () => { active = false; listener.subscription.unsubscribe(); };
    // setCurrentUser is an action supplied by AppProvider and intentionally excluded from effect identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return null;
}
