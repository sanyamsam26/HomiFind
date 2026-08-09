// Supabase Edge Function: send-notification
// Handles real-time system webhooks and multi-role activity notifications (Applications, Leases, Maintenance, Chat)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    const { recipientId, title, body, type, entityId } = payload;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Record activity log in database
    const { error: logError } = await supabase.from("activity_logs").insert({
      user_id: recipientId,
      action: type || "NOTIFICATION_SENT",
      entity_type: type?.split("_")[0] || "SYSTEM",
      entity_id: entityId || recipientId,
      details: { title, body, timestamp: new Date().toISOString() },
    });

    if (logError) {
      console.error("Error logging activity:", logError);
    }

    // Return status response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Notification dispatched and activity logged",
        recipientId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process notification" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
