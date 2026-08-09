import { supabase } from "../../lib/supabase";
import { VisitRecord } from "../api";

export const visitsService = {
  async bookVisit(visit: Omit<VisitRecord, "id" | "status">) {
    return await supabase.from("visits").insert([{ ...visit, status: "requested" }]).select().single();
  },

  async getUserVisits(userId: string) {
    const { data } = await supabase
      .from("visits")
      .select("*, property:properties(*)")
      .or(`renter_id.eq.${userId},host_id.eq.${userId}`);
    return data || [];
  },

  async updateVisitStatus(visitId: string, status: "confirmed" | "declined" | "completed") {
    return await supabase.from("visits").update({ status }).eq("id", visitId);
  }
};
