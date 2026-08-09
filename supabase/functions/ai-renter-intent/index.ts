import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST required" }, 405);
  try {
    const { query } = await req.json();
    if (!query?.trim()) return out({ error: "query is required" }, 400);
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return out({ success: true, model: "rules-fallback-v1", intent: { rawQuery: query, mustHave: [], niceToHave: [], constraints: {} } });

    const prompt = `Extract structured rental-search intent from this user request. Do not invent facts. Return JSON only with: location, workplaceOrArea, maxCommuteMinutes, minBudget, maxBudget, bedrooms, propertyTypes, furnished, petsAllowed, amenities, mustHave, niceToHave, dealBreakers, lifestyleSignals. Use null for unknown values. User request: ${JSON.stringify(query)}`;
    const result = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.05 } }),
    });
    if (!result.ok) return out({ success: true, model: "rules-fallback-v1", intent: { rawQuery: query, mustHave: [], niceToHave: [], constraints: {} } });
    const payload = await result.json();
    const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    const intent = text ? JSON.parse(text) : null;
    if (!intent) throw new Error("No intent returned");
    return out({ success: true, model: "gemini-renter-intent-v1", intent });
  } catch (error) {
    return out({ error: error instanceof Error ? error.message : "Intent extraction failed" }, 500);
  }
});
