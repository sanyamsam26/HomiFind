import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

function buildDocument(p: Record<string, any>) {
  return [
    `Title: ${p.title ?? ""}`,
    `Description: ${p.description ?? ""}`,
    `Type: ${p.property_type ?? ""}`,
    `Rent: ${p.rent_price ?? ""}`,
    `Bedrooms: ${p.bedrooms ?? ""}`,
    `Bathrooms: ${p.bathrooms ?? ""}`,
    `Furnished: ${p.is_furnished ?? false}`,
    `Pet friendly: ${p.is_pet_friendly ?? false}`,
    `Amenities: ${(p.amenities ?? []).join(", ")}`,
    `Location: ${p.city ?? ""}, ${p.state ?? ""}`,
  ].join("\n");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST required" }, 405);
  try {
    const { propertyId } = await req.json();
    if (!propertyId) return out({ error: "propertyId is required" }, 400);
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: property, error: propertyError } = await supabase.from("properties").select("*").eq("id", propertyId).single();
    if (propertyError || !property) return out({ error: "Property not found" }, 404);

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) return out({ error: "GEMINI_API_KEY is not configured" }, 503);
    const searchDocument = buildDocument(property);
    const embeddingResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "models/text-embedding-004", content: { parts: [{ text: searchDocument }] } }),
    });
    if (!embeddingResponse.ok) return out({ error: "Embedding provider request failed" }, 502);
    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData?.embedding?.values;
    if (!Array.isArray(embedding) || embedding.length !== 1536) return out({ error: "Invalid embedding returned by provider" }, 502);

    const { error: upsertError } = await supabase.from("property_embeddings").upsert({ property_id: propertyId, embedding, search_document: searchDocument, updated_at: new Date().toISOString(), created_by: property.created_by ?? null, updated_by: property.updated_by ?? null }, { onConflict: "property_id" });
    if (upsertError) throw upsertError;
    return out({ success: true, propertyId, model: "text-embedding-004", dimensions: embedding.length });
  } catch (error) { return out({ error: error instanceof Error ? error.message : "Embedding generation failed" }, 500); }
});
