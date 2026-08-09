import { supabase } from "../lib/supabase";
import type { Property } from "../types/database";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:8080/api/v1";

export async function authenticatedFetch(path: string, init: RequestInit = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("No authenticated Supabase session.");

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with ${response.status}`);
  }
  return response;
}

export async function syncBackendProfile() {
  const response = await authenticatedFetch("/auth/sync", { method: "POST" });
  return response.json();
}

export interface RecommendationResult {
  property: Partial<Property> & { id: string };
  matchScore: number;
  reasons: string[];
}

export async function fetchRecommendations(limit = 12): Promise<RecommendationResult[]> {
  const response = await authenticatedFetch(`/recommendations?limit=${limit}`);
  return (await response.json()) as RecommendationResult[];
}
