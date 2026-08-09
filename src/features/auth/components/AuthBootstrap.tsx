import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../../context/AppContext";
import { mapAuthUser } from "../../../services/auth-service";
import { supabase } from "../../../lib/supabase";

export function AuthBootstrap() {
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (active && data.user) setCurrentUser(mapAuthUser(data.user));
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      if (session?.user) setCurrentUser(mapAuthUser(session.user));
      else setCurrentUser(null);
    });

    if (window.location.pathname === "/auth/callback") {
      navigate("/choose-experience", { replace: true });
    }

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
    // AppProvider exposes a stable auth action contract for this bootstrap boundary.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return null;
}
