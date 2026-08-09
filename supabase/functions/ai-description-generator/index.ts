// Supabase Edge Function: ai-description-generator
// Generates optimized listing descriptions and key feature summaries for property owners and brokers using Gemini

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      title,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      rentPrice,
      city,
      amenities,
      highlights,
    } = await req.json();

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing");
    }

    const systemPrompt = `You are an expert real estate copywriter for HomiFind, a modern rental platform.
Generate an engaging, professional, and attractive rental property listing description.

Property Details:
- Title: ${title || "Property"}
- Type: ${propertyType || "Apartment"}
- Specs: ${bedrooms} Bed / ${bathrooms} Bath / ${squareFeet ? squareFeet + " sqft" : "Spacious"}
- Rent: $${rentPrice}/month
- Location: ${city || "Prime Location"}
- Amenities: ${Array.isArray(amenities) ? amenities.join(", ") : "Standard amenities"}
- Key Highlights: ${highlights || "Bright interior, great location"}

Return a JSON object with:
1. "description": A compelling 3-paragraph property description.
2. "bulletHighlights": Array of 5 bullet points highlighting the top selling points.
3. "seoKeywords": Array of 5 relevant search tags for this listing.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const result = JSON.parse(rawText || "{}");

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Failed to generate description" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
