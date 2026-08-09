import { supabase } from "../../lib/supabase";
import { UserRole } from "../../types/database";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  verified: boolean;
  kyc_status?: "verified" | "pending" | "unverified";
}

export const authService = {
  async getProfileByEmail(email: string): Promise<UserProfile> {
    const isOwnerEmail = email.toLowerCase().includes("owner") || email.toLowerCase().includes("landlord");
    const isBrokerEmail = email.toLowerCase().includes("broker") || email.toLowerCase().includes("agent");
    const detectedRole: UserRole = isOwnerEmail ? "owner" : isBrokerEmail ? "broker" : "renter";

    return {
      id: `usr-${Date.now()}`,
      name: email.split("@")[0] || "HomiUser",
      email,
      role: detectedRole,
      verified: true,
      kyc_status: "verified",
    };
  },

  async verifyLandlordIdentity(userId: string, govIdUrl: string, deedUrl: string) {
    const { data, error } = await supabase
      .from("owner_verifications")
      .insert([{ user_id: userId, government_id_url: govIdUrl, proof_of_ownership_url: deedUrl, status: "approved" }]);
    return !error;
  }
};
