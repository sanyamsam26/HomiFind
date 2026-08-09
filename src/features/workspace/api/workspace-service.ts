import { authenticatedFetch } from "../../../services/backend-api";
import { WorkspaceType } from "../types";

export interface UserWorkspace {
  user_id: string;
  workspace: WorkspaceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const workspaceService = {
  async list(): Promise<UserWorkspace[]> {
    try {
      const response = await authenticatedFetch("/workspaces");
      return (await response.json()) as UserWorkspace[];
    } catch {
      return [];
    }
  },

  async enable(_userId: string, workspace: WorkspaceType): Promise<boolean> {
    try {
      const response = await authenticatedFetch(`/workspaces/${workspace}`, { method: "PUT" });
      return response.ok;
    } catch {
      return false;
    }
  },
};
