import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST required" }, 405);
  try {
    const auth = req.headers.get("Authorization");
    if (!auth) return out({ error: "Authentication required" }, 401);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: auth } } });
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return out({ error: "Invalid session" }, 401);

    const { intent = {}, properties = [], semanticScores = {}, limit = 20 } = await req.json();
    const ranked = (properties as any[])
      .filter(p => p.status === "available")
      .map(p => {
        const rent = Number(p.rent_price ?? p.rentPrice ?? 0);
        const maxBudget = Number(intent.maxBudget ?? 0);
        const budget = maxBudget > 0 ? Math.max(0, Math.min(100, Math.round(100 - Math.max(0, rent - maxBudget) / maxBudget * 200))) : 75;
        const bedrooms = intent.bedrooms ? Math.min(100, Math.round((Number(p.bedrooms ?? 0) / Number(intent.bedrooms)) * 100)) : 75;
        const semantic = Math.max(0, Math.min(100, Number(semanticScores[p.id] ?? 0) * 100));
        const score = Math.round(budget * 0.35 + bedrooms * 0.15 + semantic * 0.30 + 20);
        const reasons = [budget >= 95 ? "Fits your budget" : "Close to your budget", bedrooms >= 100 ? "Meets your bedroom requirement" : null, semantic >= 80 ? "Strong match to your search intent" : null].filter(Boolean);
        return { property: p, matchScore: Math.min(100, score), reasons, scoringVersion: "recommendation-v1" };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, Math.min(50, Number(limit) || 20));

    if (ranked.length) {
      await supabase.from("ai_match_events").insert(ranked.map(item => ({ user_id: user.id, property_id: item.property.id, scoring_version: item.scoringVersion, match_score: item.matchScore, component_scores: { semantic: Number(semanticScores[item.property.id] ?? 0) }, reasons: item.reasons, tradeoffs: [] })));
    }
    return out({ success: true, model: "homifind-recommendation-v1", results: ranked });
  } catch (error) { return out({ error: error instanceof Error ? error.message : "Recommendation generation failed" }, 500); }
});
