import { authenticatedFetch } from "./backend-api";
import type { UserRole } from "../types/database";

export interface WorkspaceRecord {
  workspace: UserRole;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function listWorkspaces(): Promise<WorkspaceRecord[]> {
  const response = await authenticatedFetch("/workspaces");
  return (await response.json()) as WorkspaceRecord[];
}

export async function enableWorkspace(workspace: UserRole): Promise<WorkspaceRecord> {
  if (!["renter", "owner", "broker"].includes(workspace)) {
    throw new Error("Unsupported workspace.");
  }
  const response = await authenticatedFetch(`/workspaces/${workspace}`, { method: "PUT" });
  return (await response.json()) as WorkspaceRecord;
}

export function workspaceHome(workspace: UserRole): string {
  switch (workspace) {
    case "owner": return "/owner/dashboard";
    case "broker": return "/broker/overview";
    default: return "/app/explore";
  }
}
