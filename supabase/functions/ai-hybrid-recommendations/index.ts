import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: corsHeaders });

const text = (v: unknown) => String(v ?? "").trim().toLowerCase();
const overlap = (requested: string[] = [], actual: string[] = []) => {
  if (!requested.length) return 1;
  const values = actual.map(text);
  return requested.filter(r => values.some(v => v === text(r) || v.includes(text(r)) || text(r).includes(v))).length / requested.length;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required" }, 405);

  try {
    const { query, intent = {}, limit = 20 } = await req.json();
    if (!query?.trim()) return json({ error: "query is required" }, 400);

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) return json({ error: "GEMINI_API_KEY is not configured" }, 500);

    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "models/text-embedding-004", content: { parts: [{ text: query }] } }),
    });
    if (!embeddingResponse.ok) throw new Error(`Embedding provider returned ${embeddingResponse.status}`);
    const embeddingPayload = await embeddingResponse.json();
    const embedding = embeddingPayload?.embedding?.values;
    if (!embedding) throw new Error("No query embedding returned");

    const { data, error } = await supabase.rpc("match_properties", {
      query_embedding: embedding,
      match_threshold: 0.25,
      match_count: Math.min(100, Math.max(20, Number(limit) * 4)),
      filter_min_price: intent.minBudget ?? null,
      filter_max_price: intent.maxBudget ?? null,
      filter_bedrooms: intent.bedrooms ?? null,
      filter_city: intent.location ?? null,
      filter_type: Array.isArray(intent.propertyTypes) && intent.propertyTypes.length === 1 ? intent.propertyTypes[0] : null,
    });
    if (error) throw error;

    const results = (data ?? []).map((row: any) => {
      const semantic = Math.max(0, Math.min(100, Number(row.similarity ?? row.match_score ?? 0) * 100));
      const property = row.property ?? row;
      const hardFailures: string[] = [];
      const reasons: string[] = [];
      const tradeoffs: string[] = [];
      const rent = Number(property.rent_price ?? row.rent_price ?? 0);
      const maxBudget = Number(intent.maxBudget ?? 0);
      const bedrooms = Number(property.bedrooms ?? row.bedrooms ?? 0);

      let budget = 100;
      if (maxBudget > 0 && rent > maxBudget) {
        budget = Math.max(0, 100 - Math.round(((rent - maxBudget) / maxBudget) * 200));
        tradeoffs.push(`Rent is ₹${Math.round(rent - maxBudget)} above your maximum budget.`);
      } else if (maxBudget > 0) reasons.push("Fits your maximum budget.");

      let bedroomScore = 100;
      if (intent.bedrooms) {
        bedroomScore = bedrooms >= Number(intent.bedrooms) ? 100 : Math.max(0, Math.round((bedrooms / Number(intent.bedrooms)) * 100));
        if (bedroomScore === 100) reasons.push("Meets your bedroom requirement.");
        else hardFailures.push(`Needs at least ${intent.bedrooms} bedrooms.`);
      }

      let furnished = 80;
      if (intent.furnished != null) {
        furnished = Boolean(property.is_furnished) === Boolean(intent.furnished) ? 100 : 0;
        if (furnished === 100) reasons.push("Furnishing preference matches."); else hardFailures.push("Furnishing preference does not match.");
      }

      let pets = 80;
      if (intent.petsAllowed != null) {
        pets = Boolean(property.is_pet_friendly) === Boolean(intent.petsAllowed) ? 100 : 0;
        if (pets === 100 && intent.petsAllowed) reasons.push("Pet-friendly match.");
        if (pets === 0 && intent.petsAllowed) hardFailures.push("Pet requirement is not satisfied.");
      }

      const amenities = overlap(Array.isArray(intent.amenities) ? intent.amenities : [], Array.isArray(property.amenities) ? property.amenities : []) * 100;
      if (amenities >= 75 && Array.isArray(intent.amenities) && intent.amenities.length) reasons.push("Strong amenity match.");

      const weighted = semantic * 0.35 + budget * 0.22 + bedroomScore * 0.14 + furnished * 0.08 + pets * 0.08 + amenities * 0.07 + 6;
      const penalty = Math.min(35, hardFailures.length * 18);
      const matchScore = Math.round(Math.max(0, Math.min(100, weighted - penalty)));

      return { property, matchScore, semanticScore: Math.round(semantic), componentScores: { semantic, budget, bedrooms: bedroomScore, furnished, pets, amenities }, reasons: reasons.slice(0, 6), tradeoffs: tradeoffs.slice(0, 4), hardFailures, scoringVersion: "hybrid-semantic-v2" };
    }).sort((a: any, b: any) => b.matchScore - a.matchScore).slice(0, Math.min(50, Number(limit) || 20));

    return json({ success: true, model: "homifind-hybrid-semantic-v2", results });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Hybrid recommendation failed" }, 500);
  }
});
