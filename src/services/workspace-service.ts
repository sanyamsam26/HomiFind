import { authenticatedFetch } from "./backend-api";
import { supabase } from "../lib/supabase";
import type { UserRole } from "../types/database";

export interface WorkspaceRecord {
  workspace: UserRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

async function getCurrentUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("No authenticated Supabase user.");
  return data.user.id;
}

function normalizeWorkspace(value: unknown): UserRole {
  const workspace = String(value ?? "").toLowerCase();
  if (!["renter", "owner", "broker"].includes(workspace)) {
    throw new Error(`Unsupported workspace returned by backend: ${String(value)}`);
  }
  return workspace as UserRole;
}

export async function listWorkspaces(): Promise<WorkspaceRecord[]> {
  const userId = await getCurrentUserId();
  const response = await authenticatedFetch(`/workspaces/${userId}`);
  const records = (await response.json()) as Array<Record<string, unknown>>;

  // Spring/JPA serializes the enum as uppercase (RENTER/OWNER/BROKER),
  // while the React app consistently uses lowercase role values.
  return records.map((record) => ({
    workspace: normalizeWorkspace(record.workspace),
    is_active: Boolean(record.is_active),
    created_at: typeof record.created_at === "string" ? record.created_at : undefined,
    updated_at: typeof record.updated_at === "string" ? record.updated_at : undefined,
  }));
}

export async function enableWorkspace(workspace: UserRole): Promise<WorkspaceRecord> {
  if (!["renter", "owner", "broker"].includes(workspace)) {
    throw new Error("Unsupported workspace.");
  }

  const userId = await getCurrentUserId();
  await authenticatedFetch(`/workspaces/${userId}`, {
    method: "POST",
    body: JSON.stringify({ workspace: workspace.toUpperCase() }),
  });

  // The POST succeeded; navigation must not depend on parsing the response body.
  return { workspace, is_active: true };
}

export function workspaceHome(workspace: UserRole): string {
  switch (workspace) {
    case "owner": return "/owner/dashboard";
    case "broker": return "/broker/overview";
    default: return "/app/explore";
  }
}
