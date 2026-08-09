import { supabase } from "../lib/supabase";
import { syncBackendProfile } from "./backend-api";
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

async function syncAuthenticatedUser(user: Parameters<typeof mapAuthUser>[0]): Promise<AuthUser> {
  const fallback = mapAuthUser(user);
  try {
    const profile = await syncBackendProfile();
    return {
      id: String(profile.id ?? fallback.id),
      email: String(profile.email ?? fallback.email),
      name: String(profile.name ?? fallback.name),
      role: (profile.role === "owner" || profile.role === "broker" || profile.role === "renter")
        ? profile.role
        : fallback.role,
      verified: Boolean(profile.verified ?? fallback.verified),
    };
  } catch {
    return fallback;
  }
}

export async function signInWithPassword(email: string, password: string): Promise<AuthUser> {
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
  if (error) throw error;
  if (!data.user) throw new Error("Authentication succeeded but no user was returned.");
  return syncAuthenticatedUser(data.user);
}

export async function signUpWithPassword(
  fullName: string,
  email: string,
  password: string,
  role: UserRole,
  phone?: string,
  licenseNumber?: string,
): Promise<{ user: AuthUser | null; needsEmailConfirmation: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        role,
        phone: phone?.trim() || null,
        license_number: role === "broker" ? licenseNumber?.trim() || null : null,
      },
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
    options: { redirectTo: `${window.location.origin}/auth/callback` },
  });
  if (error) throw error;
}

export async function getSessionUser(): Promise<AuthUser | null> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return syncAuthenticatedUser(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
