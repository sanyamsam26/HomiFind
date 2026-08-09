import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const headers = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Content-Type": "application/json" };
const out = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers });

type Intent = {
  minBudget?: number | null; maxBudget?: number | null; bedrooms?: number | null;
  location?: string | null; propertyTypes?: string[] | null; furnished?: boolean | null;
  petsAllowed?: boolean | null; amenities?: string[] | null; mustHave?: string[] | null;
  niceToHave?: string[] | null; dealBreakers?: string[] | null;
};

type Property = Record<string, any>;

const norm = (value: unknown) => String(value ?? "").trim().toLowerCase();
const overlap = (a: unknown[] = [], b: unknown[] = []) => {
  const aa = a.map(norm).filter(Boolean); const bb = b.map(norm).filter(Boolean);
  if (!aa.length || !bb.length) return 0;
  return aa.filter(x => bb.some(y => x === y || x.includes(y) || y.includes(x))).length / aa.length;
};

function scoreProperty(property: Property, intent: Intent, semantic = 0) {
  const reasons: string[] = [];
  const tradeoffs: string[] = [];
  const hardFailures: string[] = [];
  const scores: Record<string, number> = {};

  const rent = Number(property.rent_price ?? property.rentPrice ?? 0);
  const maxBudget = Number(intent.maxBudget ?? 0);
  const minBudget = Number(intent.minBudget ?? 0);
  if (maxBudget > 0 && rent > maxBudget) {
    const over = (rent - maxBudget) / maxBudget;
    scores.budget = Math.max(0, 100 - Math.round(over * 200));
    tradeoffs.push(`Rent is ₹${Math.round(rent - maxBudget)} above your maximum budget.`);
  } else if (minBudget > 0 && rent < minBudget) {
    scores.budget = 95; reasons.push("Within your budget range.");
  } else { scores.budget = 100; reasons.push("Fits your budget."); }

  const bedrooms = Number(property.bedrooms ?? 0);
  if (intent.bedrooms != null && intent.bedrooms > 0) {
    scores.bedrooms = bedrooms >= intent.bedrooms ? 100 : Math.max(0, Math.round((bedrooms / intent.bedrooms) * 100));
    if (bedrooms >= intent.bedrooms) reasons.push(`${bedrooms} bedroom${bedrooms === 1 ? "" : "s"}, matching your requirement.`);
    else hardFailures.push(`Needs at least ${intent.bedrooms} bedrooms.`);
  } else scores.bedrooms = 75;

  if (intent.propertyTypes?.length) {
    const ok = intent.propertyTypes.map(norm).includes(norm(property.property_type ?? property.propertyType));
    scores.propertyType = ok ? 100 : 0;
    if (ok) reasons.push("Property type matches your preference."); else hardFailures.push("Property type does not match your selected preference.");
  } else scores.propertyType = 80;

  if (intent.furnished != null) {
    const actual = Boolean(property.furnished);
    scores.furnished = actual === intent.furnished ? 100 : 0;
    if (actual === intent.furnished) reasons.push(intent.furnished ? "Furnished as requested." : "Unfurnished as requested.");
    else hardFailures.push("Furnishing preference does not match.");
  } else scores.furnished = 70;

  if (intent.petsAllowed != null) {
    const actual = Boolean(property.pets_allowed ?? property.petsAllowed);
    scores.pets = actual === intent.petsAllowed ? 100 : 0;
    if (actual === intent.petsAllowed && intent.petsAllowed) reasons.push("Pet-friendly, matching your requirement.");
    if (actual !== intent.petsAllowed && intent.petsAllowed) hardFailures.push("Pet policy does not satisfy your requirement.");
  } else scores.pets = 70;

  const propertyAmenities = Array.isArray(property.amenities) ? property.amenities : [];
  const amenityScore = overlap(intent.amenities ?? [], propertyAmenities) * 100;
  scores.amenities = intent.amenities?.length ? Math.round(amenityScore) : 70;
  if (scores.amenities >= 75) reasons.push("Strong amenity match.");

  scores.location = intent.location ? (norm(property.city).includes(norm(intent.location)) || norm(intent.location).includes(norm(property.city)) ? 100 : 45) : 70;
  if (scores.location >= 90) reasons.push("Located in your preferred area.");

  scores.semantic = Math.max(0, Math.min(100, Math.round(semantic * 100)));
  if (scores.semantic >= 80) reasons.push("Strong semantic match to your lifestyle and search intent.");

  const weights = { budget: 0.22, bedrooms: 0.14, propertyType: 0.10, furnished: 0.08, pets: 0.08, amenities: 0.12, location: 0.10, semantic: 0.16 };
  const weighted = Object.entries(weights).reduce((sum, [key, weight]) => sum + (scores[key] ?? 0) * weight, 0);
  const penalty = hardFailures.length ? Math.min(35, hardFailures.length * 18) : 0;
  const matchScore = Math.max(0, Math.min(100, Math.round(weighted - penalty)));

  return { matchScore, scores, reasons: reasons.slice(0, 6), tradeoffs: tradeoffs.slice(0, 4), hardFailures, weights, scoringVersion: "hybrid-v1" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers });
  if (req.method !== "POST") return out({ error: "POST required" }, 405);
  try {
    const body = await req.json();
    const intent: Intent = body.intent ?? {};
    const properties: Property[] = Array.isArray(body.properties) ? body.properties : [];
    const semanticScores: Record<string, number> = body.semanticScores ?? {};
    const ranked = properties
      .filter(p => norm(p.status) === "available" || p.status == null)
      .map(property => ({ property, ...scoreProperty(property, intent, Number(semanticScores[property.id] ?? 0)) }))
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore);
    return out({ success: true, model: "homifind-hybrid-v1", results: ranked });
  } catch (error) { return out({ error: error instanceof Error ? error.message : "Matching failed" }, 500); }
});
