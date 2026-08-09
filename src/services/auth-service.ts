import { supabase } from "../lib/supabase";
import type { UserRole } from "../types/database";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
}

function roleFromMetadata(user: { user_metadata?: Record<string, unknown> | null }): UserRole {
  const role = user.user_metadata?.role;
  return role === "owner" || role === "broker" || role === "renter" ? role : "renter";
}

export function mapAuthUser(user: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown> | null;
  email_confirmed_at?: string | null;
}): AuthUser {
  const metadata = user.user_metadata ?? {};
  const email = user.email ?? "";
  return {
    id: user.id,
    email,
    name: String(metadata.full_name ?? metadata.name ?? email.split("@")[0] ?? "HomiFind Member"),
    role: roleFromMetadata(user),
    verified: Boolean(user.email_confirmed_at),
  };
}

export async function signInWithPassword(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  if (!data.user) throw new Error("Authentication succeeded but no user was returned.");
  return mapAuthUser(data.user);
}

export async function signUpWithPassword(
  fullName: string,
  email: string,
  password: string
): Promise<{ user: AuthUser | null; needsEmailConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role: "renter" },
    },
  });

  if (error) throw error;

  return {
    user: data.user ? mapAuthUser(data.user) : null,
    needsEmailConfirmation: Boolean(data.user && !data.session),
  };
}

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw error;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return mapAuthUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
