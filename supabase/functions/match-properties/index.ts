// Supabase Edge Function: match-properties
// Uses Google Gemini / OpenAI embeddings to perform semantic search via pgvector on HomiFind properties

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
    const {
      prompt,
      minPrice,
      maxPrice,
      bedrooms,
      city,
      propertyType,
      limit = 10,
    } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Search prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Generate Text Embedding using Gemini API / Embedding Endpoint
    const embeddingResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: {
            parts: [{ text: prompt }],
          },
        }),
      }
    );

    const embeddingData = await embeddingResponse.json();
    const queryEmbedding = embeddingData?.embedding?.values;

    if (!queryEmbedding) {
      throw new Error("Failed to compute query vector embedding");
    }

    // 2. Execute pgvector match_properties RPC function on Postgres
    const { data: matchedProperties, error: rpcError } = await supabase.rpc(
      "match_properties",
      {
        query_embedding: queryEmbedding,
        match_threshold: 0.3,
        match_count: limit,
        filter_min_price: minPrice || null,
        filter_max_price: maxPrice || null,
        filter_bedrooms: bedrooms || null,
        filter_city: city || null,
        filter_type: propertyType || null,
      }
    );

    if (rpcError) {
      throw rpcError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        query: prompt,
        results: matchedProperties,
        total: matchedProperties?.length || 0,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "An error occurred during property matching" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
