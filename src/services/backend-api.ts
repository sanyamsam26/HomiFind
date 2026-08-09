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

export async function fetchMyProperties(): Promise<Property[]> {
  const response = await authenticatedFetch("/properties/mine");
  return (await response.json()) as Property[];
}

export async function createProperty(property: Partial<Property>): Promise<Property> {
  const payload = {
    title: property.title,
    description: property.description || "",
    propertyType: property.property_type || "apartment",
    status: "under_review",
    rentPrice: property.rent_price,
    depositAmount: property.deposit_amount ?? 0,
    utilitiesIncluded: property.utilities_included ?? false,
    bedrooms: property.bedrooms ?? 0,
    bathrooms: property.bathrooms ?? 1,
    squareFeet: property.square_feet,
    isPetFriendly: property.is_pet_friendly ?? false,
    isFurnished: property.is_furnished ?? false,
    addressLine1: property.address_line1,
    city: property.city,
    state: property.state,
    primaryImageUrl: property.primary_image_url,
  };
  const response = await authenticatedFetch("/properties", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const created = await response.json();
  return {
    ...created,
    property_type: created.propertyType,
    rent_price: Number(created.rentPrice),
    deposit_amount: Number(created.depositAmount || 0),
    utilities_included: Boolean(created.utilitiesIncluded),
    square_feet: created.squareFeet,
    is_pet_friendly: Boolean(created.isPetFriendly),
    is_furnished: Boolean(created.isFurnished),
    address_line1: created.addressLine1,
    primary_image_url: created.primaryImageUrl,
    owner_id: created.ownerId,
    broker_id: created.brokerId,
    agency_id: created.agencyId,
  } as Property;
}

export async function fetchOwnerBrokerAssignments(): Promise<BrokerAssignment[]> {
  const response = await authenticatedFetch("/broker-properties/owner");
  return (await response.json()) as BrokerAssignment[];
}

export async function fetchBrokerAssignments(): Promise<BrokerAssignment[]> {
  const response = await authenticatedFetch("/broker-properties/broker");
  return (await response.json()) as BrokerAssignment[];
}

export async function assignBrokerToProperty(
  propertyId: string,
  brokerId: string,
  agencyId?: string,
  role: "agent" | "manager" = "agent"
): Promise<BrokerAssignment> {
  const response = await authenticatedFetch(`/broker-properties/${propertyId}/assign`, {
    method: "POST",
    body: JSON.stringify({ brokerId, agencyId: agencyId || null, role }),
  });
  return (await response.json()) as BrokerAssignment;
}

export async function revokeBrokerAssignment(assignmentId: string): Promise<void> {
  await authenticatedFetch(`/broker-properties/assignments/${assignmentId}/revoke`, { method: "POST" });
}

export interface BrokerAssignment {
  id: string;
  property_id: string;
  owner_id: string;
  broker_id: string;
  agency_id?: string | null;
  role_in_listing: "agent" | "manager";
  status: "pending" | "active" | "revoked";
  permissions: Record<string, boolean>;
  assigned_at: string;
  broker_name?: string;
  broker_email?: string;
  owner_name?: string;
  owner_email?: string;
  property_title?: string;
  city?: string;
  property_status?: string;
}
