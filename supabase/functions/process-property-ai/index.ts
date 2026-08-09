import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-homifind-internal-token", "Content-Type": "application/json" };
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });
const service = () => createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

function documentFor(p: Record<string, any>) {
  return [`Title: ${p.title ?? ""}`, `Description: ${p.description ?? ""}`, `Type: ${p.property_type ?? ""}`, `Rent: ${p.rent_price ?? ""}`, `Bedrooms: ${p.bedrooms ?? ""}`, `Bathrooms: ${p.bathrooms ?? ""}`, `Furnished: ${p.is_furnished ?? false}`, `Pet friendly: ${p.is_pet_friendly ?? false}`, `Amenities: ${(p.amenities ?? []).join(", ")}`, `Location: ${p.city ?? ""}, ${p.state ?? ""}`].join("\n");
}

async function generateEmbedding(property: Record<string, any>, key: string) {
  const searchDocument = documentFor(property);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "models/text-embedding-004", content: { parts: [{ text: searchDocument }] } }) });
  if (!response.ok) throw new Error("Embedding provider request failed");
  const data = await response.json();
  const embedding = data?.embedding?.values;
  if (!Array.isArray(embedding) || embedding.length !== 1536) throw new Error("Invalid embedding returned by provider");
  return { searchDocument, embedding };
}

async function analyze(property: Record<string, any>, key: string) {
  const checks = [property.title, property.description, property.property_type, property.rent_price, property.city, property.state, property.zip_code, property.bedrooms, property.imageUrls?.length || property.primary_image_url];
  const completeness = Math.round(checks.filter(Boolean).length / checks.length * 100);
  const prompt = `Evaluate this rental listing for quality and consistency. Never accuse the owner of fraud. Return JSON only: {"quality_score":0,"warnings":[],"missing_information":[],"suggested_improvements":[]}. Score completeness, clarity and consistency. Listing: ${JSON.stringify(property)}`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json", temperature: 0.1 } }) });
  let ai: any = null;
  if (response.ok) { const payload = await response.json(); const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text; if (text) { try { ai = JSON.parse(text); } catch { ai = null; } } }
  const quality = Math.round(((Number(ai?.quality_score ?? completeness)) * 0.7) + completeness * 0.3);
  const warnings = [...(ai?.warnings ?? [])];
  const missing = [...(ai?.missing_information ?? [])];
  return { quality: Math.max(0, Math.min(100, quality)), warnings, missing, needsReview: missing.length > 0 || completeness < 75 };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST required" }, 405);
  const expected = Deno.env.get("HOMIFIND_INTERNAL_AI_TOKEN");
  if (!expected || req.headers.get("x-homifind-internal-token") !== expected) return out({ error: "Unauthorized" }, 401);
  try {
    const { propertyId } = await req.json();
    if (!propertyId) return out({ error: "propertyId is required" }, 400);
    const db = service();
    const { data: property, error } = await db.from("properties").select("*").eq("id", propertyId).single();
    if (error || !property) return out({ error: "Property not found" }, 404);
    await db.from("properties").update({ ai_processing_status: "processing", ai_processing_error: null }).eq("id", propertyId);
    const key = Deno.env.get("GEMINI_API_KEY");
    if (!key) throw new Error("GEMINI_API_KEY is not configured");
    const [analysis, vector] = await Promise.all([analyze(property, key), generateEmbedding(property, key)]);
    const { error: vectorError } = await db.from("property_embeddings").upsert({ property_id: propertyId, embedding: vector.embedding, search_document: vector.searchDocument, updated_at: new Date().toISOString() }, { onConflict: "property_id" });
    if (vectorError) throw vectorError;
    const status = analysis.needsReview ? "needs_review" : "ready";
    await db.from("properties").update({ ai_processing_status: status, ai_quality_score: analysis.quality, ai_last_processed_at: new Date().toISOString(), ai_processing_error: null }).eq("id", propertyId);
    return out({ success: true, propertyId, status, qualityScore: analysis.quality, warnings: analysis.warnings, missingInformation: analysis.missing, embeddingDimensions: vector.embedding.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI processing failed";
    try { const db = service(); const { propertyId } = await req.clone().json(); if (propertyId) await db.from("properties").update({ ai_processing_status: "failed", ai_processing_error: message, ai_last_processed_at: new Date().toISOString() }).eq("id", propertyId); } catch {}
    return out({ error: message }, 500);
  }
});
