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

export async function syncBackendProfile() { const response = await authenticatedFetch("/auth/sync", { method: "POST" }); return response.json(); }
export async function createProperty(property: Partial<Property>): Promise<Property> { const response = await authenticatedFetch("/properties", { method: "POST", body: JSON.stringify(property) }); return (await response.json()) as Property; }
export async function fetchMyProperties(): Promise<Property[]> { const response = await authenticatedFetch("/properties/mine"); return (await response.json()) as Property[]; }

export interface RecommendationResult { property: Partial<Property> & { id: string }; matchScore: number; reasons: string[]; tradeoffs?: string[]; scoringVersion?: string; }

export async function fetchRecommendations(limit = 12): Promise<RecommendationResult[]> { const response = await authenticatedFetch(`/recommendations?limit=${limit}`); return (await response.json()) as RecommendationResult[]; }

export async function extractRenterIntent(query: string) {
  const response = await authenticatedFetch("/ai/intent", { method: "POST", body: JSON.stringify({ query }) });
  return response.json();
}

export async function recordAIFeedback(propertyId: string | null, eventType: "impression" | "view" | "save" | "unsave" | "visit_request" | "application" | "dismiss" | "share", context: Record<string, unknown> = {}) {
  const response = await authenticatedFetch("/ai/feedback", { method: "POST", body: JSON.stringify({ propertyId, eventType, source: "recommendation", context }) });
  return response.json();
}

export interface BrokerAssignment { id: string; property_id: string; owner_id: string; broker_id: string; agency_id?: string | null; role_in_listing: "agent" | "manager"; status: "pending" | "active" | "revoked"; permissions: Record<string, boolean>; assigned_at: string; broker_name?: string; broker_email?: string; owner_name?: string; owner_email?: string; property_title?: string; city?: string; property_status?: string; }
export async function fetchOwnerBrokerAssignments(): Promise<BrokerAssignment[]> { const response = await authenticatedFetch("/broker-properties/owner"); return (await response.json()) as BrokerAssignment[]; }
export async function fetchBrokerAssignments(): Promise<BrokerAssignment[]> { const response = await authenticatedFetch("/broker-properties/broker"); return (await response.json()) as BrokerAssignment[]; }
export async function assignBrokerToProperty(propertyId: string, brokerId: string, agencyId?: string, role: "agent" | "manager" = "agent"): Promise<BrokerAssignment> { const response = await authenticatedFetch(`/broker-properties/${propertyId}/assign`, { method: "POST", body: JSON.stringify({ brokerId, agencyId: agencyId || null, role }) }); return (await response.json()) as BrokerAssignment; }
export async function revokeBrokerAssignment(assignmentId: string): Promise<void> { await authenticatedFetch(`/broker-properties/assignments/${assignmentId}/revoke`, { method: "POST" }); }
