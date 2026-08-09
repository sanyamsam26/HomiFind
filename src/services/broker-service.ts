import { authenticatedFetch } from "./backend-api";

export interface BrokerDirectoryEntry {
  id: string;
  full_name: string;
  email: string;
  company_name?: string | null;
  license_number?: string | null;
  is_verified: boolean;
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

export async function fetchBrokerDirectory(search = "") {
  const query = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  const response = await authenticatedFetch(`/brokers${query}`);
  return (await response.json()) as BrokerDirectoryEntry[];
}

export async function fetchOwnerBrokerAssignments() {
  const response = await authenticatedFetch("/broker-properties/owner");
  return (await response.json()) as BrokerAssignment[];
}

export async function fetchBrokerAssignments() {
  const response = await authenticatedFetch("/broker-properties/broker");
  return (await response.json()) as BrokerAssignment[];
}

export async function assignBroker(
  propertyId: string,
  brokerId: string,
  agencyId: string | null,
  role: "agent" | "manager",
) {
  const response = await authenticatedFetch(`/broker-properties/${propertyId}/assign`, {
    method: "POST",
    body: JSON.stringify({ brokerId, agencyId, role }),
  });
  return (await response.json()) as BrokerAssignment;
}

export async function revokeBrokerAssignment(assignmentId: string) {
  await authenticatedFetch(`/broker-properties/assignments/${assignmentId}/revoke`, {
    method: "POST",
  });
}
