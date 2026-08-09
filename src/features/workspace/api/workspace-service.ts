import { supabase } from "../../../lib/supabase";
import { WorkspaceType } from "../types";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface UserWorkspace {
  user_id: string;
  workspace: WorkspaceType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const workspaceService = {
  async list(userId: string): Promise<UserWorkspace[]> {
    if (!UUID_PATTERN.test(userId)) return [];

    const { data, error } = await supabase
      .from("user_workspaces")
      .select("user_id, workspace, is_active, created_at, updated_at")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: true });

    if (error || !data) return [];
    return data as UserWorkspace[];
  },

  async enable(userId: string, workspace: WorkspaceType): Promise<boolean> {
    if (!UUID_PATTERN.test(userId)) return false;

    const { error } = await supabase.from("user_workspaces").upsert(
      {
        user_id: userId,
        workspace,
        is_active: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,workspace" }
    );

    return !error;
  },
};
